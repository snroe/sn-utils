import * as td from "typedoc";
import fs from "fs-extra";
import path from "path";

function getTsFiles(dir: string): string[] {
  const result: string[] = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 递归处理子目录并合并结果
      const subFiles = getTsFiles(fullPath);
      result.push(...subFiles);
    } else if (
      file.endsWith(".ts") &&
      !file.endsWith(".d.ts") &&
      file !== "index.ts" // 可选排除 index.ts
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

async function generateDocs(lang: "en" | "zh", outDir: string) {
  const entryPoints = getTsFiles("src");

  if (entryPoints.length === 0) {
    console.error(`No .ts files found for ${lang}.`);
    return;
  }

  const app = await td.Application.bootstrapWithPlugins({
    entryPoints,
    out: outDir,
    // plugin: [
    //   "typedoc-plugin-md"
    // ],
    excludePrivate: true,
    includeVersion: true,
    cleanOutputDir: true,
    readme: "README.md",
  });

  const project = await app.convert();
  if (!project) {
    console.error(`Failed to convert project for ${lang}.`);
    return;
  }

  await app.generateDocs(project, outDir);
  console.log(`✅ ${lang.toUpperCase()} 文档已生成至 ${outDir}`);
}

async function main() {
  // await generateDocs("en", "docs/en/modules");
  await generateDocs("zh", "docs/");
}

main().catch(console.error);