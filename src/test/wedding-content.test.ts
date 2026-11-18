import { describe, expect, it } from "vitest";
import { hotels, plannedStories, stories } from "@/components/site/wedding-content";

describe("wedding content", () => {
  it("keeps RiverWalk as the sole featured accommodation", () => {
    expect(hotels.map((h) => [h.id, h.name])).toEqual([
      ["riverwalk", "RiverWalk Resort at Loon Mountain"],
    ]);
  });
  it("plans nine stories", () => expect(plannedStories).toHaveLength(9));

  it("gives the gallery ten stories in the supplied order, with exact titles and subtitles", () => {
    expect(stories.map((s) => [s.n, s.title, s.subtitle])).toEqual([
      ["01", "Halloween 2023", "The First Time We Met"],
      ["02", "The Bow", "Sharanya’s Favorite Sahil Story"],
      ["03", "Shravya", "Sahil’s Favorite Sharanya Story"],
      ["04", "New York", "The First Big Trip"],
      ["05", "The Free Mattress", "He Meant Well…."],
      ["06", "Our Homes Away From Home", "Cornwalls & Silhouette"],
      ["07", "The Puppy Proposal", "A Ring Pop, A Misunderstanding, & A Very Confused Mother"],
      ["08", "The One Where He Behaved!", "Blessings from The Gowdas & The Malhotras"],
      ["09", "The Proposal That Became Two", "They both knew they’d found their forever. Neither knew the other was planning to propose."],
      ["10", "Stormy Gowda-Malhotra", "Our first big purchase. Her first thousand miles."],
      ["11", "The Great Board Game Merger", "Two board game nerds. One shared collection. A marriage built on love, strategy, and a little too much competition."],
    ]);
  });

  it("gives Stormy the short card subtitle and the longer reading-view line", () => {
    const s = stories.find((x) => x.id === "stormy-gowda-malhotra");
    expect(s?.subtitle).toBe("Our first big purchase. Her first thousand miles.");
    expect(s?.readerSubtitle).toBe("Our first big purchase, a thousand-mile adventure, and a new member of the family.");
    expect(s?.preview).toBe(
      "Sahil and Sharanya hadn’t planned on buying a car quite so soon. But when Sahil’s aging van finally gave up, they found themselves making their first major purchase together. Two months of obsessive tracking later, Stormy arrived—and promptly embarked on a thousand-mile road trip through New England.",
    );
  });

  it("shows the supplied Halloween and bow photographs and leaves every other card front a placeholder", () => {
    const halloween = stories.find((s) => s.id === "halloween-2023");
    expect(halloween?.photo).toMatchObject({ width: 1600, height: 1200 });
    expect(halloween?.photo?.url).toMatch(/\/halloween-2023\.png$/);
    const bow = stories.find((s) => s.id === "the-bow");
    expect(bow?.photo).toMatchObject({ width: 1320, height: 1765 });
    expect(bow?.photo?.url).toMatch(/\/the-bow\.png$/);
    const shravya = stories.find((s) => s.id === "shravya");
    expect(shravya?.photo).toMatchObject({ width: 1440, height: 1920 });
    expect(shravya?.photo?.url).toMatch(/\/shravya\.webp$/);
    expect(shravya?.photo?.objectPosition).toBe("50% 81.2%");
    const newYork = stories.find((s) => s.id === "new-york");
    expect(newYork?.photo).toMatchObject({ width: 1440, height: 1920 });
    expect(newYork?.photo?.url).toMatch(/\/new-york\.webp$/);
    const freeMattress = stories.find((s) => s.id === "the-free-mattress");
    expect(freeMattress?.photo).toMatchObject({ width: 1440, height: 1920 });
    expect(freeMattress?.photo?.url).toMatch(/\/free-mattress\.webp$/);
    const puppy = stories.find((s) => s.id === "the-puppy-proposal");
    expect(puppy?.photo).toMatchObject({ width: 1080, height: 1920 });
    expect(puppy?.photo?.url).toMatch(/\/the-puppy-proposal\.jpg$/);
    const behaved = stories.find((s) => s.id === "the-one-where-he-behaved");
    expect(behaved?.photo).toMatchObject({ width: 1080, height: 1920, objectPosition: "50% 11.9%" });
    expect(behaved?.photo?.url).toMatch(/\/the-one-where-he-behaved\.jpg$/);
    const proposalTwo = stories.find((s) => s.id === "the-proposal-that-became-two");
    expect(proposalTwo?.photo).toMatchObject({ width: 1280, height: 1920 });
    expect(proposalTwo?.photo?.url).toMatch(/\/proposal-that-became-two\.jpg$/);
    const stormy = stories.find((s) => s.id === "stormy-gowda-malhotra");
    expect(stormy?.photo).toMatchObject({ width: 1440, height: 1920 });
    expect(stormy?.photo?.url).toMatch(/\/stormy-gowda-malhotra\.webp$/);
    const boardGames = stories.find((s) => s.id === "the-great-board-game-merger");
    expect(boardGames?.photo).toMatchObject({ width: 1440, height: 1276 });
    expect(boardGames?.photo?.url).toMatch(/\/the-great-board-game-merger\.jpg$/);
    expect(stories.filter((s) => s.photo === null).map((s) => s.n)).toEqual([
      "06",
    ]);
  });

  it("shows the supplied board game preview on the card back, word for word", () => {
    const s = stories.find((x) => x.id === "the-great-board-game-merger");
    expect(s?.preview).toBe(
      "When Sharanya and Sahil got married, they didn’t just combine their lives. They merged their board game collections. What followed was an obsession with 7 Wonders Duel, an ongoing Everdell rivalry, and a new definition of date night. And somewhere along the way, Sahil seems to have forgotten how to win.",
    );
  });

  it("shows the supplied proposal preview on the card back, word for word", () => {
    const s = stories.find((x) => x.id === "the-proposal-that-became-two");
    expect(s?.preview).toBe(
      "Sahil had planned an elaborate scavenger hunt through Boston, revisiting the places that had shaped their relationship. What he didn’t know was that Sharanya had been carrying a ring for him for over a month. They both had a proposal planned, and neither knew what the other was about to do.",
    );
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

    expect(byId("the-proposal-that-became-two").body.split(/\n{2,}/)[0]).toBe("Sahil had a plan. A rather elaborate one, actually.");
    expect(byId("the-proposal-that-became-two").body).toContain("Every stop came with two clues: one to figure out where they were going and another to figure out what they had to do once they got there.");
    expect(byId("the-proposal-that-became-two").body).toContain("This time, it was green tea shots.");
    expect(byId("the-proposal-that-became-two").body).toContain("She hadn’t.");
    expect(byId("the-proposal-that-became-two").body).toContain("Two proposals. Two rings. Two very happy people.");
    expect(byId("the-proposal-that-became-two").body.trimEnd()).toMatch(/He had absolutely no idea she was planning to ask him the very same question\.$/);

    expect(byId("stormy-gowda-malhotra").body.split(/\n{2,}/)[0]).toBe("Every family has that one car that’s been around a little too long.");
    expect(byId("stormy-gowda-malhotra").body).toContain("For Sahil, it was an enormous, aging van that Sharanya affectionately referred to as his “soccer mom car.”");
    expect(byId("stormy-gowda-malhotra").body).toContain("For nearly two months, Sharanya and Sahil tracked their car’s progress with the dedication of people monitoring a spacecraft launch.");
    expect(byId("stormy-gowda-malhotra").body).toContain("Inspired partly by Stormtroopers and partly by the fact that the car simply looked like a Stormy, the name stuck.");
    expect(byId("stormy-gowda-malhotra").body).toContain("At one point, they ventured so far north that their phones picked up Canadian cell service and cheerfully welcomed them to Canada.");
    expect(byId("stormy-gowda-malhotra").body).toContain("By the time the weekend was over, Stormy had traveled more than 1,000 miles.");
    expect(byId("stormy-gowda-malhotra").body.trimEnd()).toMatch(/Welcome to the family, Stormy\.$/);

    expect(byId("the-great-board-game-merger").body.split(/\n{2,}/)[0]).toBe("When Sharanya and Sahil got married, they combined a lot of things.");
    expect(byId("the-great-board-game-merger").body).toContain("Their first great obsession was 7 Wonders Duel.");
    expect(byId("the-great-board-game-merger").body).toContain("And, apparently, it’s also where Sahil’s winning streak went to die.");
    expect(byId("the-great-board-game-merger").body).toContain("Jumping. Dancing. Screaming. Celebrating like she’d just won an Olympic gold medal.");
    expect(byId("the-great-board-game-merger").body).toContain("The games may change. The competition never will.");
    expect(byId("the-great-board-game-merger").body.trimEnd()).toMatch(/And possibly another victory dance happening in the next room\.$/);

    expect(stories.map(paras)).toEqual([5, 6, 6, 6, 5, 6, 8, 6, 28, 54, 62]);
    expect(byId("the-puppy-proposal").body).toContain("You’re so close.”\nEventually, after many circles");
  });
});
