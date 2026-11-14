import { createFileRoute } from "@tanstack/react-router";
import riverwalkPhoto from "@/assets/hotel-riverwalk.jpg.asset.json";
import { PhotoPlaceholder, Reveal } from "@/components/site/Reveal";
import { hotels, travelGuide } from "@/components/site/wedding-content";

export const Route = createFileRoute("/plan-your-trip")({
  head: () => ({
    meta: [
      { title: "Plan Your Trip · Sharanya & Sahil" },
      { name: "description", content: "A destination wedding travel guide for Sharanya & Sahil’s celebration at Loon Mountain, New Hampshire, October 7–9, 2027." },
      { property: "og:title", content: "Plan Your Trip · Sharanya & Sahil" },
      { property: "og:description", content: "Travel, accommodation, transportation and White Mountains inspiration for our October 7–9, 2027 wedding weekend." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlanYourTrip,
});

const riverwalk = hotels[0];

function SectionHeading({ title, accent, align = "left" }: { title: string; accent: string; align?: "left" | "center" }) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <h2 className="display text-4xl uppercase leading-tight text-foreground sm:text-5xl md:text-6xl">{title}</h2>
      <p className="mt-4 font-script text-4xl leading-tight text-rust md:text-5xl">{accent}</p>
    </div>
  );
}

function PlanYourTrip() {
  return (
    <main className="bg-card text-foreground">
      <Introduction />
      <Stay />
      <GettingHere />
      <Adventure />
      <GondolaGift />
      <Planning />
    </main>
  );
}

function Introduction() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-36 md:px-10 md:pb-36 md:pt-48">
      <Reveal className="mx-auto max-w-4xl text-center">
        <p className="eyebrow text-cinnamon">Lincoln, New Hampshire · October 7–9, 2027</p>
        <h1 className="display mt-8 text-4xl uppercase leading-tight sm:text-5xl md:text-7xl">A Little Mountain Magic</h1>
        <p className="mt-5 font-script text-5xl leading-tight text-romantic-crimson md:text-6xl">Your New Hampshire adventure awaits.</p>
      </Reveal>
      <Reveal delay={120} className="mx-auto mt-12 max-w-3xl space-y-6 text-center text-[15px] leading-8 text-muted-foreground md:text-base">
        <p>There’s something magical about New Hampshire in October. The mountains turn brilliant shades of red, orange, and gold, the air gets a little crisper, and every winding road seems to lead to another breathtaking view.</p>
        <p>We’re bringing our favorite people together in one of our favorite places, and we hope you’ll make an adventure of it!</p>
        <p>Whether you’re joining us from down the road, across the country, or halfway around the world, we’ve put together everything you need to plan your trip and make the most of your time in the White Mountains.</p>
      </Reveal>
      <Reveal delay={220} className="mt-14 md:mt-20">
        <PhotoPlaceholder label="White Mountains in peak autumn foliage" className="aspect-[4/3] w-full sm:aspect-[16/8] md:aspect-[16/7]" />
      </Reveal>
    </section>
  );
}

function Stay() {
  return (
    <section id="stay" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <Reveal>
          <SectionHeading title="Stay Close to the Celebrations" accent="Our recommended mountain stay." />
        </Reveal>
        <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-14">
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
              <h3 className="display text-3xl uppercase leading-tight md:text-4xl">{riverwalk.name}</h3>
              <div className="mt-7 space-y-5 text-sm leading-7 text-muted-foreground">
                <p>{riverwalk.introduction}</p>
                <p>{riverwalk.season}</p>
                <p>{riverwalk.availability}</p>
                <p className="font-bold text-foreground">{riverwalk.encouragement}</p>
              </div>
            </Reveal>
            <Reveal delay={200} className="mt-9 border-l-2 border-rust bg-muted px-6 py-7">
              <h4 className="eyebrow text-rust">{riverwalk.bookingHeading}</h4>
              <p className="mt-4 text-sm leading-7 text-foreground">{riverwalk.bookingNote}</p>
              <p className="mt-2 font-serif text-sm italic leading-7 text-muted-foreground">{riverwalk.bookingStatus}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function GettingHere() {
  return (
    <section id="getting-here" className="border-t border-border">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <Reveal>
          <SectionHeading title="The Journey to the Mountains" accent="Getting here is part of the adventure." />
        </Reveal>

        <Reveal className="mt-16 grid gap-7 border-t border-foreground/20 py-10 md:grid-cols-12 md:py-14">
          <h3 className="eyebrow text-cinnamon md:col-span-4">International Travelers</h3>
          <div className="md:col-span-8">
            <p className="font-serif text-2xl leading-snug">{travelGuide.international.name} <span className="text-rust">({travelGuide.international.code})</span></p>
            <p className="mt-3 font-display text-lg uppercase tracking-[0.08em] text-forest">{travelGuide.international.driveTime}</p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">{travelGuide.international.description}</p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{travelGuide.international.recommendation}</p>
          </div>
        </Reveal>

        <div className="border-t border-foreground/20 pt-10 md:pt-14">
          <Reveal>
            <h3 className="eyebrow text-cinnamon">Domestic Travelers</h3>
          </Reveal>
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-0">
            {travelGuide.domestic.map((airport, index) => (
              <Reveal key={airport.code} delay={index * 100} className={index === 0 ? "md:border-r md:border-border md:pr-12" : "md:pl-12"}>
                <p className="display text-7xl text-rust md:text-8xl">{airport.code}</p>
                <h4 className="mt-5 max-w-sm font-serif text-2xl leading-snug">{airport.name}</h4>
                <p className="mt-3 font-display text-base uppercase tracking-[0.08em] text-forest">{airport.driveTime}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 max-w-2xl text-sm leading-7 text-muted-foreground">
            <p>{travelGuide.airportComparison}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid items-center gap-10 border-t border-foreground/20 pt-10 md:grid-cols-12 md:pt-14">
          <Reveal className="md:col-span-5">
            <h3 className="eyebrow text-cinnamon">Driving from New England</h3>
            <p className="mt-6 font-serif text-2xl leading-snug">Joining us from Massachusetts or a neighboring state?</p>
            <p className="mt-4 font-script text-4xl text-rust">Lincoln makes for a beautiful mountain road trip!</p>
            <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">We recommend allowing extra travel time during Columbus Day weekend, as the roads can get busy with fall foliage visitors.</p>
          </Reveal>
          <Reveal delay={120} className="md:col-span-7">
            <PhotoPlaceholder label="A scenic New Hampshire autumn road" className="aspect-[4/3] w-full md:aspect-[16/10]" />
          </Reveal>
        </div>

        <Reveal className="mt-16 border-t border-foreground/20 pt-10 md:pt-14">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <h3 className="eyebrow text-cinnamon">Rental Car Information</h3>
            </div>
            <div className="md:col-span-8">
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">We recommend arranging a rental car in advance.</p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">Lincoln is a mountain destination, and having your own transportation makes it easier to explore the area.</p>
              <nav aria-label="Official rental car websites" className="mt-8 grid border-t border-border sm:grid-cols-2 lg:grid-cols-3">
                {travelGuide.rentalCompanies.map((company) => (
                  <a key={company.name} href={company.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 border-b border-border py-4 pr-4 font-display text-sm font-medium uppercase tracking-[0.08em] text-foreground transition-colors hover:text-rust sm:mr-5">
                    {company.name}<span aria-hidden="true" className="text-rust">↗</span>
                  </a>
                ))}
              </nav>
              <p className="mt-7 max-w-2xl text-sm leading-7 text-muted-foreground">Please confirm airport pickup availability, rental requirements, and operating hours directly with the rental provider.</p>
              <p className="mt-4 max-w-2xl border-l border-cinnamon pl-5 text-sm leading-7 text-foreground"><span className="font-bold">International travelers:</span> check driver’s license and International Driving Permit requirements before traveling.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AdventureList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <h3 className="eyebrow text-cinnamon">{title}</h3>
      <ul className="mt-7 border-t border-foreground/20">
        {items.map((item) => (
          <li key={item} className="border-b border-border py-5">
            <p className="font-serif text-xl leading-snug">{item}</p>
            <p className="mt-2 font-serif text-sm italic text-muted-foreground">Recommendation details to come.</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Adventure() {
  return (
    <section id="adventure" className="border-t border-border">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <Reveal>
          <SectionHeading title="Make an Adventure of It" accent="There’s more to explore." />
        </Reveal>
        <Reveal delay={100} className="mt-10 max-w-2xl space-y-5 text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
          <p>We’ve spent some of our favorite moments exploring the mountains, finding little places to eat, and taking the scenic route whenever possible.</p>
          <p>Here are a few experiences we’d love for you to discover while you’re here.</p>
        </Reveal>
        <div className="mt-16 grid gap-16 md:grid-cols-2 md:gap-14">
          <Reveal><AdventureList title="Scenic Drives" items={travelGuide.scenicDrives} /></Reveal>
          <Reveal delay={120}><AdventureList title="Outdoor Adventures" items={travelGuide.outdoorAdventures} /></Reveal>
        </div>
        <Reveal className="mt-20 border-t border-foreground/20 pt-10 md:pt-14">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <h3 className="eyebrow text-cinnamon">Eat &amp; Explore</h3>
              <p className="mt-5 max-w-xs font-script text-4xl leading-tight text-rust">A few of our favorites, coming soon.</p>
            </div>
            <ul className="grid border-t border-border sm:grid-cols-2 md:col-span-8">
              {travelGuide.eatAndExplore.map((item) => (
                <li key={item} className="border-b border-border py-5 sm:odd:pr-6 sm:even:pl-6">
                  <p className="font-serif text-xl">{item}</p>
                  <p className="mt-2 font-serif text-sm italic text-muted-foreground">Our personal recommendation will be added here.</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function GondolaGift() {
  return (
    <section id="gondola" className="border-y border-border bg-background">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-24 md:grid-cols-12 md:px-10 md:py-36">
        <Reveal className="md:col-span-7">
          <PhotoPlaceholder label="Loon Mountain gondolas in autumn" className="aspect-[4/3] w-full md:aspect-[16/11]" />
        </Reveal>
        <Reveal delay={120} className="md:col-span-5">
          <p className="font-script text-5xl leading-tight text-romantic-crimson">A little something from us</p>
          <h2 className="display mt-6 text-4xl uppercase leading-tight md:text-5xl">The Mountain Views Are on Us!</h2>
          <p className="mt-8 text-[15px] leading-8 text-muted-foreground">On {travelGuide.gondola.date}, we’re treating our wedding guests to complimentary gondola rides at Loon Mountain!</p>
          <p className="mt-5 text-[15px] leading-8 text-muted-foreground">Enjoy the journey to the summit, take in the spectacular autumn views, and celebrate with us above the mountains.</p>
          <p className="mt-7 border-l border-rust pl-5 font-serif text-sm italic leading-7 text-foreground">{travelGuide.gondola.accessDetails}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Planning() {
  return (
    <section className="mx-auto max-w-[1000px] px-5 py-24 text-center md:px-10 md:py-36">
      <Reveal>
        <p className="eyebrow text-cinnamon">A little planning goes a long way</p>
        <h2 className="display mt-7 text-4xl uppercase leading-tight md:text-6xl">Make the Most of Your Mountain Getaway</h2>
      </Reveal>
      <Reveal delay={120} className="mx-auto mt-12 max-w-3xl space-y-6 text-[15px] leading-8 text-muted-foreground md:text-base">
        <p>Planning to arrive early or stay a little longer?</p>
        <p>We love that you’re making a trip out of our wedding! The White Mountains have so much to offer, and we encourage you to explore at your own pace.</p>
        <p>Flights, accommodations, transportation, and any additional activities or excursions can be arranged independently.</p>
        <p>Since October is an especially popular time to visit, we recommend making reservations well in advance.</p>
      </Reveal>
      <Reveal delay={200} className="mx-auto mt-12 max-w-3xl border-t border-border pt-10 text-sm leading-7 text-muted-foreground">
        <p>Many popular attractions, restaurants, and experiences can be particularly busy during peak foliage season.</p>
        <p className="mt-4">Guests planning additional activities should check availability and make reservations ahead of time where possible.</p>
      </Reveal>
    </section>
  );
}
