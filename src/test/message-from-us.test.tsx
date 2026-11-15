import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MessageFromUs } from "@/components/site/MessageFromUs";

/**
 * Guest-facing rules for the personal message video:
 * it must never start on its own, must carry its own controls, and must not
 * download before a visitor asks for it.
 */
describe("a message from us video", () => {
  const video = () => document.querySelector("#message-from-us video") as HTMLVideoElement | null;

  it("plays only when the visitor asks, with sound controls available", () => {
    render(<MessageFromUs />);
    const v = video();
    expect(v).not.toBeNull();
    expect(v?.autoplay).toBe(false);
    expect(v?.controls).toBe(true);
    expect(v?.playsInline).toBe(true);
  });

  it("loads just enough to show a preview until playback starts", () => {
    render(<MessageFromUs />);
    const v = video();
    expect(v?.getAttribute("preload")).toBe("metadata");
    expect(v?.getAttribute("poster")).toMatch(/^\/__l5e\/assets-v1\//);
  });
});
