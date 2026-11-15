import { faqCategories } from "./faq-content";

/** Category fragments use the existing FAQ IDs, not duplicate sections. */
export function faqCategoryFromHash(hash: string) {
  return faqCategories.find((category) => category.id === hash.replace(/^#/, ""));
}