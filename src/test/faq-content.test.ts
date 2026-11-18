import { describe, expect, it } from "vitest";
import { faqCategories } from "@/components/site/faq-content";

const category = (id: string) => {
  const found = faqCategories.find((c) => c.id === id);
  if (!found) throw new Error(`Missing category ${id}`);
  return found;
};

const item = (id: string, q: string) => {
  const found = category(id).items.find((i) => i.q === q);
  if (!found) throw new Error(`Missing ${id} question: ${q}`);
  return found;
};

describe("Confirmed FAQ wedding rules", () => {
  it("limits wedding celebrations to ages 13 and older", () => {
    const answer = item("celebrations", "Are children welcome at the wedding?").a;
    const text = answer.filter((block) => typeof block === "string").join(" ");
    expect(Number(text.match(/aged (\d+) and older/)?.[1])).toBe(13);
  });

  const roomAnswer = item("accommodations", "How much will accommodation cost?").a;
  const rooms = roomAnswer.flatMap((block, i) => {
    if (typeof block === "string" || !("heading" in block)) return [];
    const rate = Number(block.heading.match(/\$(\d+) per night/)?.[1]);
    const next = roomAnswer[i + 1];
    const occupancy = next && typeof next !== "string" && "list" in next
      ? Number(next.list[0]?.match(/up to (\d+) guests/)?.[1]) : NaN;
    return [{ name: block.heading.split(" — ")[0], rate, occupancy }];
  });

  it.each([
    ["Studio", 296, 4],
    ["One-Bedroom Suite", 422, 4],
    ["Two-Bedroom Suite", 718, 8],
  ])("confirms %s nightly group rate and occupancy", (name, rate, occupancy) => {
    expect(rooms.find((room) => room.name === name)).toEqual({ name, rate, occupancy });
  });

  it("requires two nights for every room option", () => {
    const minimum = roomAnswer.find((block) => typeof block === "string" && /All room options require/.test(block));
    const nights = typeof minimum === "string" ? minimum.match(/minimum (\S+)-night stay/)?.[1] : undefined;
    expect(nights).toBe("two");
  });
});
