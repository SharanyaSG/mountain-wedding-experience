import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tell-us-your-plans")({
 head: () => ({ meta: [{ title: "Tell Us Your Plans · Gowda × Malhotra" }, { name: "description", content: "Sharanya and Sahil’s wedding plans destination." }, { property: "og:title", content: "Tell Us Your Plans · Gowda × Malhotra" }, { property: "og:description", content: "Sharanya and Sahil’s wedding plans destination." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
 component: Page,
});
function Page() { return <main className="content-page"></main>; }
