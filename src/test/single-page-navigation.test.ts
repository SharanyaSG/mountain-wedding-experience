import { describe, expect, it } from "vitest";
import { navigationItems, plansHash } from "@/components/site/SiteNavigation";

describe("single-page navigation", () => {
  it("lists all eight destinations in the requested order as same-page anchors", () => {
    expect([...navigationItems.map((item) => [item.label, item.hash]), ["Tell Us Your Plans", plansHash]]).toEqual([
      ["Home", "home"],
      ["Wedding Itinerary", "wedding-itinerary"],
      ["Plan Your Trip", "plan-your-trip"],
      ["Our Stories", "our-stories"],
      ["Gallery", "gallery"],
      ["FAQs", "faqs"],
      ["A Message From Us", "message-from-us"],
      ["Tell Us Your Plans", "tell-us-your-plans"],
    ]);
  });
});
