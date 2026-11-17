import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Every image and video lives in the repository, so builds never download assets.
 * A Lovable upload arrives as a `.asset.json` manifest pointing at Lovable's storage:
 * run `node scripts/localize-lovable-assets.mjs` to turn it into a real file.
 */
const files = readdirSync("src", { recursive: true, encoding: "utf8" }).map((f) =>
  path.join("src", f),
);

describe("local assets", () => {
  it("has no Lovable-hosted asset manifests", () => {
    expect(files.filter((f) => f.endsWith(".asset.json"))).toEqual([]);
  });

  it("never references Lovable's asset storage in code", () => {
    const code = files.filter(
      (f) => /\.(ts|tsx|css)$/.test(f) && !f.includes(`${path.sep}test${path.sep}`),
    );
    expect(code.filter((f) => readFileSync(f, "utf8").includes("/__l5e/"))).toEqual([]);
  });
});
