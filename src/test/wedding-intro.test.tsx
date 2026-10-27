import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WeddingIntro } from "@/components/site/intro/WeddingIntro";
import { INTRO_STORAGE_KEY } from "@/components/site/intro/timeline";

afterEach(() => { cleanup(); localStorage.clear(); vi.restoreAllMocks(); });
const renderIntro = () => render(<WeddingIntro><main>Original homepage</main></WeddingIntro>);

describe("intro entry and browser preference", () => {
  it("skipping remembers the decision and displays the original homepage", () => {
    renderIntro();
    expect(screen.queryByRole("main")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "SKIP INTRO" }));
    expect(localStorage.getItem(INTRO_STORAGE_KEY)).toBe("true");
    expect(screen.getByRole("main")).toBeVisible();
  });
  it("returning visitors enter directly and can replay then skip", () => {
    localStorage.setItem(INTRO_STORAGE_KEY, "true");
    renderIntro();
    expect(screen.getByRole("main")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Replay Intro" }));
    expect(screen.getByRole("dialog")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "BEGIN OUR ADVENTURE" }));
    expect(screen.queryByRole("button", { name: "BEGIN OUR ADVENTURE" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Skip Intro" }));
    expect(screen.getByRole("main")).toBeVisible();
  });
  it("reduced-motion visitors enter without playing the film", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
    renderIntro();
    act(() => fireEvent.click(screen.getByRole("button", { name: "BEGIN OUR ADVENTURE" })));
    expect(screen.getByRole("main")).toBeVisible();
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});