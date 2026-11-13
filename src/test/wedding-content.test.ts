import { describe, expect, it } from "vitest";
import { hotels, plannedStories } from "@/components/site/wedding-content";

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
});
