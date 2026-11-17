import { createFileRoute } from "@tanstack/react-router";
import { ThingsToDo } from "@/components/site/ThingsToDo";
export const Route = createFileRoute("/things-to-do")({
 head: () => ({ meta: [{ title: "Things To Do · Gowda × Malhotra" }, { name: "description", content: "Exploring Lincoln and the White Mountains, and the gondola rides that are on Sharanya and Sahil." }, { property: "og:title", content: "Things To Do · Gowda × Malhotra" }, { property: "og:description", content: "Exploring Lincoln and the White Mountains, and the gondola rides that are on Sharanya and Sahil." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
 component: Page,
});
function Page() { return <main className="content-page"><ThingsToDo /></main>; }
