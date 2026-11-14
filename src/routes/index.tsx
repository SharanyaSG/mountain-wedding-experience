import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import drive from "@/assets/explore-drive.jpg";
import outdoor from "@/assets/explore-outdoor.jpg";
import eat from "@/assets/explore-eat.jpg";
import riverwalkPhoto from "@/assets/hotel-riverwalk.jpg.asset.json";
import hamptonPhoto from "@/assets/hotel-hampton-inn.jpg.asset.json";
import overlook from "@/assets/sharanya-sahil-overlook.jpg.asset.json";
import { Reveal, PhotoPlaceholder } from "@/components/site/Reveal";
import { HeroIllustration } from "@/components/site/HeroIllustration";
import { StoryCard } from "@/components/site/StoryCard";
import { agenda, hotels, stories } from "@/components/site/wedding-content";

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
        light ? "text-foreground" : "border-b border-border bg-background/90 text-foreground backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-20 md:px-10">
        <a href="#top" className="font-serif text-lg tracking-[0.18em]">
          G <span className="text-gold">×</span> M
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex xl:gap-8">
          <a href="#top" className="font-display text-[13px] font-medium uppercase tracking-[0.14em] xl:text-[14px] xl:tracking-[0.18em] border-b-2 border-rust pb-1 text-foreground">Home</a>
          {futureNav.map((n) => (
            <span key={n} className="font-display text-[13px] font-medium uppercase tracking-[0.14em] xl:text-[14px] xl:tracking-[0.18em] cursor-default border-b-2 border-transparent pb-1 text-foreground transition-colors hover:text-rust" title="Coming soon" aria-disabled="true">
              {n}
            </span>
          ))}
          <button
            onClick={onPlans}
            className={`btn-label ml-1 border px-4 py-2.5 !text-[15px] xl:ml-2 xl:px-5 xl:!text-[16px] transition-colors ${
              light ? "border-cinnamon bg-card text-foreground hover:border-rust hover:bg-rust hover:text-card" : "border-forest bg-forest text-ivory hover:border-rust hover:bg-rust"
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
            className="btn-label mt-8 w-full bg-forest py-5 text-ivory"
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
    <section id="top" className="relative overflow-hidden bg-card pt-24 md:pt-28">
      <div className="relative z-10 mx-auto max-w-[1100px] px-4 text-center md:px-10">
        <h1 className="hero-rise font-script text-[17vw] leading-[1.05] text-foreground sm:text-8xl md:text-[8.5rem]" style={{ animationDelay: "300ms" }}>
          Sharanya &amp; Sahil
        </h1>
        <div className="hero-rise mt-[26px] font-display uppercase tracking-[0.22em] md:mt-9" style={{ animationDelay: "500ms" }}>
          <p className="text-lg/[26px] font-medium text-foreground md:text-[22px]/[28px]">October 7 – 9, 2027</p>
          <p className="mt-[2px] text-sm/[18px] text-muted-foreground md:mt-[3px] md:text-base/[20px]">
            Loon Mountain,<br className="hidden max-[380px]:inline" /> New Hampshire
          </p>
        </div>
        <p className="hero-rise relative z-10 mt-[18px] font-hand text-[3.25rem] text-[#922F3C] md:mt-6 md:text-[4rem]" style={{ animationDelay: "700ms" }}>
          Meet us in the mountains.
        </p>
      </div>
      <div className="hero-rise relative z-0 mx-auto -mt-6 max-w-[1700px] md:-mt-[8vw]" style={{ animationDelay: "900ms" }}>
        <HeroIllustration />
      </div>
      <div className="hero-rise flex flex-col items-center justify-center gap-3 px-5 pb-16 sm:flex-row md:pb-20" style={{ animationDelay: "1100ms" }}>
        <a href="#plans" className="btn-label bg-forest px-7 py-4 text-center text-ivory transition-colors hover:bg-rust">Tell Us Your Plans</a>
        <a href="#stay" className="btn-label border border-cinnamon bg-card px-7 py-4 text-center text-foreground transition-colors hover:border-rust hover:bg-rust hover:text-card">Plan Your Stay</a>
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
          <Reveal><Kicker n="01" label="Save the date" /></Reveal>
          <Reveal delay={120}>
            <blockquote className="display mt-8 text-4xl md:text-5xl lg:text-6xl">
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

/* ---------------- PLANS ---------------- */
function Plans({ onPlans }: { onPlans: () => void }) {
  return (
    <section id="plans" className="scroll-mt-16 border-y border-border bg-muted text-foreground">
      <div className="mx-auto max-w-[1100px] px-5 py-24 text-center md:py-36">
        <Reveal><p className="eyebrow text-cinnamon">02 · Early word</p></Reveal>
        <Reveal delay={100}>
          <h2 className="display mx-auto mt-8 max-w-4xl text-5xl md:text-7xl lg:text-8xl">
            Will we see you <em>in the mountains?</em>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            We're gathering an early sense of who's planning to join us. Formal invitations and final RSVP details will follow.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <button onClick={onPlans} className="btn-label mt-12 bg-forest px-10 py-5 text-ivory transition-colors hover:bg-rust">
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
        <button autoFocus onClick={onClose} className="btn-label mt-8 w-full bg-forest py-4 text-ivory hover:bg-rust">
          Sounds good
        </button>
      </div>
    </div>
  );
}

/* ---------------- WEEKEND ---------------- */
function Weekend() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-40">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Reveal><Kicker n="03" label="At a glance" /></Reveal>
          <Reveal delay={100}>
            <h2 className="display mt-8 text-5xl md:text-6xl">The Festivities</h2>
            <p className="display mt-4 text-3xl md:text-4xl">Three days, <em className="text-forest">one mountain.</em></p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">Times and details will be shared with your invitation.</p>
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
                      {e.note && <p className="mt-2 font-serif text-sm italic text-muted-foreground">{e.note}</p>}
                      {e.detail && <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{e.detail}</p>}
                      {e.open && <p className="mt-2 font-serif text-sm italic text-sage">{e.open}</p>}
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

/* ---------------- STAY ---------------- */
const preferred = hotels[0];
const alternative = hotels[1];

// Authentic guest-supplied photographs, one per hotel. Never AI-generated.
type HotelId = (typeof hotels)[number]["id"];
type HotelPhoto = { url: string; alt: string; width: number; height: number };
const hotelPhotos: { [K in HotelId]: HotelPhoto } = {
  riverwalk: {
    url: riverwalkPhoto.url,
    alt: "RiverWalk Resort at Loon Mountain, a multi-wing resort with red roofs set beneath a forested mountain",
    width: 1000,
    height: 720,
  },
  hampton: {
    url: hamptonPhoto.url,
    alt: "Hampton Inn Lincoln White Mountains exterior with its entrance canopy and monument sign",
    width: 575,
    height: 375,
  },
};

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

        <Reveal className="mt-16 grid border border-border bg-card text-foreground md:grid-cols-2">
          <img
            src={hotelPhotos[preferred.id].url}
            alt={hotelPhotos[preferred.id].alt}
            width={hotelPhotos[preferred.id].width}
            height={hotelPhotos[preferred.id].height}
            loading="lazy"
            className="min-h-[320px] h-full w-full object-cover"
          />
          <div className="flex flex-col justify-between gap-10 p-8 md:p-14">
            <div>
              <p className="eyebrow text-gold">{preferred.n} · {preferred.label}</p>
              <h3 className="display mt-6 text-4xl md:text-6xl">RiverWalk Resort <em>at Loon Mountain</em></h3>
              <p className="mt-4 font-serif text-2xl italic">{preferred.tagline}</p>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">{preferred.introduction}</p>
              <p className="mt-7 max-w-md border-l border-gold/60 pl-5 text-sm leading-relaxed text-foreground">{preferred.urgency}</p>
            </div>
            <div>
              <p className="eyebrow text-forest">Why Stay Here</p>
              <ul className="mt-4 grid gap-2 text-sm leading-relaxed sm:grid-cols-2">
                {preferred.reasons.map((x) => <li key={x}>— {x}</li>)}
              </ul>
            </div>
            <div className="border border-border bg-muted p-6 md:p-8">
              <p className="eyebrow text-gold">{preferred.bookingHeading}</p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">{preferred.bookingNote}</p>
              <span className="btn-label mt-6 inline-block w-fit border border-forest/40 px-6 py-4 text-forest" aria-disabled="true">
                Booking link &amp; discount code to follow
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-8">
          <article className="grid gap-8 border border-border p-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:gap-12 md:p-12">
            <img
              src={hotelPhotos[alternative.id].url}
              alt={hotelPhotos[alternative.id].alt}
              width={hotelPhotos[alternative.id].width}
              height={hotelPhotos[alternative.id].height}
              loading="lazy"
              className="aspect-[16/9] w-full object-cover"
            />
            <div>
              <p className="eyebrow text-muted-foreground">{alternative.n} · {alternative.label}</p>
              <h3 className="display mt-4 text-3xl md:text-4xl">{alternative.name}</h3>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">{alternative.introduction}</p>
              <p className="eyebrow mt-6 text-muted-foreground">{alternative.bookingNote}</p>
            </div>
          </article>
        </Reveal>

        <Reveal className="mt-14">
          <p className="eyebrow text-muted-foreground">At a glance</p>
          <div className="mt-5 grid gap-px bg-border md:grid-cols-2">
            {hotels.map((h) => (
              <dl key={h.id} className="bg-card p-6 text-sm">
                <dt className="font-serif text-xl">{h.n} · {h.name.split(" at ")[0]?.split(" Lincoln")[0]}</dt>
                <dd className="mt-4 grid grid-cols-[7rem_1fr] gap-2"><span className="text-muted-foreground">Thursday</span>{h.thursday}</dd>
                <dd className="mt-2 grid grid-cols-[7rem_1fr] gap-2"><span className="text-muted-foreground">Breakfast</span>{h.breakfastIncluded ? "Included" : "Not included"}</dd>
                <dd className="mt-2 grid grid-cols-[7rem_1fr] gap-2"><span className="text-muted-foreground">Room block</span>{h.roomBlock === "reserved" ? "Reserved for our wedding" : "No wedding room block"}</dd>
              </dl>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- STORIES ---------------- */
function Stories() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-40">
      <Reveal><Kicker n="05" label="Our stories" /></Reveal>
      <Reveal delay={100}>
        <h2 className="display mt-8 max-w-3xl text-5xl md:text-7xl">The stories that <em className="text-crimson">got us here</em></h2>
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
            <a href="#stay" className="eyebrow hover:text-gold">Plan Your Stay</a>
            {futureNav.map((n) => <span key={n} className="eyebrow text-muted-foreground/60">{n}</span>)}
          </nav>
          <p className="eyebrow text-muted-foreground md:text-right">Contact details · coming soon</p>
        </div>
        <p className="mt-16 font-hand text-4xl text-cinnamon">See you at the top.</p>
      </div>
    </footer>
  );
}
