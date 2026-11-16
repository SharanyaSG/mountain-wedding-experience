// Copies every Lovable-hosted asset referenced by src/assets/*.asset.json into the
// static build so GitHub Pages can serve the images itself.
//
// Lovable keeps uploaded images in its own storage and serves them from
// `/__l5e/assets-v1/...` on its domains. A static host has no such route, so we
// download each file from LOVABLE_ASSET_ORIGIN (e.g. https://your-site.lovable.app)
// into <outDir>/__l5e/assets-v1/... after `vite build`.
//
// Usage: LOVABLE_ASSET_ORIGIN=https://... node scripts/fetch-lovable-assets.mjs [outDir]
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = process.argv[2] ?? "dist/client";
const origin = process.env.LOVABLE_ASSET_ORIGIN?.replace(/\/+$/, "");
const token = process.env.LOVABLE_PREVIEW_TOKEN;

if (!origin) {
  console.error(
    "LOVABLE_ASSET_ORIGIN is not set. Set it to the Lovable site that serves this project's images, " +
      "for example https://your-site.lovable.app",
  );
  process.exit(1);
}

const assetDir = "src/assets";
const manifests = (await readdir(assetDir)).filter((name) => name.endsWith(".asset.json"));
const failures = [];

await Promise.all(
  manifests.map(async (name) => {
    const { url, content_type: expectedType } = JSON.parse(
      await readFile(path.join(assetDir, name), "utf8"),
    );
    if (typeof url !== "string" || !url.startsWith("/__l5e/")) return;

    const source = new URL(origin + url);
    if (token) source.searchParams.set("__lovable_token", token);

    try {
      const response = await fetch(source);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const type = response.headers.get("content-type") ?? "";
      if (type.includes("text/html"))
        throw new Error(`got an HTML page instead of ${expectedType}`);
      const target = path.join(outDir, url);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      failures.push(`${url}: ${error.message}`);
    }
  }),
);

if (failures.length > 0) {
  console.error(
    `Failed to download ${failures.length} of ${manifests.length} assets from ${origin}:`,
  );
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log(`Downloaded ${manifests.length} assets from ${origin} into ${outDir}`);
