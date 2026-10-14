<?php
/**
 * Clinivo Media: consultation form handler (Hostinger shared hosting, PHP 8+).
 * Validates on the server, blocks spam (honeypot, timing, origin check, rate limit)
 * and emails the enquiry. Nothing secret lives in the browser; this file is never shown to visitors.
 */
declare(strict_types=1);

const TO_EMAIL     = 'clinivomedia@gmail.com';
const FROM_EMAIL   = 'clinivomedia@gmail.com';
const SITE_HOSTS   = ['clinivomedia.asauvia.com', 'www.clinivomedia.asauvia.com'];
const MAX_PER_HOUR = 5;                                // per visitor IP
const MIN_SECONDS  = 4;                                // humans take longer than this to fill the form

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function reply(int $code, array $body): void { http_response_code($code); echo json_encode($body); exit; }
function clean(string $v, int $max): string {
    $v = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '');
    return mb_substr($v, 0, $max);
}
function oneLine(string $v): string { return trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v)); }

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') reply(405, ['ok' => false, 'error' => 'Method not allowed.']);

// 1. Only accept posts from our own pages
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
$host = parse_url($origin, PHP_URL_HOST) ?: '';
$hosts = SITE_HOSTS; if (getenv('CLINIVO_DEV_HOST')) $hosts[] = getenv('CLINIVO_DEV_HOST');
if (!in_array(strtolower($host), $hosts, true)) reply(403, ['ok' => false, 'error' => 'Please send the form from clinivomedia.asauvia.com.']);

// 2. Honeypot: bots fill every field. Pretend success so they learn nothing.
if (!empty($_POST['website'])) reply(200, ['ok' => true]);

// 3. Timing: too fast means a script
$ts = (int)($_POST['ts'] ?? 0);
$elapsed = (int)floor((microtime(true) * 1000 - $ts) / 1000);
if ($ts <= 0 || $elapsed < MIN_SECONDS || $elapsed > 86400) reply(200, ['ok' => true]);

// 4. Rate limit per IP (stored outside public_html)
$dataDir = dirname(__DIR__) . '/clinivo-data';
if (!is_dir($dataDir)) @mkdir($dataDir, 0700, true);
$ipKey = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . '|clinivo');
$rlFile = $dataDir . '/ratelimit.json';
$fp = @fopen($rlFile, 'c+');
if ($fp && flock($fp, LOCK_EX)) {
    $raw = stream_get_contents($fp);
    $all = json_decode($raw ?: '{}', true) ?: [];
    $now = time();
    foreach ($all as $k => $times) { $all[$k] = array_values(array_filter($times, fn($t) => $t > $now - 3600)); if (!$all[$k]) unset($all[$k]); }
    $mine = $all[$ipKey] ?? [];
    if (count($mine) >= MAX_PER_HOUR) { flock($fp, LOCK_UN); fclose($fp); reply(429, ['ok' => false, 'error' => 'Too many requests from this connection. Please try again in an hour, or ']); }
    $mine[] = $now; $all[$ipKey] = $mine;
    ftruncate($fp, 0); rewind($fp); fwrite($fp, json_encode($all)); fflush($fp); flock($fp, LOCK_UN); fclose($fp);
}

// 5. Validate every field again on the server
$name    = oneLine(clean((string)($_POST['name'] ?? ''), 80));
$phone   = oneLine(clean((string)($_POST['phone'] ?? ''), 16));
$email   = oneLine(clean((string)($_POST['email'] ?? ''), 120));
$city    = oneLine(clean((string)($_POST['city'] ?? ''), 60));
$clinic  = oneLine(clean((string)($_POST['clinic'] ?? ''), 100));
$plan    = oneLine(clean((string)($_POST['plan'] ?? ''), 30));
$message = clean((string)($_POST['message'] ?? ''), 1000);
$consent = ($_POST['consent'] ?? '') === 'yes';

$errors = [];
if (!preg_match("/^\p{L}[\p{L} .'-]{1,79}$/u", $name)) $errors[] = 'name';
$digits = preg_replace('/[\s()-]/', '', $phone);
if (!preg_match('/^(?:\+?91|0)?[6-9]\d{9}$/', $digits)) $errors[] = 'phone';
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if (mb_strlen($city) < 2) $errors[] = 'city';
if (!in_array($plan, ['Not sure yet', 'WebDoc', 'ContentDoc', 'GrowthDoc', 'ClinicScale'], true)) $plan = 'Not sure yet';
if (!$consent) $errors[] = 'consent';
if (preg_match('~https?://|www\.~i', $message . $name . $clinic) && substr_count(strtolower($message), 'http') > 1) $errors[] = 'links';
if ($errors) reply(422, ['ok' => false, 'error' => 'Some details need another look (' . implode(', ', $errors) . '). ']);

// 6. Send the email
$subject = 'New consultation request: ' . $name . ($clinic ? ' (' . $clinic . ')' : '');
$body = "New consultation request from clinivomedia.asauvia.com\n\n"
      . "Name:          $name\n"
      . "Phone:         $digits\n"
      . "Email:         " . ($email ?: '-') . "\n"
      . "City:          $city\n"
      . "Clinic:        " . ($clinic ?: '-') . "\n"
      . "Interested in: $plan\n\n"
      . "Message:\n" . ($message ?: '-') . "\n\n"
      . "Consent to be contacted: yes\n"
      . "Sent: " . gmdate('Y-m-d H:i') . " UTC\n";
$headers = [
    'From: Clinivo Website <' . FROM_EMAIL . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: Clinivo',
];
if ($email !== '') $headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
if (getenv('CLINIVO_DRY_RUN') === '1') reply(200, ['ok' => true, 'dry_run' => true]);
$sent = @mail(TO_EMAIL, $encodedSubject, $body, implode("\r\n", $headers), '-f' . FROM_EMAIL);
if (!$sent) reply(500, ['ok' => false, 'error' => "We couldn't send this right now. "]);
reply(200, ['ok' => true]);
