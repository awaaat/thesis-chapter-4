import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
const ROUTES = ['/', '/services', '/about', '/contact', '/order-now'];
const PORT = 4599;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain' };

async function main() {
  let puppeteer;
  try { puppeteer = (await import('puppeteer')).default; }
  catch { console.warn('[prerender] puppeteer unavailable, skipping'); return; }

  const shell = await fs.readFile(path.join(DIST, 'index.html'));
  const server = http.createServer(async (req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(DIST, urlPath);
    try {
      if (!file.startsWith(DIST)) throw new Error('bad path');
      const st = await fs.stat(file);
      if (!st.isFile()) throw new Error('not file');
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      res.end(await fs.readFile(file));
    } catch {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(shell);
    }
  }).listen(PORT);

  let browser;
  const results = [];
  try {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForSelector('#root > *', { timeout: 10000 });
      await new Promise(r => setTimeout(r, 500));
      const html = '<!DOCTYPE html>' + await page.evaluate(() => document.documentElement.outerHTML);
      const info = await page.evaluate(() => ({
        title: document.title,
        desc: document.querySelector('meta[name="description"]')?.content || '(none)',
        canonical: document.querySelector('link[rel="canonical"]')?.href || '(none)',
        h1: document.querySelectorAll('h1').length,
        words: document.body.innerText.split(/\s+/).filter(Boolean).length,
      }));
      results.push({ route, html, info });
      await page.close();
    }
    for (const { route, html } of results) {
      const out = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route, 'index.html');
      await fs.mkdir(path.dirname(out), { recursive: true });
      await fs.writeFile(out, html);
    }
    console.log('\n[prerender] SEO AUDIT');
    for (const { route, info } of results) {
      console.log(`\n${route}\n  title:     ${info.title}\n  desc:      ${info.desc.slice(0, 90)}\n  canonical: ${info.canonical}\n  h1 count:  ${info.h1}\n  words:     ${info.words}`);
    }
  } catch (e) {
    console.warn('[prerender] failed, shipping plain SPA build:', e.message);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}
main().then(() => process.exit(0));
