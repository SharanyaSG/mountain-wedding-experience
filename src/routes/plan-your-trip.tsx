import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/plan-your-trip")({
  head: () => ({ meta: [
    { title: "Plan Your Trip · Gowda × Malhotra" },
    { name: "description", content: "Sharanya & Sahil’s Lincoln, New Hampshire trip recommendations — coming soon." },
    { property: "og:title", content: "Plan Your Trip · Gowda × Malhotra" },
    { property: "og:description", content: "Sharanya & Sahil’s Lincoln, New Hampshire trip recommendations — coming soon." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: PlanYourTrip,
});

function PlanYourTrip() {
  return (
    <main className="min-h-dvh bg-background px-5 pb-24 pt-40 text-center md:px-10 md:pt-52">
      <p className="eyebrow text-cinnamon">Lincoln, New Hampshire</p>
      <h1 className="display mt-8 text-4xl text-foreground md:text-6xl">Plan Your Trip</h1>
      <div className="mx-auto mt-10 h-px w-16 bg-border" />
      <p className="mt-10 font-serif text-sm italic text-muted-foreground">Coming soon</p>
    </main>
  );
}