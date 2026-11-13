import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StoryCard } from "@/components/site/StoryCard";
import { stories } from "@/components/site/wedding-content";

const story = stories[0];

describe("story cards", () => {
  it("shows the photograph side first and flips to the story on tap", () => {
    render(<StoryCard story={story} />);
    expect(screen.queryByText("Read Full Story")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Read the story: Halloween 2023" }));
    expect(screen.getByText("Read Full Story")).toBeVisible();
  });

  it("opens the full story in a readable modal and closes it", () => {
    render(<StoryCard story={story} />);
    fireEvent.click(screen.getByRole("button", { name: "Read the story: Halloween 2023" }));
    fireEvent.click(screen.getByRole("button", { name: "Read Full Story" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent("Halloween 2023");
    expect(dialog).toHaveTextContent("The First Time We Met");
    fireEvent.click(screen.getByRole("button", { name: "Close story" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("keeps the photograph side out of the way while the story is showing", () => {
    render(<StoryCard story={story} />);
    const flip = screen.getByRole("button", { name: "Read the story: Halloween 2023" });
    expect(flip).toBeEnabled();
    fireEvent.click(flip);
    expect(screen.queryByRole("button", { name: "Read the story: Halloween 2023" })).toBeNull();
  });
});
