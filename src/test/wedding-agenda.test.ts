import { describe, expect, it } from "vitest";
import { agenda } from "@/components/site/wedding-content";

const byDate = (date: string) => {
  const day = agenda.find((d) => d.date === date);
  if (!day) throw new Error(`No agenda day for ${date}`);
  return day;
};

describe("wedding weekend agenda", () => {
  it("covers three days, Thursday 07 through Saturday 09", () => {
    expect(agenda.map((d) => [d.n, d.dow, d.date])).toEqual([
      ["07", "Thursday", "October 7, 2027"],
      ["08", "Friday", "October 8, 2027"],
      ["09", "Saturday", "October 9, 2027"],
    ]);
  });

  it("lists the rehearsal dinner as the only invitation-only event", () => {
    const thursday = byDate("October 7, 2027");
    expect(thursday.events.map((e) => e.title)).toEqual(["Rehearsal Dinner", "Welcome Party"]);

    const dinner = thursday.events[0];
    expect(dinner?.place).toBe("RiverWalk Resort · Tuscan Terrace");
    expect(dinner?.note).toBe("By Invitation Only");
    expect(dinner?.detail).toBe(
      "An intimate gathering for our immediate families and those involved in the wedding ceremony.",
    );
    expect(dinner?.open).toBeUndefined();
  });

  it("opens the welcome party to every wedding guest with no invitation restriction", () => {
    const party = byDate("October 7, 2027").events[1];
    expect(party?.title).toBe("Welcome Party");
    expect(party?.place).toBe("Seven Birches Winery · RiverWalk Resort");
    expect(party?.open).toBe("All Wedding Guests Welcome!");
    expect(party?.note).toBeUndefined();
    expect(party?.detail).toBeUndefined();
  });

  it("shows Friday as three separate events", () => {
    const friday = byDate("October 8, 2027");
    expect(friday.events.map((e) => [e.title, e.place])).toEqual([
      ["The Vows", "Loon Mountain · Summit Amphitheater"],
      ["Cocktail Hour", "Loon Mountain · Octagon Lodge"],
      ["Wedding Reception", "Loon Mountain · Octagon Lodge"],
    ]);
    expect(friday.events.every((e) => e.note === undefined && e.open === undefined)).toBe(true);
  });

  it("closes with the farewell brunch at an unannounced location", () => {
    expect(byDate("October 9, 2027").events.map((e) => [e.title, e.place])).toEqual([
      ["Farewell Brunch", "Location to be announced"],
    ]);
  });

  it("invents no event times", () => {
    const text = JSON.stringify(agenda);
    expect(text).not.toMatch(/\d{1,2}:\d{2}/);
    expect(text).not.toMatch(/\b(AM|PM|am|pm)\b/);
  });
});
