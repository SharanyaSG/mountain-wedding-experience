import { describe, expect, it } from "vitest";
import { faqCategories } from "@/components/site/faq-content";

const category = (id: string) => {
  const found = faqCategories.find((c) => c.id === id);
  expect(found, `category ${id}`).toBeDefined();
  return found!;
};

const item = (id: string, q: string) => {
  const found = category(id).items.find((i) => i.q === q);
  expect(found, `${id} question: ${q}`).toBeDefined();
  return found!;
};

describe("FAQ guest-list and invitation answers", () => {
  it("explains plus-ones come from the personally invited list", () => {
    expect(item("celebrations", "Can I bring a plus-one?").a).toEqual([
      "We’d love to celebrate with everyone, but we’re keeping our guest list limited to those we’ve personally invited.",
      "When you visit “Tell Us Your Plans” on our website and look up your name, you’ll see everyone included in your party. Those are the guests we’re planning to accommodate.",
      "We’re generally unable to accommodate additional plus-ones beyond those already listed. However, if you have a special request, please reach out to Sharanya or Sahil directly, and we’ll see what we can do!",
      "We appreciate your understanding as we work within our venue’s capacity and guest arrangements.",
    ]);
  });

  it("asks about a separate wedding invitation, not a formal one", () => {
    expect(category("invitations").items.some((i) => /formal wedding invitation/i.test(i.q))).toBe(false);
    expect(item("invitations", "Will we receive a separate wedding invitation?").a).toEqual([
      "No separate invitation is needed!",
      "We’re keeping things simple and digital. The personal message and save-the-date video we’ve shared with you are our way of inviting you to celebrate with us!",
      "This website will be your home for all the wedding details, including the schedule, accommodations, travel information, and eventually your final RSVP.",
      "We’ll continue sharing updates as the wedding gets closer, so you won’t need to wait for a separate formal invitation.",
    ]);
  });

  it("tells guests to contact the couple when their name is missing", () => {
    expect(item("invitations", "What if I can’t find my name in “Tell Us Your Plans”?").a).toEqual([
      "If you’re having trouble finding your name, don’t worry!",
      "Try searching using your first or last name as it appears in our guest list.",
      "If you’re still unable to find your details, please reach out to Sharanya or Sahil directly, and we’ll be happy to help you sort it out.",
    ]);
  });

  it("keeps additional-guest requests with the couple", () => {
    expect(item("invitations", "Can we bring additional guests?").a).toEqual([
      "When you look yourself up in “Tell Us Your Plans”, you’ll see exactly who is included in your party.",
      "Everyone listed in your party is invited to celebrate with us. We kindly ask that you keep to those guests when submitting your response.",
      "If you have any questions or would like to request an additional guest, please reach out to Sharanya or Sahil directly. While we can’t guarantee additional spots, we’re happy to discuss your request.",
    ]);
  });

  it("leaves every other FAQ section untouched", () => {
    expect(faqCategories.map((c) => `${c.id}:${c.items.length}`)).toEqual([
      "celebrations:6",
      "invitations:9",
      "accommodations:7",
      "travel:7",
      "experience:5",
      "explore:3",
    ]);
  });
});
