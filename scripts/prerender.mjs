// Renders every route in public/sitemap.xml in headless Chrome and writes dist/<route>/index.html,
// so crawlers that do not run JavaScript (Bing, social cards, AI bots) get the full page.
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { join, extname, resolve, sep } from "node:path";
import puppeteer from "puppeteer";

const DIST = resolve("dist");
const PORT = 4783;
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".json": "application/json", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain", ".ico": "image/x-icon" };

if (!existsSync(join(DIST, "index.html"))) { console.error("dist/index.html missing. Run vite build first."); process.exit(1); }
const shell = readFileSync(join(DIST, "index.html"));

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = resolve(join(DIST, path));
  if (extname(path) && file.startsWith(DIST + sep) && existsSync(file)) {
    res.writeHead(200, { "content-type": TYPES[extname(path)] || "application/octet-stream" });
    res.end(await readFile(file));
  } else {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(shell);
  }
}).listen(PORT);

const sitemap = existsSync("public/sitemap.xml") ? readFileSync("public/sitemap.xml", "utf8") : "";
const routes = [...new Set(["/", ...[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/+$/, "") || "/")])];

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
let failed = 0;
for (const route of routes) {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (r) => (r.url().startsWith(`http://localhost:${PORT}`) ? r.continue() : r.abort()));
  try {
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle0", timeout: 30000 });
    await page.waitForSelector("h1", { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 400));
    const html = await page.evaluate(() => {
      // Helmet adds data-rh tags next to the static ones from index.html: keep only the page-specific copy.
      const key = (e) => (e.tagName === "META" ? "m:" + (e.getAttribute("name") || e.getAttribute("property")) : e.tagName === "LINK" ? "l:" + e.getAttribute("rel") : e.tagName === "TITLE" ? "title" : null);
      const managed = new Set([...document.head.querySelectorAll("[data-rh]")].map(key));
      document.head.querySelectorAll("title:not([data-rh]), meta:not([data-rh]), link:not([data-rh])").forEach((e) => { const k = key(e); if (k && managed.has(k)) e.remove(); });
      return "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
    });
    const out = route === "/" ? join(DIST, "index.html") : join(DIST, route, "index.html");
    await mkdir(resolve(out, ".."), { recursive: true });
    await writeFile(out, html);
    console.log("prerendered", route);
  } catch (e) {
    failed++;
    console.error("FAILED", route, e.message);
  }
  await page.close();
}
await browser.close();
server.close();
process.exit(failed ? 1 : 0);
