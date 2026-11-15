import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { agenda } from "./wedding-content";

export function WeddingItinerary() {
  return (
    <section id="wedding-itinerary" className="section-shell section-divider scroll-mt-24 md:scroll-mt-28">
      <span id="itinerary" aria-hidden="true" />
      <div>
        <div className="mx-auto text-center">

          <Reveal delay={100}>
            <h2 className="itinerary-heading display text-5xl md:text-6xl">The Festivities</h2>
            <p className="itinerary-subtitle display text-3xl text-itinerary-forest md:text-4xl">Three days, <em className="text-romantic-crimson">one mountain.</em></p>
          </Reveal>
        </div>
        <ol className="section-content grid grid-cols-1 items-start gap-y-10 md:grid-cols-2 min-[1200px]:grid-cols-3">
          {agenda.map((d, i) => (
            <Reveal as="li" key={d.n} delay={i * 150} className={`group min-w-0 border-t border-foreground/20 pt-8 md:border-t-0 md:px-6 md:pt-0 min-[1200px]:px-8 ${i === 1 ? "md:border-l md:border-border" : ""} ${i === 2 ? "min-[1200px]:border-l min-[1200px]:border-border" : ""}`}>
              <div className="min-w-0">
                <p className="itinerary-date-label eyebrow text-muted-foreground">{d.dow}</p>
                <span className="itinerary-day-number display mt-3 block text-7xl text-gold transition-colors duration-700 group-hover:text-rust md:text-9xl">{d.n}</span>
                <p className="itinerary-date-label eyebrow mt-3 text-muted-foreground">{d.date}</p>
                <ul className="mt-7">
                  {d.events.map((e, j) => (
                    <li key={e.title} className={j > 0 ? "mt-7 border-t border-border pt-7" : ""}>
                      <h3 className="itinerary-event-name display text-3xl md:text-4xl">{e.title}</h3>
                      <p className="itinerary-location mt-2 font-serif text-xl italic text-forest">{e.place}</p>
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
        <Reveal delay={200} className="section-content text-center">
          <p className="font-serif text-sm font-normal leading-relaxed text-foreground">
            Have any additional questions? {" "}
            <Link to="/faqs" className="text-romantic-crimson underline-offset-4 hover:underline focus-visible:underline">Visit our FAQs</Link>{" "}
            for more information.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

