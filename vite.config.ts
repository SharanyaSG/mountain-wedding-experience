// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// GitHub Pages builds (`bun run build:pages`) prerender every route to static HTML,
// skip the Cloudflare server bundle and serve from the repository sub-path.
// Lovable builds don't set GITHUB_PAGES and are unaffected.
const isGitHubPages = process.env["GITHUB_PAGES"] === "true";
const pagesBase = process.env["PAGES_BASE_PATH"] || "/";

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
    vite: { base: pagesBase },
  }),
});
