import { createFileRoute } from "@tanstack/react-router";
import { WeddingItinerary } from "@/components/site/WeddingItinerary";
export const Route = createFileRoute("/wedding-itinerary")({
 head: () => ({ meta: [{ title: "Wedding Itinerary · Gowda × Malhotra" }, { name: "description", content: "Three days of celebrations for Sharanya and Sahil, October 7–9, 2027." }, { property: "og:title", content: "Wedding Itinerary · Gowda × Malhotra" }, { property: "og:description", content: "Three days of celebrations for Sharanya and Sahil, October 7–9, 2027." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
 component: Page,
});
function Page() { return <main className="content-page"><WeddingItinerary /></main>; }
