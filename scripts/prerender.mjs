// Renders every route in headless Chrome after `vite build` and saves real HTML.
// Never fails the deploy: if Chrome is unavailable the plain SPA build ships.
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { landingPages } from "../src/pages/Landing/landingData.js";

const DIST = path.resolve("dist");
const ROUTES = ["/", "/services", "/about", "/contact", "/order-now", "/data-analysis-services", ...landingPages.map((p) => "/" + p.slug)];
const PORT = 4599;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".woff": "font/woff",
  ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain" };

async function main() {
  let puppeteer;
  try { puppeteer = (await import("puppeteer")).default; } catch { console.warn("[prerender] puppeteer unavailable, skipping"); return; }
  const shell = await fs.readFile(path.join(DIST, "index.html"));
  const server = http.createServer(async (req, res) => {
    const file = path.join(DIST, decodeURIComponent(req.url.split("?")[0]));
    try {
      if (!file.startsWith(DIST)) throw new Error("bad path");
      const st = await fs.stat(file);
      if (!st.isFile()) throw new Error("not file");
      res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
      res.end(await fs.readFile(file));
    } catch { res.writeHead(200, { "Content-Type": "text/html" }); res.end(shell); }
  }).listen(PORT);

  let browser;
  const done = [];
  try {
    browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    for (const route of ROUTES) {
      try {
        const page = await browser.newPage();
        await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle0", timeout: 30000 });
        await page.waitForSelector("#root > *", { timeout: 10000 });
        await new Promise((r) => setTimeout(r, 400));
        // Drop the static head tags from index.html so each page keeps only its own (Helmet) tags.
        await page.evaluate(() => {
          document.head.querySelectorAll('meta[name="description"],meta[name="keywords"],meta[name="robots"],meta[name="author"],meta[property^="og:"],meta[name^="twitter:"],link[rel="canonical"]')
            .forEach((el) => { if (!el.hasAttribute("data-rh")) el.remove(); });
        });
        const html = "<!DOCTYPE html>" + (await page.evaluate(() => document.documentElement.outerHTML));
        const info = await page.evaluate(() => ({
          title: document.title,
          desc: document.querySelector('meta[name="description"]')?.content || "(none)",
          canonical: document.querySelector('link[rel="canonical"]')?.href || "(none)",
          h1: document.querySelectorAll("h1").length,
          words: document.body.innerText.split(/\s+/).filter(Boolean).length,
        }));
        const out = route === "/" ? path.join(DIST, "index.html") : path.join(DIST, route, "index.html");
        await fs.mkdir(path.dirname(out), { recursive: true });
        await fs.writeFile(out, html);
        done.push({ route, info });
        await page.close();
      } catch (e) { console.warn(`[prerender] ${route} failed: ${e.message}`); }
    }
    console.log(`\n[prerender] ${done.length}/${ROUTES.length} routes rendered. SEO AUDIT`);
    for (const { route, info } of done) {
      console.log(`${route}\n  title: ${info.title}\n  canonical: ${info.canonical}\n  h1: ${info.h1}  words: ${info.words}\n  desc: ${info.desc.slice(0, 80)}`);
    }
  } catch (e) { console.warn("[prerender] failed, shipping plain SPA build:", e.message); }
  finally { if (browser) await browser.close(); server.close(); }
}
main().then(() => process.exit(0));
