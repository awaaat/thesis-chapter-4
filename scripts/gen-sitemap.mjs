import fs from "node:fs";
import { landingPages, SITE } from "../src/pages/Landing/landingData.js";

const today = new Date().toISOString().slice(0, 10);
const urls = [
  ["/", "1.0"], ["/services", "0.9"], ["/data-analysis-services", "0.9"],
  ...landingPages.map((p) => ["/" + p.slug, "0.8"]),
  ["/about", "0.5"],
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(([p, pr]) => `  <url><loc>${SITE}${p === "/" ? "/" : p}</loc><lastmod>${today}</lastmod><priority>${pr}</priority></url>`).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync("public/sitemap.xml", xml);
console.log(`[sitemap] ${urls.length} URLs`);
