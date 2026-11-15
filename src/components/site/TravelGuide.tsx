import gondolaPhoto from "@/assets/loon-mountain-gondola.jpg.asset.json";
import riverwalkPhoto from "@/assets/hotel-riverwalk.jpg.asset.json";
import { Reveal } from "@/components/site/Reveal";
import { hotels, travelGuide } from "@/components/site/wedding-content";
import { Link } from "@tanstack/react-router";

const riverwalk = hotels[0];

function SectionHeading({ title, accent, align = "left", crimson = false }: { title: string; accent: string; align?: "left" | "center"; crimson?: boolean }) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <h2 className="display text-4xl uppercase leading-tight text-foreground sm:text-5xl md:text-6xl">{title}</h2>
      <p className={`mt-4 font-script text-4xl leading-tight md:text-5xl ${crimson ? "text-romantic-crimson" : "text-rust"}`}>{accent}</p>
    </div>
  );
}

function TravelerHeading({ children }: { children: string }) {
  return (
    <h3 className="font-display text-[17px] font-bold uppercase tracking-[0.16em] text-rust md:text-[19px] lg:text-[21px]">{children}</h3>
  );
}

function DriveTime({ children }: { children: string }) {
  return (
    <p className="mt-3 font-display text-sm font-normal uppercase tracking-[0.08em] text-forest md:text-base lg:text-lg">{children}</p>
  );
}

export function TravelGuide() {
  return (
    <div className="bg-card text-foreground">
      <Introduction />
      <Stay />
      <GettingHere />
      <Adventure />
      <GondolaGift />
    </div>
  );
}

function Introduction() {
  return (
    <section id="plan-your-trip" className="section-shell section-divider scroll-mt-20 md:scroll-mt-24">
      <Reveal className="mx-auto max-w-4xl text-center">
        <p className="eyebrow text-cinnamon lg:font-bold">Lincoln, New Hampshire · October 7–9, 2027</p>
        <h2 className="display mt-8 text-4xl uppercase leading-tight sm:text-5xl md:text-7xl">A Little Mountain Magic</h2>
        <p className="mt-5 font-script text-5xl leading-tight text-romantic-crimson md:text-6xl">Your New Hampshire adventure awaits.</p>
      </Reveal>
      <Reveal delay={120} className="section-content mx-auto max-w-3xl space-y-6 text-center text-[15px] leading-8 text-muted-foreground md:text-base">
        <p>There’s something magical about New Hampshire in October. The mountains turn brilliant shades of red, orange, and gold, the air gets a little crisper, and every winding road seems to lead to another breathtaking view.</p>
        <p>We’re bringing our favorite people together in one of our favorite places, and we hope you’ll make an adventure of it!</p>
        <p>Whether you’re joining us from down the road, across the country, or halfway around the world, <span className="lg:font-bold lg:text-itinerary-forest">we’ve put together everything you need to plan your trip and make the most of your time in the White Mountains.</span></p>
      </Reveal>
    </section>
  );
}

function Stay() {
  return (
    <section id="stay" className="section-divider scroll-mt-20">
      <div className="section-shell">
        <Reveal>
          <SectionHeading title="Our Recommended Mountain Stay" accent="Stay close to the celebrations." crimson />
        </Reveal>
        <div className="section-content grid gap-12 md:grid-cols-12 md:gap-14">
          <Reveal className="md:col-span-7">
            <img
              src={riverwalkPhoto.url}
              alt="RiverWalk Resort at Loon Mountain, a multi-wing resort with red roofs set beneath a forested mountain"
              width={1000}
              height={720}
              loading="lazy"
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </Reveal>
          <div className="md:col-span-5">
            <Reveal delay={120}>
              <h3 className="text-3xl leading-tight text-foreground md:text-4xl"><span className="font-display font-bold uppercase text-rust">RiverWalk Resort</span>{" "}<span className="font-display font-normal">at Loon Mountain</span></h3>
              <div className="mt-7 space-y-5 text-sm leading-7 text-muted-foreground">
                <p>{riverwalk.introduction}</p>
                <p className="text-foreground"><span className="font-bold">{riverwalk.bookingRecommendation}</span><br /><span className="font-normal italic">{riverwalk.availabilityNote}</span></p>
              </div>
            </Reveal>
            <Reveal delay={200} className="mt-9 border-l-2 border-rust bg-muted px-6 py-7">
              <h4 className="eyebrow text-[14px] font-bold text-rust">{riverwalk.bookingHeading}</h4>
              <p className="mt-4 text-sm leading-7 text-foreground">{riverwalk.bookingNote}</p>
              <p className="mt-2 font-serif text-sm italic leading-7 text-muted-foreground">{riverwalk.bookingStatus}</p>
            </Reveal>
            <Reveal delay={240} className="mt-6 border-l-2 border-info-forest bg-info-sage px-6 py-7 text-left">
              <h4 className="eyebrow text-[14px] font-bold text-itinerary-forest">Have any additional questions?</h4>
              <p className="mt-4 font-serif text-base font-normal leading-relaxed text-foreground">
                Visit our <Link to="/faqs" className="font-bold text-romantic-crimson underline-offset-4 hover:underline focus-visible:underline">FAQs</Link>, particularly {" "}
                <Link to="/faqs" hash="accommodations" className="font-bold text-romantic-crimson underline-offset-4 hover:underline focus-visible:underline">Accommodations</Link>, for more information.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function GettingHere() {
  return (
    <section id="getting-here" className="section-divider">
      <div className="section-shell">
        <Reveal>
          <SectionHeading title="The Journey to the Mountains" accent="Getting here is part of the adventure." crimson />
        </Reveal>

        <Reveal className="section-content">
          <div className="grid gap-12 md:grid-cols-2 md:gap-0">
            <div className="md:pr-8 lg:pr-14">
              <TravelerHeading>International Travelers</TravelerHeading>
              <p className="mt-7 font-serif text-xl leading-snug md:text-2xl">{travelGuide.international.name} <span className="text-rust">({travelGuide.international.code})</span></p>
              <DriveTime>{travelGuide.international.driveTime}</DriveTime>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">{travelGuide.international.description}</p>
            </div>
            <div className="border-t border-border pt-10 md:border-t-0 md:border-l md:pl-8 md:pt-0 lg:pl-14">
              <TravelerHeading>Domestic Travelers</TravelerHeading>
              <ul className="mt-7">
                {travelGuide.domestic.map((airport, index) => (
                  <li key={airport.code} className={index === 0 ? "" : "mt-7 border-t border-border pt-7"}>
                    <p className="font-serif text-xl leading-snug md:text-2xl">{airport.name} <span className="text-rust">({airport.code})</span></p>
                    <DriveTime>{airport.driveTime}</DriveTime>
                  </li>
                ))}
              </ul>
              <p className="mt-7 font-serif text-sm italic leading-7 text-muted-foreground">{travelGuide.airportComparison}</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="section-content">
          <p className="mx-auto max-w-3xl text-center font-serif text-[17px] font-bold leading-8 text-itinerary-forest md:text-lg">{travelGuide.rentalRecommendation}</p>
        </Reveal>

        <Reveal className="section-content border-t border-border pt-8">
          <div id="driving-to-lincoln" className="mx-auto w-full max-w-[980px]">
            <h3 className="eyebrow font-bold text-rust">Driving to Lincoln</h3>
            <div className="mt-6">
              <SectionHeading title="Making your way to the mountains?" accent="Lincoln makes for a beautiful mountain road trip!" crimson />
            </div>
            <p className="mt-6 font-serif text-sm leading-7 text-foreground">{travelGuide.driving.introduction}</p>

            <p className="mt-8 font-serif text-base font-bold leading-8 text-itinerary-forest lg:text-lg">{travelGuide.driving.recommendation}</p>
            <p className="mt-3 font-serif text-sm leading-7 text-foreground">{travelGuide.driving.transportation}</p>

            <aside className="mt-8 border-l-2 border-rust bg-muted px-6 py-6" aria-labelledby="rental-group-rates">
              <h4 id="rental-group-rates" className="eyebrow text-[13px] font-bold text-rust">Rental Car Group Rates</h4>
              <p className="mt-4 font-serif text-sm leading-7 text-foreground">{travelGuide.driving.groupRates.notice}</p>
              <p className="mt-2 font-serif text-sm italic leading-7 text-foreground">{travelGuide.driving.groupRates.update}</p>
            </aside>

            <h4 className="mt-9 font-display text-base font-bold uppercase tracking-[0.08em] text-foreground">Explore Rental Car Options</h4>
            <nav aria-label="Official rental car websites" className="mt-5 grid border-t border-border sm:grid-cols-2 lg:grid-cols-3">
              {travelGuide.rentalCompanies.map((company) => (
                <a key={company.name} href={company.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 border-b border-border py-4 pr-4 font-display text-sm font-medium uppercase tracking-[0.08em] text-foreground transition-colors hover:text-rust sm:mr-5">
                  {company.name}<span aria-hidden="true" className="text-rust">↗</span>
                </a>
              ))}
            </nav>
            <p className="mt-7 text-sm leading-7 text-muted-foreground">Please confirm airport pickup availability, rental requirements, and operating hours directly with the rental provider.</p>
            <p className="mt-4 border-l border-cinnamon pl-5 text-sm leading-7 text-rust"><span className="font-bold">International travelers:</span> Check driver’s license and International Driving Permit requirements before traveling.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Adventure() {
  const guide = travelGuide.newHampshireGuide;
  return (
    <section id="adventure" className="section-divider">
      <div className="section-shell text-center">
        <Reveal>
          <SectionHeading title="Make an Adventure of It" accent="There’s more to explore." align="center" crimson />
        </Reveal>
        <Reveal delay={100} className="section-content mx-auto max-w-[680px] font-serif text-[15px] leading-8 text-foreground md:text-base md:leading-9">
          <p>{guide.intro}</p>
        </Reveal>
        <Reveal delay={180} className="section-content flex justify-center">
          {guide.url ? (
            <a
              href={guide.url}
              target="_blank"
              rel="noreferrer"
              className="btn-label border border-forest bg-forest px-7 py-4 font-bold text-ivory shadow-none transition-colors hover:border-rust hover:bg-rust"
            >
              {guide.label}<span aria-hidden="true" className="ml-2">↗</span>
            </a>
          ) : (
            <button
              type="button"
              aria-disabled="true"
              tabIndex={-1}
              title="Our New Hampshire guide is coming soon."
              className="btn-label cursor-not-allowed border border-forest bg-forest px-7 py-4 font-bold text-ivory shadow-none transition-colors hover:border-rust hover:bg-rust"
            >
              {guide.label}<span aria-hidden="true" className="ml-2">↗</span>
            </button>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function GondolaGift() {
  const [offerBefore, offerAfter] = travelGuide.gondola.offer.split(travelGuide.gondola.highlight);
  return (
    <section id="gondola" className="section-divider bg-card">
      <div className="section-shell grid items-center gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <img
            src={gondolaPhoto.url}
            alt="A guest standing between two Loon Mountain scenic gondola cabins at the base station"
            width={1440}
            height={1920}
            loading="lazy"
            className="aspect-[3/4] h-full w-full object-contain"
          />
        </Reveal>
        <Reveal delay={120} className="md:col-span-7">
          <p className="font-script text-5xl leading-tight text-romantic-crimson">A gift from us to you.</p>
          <h2 className="display mt-6 text-4xl uppercase leading-tight md:text-5xl">The Mountain Views Are on Us!</h2>
          <p className="mt-8 text-[15px] leading-8 text-muted-foreground">{travelGuide.gondola.intro}</p>
          <p className="mt-5 text-[15px] leading-8 text-muted-foreground">{travelGuide.gondola.climb}</p>
          <p className="mt-5 text-[15px] leading-8 text-muted-foreground">{offerBefore}<span className="font-bold text-itinerary-forest">{travelGuide.gondola.highlight}</span>{offerAfter}</p>
          <p className="mt-7 border-l border-rust pl-5 font-serif text-sm italic leading-7 text-romantic-crimson">{travelGuide.gondola.accessDetails}</p>
        </Reveal>
      </div>
    </section>
  );
}

