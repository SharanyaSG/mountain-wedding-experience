import { createFileRoute, Link } from "@tanstack/react-router";
import overlook from "@/assets/sharanya-sahil-mountain-portrait.jpg.asset.json";
import { Reveal } from "@/components/site/Reveal";
import { HeroIllustration } from "@/components/site/HeroIllustration";
import { StoryCard } from "@/components/site/StoryCard";
import { PicturesOfUs } from "@/components/site/PicturesOfUs";
import { TravelGuide } from "@/components/site/TravelGuide";
import { FaqSection } from "@/components/site/FaqSection";
import { MessageFromUs } from "@/components/site/MessageFromUs";
import { agenda, stories } from "@/components/site/wedding-content";

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

const futureNav = ["Our Stories", "Gallery", "Wedding Weekend", "FAQ"];

function Index() {
  return (
    <>
      <main>
        <Hero />
        <SaveTheDate />
        <Weekend />
        <TravelGuide />
        <Stories />
        <Gallery />
        <FaqSection />
        <MessageFromUs />
      </main>
      <Footer />
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
        <Link to="/" hash="tell-us-your-plans" className="btn-label bg-forest px-7 py-4 text-center text-ivory transition-colors hover:bg-rust">Tell Us Your Plans</Link>
        <Link to="/" hash="plan-your-trip" className="btn-label border border-cinnamon bg-card px-7 py-4 text-center text-foreground transition-colors hover:border-rust hover:bg-rust hover:text-card">Plan Your Trip</Link>
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

/* ---------------- WEEKEND ---------------- */
function Weekend() {
  return (
    <section id="wedding-itinerary" className="section-shell section-divider scroll-mt-24 md:scroll-mt-28">
      <span id="itinerary" aria-hidden="true" />
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">

          <Reveal delay={100}>
            <h2 className="display text-5xl md:text-6xl">The Festivities</h2>
            <p className="display text-3xl text-itinerary-forest md:text-4xl">Three days, <em className="text-romantic-crimson">one mountain.</em></p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-xs text-sm font-bold leading-relaxed text-muted-foreground">Times and details will be shared with your invitation.</p>
            <p className="mt-[18px] max-w-xs font-serif text-sm font-normal leading-relaxed text-foreground">
              Have any additional questions? {" "}
              <a href="#faqs" className="text-romantic-crimson underline-offset-4 hover:underline focus-visible:underline">Visit our FAQs</a>{" "}
              for more information.
            </p>
          </Reveal>
        </div>
        <ol className="md:col-span-8">
          {agenda.map((d, i) => (
            <Reveal as="li" key={d.n} delay={i * 150} className="group grid grid-cols-[auto_1fr] gap-6 border-t border-foreground/20 py-10 md:gap-12 md:py-14">
              <span className="display text-7xl text-gold transition-colors duration-700 group-hover:text-rust md:text-9xl">{d.n}</span>
              <div>
                <p className="eyebrow text-muted-foreground">{d.dow} · {d.date}</p>
                <ul className="mt-7">
                  {d.events.map((e, j) => (
                    <li key={e.title} className={j > 0 ? "mt-7 border-t border-border pt-7" : ""}>
                      <h3 className="display text-3xl md:text-4xl">{e.title}</h3>
                      <p className="mt-2 font-serif text-xl italic text-forest">{e.place}</p>
                      {e.note && <p className="mt-2 font-serif text-sm font-bold italic text-romantic-crimson">{e.note}</p>}
                      {e.detail && <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{e.detail}</p>}
                      {e.open && <p className="mt-2 font-serif text-sm italic text-rust">{e.open}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- STORIES ---------------- */
function Stories() {
  return (
    <section id="our-stories" className="section-shell section-divider scroll-mt-24 md:scroll-mt-28">
      <span id="stories" aria-hidden="true" />

      <Reveal delay={100}>
        <h2 className="display max-w-3xl text-5xl md:text-7xl">The stories that <em className="text-crimson">got us here</em></h2>
      </Reveal>
      <Reveal delay={200}>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base min-[1200px]:max-w-none min-[1200px]:whitespace-nowrap">
          Hover over a card to read the story behind it. On a phone, tap the card to turn it over.
        </p>
      </Reveal>
      <div className="section-content grid gap-6 min-[540px]:max-[767px]:grid-cols-2 min-[540px]:max-[767px]:gap-4 min-[768px]:max-[1200px]:grid-cols-2 min-[768px]:max-[1200px]:gap-8 min-[1200px]:grid-cols-4 min-[1200px]:gap-5">
        {stories.map((s, i) => (
          <Reveal key={s.id} delay={(i % 4) * 120}>
            <StoryCard story={s} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- GALLERY ---------------- */
function Gallery() {
  return <PicturesOfUs />;
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer id="tell-us-your-plans" className="section-divider bg-background text-foreground">
      <div className="section-shell">
        <p className="display text-[11vw] leading-none md:text-[6.5rem]">
          Gowda <span className="text-gold">×</span> Malhotra
        </p>
        <div className="mt-16 grid gap-10 border-t border-border pt-10 md:grid-cols-3">
          <div className="space-y-2">
            <p className="eyebrow text-muted-foreground">October 8, 2027</p>
            <p className="eyebrow text-muted-foreground">Loon Mountain, New Hampshire</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
            <Link to="/" hash="home" className="eyebrow hover:text-gold">Home</Link>
            <Link to="/" hash="tell-us-your-plans" className="eyebrow hover:text-gold">Tell Us Your Plans</Link>
            <Link to="/" hash="plan-your-trip" className="eyebrow hover:text-gold">Plan Your Trip</Link>
            {futureNav.map((n) => <span key={n} className="eyebrow text-muted-foreground/60">{n}</span>)}
          </nav>
          <p className="eyebrow text-muted-foreground md:text-right">Contact details · coming soon</p>
        </div>
        <p className="mt-16 font-hand text-4xl text-cinnamon">See you at the top.</p>
      </div>
    </footer>
  );
}
