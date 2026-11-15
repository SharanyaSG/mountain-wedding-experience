import { createFileRoute } from "@tanstack/react-router";
import { Stories } from "@/components/site/Stories";
import { PicturesOfUs } from "@/components/site/PicturesOfUs";
export const Route = createFileRoute("/our-journey")({
 head: () => ({ meta: [{ title: "Our Journey · Gowda × Malhotra" }, { name: "description", content: "Sharanya and Sahil’s stories and personal photograph collections." }, { property: "og:title", content: "Our Journey · Gowda × Malhotra" }, { property: "og:description", content: "Sharanya and Sahil’s stories and personal photograph collections." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
 component: Page,
});
function Page() { return <main className="content-page"><PicturesOfUs /><Stories /></main>; }
