import { createFileRoute, Link } from "@tanstack/react-router";
import overlook from "@/assets/sharanya-sahil-mountain-portrait.jpg.asset.json";
import { Reveal } from "@/components/site/Reveal";
import { HeroIllustration } from "@/components/site/HeroIllustration";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gowda × Malhotra · Meet us in the mountains" },
      { name: "description", content: "Sharanya & Sahil · October 7–9, 2027 · Loon Mountain, New Hampshire." },
      { property: "og:title", content: "Gowda × Malhotra · Meet us in the mountains" },
      { property: "og:description", content: "Sharanya & Sahil · October 7–9, 2027 · Loon Mountain, New Hampshire." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});


function Index() {
  return (
    <>
      <main>
        <Hero />
        <SaveTheDate />
      </main>
    </>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-card pt-24 md:pt-28">
      <span id="top" aria-hidden="true" className="absolute inset-x-0 top-0" />
      <div className="relative z-10 mx-auto max-w-[1100px] px-3 text-center md:px-10">
        <h1 className="hero-rise font-script text-[17vw] leading-[1.05] text-foreground sm:text-8xl md:text-[8.5rem]" style={{ animationDelay: "300ms" }}>
          Sharanya &amp; Sahil
        </h1>
        <div className="hero-details hero-rise mt-[26px] font-display uppercase tracking-[0.22em] md:mt-9" style={{ animationDelay: "500ms" }}>
          <p className="hero-date text-lg/[26px] font-medium text-foreground md:text-[22px]/[28px]">October 7 – 9, 2027</p>
          <p className="hero-location mt-[2px] text-sm/[18px] text-muted-foreground md:mt-[3px] md:text-base/[20px]">
            Loon Mountain,<br className="hidden max-[380px]:inline" /> New Hampshire
          </p>
        </div>
        <p className="hero-tagline hero-rise relative z-10 mt-[16px] font-hand text-[3.125rem]/[50px] text-[#922F3C] md:mt-6 md:text-[4rem]/[64px]" style={{ animationDelay: "700ms" }}>
          Meet us in the mountains.
        </p>
      </div>
      <div className="hero-rise relative z-0 mx-auto -mt-6 max-w-[1700px] md:-mt-[8vw]" style={{ animationDelay: "900ms" }}>
        <HeroIllustration />
      </div>
      <div className="hero-rise flex flex-col items-center justify-center gap-3 px-5 pb-16 sm:flex-row md:pb-20" style={{ animationDelay: "1100ms" }}>
        <Link to="/tell-us-your-plans" className="btn-label bg-forest px-7 py-4 text-center text-ivory transition-colors hover:bg-rust">Tell Us Your Plans</Link>
        <Link to="/plan-your-trip" className="btn-label border border-cinnamon bg-card px-7 py-4 text-center text-foreground transition-colors hover:border-rust hover:bg-rust hover:text-card">Plan Your Trip</Link>
      </div>
    </section>
  );
}

/* ---------------- SAVE THE DATE ---------------- */
function SaveTheDate() {
  return (
    <section className="section-shell section-divider">
      <div className="announcement-layout grid gap-8 min-[1200px]:grid-cols-2 min-[1200px]:gap-10">
        <Reveal className="announcement-photo min-w-0 overflow-hidden">
          <img
            src={overlook.url}
            alt="Sharanya and Sahil seated together on a rocky mountain overlook, seen from behind, looking out across a forested valley"
            width={1028}
            height={1413}
            loading="lazy"
            className="block h-full w-full object-cover object-bottom"
          />
        </Reveal>
        <div className="announcement-copy flex min-w-0 flex-col">

          <Reveal delay={120}>
            <blockquote className="display text-4xl md:text-5xl lg:text-6xl">
              Between winding trails and snowy slopes,
              <br />
              <em className="text-crimson">we took the scenic route to forever.</em>
            </blockquote>
          </Reveal>
          <Reveal delay={240} className="mt-12 space-y-2 border-l border-gold pl-6">
            <p className="font-script text-4xl">Sharanya &amp; Sahil</p>
            <p className="eyebrow text-muted-foreground">October 8, 2027</p>
            <p className="eyebrow text-muted-foreground">Loon Mountain, New Hampshire</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

