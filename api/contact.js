const https = require('https');

const WA_PHONE    = '917052301258';
const MIN_SECONDS = 4;

const SITE_URL   = (process.env.SITE_URL || 'clinivomedia.asauvia.com').replace(/^https?:\/\//, '').replace(/\/$/, '');
const SITE_HOSTS = [SITE_URL, `www.${SITE_URL}`];

function clean(v, max) {
  return ((v || '') + '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, max);
}
function oneLine(v) {
  return v.replace(/[\r\n]|%0a|%0d/gi, ' ').trim();
}

function sendWhatsApp(text) {
  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (!apiKey) return;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${WA_PHONE}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apiKey)}`;
  https.get(url, res => res.resume()).on('error', () => {});
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  // 1. Origin check
  const origin = req.headers.origin || req.headers.referer || '';
  let host = '';
  try { host = new URL(origin).hostname.toLowerCase(); } catch {}
  const devHost = (process.env.CLINIVO_DEV_HOST || '').toLowerCase();
  const allowed = devHost ? [...SITE_HOSTS, devHost] : SITE_HOSTS;
  if (!allowed.includes(host)) {
    return res.status(403).json({ ok: false, error: `Please send the form from ${SITE_URL}.` });
  }

  const body = req.body || {};

  // 2. Honeypot
  if (body.website) return res.status(200).json({ ok: true });

  // 3. Timing
  const ts = parseInt(body.ts || 0, 10);
  const elapsed = Math.floor((Date.now() - ts) / 1000);
  if (!ts || elapsed < MIN_SECONDS || elapsed > 86400) {
    return res.status(200).json({ ok: true });
  }

  // 4. Validate
  const name    = oneLine(clean(body.name, 80));
  const phone   = oneLine(clean(body.phone, 16));
  const email   = oneLine(clean(body.email, 120));
  const city    = oneLine(clean(body.city, 60));
  const clinic  = oneLine(clean(body.clinic, 100));
  let   plan    = oneLine(clean(body.plan, 30));
  const message = clean(body.message, 1000);
  const consent = body.consent === 'yes';

  const errors = [];
  if (!/^\p{L}[\p{L} .'\\-]{1,79}$/u.test(name)) errors.push('name');
  const digits = phone.replace(/[\s()\-]/g, '');
  if (!/^(?:\+?91|0)?[6-9]\d{9}$/.test(digits)) errors.push('phone');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('email');
  if (city.length < 2) errors.push('city');
  const validPlans = ['Not sure yet', 'WebDoc', 'ContentDoc', 'GrowthDoc', 'ClinicScale'];
  if (!validPlans.includes(plan)) plan = 'Not sure yet';
  if (!consent) errors.push('consent');
  if (errors.length) {
    return res.status(422).json({ ok: false, error: `Some details need another look (${errors.join(', ')}). ` });
  }

  // 5. Fire WhatsApp notification (non-blocking — reply to visitor immediately)
  const waText = [
    `New consultation - ${SITE_URL}`,
    `Name: ${name}`,
    `Phone: ${digits}`,
    `City: ${city}`,
    clinic  ? `Clinic: ${clinic}`                : '',
    `Plan: ${plan}`,
    email   ? `Email: ${email}`                  : '',
    message ? `Note: ${message.slice(0, 300)}`   : '',
  ].filter(Boolean).join('\n');

  sendWhatsApp(waText);

  return res.status(200).json({ ok: true });
};
