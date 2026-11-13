import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StoryCard } from "@/components/site/StoryCard";
import { stories } from "@/components/site/wedding-content";

const story = stories[0];
const flipTo = () => fireEvent.click(screen.getByRole("button", { name: "Read the story: Halloween 2023" }));

describe("story cards", () => {
  it("keeps the story side out of the way until the card is turned", () => {
    render(<StoryCard story={story} />);
    expect(screen.queryByRole("button", { name: "Read Full Story" })).toBeNull();
    flipTo();
    expect(screen.getByRole("button", { name: "Read Full Story" })).toBeVisible();
  });

  it("returns to the photograph when the visitor turns the card back", () => {
    render(<StoryCard story={story} />);
    flipTo();
    fireEvent.click(screen.getByRole("button", { name: "Back to photograph" }));
    expect(screen.queryByRole("button", { name: "Read Full Story" })).toBeNull();
    expect(screen.getByRole("button", { name: "Read the story: Halloween 2023" })).toBeVisible();
  });

  it("opens the full story in a readable modal and closes it", () => {
    render(<StoryCard story={story} />);
    flipTo();
    fireEvent.click(screen.getByRole("button", { name: "Read Full Story" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent("Halloween 2023");
    expect(dialog).toHaveTextContent("The First Time We Met");
    fireEvent.click(screen.getByRole("button", { name: "Close story" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
