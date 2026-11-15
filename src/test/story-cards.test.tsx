import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StoryCard } from "@/components/site/StoryCard";
import { stories } from "@/components/site/wedding-content";

const story = stories.find((s) => s.id === "halloween-2023");
if (!story) throw new Error("Halloween 2023 is missing from the story collection");
const flipTo = () => fireEvent.click(screen.getByRole("button", { name: "Read the story: Halloween 2023" }));

describe("story cards", () => {
  it("keeps the story side out of the way until the card is turned", () => {
    render(<StoryCard story={story} />);
    expect(screen.queryByRole("button", { name: "Read the Full Story" })).toBeNull();
    flipTo();
    expect(screen.getByRole("button", { name: "Read the Full Story" })).toBeVisible();
    expect(screen.getByText(/On Halloween 2023, Sharanya and her friends went to Witches Woods/)).toBeVisible();
  });

  it("returns to the photograph when the visitor turns the card back", () => {
    render(<StoryCard story={story} />);
    flipTo();
    fireEvent.click(screen.getByRole("button", { name: "Back to photograph" }));
    expect(screen.queryByRole("button", { name: "Read the Full Story" })).toBeNull();
    expect(screen.getByRole("button", { name: "Read the story: Halloween 2023" })).toBeVisible();
  });

  it("opens the full story in a readable modal and closes it", () => {
    render(<StoryCard story={story} />);
    flipTo();
    fireEvent.click(screen.getByRole("button", { name: "Read the Full Story" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent("Halloween 2023");
    expect(dialog).toHaveTextContent("The First Time We Met");
    fireEvent.click(screen.getByRole("button", { name: "Close story" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows the supplied preview and the complete proposal story", () => {
    const proposal = stories.find((s) => s.id === "the-proposal-that-became-two");
    if (!proposal) throw new Error("The Proposal That Became Two is missing from the story collection");
    render(<StoryCard story={proposal} />);
    fireEvent.click(screen.getByRole("button", { name: "Read the story: The Proposal That Became Two" }));
    expect(
      screen.getByText("Sahil had planned an elaborate scavenger hunt through Boston, revisiting the places that had shaped their relationship. What he didn’t know was that Sharanya had been carrying a ring for him for over a month. They both had a proposal planned, and neither knew what the other was about to do."),
    ).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Read the Full Story" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent("They both knew they’d found their forever. Neither knew the other was planning to propose.");
    expect(dialog).toHaveTextContent("Two proposals. Two rings. Two very happy people.");
    expect(dialog).toHaveTextContent("He had absolutely no idea she was planning to ask him the very same question.");
    expect(dialog.querySelectorAll("p").length).toBeGreaterThanOrEqual(28);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
