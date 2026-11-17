import { createFileRoute } from "@tanstack/react-router";
import { TellUsYourPlans } from "@/components/site/TellUsYourPlans";

export const Route = createFileRoute("/tell-us-your-plans")({
 head: () => ({ meta: [{ title: "Tell Us Your Plans · Gowda × Malhotra" }, { name: "description", content: "Let Sharanya and Sahil know whether you can join them in the mountains." }, { property: "og:title", content: "Tell Us Your Plans · Gowda × Malhotra" }, { property: "og:description", content: "Let Sharanya and Sahil know whether you can join them in the mountains." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
 component: Page,
});
function Page() { return <main className="content-page"><TellUsYourPlans /></main>; }
