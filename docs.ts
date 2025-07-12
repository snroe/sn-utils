import * as td from "typedoc";
import fs from "fs-extra";
import path from "path";
import { MarkdownApplication } from 'typedoc-plugin-markdown';

function getTsFiles(dir: string): string[] {
  const result: string[] = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const subFiles = getTsFiles(fullPath);
      result.push(...subFiles);
    } else if (
      file.endsWith(".ts") &&
      !file.endsWith(".d.ts") &&
      file !== "index.ts"
    ) {
      result.push(path.relative(process.cwd(), fullPath));
    }
  }

  return result;
}

const entryPoints = getTsFiles("src");

if (entryPoints.length === 0) {
  console.error("No .ts files found.");
  process.exit(1);
}

async function generateDocs(outDir: string) {
  const entryPoints = getTsFiles("src");

  const app = await td.Application.bootstrapWithPlugins({
    entryPoints,
    out: outDir,
    excludePrivate: false,
    includeVersion: true,
    customFooterHtml: `Copyright <strong>Snroe</strong> 2024`,
    cleanOutputDir: false,
    readme: "README.md",
    githubPages: true,
    plugin: [
      "typedoc-plugin-markdown"
    ],
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

async function main() {
  await generateDocs("docs/");
}

main().catch(console.error);