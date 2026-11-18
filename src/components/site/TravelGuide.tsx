import riverwalkPhoto from "@/assets/hotel-riverwalk.jpg";
import { Reveal } from "@/components/site/Reveal";
import { hotels, travelGuide } from "@/components/site/wedding-content";
import { FaqCallout } from "./FaqCallout";
import { SectionHeading } from "./SectionHeading";

const riverwalk = hotels[0];

function TravelerHeading({ children }: { children: string }) {
  return (
    <h3 className="font-display text-[17px] font-bold uppercase tracking-[0.16em] text-rust md:text-[19px] lg:text-[21px]">{children}</h3>
  );
}

function DriveTime({ children }: { children: string }) {
  return (
    <p className="mt-3 font-serif text-sm font-bold tracking-normal text-forest md:text-base lg:text-lg">{children}</p>
  );
}

export function TravelGuide() {
  return (
    <div className="bg-card text-foreground">
      <Introduction />
      <Stay />
      <GettingHere />
    </div>
  );
}

function Introduction() {
  return (
    <section id="plan-your-trip" className="page-lead section-shell section-divider scroll-mt-20 md:scroll-mt-24">
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
          <SectionHeading label="Staying in Lincoln, New Hampshire" title="Our Recommended Mountain Stay" accent="Stay close to the celebrations." crimson />
        </Reveal>
        <div className="section-content grid gap-12 md:grid-cols-12 md:gap-14">
          <Reveal className="md:col-span-7">
            <img
              src={riverwalkPhoto}
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
            <FaqCallout delay={240} className="mt-6" category="Accommodations" hash="accommodations" />
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
          <SectionHeading label="Flying to New England" title="The Journey to the Mountains" accent="Getting here is part of the adventure." crimson />
          <p className="mt-6 font-serif text-sm leading-7 text-foreground">{travelGuide.flyingIntro}</p>
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

        <FaqCallout className="section-content mx-auto w-full min-[1200px]:max-w-[90%]" category="Travel & Weather" hash="travel" />

        <Reveal className="section-content border-t border-border pt-8">
          <div id="driving-to-lincoln" className="w-full">
            <SectionHeading label="Driving to Lincoln, New Hampshire" title="Making your way to the mountains" accent="Lincoln makes for a beautiful mountain road trip!" crimson />
            <p className="mt-6 font-serif text-sm leading-7 text-foreground">{travelGuide.driving.introduction}</p>

            <p className="mt-8 font-serif text-base font-bold leading-8 text-itinerary-forest lg:text-lg">{travelGuide.driving.recommendation}</p>
            <p className="mt-3 font-serif text-sm leading-7 text-foreground">{travelGuide.driving.transportation}</p>

            <p className="mt-6 border-l border-cinnamon pl-5 text-sm leading-7 text-rust"><span className="font-bold">International travelers:</span> If you plan to drive while you’re here, check driver’s license and International Driving Permit requirements before traveling.</p>

            <aside className="mt-8 border-l-2 border-rust bg-muted px-6 py-6" aria-labelledby="rental-group-rates">
              <h4 id="rental-group-rates" className="eyebrow text-[13px] font-bold text-rust">Rental Car Group Rates</h4>
              <p className="mt-4 font-serif text-sm leading-7 text-foreground">{travelGuide.driving.groupRates.notice}</p>
              <p className="mt-2 font-serif text-sm italic leading-7 text-foreground">{travelGuide.driving.groupRates.update}</p>
            </aside>

            <FaqCallout className="mt-6 w-full" category="Travel & Weather" hash="travel" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
