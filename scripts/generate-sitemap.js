const fs = require("fs");
const path = require("path");

// Builds public/sitemap.xml from the slugs in portfolio.data.ts so new blog
// posts and case studies are picked up without editing the sitemap by hand.
const SITE_URL = "https://ravinbhaktaresume.netlify.app";

const dataPath = path.resolve(__dirname, "../src/app/data/portfolio.data.ts");
const source = fs.readFileSync(dataPath, "utf8");

// Returns the source text of `export const NAME ... = [ ... ];`
function exportBlock(name) {
  const start = source.indexOf(`export const ${name}`);
  if (start === -1) throw new Error(`generate-sitemap: ${name} not found in portfolio.data.ts`);
  const end = source.indexOf("\n];", start);
  return source.slice(start, end);
}

// Splits an array block into its top-level `{ ... }` entries (indented 2 spaces).
function entries(block) {
  return block.split(/\n  \{/).slice(1);
}

const slugOf = (entry) => (entry.match(/slug: '([^']+)'/) || [])[1];
const dateOf = (entry) => (entry.match(/date: '(\d{4}-\d{2}-\d{2})'/) || [])[1];

const urls = [
  { loc: "/", priority: "1.0" },
  { loc: "/blog", priority: "0.8" },
];

for (const entry of entries(exportBlock("PROJECTS"))) {
  const slug = slugOf(entry);
  if (slug && entry.includes("caseStudy:")) {
    urls.push({ loc: `/projects/${slug}`, priority: "0.7" });
  }
}

for (const entry of entries(exportBlock("BLOG_POSTS"))) {
  const slug = slugOf(entry);
  if (slug) urls.push({ loc: `/blog/${slug}`, lastmod: dateOf(entry), priority: "0.6" });
}

const body = urls
  .map(({ loc, lastmod, priority }) =>
    [
      "  <url>",
      `    <loc>${SITE_URL}${loc}</loc>`,
      lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
      `    <priority>${priority}</priority>`,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n"),
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

fs.writeFileSync(path.resolve(__dirname, "../public/sitemap.xml"), xml);
console.log(`sitemap.xml generated with ${urls.length} URLs`);
