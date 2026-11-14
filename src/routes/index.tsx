import { createFileRoute, Link } from "@tanstack/react-router";
import overlook from "@/assets/sharanya-sahil-overlook.jpg.asset.json";
import { Reveal, PhotoPlaceholder } from "@/components/site/Reveal";
import { HeroIllustration } from "@/components/site/HeroIllustration";
import { StoryCard } from "@/components/site/StoryCard";
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
        <Stories />
        <Gallery />
        <Faq />
      </main>
      <Footer />
    </>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-card pt-24 md:pt-28">
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
        <a href="#plans" className="btn-label bg-forest px-7 py-4 text-center text-ivory transition-colors hover:bg-rust">Tell Us Your Plans</a>
        <Link to="/plan-your-trip" className="btn-label border border-cinnamon bg-card px-7 py-4 text-center text-foreground transition-colors hover:border-rust hover:bg-rust hover:text-card">Plan Your Trip</Link>
      </div>
    </section>
  );
}

/* ---------------- SAVE THE DATE ---------------- */
function SaveTheDate() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-40">
      <div className="grid gap-12 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-7">
          <img
            src={overlook.url}
            alt="Sharanya and Sahil seated together on a rocky mountain overlook, seen from behind, looking out across a forested valley"
            width={1080}
            height={1920}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover object-bottom md:aspect-[5/6]"
          />
        </Reveal>
        <div className="flex flex-col justify-end md:col-span-5 md:pb-10">

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
    <section id="itinerary" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-40">
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
    <section id="stories" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-40">

      <Reveal delay={100}>
        <h2 className="display max-w-3xl text-5xl md:text-7xl">The stories that <em className="text-crimson">got us here</em></h2>
      </Reveal>
      <Reveal delay={200}>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Hover over a card to read the story behind it. On a phone, tap the card to turn it over.
        </p>
      </Reveal>
      <div className="mt-16 grid gap-6 md:grid-cols-2 md:gap-8">
        {stories.map((s, i) => (
          <Reveal key={s.id} delay={(i % 2) * 120}>
            <StoryCard story={s} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- GALLERY ---------------- */
const tiles = [
  "md:col-span-5 md:row-span-2 aspect-[4/5] md:aspect-auto",
  "md:col-span-4 aspect-[4/3] md:aspect-auto",
  "md:col-span-3 aspect-square md:aspect-auto",
  "md:col-span-3 aspect-[3/4] md:aspect-auto",
  "md:col-span-4 aspect-[4/3] md:aspect-auto",
  "md:col-span-7 aspect-[16/9] md:aspect-auto",
  "md:col-span-5 aspect-[4/3] md:aspect-auto",
];
function Gallery() {
  return (
    <section id="gallery" className="bg-card">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <div>

            <Reveal delay={100}><h2 className="display text-5xl md:text-7xl">Us, through <em>the years</em></h2></Reveal>
          </div>
          <Reveal delay={200}>
            <p className="font-serif text-2xl italic text-muted-foreground md:text-right">
              From friends to forever. With a few questionable decisions along the way.
            </p>
          </Reveal>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-12 md:gap-4">
          {tiles.map((c, i) => (
            <Reveal key={i} delay={(i % 4) * 90} className={`${c} ${i === 0 || i === 5 ? "col-span-2" : ""}`}>
              <PhotoPlaceholder label={`No. ${String(i + 1).padStart(2, "0")}`} className="h-full w-full transition-opacity duration-500 hover:opacity-80" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
const faqs = [
  { q: "When should we book accommodation?", a: "As early as you comfortably can. October is peak foliage season in the White Mountains, and rooms in the area fill quickly. Hotel details will be shared here as they're confirmed." },
  { q: "Will we need warm clothing?", a: "We'd recommend it. Mountain weather in October can change quickly, and it's often cooler at elevation. We'll share more guidance closer to the date." },
  { q: "Is this our final RSVP?", a: "No. We're simply gathering an early sense of plans. Invitations are personalized, and formal RSVP details will follow with yours." },
  { q: "Can we bring additional guests?", a: "Invitations are personal and will specify who is invited. If you have questions, please reach out to us directly once your invitation arrives." },
];
function Faq() {
  return (
    <section id="faqs" className="border-t border-border">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-24 md:grid-cols-12 md:px-10 md:py-36">
        <div className="md:col-span-4">

          <Reveal delay={100}><h2 className="display text-5xl md:text-6xl">A few <em className="text-forest">early answers</em></h2></Reveal>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 80}>
              <details className="group border-t border-foreground/20 last:border-b">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 [&::-webkit-details-marker]:hidden">
                  <span className="font-serif text-2xl md:text-3xl">{f.q}</span>
                  <span aria-hidden className="text-2xl text-rust transition-transform duration-500 group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-xl pb-8 text-sm leading-relaxed text-muted-foreground md:text-base">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-[1400px] px-5 pb-10 pt-24 md:px-10">
        <p className="display text-[11vw] leading-none md:text-[6.5rem]">
          Gowda <span className="text-gold">×</span> Malhotra
        </p>
        <div className="mt-16 grid gap-10 border-t border-border pt-10 md:grid-cols-3">
          <div className="space-y-2">
            <p className="eyebrow text-muted-foreground">October 8, 2027</p>
            <p className="eyebrow text-muted-foreground">Loon Mountain, New Hampshire</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
            <a href="#top" className="eyebrow hover:text-gold">Home</a>
            <a href="#plans" className="eyebrow hover:text-gold">Tell Us Your Plans</a>
            <Link to="/plan-your-trip" className="eyebrow hover:text-gold">Plan Your Trip</Link>
            {futureNav.map((n) => <span key={n} className="eyebrow text-muted-foreground/60">{n}</span>)}
          </nav>
          <p className="eyebrow text-muted-foreground md:text-right">Contact details · coming soon</p>
        </div>
        <p className="mt-16 font-hand text-4xl text-cinnamon">See you at the top.</p>
      </div>
    </footer>
  );
}
