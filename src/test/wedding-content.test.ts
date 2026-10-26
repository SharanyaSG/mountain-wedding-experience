import { describe, expect, it } from "vitest";
import { hotels, plannedStories } from "@/components/site/wedding-content";

describe("wedding content", () => {
  it("keeps hotels in priority order", () => {
    expect(hotels.map((h) => h.id)).toEqual(["riverwalk", "hampton", "holiday-inn"]);
  });
  it("records confirmed breakfast and room-block facts", () => {
    expect(hotels.map((h) => [h.breakfastIncluded, h.roomBlock])).toEqual([[false, "planned"], [true, "planned"], [true, "none"]]);
  });
  it("plans nine stories", () => expect(plannedStories).toHaveLength(9));
});