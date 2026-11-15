import { createFileRoute } from "@tanstack/react-router";
import { FaqSection } from "@/components/site/FaqSection";
export const Route = createFileRoute("/faqs")({
 head: () => ({ meta: [{ title: "FAQs · Gowda × Malhotra" }, { name: "description", content: "Answers about Sharanya and Sahil’s wedding celebrations and travel plans." }, { property: "og:title", content: "FAQs · Gowda × Malhotra" }, { property: "og:description", content: "Answers about Sharanya and Sahil’s wedding celebrations and travel plans." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
 component: Page,
});
function Page() { return <main className="content-page"><FaqSection /></main>; }
