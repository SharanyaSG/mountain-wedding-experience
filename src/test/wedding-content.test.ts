import { describe, expect, it } from "vitest";
import { hotels, plannedStories, stories } from "@/components/site/wedding-content";

const riverwalk = hotels[0];
const hampton = hotels[1];

describe("wedding content", () => {
  it("lists RiverWalk first and Hampton Inn second, with no third hotel", () => {
    expect(hotels.map((h) => [h.n, h.id, h.name])).toEqual([
      ["01", "riverwalk", "RiverWalk Resort at Loon Mountain"],
      ["02", "hampton", "Hampton Inn Lincoln White Mountains"],
    ]);
    expect(hotels.some((h) => h.name.includes("Holiday Inn"))).toBe(false);
  });
  it("recommends RiverWalk with its confirmed room block", () => {
    expect(riverwalk.label).toBe("Our Recommended Stay");
    expect(riverwalk.tagline).toBe("Stay close to the celebrations.");
    expect(riverwalk.introduction).toBe(
      "We’ve reserved a discounted wedding room block at RiverWalk Resort, and we’d love for you to stay here with us! With our Thursday celebrations taking place on-site and convenient access to our wedding-day shuttle, it’s the easiest way to enjoy the festivities.",
    );
    expect(riverwalk.urgency).toBe(
      "Our wedding falls during New Hampshire’s peak foliage season and Columbus Day weekend, when accommodations are in high demand. We strongly recommend booking early to take advantage of our special group rates.",
    );
    expect(riverwalk.reasons).toEqual([
      "Exclusive wedding room-block rates",
      "Thursday celebrations on-site",
      "Convenient access to the wedding-day shuttle",
      "Stay close to family and friends",
    ]);
    expect(riverwalk.bookingHeading).toBe("Our Wedding Room Block");
    expect(riverwalk.bookingNote).toBe(
      "Special group rates have been secured for our guests. Booking details will be shared soon.",
    );
  });
  it("keeps Hampton Inn a secondary option with no room block", () => {
    expect(hampton.label).toBe("Alternative Accommodation");
    expect(hampton.introduction).toBe(
      "Prefer another option? Hampton Inn is located nearby. Please note that we do not have a wedding room block here, and rates and availability will be subject to holiday-weekend demand.",
    );
    expect(hampton.roomBlock).toBe("none");
  });
  it("records confirmed breakfast and room-block facts", () => {
    expect(hotels.map((h) => [h.breakfastIncluded, h.roomBlock])).toEqual([
      [false, "reserved"],
      [true, "none"],
    ]);
  });
  it("invents no rates, codes, deadlines or availability claims", () => {
    expect(JSON.stringify(hotels)).not.toMatch(/\$\d|per night|discount code|% off|book by|deadline|rooms left/i);
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
