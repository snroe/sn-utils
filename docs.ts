import * as td from "typedoc";
import fs from "fs-extra";
import path from "path";
import fg from 'fast-glob';
import * as cheerio from 'cheerio';
import { create } from 'xmlbuilder2';

const entryPoints = fg.sync('pages/**/*.html');

if (entryPoints.length === 0) {
  console.error("No .ts files found.");
  process.exit(1);
}

async function generateDocs(outDir: string) {
  const entryPoints = fg.sync(['src/**/*.ts', '!src/**/index.ts']);

  const app = await td.Application.bootstrapWithPlugins({
    entryPoints,
    out: outDir,
    excludePrivate: false,
    includeVersion: true,
    customFooterHtml: `Copyright <strong><a href="https://snroe.com">Snroe</a></strong> 2025 | <a href="https://github.com/snroe">GitHub</a>`,
    cleanOutputDir: false,
    readme: "README.md",
    gitRevision: "main",
    githubPages: false,
    // logLevel: "Verbose",
  });

  const project = await app.convert();
  if (!project) {
    console.error(`Failed to convert project`);
    return;
  }

  await app.generateDocs(project, outDir);

  console.log(`Documents generate in ${outDir}`);
}

async function generateMetadata() {
  const files = fg.sync('pages/**/*.html');

  files.forEach((filePath) => {
    let html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);

    const metaTags = `
    <meta name="keywords" content="Snroe, selize, utils, Documentation, typescript, selize-utils, bun">
    <meta property="og:title" content="${$('title').text()}">
    <meta property="og:description" content="Documentation for @selize/utils">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://utils.selize.snroe.com/">
    <meta property="og:image" content="https://utils.selize.snroe.com/logo.png">
    `;
    const jsonLd = `<script type="application/ld+json">{"@context": "https://schema.org","@type": "WebSite","name": "Documentation for @selize/utils","url": "https://utils.selize.snroe.com/"}</script>`;

    $('head').append(metaTags.trim());
    $('head').append(jsonLd.trim());

    fs.writeFileSync(filePath, $.html(), 'utf-8');
  });

  console.log('Meta tags and structured data inserted into all HTML files.');
}

async function generateSitemap() {
  const files = fg.sync(`pages/**/*.html`);

  // Create XML root node
  const root = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });

  files.forEach((filePath) => {
    const fileStat = fs.statSync(filePath);

    // Generate a relative URL path from the file path
    let urlPath = path.relative("pages", filePath);
    if (!urlPath.startsWith('/')) {
      urlPath = '/' + urlPath;
    }
    urlPath = urlPath.replace(/\\/g, '/'); // Windows compatibility processing

    const fullUrl = "https://utils.selize.snroe.com" + urlPath;

    // Add lastmod
    root.ele('url', {
      loc: fullUrl,
      lastmod: new Date(fileStat.mtime).toISOString().split('T')[0] // YYYY-MM-DD
    });
  });

  // Generate XML string
  const xml = root.end({ prettyPrint: true });

  await fs.ensureDir(path.dirname("pages/sitemap.xml"));
  await fs.writeFile("pages/sitemap.xml", xml, 'utf-8');

  console.log(`Sitemap generated at: pages/sitemap.xml`);
}


async function main() {
  await generateDocs("pages/");
  await generateMetadata();
  await generateSitemap();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});