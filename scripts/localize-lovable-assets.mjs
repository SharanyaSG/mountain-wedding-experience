// Turns Lovable-hosted uploads into real files in the repository.
//
// Lovable stores uploaded images and videos in its own storage and adds a small manifest to the project
// (src/assets/<name>.<ext>.asset.json, whose `url` is /__l5e/assets-v1/...). This script, for each manifest:
//   1. downloads the file into src/assets/<name>.<ext> (next to the manifest) and checks its size,
//   2. rewrites `import x from "@/assets/<name>.<ext>.asset.json"` to `import x from "@/assets/<name>.<ext>"`
//      and `x.url` to `x` (a plain Vite import is already the file's URL),
//   3. deletes the manifest.
// Run it whenever a new Lovable upload shows up as a .asset.json; the build never downloads anything.
//
// Usage: node scripts/localize-lovable-assets.mjs
//   LOVABLE_ASSET_ORIGIN  where to download from (default: the live site, which serves every deployed upload).
//                         For uploads not deployed yet, use the Lovable preview origin plus LOVABLE_PREVIEW_TOKEN.
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const origin = (process.env.LOVABLE_ASSET_ORIGIN || "https://www.gowdamalhotra.com").replace(
  /\/+$/,
  "",
);
const token = process.env.LOVABLE_PREVIEW_TOKEN;
const assetDir = "src/assets";
const sourceDir = "src";

const manifests = (await readdir(assetDir, { recursive: true }))
  .filter((name) => name.endsWith(".asset.json"))
  .map((name) => path.join(assetDir, name));
if (manifests.length === 0) {
  console.log("No Lovable manifests (.asset.json) found: every asset is already a local file.");
  process.exit(0);
}

async function download(manifestPath) {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const target = manifestPath.slice(0, -".asset.json".length);
  const existing = await stat(target).catch(() => null);
  if (existing && (!manifest.size || existing.size === manifest.size)) return target;
  if (typeof manifest.url !== "string" || !manifest.url.startsWith("/__l5e/")) {
    throw new Error(`unexpected url ${JSON.stringify(manifest.url)}`);
  }
  const source = new URL(origin + manifest.url);
  if (token) source.searchParams.set("__lovable_token", token);
  const response = await fetch(source);
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${source.origin}`);
  if ((response.headers.get("content-type") ?? "").includes("text/html")) {
    throw new Error(`got an HTML page instead of ${manifest.content_type}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (manifest.size && bytes.length !== manifest.size) {
    throw new Error(`size ${bytes.length} does not match the manifest's ${manifest.size}`);
  }
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
  return target;
}

// Download a few at a time.
const done = [];
const failures = [];
const queue = [...manifests];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    for (let m = queue.shift(); m; m = queue.shift()) {
      try {
        done.push({ manifest: m, file: await download(m) });
      } catch (error) {
        failures.push(`${m}: ${error.message}`);
      }
    }
  }),
);

// Rewrite imports of the downloaded manifests.
const localized = new Set(done.map((d) => path.basename(d.manifest)));
const sources = (await readdir(sourceDir, { recursive: true }))
  .filter((name) => /\.(ts|tsx)$/.test(name))
  .map((name) => path.join(sourceDir, name));
const importRe = /import\s+(\w+)\s+from\s+(["'])([^"']+?)\.asset\.json\2/g;
let rewritten = 0;
for (const file of sources) {
  const text = await readFile(file, "utf8");
  const names = [];
  let next = text.replace(importRe, (whole, name, quote, spec) => {
    if (!localized.has(path.basename(spec) + ".asset.json")) return whole;
    names.push(name);
    return `import ${name} from ${quote}${spec}${quote}`;
  });
  for (const name of names) next = next.replace(new RegExp(`\\b${name}\\.url\\b`, "g"), name);
  if (next !== text) {
    await writeFile(file, next);
    rewritten++;
  }
}

for (const { manifest } of done) await rm(manifest);

console.log(
  `Localized ${done.length} of ${manifests.length} assets from ${origin}; rewrote imports in ${rewritten} files.`,
);
if (failures.length > 0) {
  console.error(`Failed (manifests kept, imports unchanged):\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
