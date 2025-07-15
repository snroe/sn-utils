import { build } from "bun";
import fg from 'fast-glob';

const main = async () => {
  const entryPoints = fg.sync("src/**/*.ts");

  if (entryPoints.length === 0) {
    console.error("No .ts files found.");
    process.exit(1);
  }

  const result = await build({
    root: 'src',
    entrypoints: entryPoints,
    outdir: "./lib",
    naming: "[dir]/[name].mjs",
    minify: false,
    splitting: true,
    target: "node",
    format: "esm",
    external: ["*"],
    sourcemap: "none",
  });

  if (result.success) {
    console.log("bun build successful");
  } else {
    console.error("bun build failed");
    for (const message of result.logs) {
      console.error(message);
    }
  }
};

await main().catch(error => {
  console.error(error);
  process.exit(1);
});