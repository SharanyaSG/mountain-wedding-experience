import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/a-message-from-us")({
  head: () => ({ meta: [
    { title: "A Message From Us · Gowda × Malhotra" },
    { name: "description", content: "A personal message from Sharanya & Sahil to their wedding guests — coming soon." },
    { property: "og:title", content: "A Message From Us · Gowda × Malhotra" },
    { property: "og:description", content: "A personal message from Sharanya & Sahil to their wedding guests — coming soon." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MessageFromUs,
});

function MessageFromUs() {
  return (
    <main className="min-h-dvh bg-background px-5 pb-24 pt-40 text-center md:px-10 md:pt-52">
      <p className="font-script text-4xl text-foreground">Sharanya &amp; Sahil</p>
      <h1 className="display mx-auto mt-8 max-w-4xl text-4xl text-foreground md:text-6xl">A Message From Us</h1>
      <div className="mx-auto mt-10 h-px w-16 bg-border" />
      <p className="mt-10 font-serif text-sm italic text-muted-foreground">Coming soon</p>
    </main>
  );
}