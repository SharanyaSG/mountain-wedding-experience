// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

// GitHub Pages builds (`bun run build:pages`) prerender every route to static HTML,
// skip the Cloudflare server bundle and serve from the repository sub-path.
// Lovable builds don't set GITHUB_PAGES and are unaffected.
const isGitHubPages = process.env["GITHUB_PAGES"] === "true";
const pagesBase = process.env["PAGES_BASE_PATH"] || "/";

// Lovable asset manifests point at root-relative `/__l5e/...` URLs. On GitHub Pages the
// site lives under a sub-path, so prefix them with the base. The files themselves are
// downloaded into the build by scripts/fetch-lovable-assets.mjs.
function pagesAssetBase(base: string): Plugin {
  return {
    name: "pages-asset-base",
    enforce: "pre",
    transform(code, id) {
      if (!id.split("?", 1)[0]!.endsWith(".asset.json")) return null;
      return { code: code.replaceAll('"/__l5e/', `"${base}__l5e/`), map: null };
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(isGitHubPages && {
      prerender: { enabled: true, crawlLinks: true, autoSubfolderIndex: true },
      // Unknown URLs fall back to 404.html, which boots the app and shows its 404 page.
      spa: { enabled: true, prerender: { outputPath: "/404.html" } },
    }),
  },
  ...(isGitHubPages && {
    nitro: false as const,
    plugins: [pagesAssetBase(pagesBase)],
    vite: { base: pagesBase },
  }),
});
