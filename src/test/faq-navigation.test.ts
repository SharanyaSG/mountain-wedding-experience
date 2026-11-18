import { describe, expect, it } from "vitest";
import { faqCategoryFromHash } from "@/components/site/faq-navigation";

describe("FAQ category deep links", () => {
  it("opens the existing wedding experience category", () => {
    expect(faqCategoryFromHash("#experience")?.label).toBe("The Wedding Experience");
  });
  it("opens the existing mountain exploration category", () => {
    expect(faqCategoryFromHash("#explore")?.label).toBe("Explore the Mountains");
  });
  it("opens the existing travel and weather category", () => {
    expect(faqCategoryFromHash("#travel")?.label).toBe("Travel & Weather");
  });
  it("opens the existing wedding and celebrations category", () => {
    expect(faqCategoryFromHash("celebrations")?.label).toBe("Our Wedding & Celebrations");
  });
  it("opens the existing invitations and RSVPs category", () => {
    expect(faqCategoryFromHash("#invitations")?.label).toBe("Save the Date & RSVPs");
  });
  it("does not select a category for the main FAQ URL", () => {
    expect(faqCategoryFromHash("")).toBeUndefined();
  });
  it("opens the existing accommodations category", () => {
    expect(faqCategoryFromHash("#accommodations")?.label).toBe("Accommodations");
  });
});