import { describe, expect, it } from "vitest";
import { hotels, plannedStories, stories } from "@/components/site/wedding-content";

describe("wedding content", () => {
  it("keeps RiverWalk as the sole featured accommodation", () => {
    expect(hotels.map((h) => [h.id, h.name])).toEqual([
      ["riverwalk", "RiverWalk Resort at Loon Mountain"],
    ]);
  });
  it("plans nine stories", () => expect(plannedStories).toHaveLength(9));

  it("gives the gallery eight stories in the supplied order, with exact titles and subtitles", () => {
    expect(stories.map((s) => [s.n, s.title, s.subtitle])).toEqual([
      ["01", "Halloween 2023", "The First Time We Met"],
      ["02", "The Bow", "Sharanya’s Favorite Sahil Story"],
      ["03", "Shravya", "Sahil’s Favorite Sharanya Story"],
      ["04", "New York", "The First Big Trip"],
      ["05", "The Free Mattress", "He Meant Well…."],
      ["06", "Our Homes Away From Home", "Cornwalls & Silhouette"],
      ["07", "The Puppy Proposal", "A Ring Pop, A Misunderstanding, & A Very Confused Mother"],
      ["08", "The One Where He Behaved!", "Blessings from The Gowdas & The Malhotras"],
    ]);
  });

  it("carries every story in full, exactly as supplied", () => {
    expect(stories.every((s) => s.body.trim().length > 0)).toBe(true);
    expect(JSON.stringify(stories)).not.toContain("Story text to come");
    expect(JSON.stringify(stories)).not.toMatch(/[♥❤💕]/);

    const byId = (id: string) => {
      const s = stories.find((x) => x.id === id);
      if (!s) throw new Error("missing story: " + id);
      return s;
    };
    const paras = (s: (typeof stories)[number]) =>
      s.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).length;

    expect(byId("halloween-2023").body).toMatch(/^On Halloween 2023, Sharanya and her friends went to Witches Woods/);
    expect(byId("halloween-2023").body).toContain("“Never, ever, ever will I  date him. Not even if he were the last man on earth, and not even if procreation depended on it!”");
    expect(byId("halloween-2023").body.trimEnd()).toMatch(/Three years later, here they are …$/);

    expect(byId("the-bow").body).toContain("“I’ll always give you what you want.”");
    expect(byId("shravya").body).toContain("“Oh yes, that girl… Shravya, right?”");
    expect(byId("new-york").body).toContain("It was their first trip together, and it turned out to be full of unexpected adventures, small mishaps, and a lot of laughter.");
    expect(byId("the-free-mattress").body.trimEnd()).toMatch(/just on a normal bed frame\.$/);
    expect(byId("our-homes-away-from-home").body).toContain("we told Sarah and Miz that one day, whenever we got married, we wanted them behind the bar.");
    expect(byId("the-puppy-proposal").body).toContain("asked, “Will you be my puppy?”");
    expect(byId("the-puppy-proposal").body.trimEnd()).toMatch(/…which led to the next step - asking for blessings the slightly more formal way\.$/);
    expect(byId("the-one-where-he-behaved").body).toContain("gave their blessing with warmth and happiness.");

    expect(stories.map(paras)).toEqual([5, 6, 6, 6, 5, 6, 8, 6]);
    expect(byId("the-puppy-proposal").body).toContain("You’re so close.”\nEventually, after many circles");
  });
});
