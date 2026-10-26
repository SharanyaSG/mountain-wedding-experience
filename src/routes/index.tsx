import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import hero from "@/assets/hero-mountains.jpg";
import drive from "@/assets/explore-drive.jpg";
import outdoor from "@/assets/explore-outdoor.jpg";
import eat from "@/assets/explore-eat.jpg";
import { Reveal, PhotoPlaceholder } from "@/components/site/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gowda × Malhotra · Meet us in the mountains" },
      { name: "description", content: "Sharanya & Sahil · October 8, 2027 · Loon Mountain, New Hampshire." },
      { property: "og:title", content: "Gowda × Malhotra · Meet us in the mountains" },
      { property: "og:description", content: "Sharanya & Sahil · October 8, 2027 · Loon Mountain, New Hampshire." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const futureNav = ["Our Stories", "Gallery", "Wedding Weekend", "Travel & Stay", "FAQ"];

function Index() {
  const [notice, setNotice] = useState(false);
  return (
    <>
      <Nav onPlans={() => setNotice(true)} />
      <main>
        <Hero />
        <SaveTheDate />
        <Plans onPlans={() => setNotice(true)} />
        <Weekend />
        <Stay />
        <Stories />
        <Gallery />
        <Explore />
        <Faq />
      </main>
      <Footer />
      {notice && <Notice onClose={() => setNotice(false)} />}
    </>
  );
}

/* ---------------- NAV ---------------- */
function Nav({ onPlans }: { onPlans: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const light = !scrolled && !open;
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        light ? "text-ivory" : "border-b border-border bg-background/90 text-foreground backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-20 md:px-10">
        <a href="#top" className="font-serif text-lg tracking-[0.18em]">
          G <span className="text-gold">×</span> M
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          <a href="#top" className="eyebrow border-b border-current pb-1">Home</a>
          {futureNav.map((n) => (
            <span key={n} className="eyebrow cursor-default opacity-50" title="Coming soon" aria-disabled="true">
              {n}
            </span>
          ))}
          <button
            onClick={onPlans}
            className={`eyebrow border px-5 py-3 transition-colors ${
              light ? "border-ivory/60 hover:bg-ivory hover:text-charcoal" : "border-forest bg-forest text-ivory hover:bg-forest-deep"
            }`}
          >
            Tell Us Your Plans
          </button>
        </nav>
        <button
          className="eyebrow lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-4rem)] bg-background px-6 pb-10 pt-8 lg:hidden">
          <a href="#top" onClick={() => setOpen(false)} className="display block py-3 text-5xl">Home</a>
          {futureNav.map((n) => (
            <div key={n} className="flex items-baseline justify-between border-t border-border py-3">
              <span className="display text-3xl text-muted-foreground">{n}</span>
              <span className="eyebrow text-muted-foreground">Soon</span>
            </div>
          ))}
          <button
            onClick={() => { setOpen(false); onPlans(); }}
            className="eyebrow mt-8 w-full bg-forest py-5 text-ivory"
          >
            Tell Us Your Plans
          </button>
        </div>
      )}
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section id="top" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-forest-deep text-ivory">
      {/* Future: replace <img> with a muted, looping <video> using the same classes */}
      <img
        src={hero}
        alt="Autumn ridgelines of the White Mountains beneath drifting clouds"
        width={1920}
        height={1088}
        fetchPriority="high"
        className="hero-drift absolute inset-0 h-full w-full object-cover object-[60%_center]"
      />
      <div className="bg-hero-veil absolute inset-0" />
      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-between px-5 pb-10 pt-28 md:px-10 md:pb-14">
        <p className="eyebrow hero-rise text-ivory/85" style={{ animationDelay: "200ms" }}>
          Gowda <span className="text-gold">×</span> Malhotra
        </p>
        <div>
          <h1 className="display hero-rise max-w-5xl text-[15vw] sm:text-7xl md:text-8xl lg:text-[9.5rem]" style={{ animationDelay: "400ms" }}>
            Meet us in<br /><em className="font-light">the mountains.</em>
          </h1>
          <div className="hero-rise mt-10 grid gap-8 border-t border-ivory/30 pt-6 md:grid-cols-[1fr_auto] md:items-end" style={{ animationDelay: "800ms" }}>
            <div className="grid grid-cols-2 gap-4 sm:flex sm:gap-12">
              <p className="font-serif text-2xl italic md:text-3xl">Sharanya &amp; Sahil</p>
              <p className="eyebrow self-center text-ivory/85">October 8, 2027</p>
              <p className="eyebrow col-span-2 self-center text-ivory/85">Loon Mountain · New Hampshire</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#plans" className="eyebrow bg-ivory px-7 py-4 text-center text-charcoal transition-colors hover:bg-gold">
                Tell Us Your Plans
              </a>
              <a href="#stay" className="eyebrow border border-ivory/60 px-7 py-4 text-center transition-colors hover:bg-ivory/10">
                Plan Your Stay
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- SECTION HEAD ---------------- */
function Kicker({ n, label }: { n: string; label: string }) {
  return (
    <p className="eyebrow flex items-center gap-4 text-muted-foreground">
      <span className="text-rust">{n}</span>
      <span className="h-px w-10 bg-border" />
      {label}
    </p>
  );
}

/* ---------------- SAVE THE DATE ---------------- */
function SaveTheDate() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-40">
      <div className="grid gap-12 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-7">
          <PhotoPlaceholder
            label="Sharanya & Sahil on the overlook"
            className="aspect-[4/5] w-full md:aspect-[5/6]"
          />
        </Reveal>
        <div className="flex flex-col justify-end md:col-span-5 md:pb-10">
          <Reveal><Kicker n="01" label="Save the date" /></Reveal>
          <Reveal delay={120}>
            <blockquote className="display mt-8 text-4xl md:text-5xl lg:text-6xl">
              Somewhere between the mountains and all the adventures,{" "}
              <em className="text-forest">we found our way here.</em>
            </blockquote>
          </Reveal>
          <Reveal delay={240} className="mt-12 space-y-2 border-l border-gold pl-6">
            <p className="font-serif text-2xl italic">Sharanya &amp; Sahil</p>
            <p className="eyebrow text-muted-foreground">October 8, 2027</p>
            <p className="eyebrow text-muted-foreground">Loon Mountain, New Hampshire</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- PLANS ---------------- */
function Plans({ onPlans }: { onPlans: () => void }) {
  return (
    <section id="plans" className="scroll-mt-16 bg-forest-deep text-ivory">
      <div className="mx-auto max-w-[1100px] px-5 py-24 text-center md:py-36">
        <Reveal><p className="eyebrow text-gold">02 · Early word</p></Reveal>
        <Reveal delay={100}>
          <h2 className="display mx-auto mt-8 max-w-4xl text-5xl md:text-7xl lg:text-8xl">
            Will we see you <em>in the mountains?</em>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-ivory/75 md:text-lg">
            We're gathering an early sense of who's planning to join us. Formal invitations and final RSVP details will follow.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <button onClick={onPlans} className="eyebrow mt-12 bg-ivory px-10 py-5 text-charcoal transition-colors hover:bg-gold">
            Tell Us Your Plans
          </button>
        </Reveal>
      </div>
    </section>
  );
}

function Notice({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/60 p-4 backdrop-blur-sm animate-in fade-in sm:items-center"
      onClick={onClose}
    >
      <div className="w-full max-w-md bg-background p-8 text-center md:p-12" onClick={(e) => e.stopPropagation()}>
        <p className="eyebrow text-rust">Almost there</p>
        <h3 id="notice-title" className="display mt-4 text-4xl">Hold that thought.</h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Personalized responses will open here soon. Each invitation is personal, and we'll share a link when it's ready.
        </p>
        <button autoFocus onClick={onClose} className="eyebrow mt-8 w-full bg-forest py-4 text-ivory hover:bg-forest-deep">
          Sounds good
        </button>
      </div>
    </div>
  );
}

/* ---------------- WEEKEND ---------------- */
const days = [
  { dow: "Thursday", date: "October 7, 2027", n: "07", title: "Welcome gathering", place: "RiverWalk Resort at Loon Mountain" },
  { dow: "Friday", date: "October 8, 2027", n: "08", title: "Wedding ceremony & reception", place: "Loon Mountain, New Hampshire" },
];
function Weekend() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-40">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Reveal><Kicker n="03" label="The wedding weekend" /></Reveal>
          <Reveal delay={100}>
            <h2 className="display mt-8 text-5xl md:text-6xl">Two days, <em className="text-burgundy">one mountain.</em></h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">Times and details will be shared with your invitation.</p>
          </Reveal>
        </div>
        <ol className="md:col-span-8">
          {days.map((d, i) => (
            <Reveal as="li" key={d.n} delay={i * 150} className="group grid grid-cols-[auto_1fr] gap-6 border-t border-foreground/20 py-10 md:gap-12 md:py-14">
              <span className="display text-7xl text-gold transition-colors duration-700 group-hover:text-rust md:text-9xl">{d.n}</span>
              <div className="self-center">
                <p className="eyebrow text-muted-foreground">{d.dow} · {d.date}</p>
                <h3 className="display mt-3 text-3xl md:text-5xl">{d.title}</h3>
                <p className="mt-3 font-serif text-xl italic text-forest">{d.place}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- STAY ---------------- */
const others = [
  { n: "02", name: "Hampton Inn Lincoln White Mountains", note: "Convenient nearby alternative" },
  { n: "03", name: "Holiday Inn Express & Suites Lincoln East – White Mountains", note: "Additional accommodation option" },
];
function Stay() {
  return (
    <section id="stay" className="scroll-mt-16 bg-card">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal><Kicker n="04" label="Plan your stay" /></Reveal>
            <Reveal delay={100}>
              <h2 className="display mt-8 text-5xl md:text-7xl">Stay close. <em className="text-forest">The mountains are calling.</em></h2>
            </Reveal>
          </div>
          <Reveal delay={200} className="md:col-span-4 md:col-start-9">
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              October is peak foliage season in the White Mountains and one of the busiest times of year. We'd gently encourage arranging accommodation early.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-16 grid bg-forest text-ivory md:grid-cols-2">
          <div className="relative min-h-[280px] overflow-hidden">
            <img src={outdoor} alt="River and autumn forest near Loon Mountain" loading="lazy" width={896} height={1152} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] hover:scale-105" />
          </div>
          <div className="flex flex-col justify-between gap-10 p-8 md:p-14">
            <div>
              <p className="eyebrow text-gold">01 · Preferred wedding-weekend hotel</p>
              <h3 className="display mt-6 text-4xl md:text-6xl">RiverWalk Resort <em>at Loon Mountain</em></h3>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/75">Home to our welcome gathering. Booking details will be shared here once confirmed.</p>
            </div>
            <span className="eyebrow inline-block w-fit border border-ivory/40 px-6 py-4 text-ivory/70" aria-disabled="true">
              Booking details coming soon
            </span>
          </div>
        </Reveal>

        <div className="mt-px grid md:grid-cols-2">
          {others.map((h, i) => (
            <Reveal key={h.n} delay={i * 120} className="flex flex-col justify-between gap-8 border-b border-border p-8 md:border-r md:p-12 md:last:border-r-0">
              <div>
                <p className="eyebrow text-muted-foreground">{h.n} · {h.note}</p>
                <h3 className="display mt-4 text-3xl md:text-4xl">{h.name}</h3>
              </div>
              <span className="eyebrow text-muted-foreground">Details to follow</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- STORIES ---------------- */
const stories = [
  { k: "Halloween 2023", t: "The First Time We Met", ex: "It started, as these things do, in costume.", tone: "bg-burgundy text-ivory", h: "md:mt-0" },
  { k: "The Bow", t: "Sharanya's Favorite Sahil Story", ex: "She'll tell this one better than we can write it.", tone: "bg-stone text-charcoal", h: "md:mt-24" },
  { k: "Shravya", t: "Sahil's Favorite Sharanya Story", ex: "He insists this is the definitive one.", tone: "bg-forest text-ivory", h: "md:mt-12" },
];
function Stories() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-40">
      <Reveal><Kicker n="05" label="Our stories" /></Reveal>
      <Reveal delay={100}>
        <h2 className="display mt-8 max-w-3xl text-5xl md:text-7xl">The stories that <em className="text-rust">got us here</em></h2>
      </Reveal>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {stories.map((s, i) => (
          <Reveal key={s.k} delay={i * 140} className={s.h}>
            <article className={`group flex aspect-[3/4] flex-col justify-between p-8 transition-transform duration-700 hover:-translate-y-2 ${s.tone}`}>
              <div className="flex justify-between">
                <span className="eyebrow opacity-70">Chapter {i + 1}</span>
                <span className="eyebrow opacity-70">Full story soon</span>
              </div>
              <div>
                <p className="display text-5xl md:text-6xl">{s.k}</p>
                <h3 className="eyebrow mt-6 opacity-80">{s.t}</h3>
                <p className="mt-4 font-serif text-xl italic opacity-90">"{s.ex}"</p>
              </div>
            </article>
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
    <section className="bg-card">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <Reveal><Kicker n="06" label="Gallery" /></Reveal>
            <Reveal delay={100}><h2 className="display mt-8 text-5xl md:text-7xl">Us, through <em>the years</em></h2></Reveal>
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

/* ---------------- EXPLORE ---------------- */
const explore = [
  { t: "Scenic Drives", img: drive, alt: "A winding road through autumn foliage" },
  { t: "Outdoor Adventures", img: outdoor, alt: "A rocky trail beside a mountain river" },
  { t: "Eat & Explore", img: eat, alt: "A New England main street at dusk" },
];
function Explore() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-40">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Reveal><Kicker n="07" label="Explore" /></Reveal>
          <Reveal delay={100}><h2 className="display mt-8 text-5xl md:text-7xl">The White Mountains</h2></Reveal>
        </div>
        <Reveal delay={200}><p className="eyebrow text-muted-foreground">Our recommendations, coming soon</p></Reveal>
      </div>
      <div className="-mx-5 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
        {explore.map((e, i) => (
          <Reveal key={e.t} delay={i * 140} className="w-[78%] shrink-0 snap-start md:w-auto">
            <figure className="group relative aspect-[3/4] overflow-hidden">
              <img src={e.img} alt={e.alt} loading="lazy" width={896} height={1152} className="h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105" />
              <div className="bg-image-veil absolute inset-0" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-ivory">
                <span className="eyebrow opacity-70">0{i + 1}</span>
                <p className="display mt-2 text-4xl">{e.t}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
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
    <section className="border-t border-border">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-24 md:grid-cols-12 md:px-10 md:py-36">
        <div className="md:col-span-4">
          <Reveal><Kicker n="08" label="FAQ" /></Reveal>
          <Reveal delay={100}><h2 className="display mt-8 text-5xl md:text-6xl">A few <em className="text-forest">early answers</em></h2></Reveal>
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
    <footer className="bg-charcoal text-ivory">
      <div className="mx-auto max-w-[1400px] px-5 pb-10 pt-24 md:px-10">
        <p className="display text-[14vw] leading-none md:text-[9rem]">
          Gowda <span className="text-gold">×</span> Malhotra
        </p>
        <div className="mt-16 grid gap-10 border-t border-ivory/20 pt-10 md:grid-cols-3">
          <div className="space-y-2">
            <p className="eyebrow text-ivory/60">October 8, 2027</p>
            <p className="eyebrow text-ivory/60">Loon Mountain, New Hampshire</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
            <a href="#top" className="eyebrow hover:text-gold">Home</a>
            <a href="#plans" className="eyebrow hover:text-gold">Tell Us Your Plans</a>
            <a href="#stay" className="eyebrow hover:text-gold">Plan Your Stay</a>
            {futureNav.map((n) => <span key={n} className="eyebrow text-ivory/35">{n}</span>)}
          </nav>
          <p className="eyebrow text-ivory/60 md:text-right">Contact details · coming soon</p>
        </div>
        <p className="mt-16 font-serif text-lg italic text-ivory/40">See you at the top.</p>
      </div>
    </footer>
  );
}
