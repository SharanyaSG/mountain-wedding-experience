import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { agenda } from "./wedding-content";

export function WeddingItinerary() {
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
              <Link to="/faqs" className="text-romantic-crimson underline-offset-4 hover:underline focus-visible:underline">Visit our FAQs</Link>{" "}
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

