import { describe, expect, it } from "vitest";
import { navigationItems, plansDestination } from "@/components/site/navigation-content";

describe("single-page navigation", () => {
  it("lists the six requested pages and separate plans destination in order", () => {
    expect([...navigationItems.map((item) => [item.label, item.to]), ["Tell Us Your Plans", plansDestination]]).toEqual([
      ["Home", "/"],
      ["Wedding Itinerary", "/wedding-itinerary"],
      ["Plan Your Trip", "/plan-your-trip"],
      ["Our Journey", "/our-journey"],
      ["FAQs", "/faqs"],
      ["A Message From Us", "/a-message-from-us"],
      ["Tell Us Your Plans", "/tell-us-your-plans"],
    ]);
  });
});
