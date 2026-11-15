import { createFileRoute } from "@tanstack/react-router";
import { MessageFromUs } from "@/components/site/MessageFromUs";
export const Route = createFileRoute("/a-message-from-us")({
 head: () => ({ meta: [{ title: "A Message From Us · Gowda × Malhotra" }, { name: "description", content: "A personal video message from Sharanya and Sahil." }, { property: "og:title", content: "A Message From Us · Gowda × Malhotra" }, { property: "og:description", content: "A personal video message from Sharanya and Sahil." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
 component: Page,
});
function Page() { return <main className="content-page"><MessageFromUs /></main>; }
