"""Build the Hostinger upload folder (deploy/) from the source files."""
import pathlib, shutil
root = pathlib.Path(__file__).parent
out = root / 'deploy'
if out.exists(): shutil.rmtree(out)
out.mkdir()
src = (root / 'index.html').read_text()
i = src.index('</style>') + len('</style>')
head, body = src[:i], src[i:]
(out / 'index.html').write_text('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' + head + '\n</head>\n<body>\n' + body.strip() + '\n</body>\n</html>\n')
for f in ['privacy.html', 'terms.html', '404.html', 'contact.php', 'robots.txt', 'sitemap.xml', 'site.webmanifest', '.htaccess', 'favicon.ico']:
    shutil.copy(root / f, out / f)
shutil.copytree(root / 'assets', out / 'assets')
print(sorted(str(p.relative_to(out)) for p in out.rglob('*') if p.is_file()))
