import { createFileRoute } from "@tanstack/react-router";
import { TravelGuide } from "@/components/site/TravelGuide";
export const Route = createFileRoute("/plan-your-trip")({
 head: () => ({ meta: [{ title: "Plan Your Trip · Gowda × Malhotra" }, { name: "description", content: "Travel, accommodations and mountain adventures for Sharanya and Sahil’s New Hampshire wedding." }, { property: "og:title", content: "Plan Your Trip · Gowda × Malhotra" }, { property: "og:description", content: "Travel, accommodations and mountain adventures for Sharanya and Sahil’s New Hampshire wedding." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
 component: Page,
});
function Page() { return <main className="content-page"><TravelGuide /></main>; }
