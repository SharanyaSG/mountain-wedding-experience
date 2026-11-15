import riverwalkPhoto from "@/assets/hotel-riverwalk.jpg.asset.json";
import { PhotoPlaceholder, Reveal } from "@/components/site/Reveal";
import { hotels, travelGuide } from "@/components/site/wedding-content";

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
    <p className="mt-3 font-display text-sm font-bold uppercase tracking-[0.08em] text-forest md:text-base lg:text-lg">{children}</p>
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
      <Planning />
    </div>
  );
}

function Introduction() {
  return (
    <section id="plan-your-trip" className="mx-auto max-w-[1400px] scroll-mt-20 px-5 pb-24 pt-36 md:scroll-mt-24 md:px-10 md:pb-36 md:pt-48">
      <Reveal className="mx-auto max-w-4xl text-center">
        <p className="eyebrow text-cinnamon lg:font-bold">Lincoln, New Hampshire · October 7–9, 2027</p>
        <h2 className="display mt-8 text-4xl uppercase leading-tight sm:text-5xl md:text-7xl">A Little Mountain Magic</h2>
        <p className="mt-5 font-script text-5xl leading-tight text-romantic-crimson md:text-6xl">Your New Hampshire adventure awaits.</p>
      </Reveal>
      <Reveal delay={120} className="mx-auto mt-12 max-w-3xl space-y-6 text-center text-[15px] leading-8 text-muted-foreground md:text-base">
        <p>There’s something magical about New Hampshire in October. The mountains turn brilliant shades of red, orange, and gold, the air gets a little crisper, and every winding road seems to lead to another breathtaking view.</p>
        <p>We’re bringing our favorite people together in one of our favorite places, and we hope you’ll make an adventure of it!</p>
        <p>Whether you’re joining us from down the road, across the country, or halfway around the world, <span className="lg:font-bold lg:text-itinerary-forest">we’ve put together everything you need to plan your trip and make the most of your time in the White Mountains.</span></p>
      </Reveal>
    </section>
  );
}

function Stay() {
  return (
    <section id="stay" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <Reveal>
          <SectionHeading title="Our Recommended Mountain Stay" accent="Stay close to the celebrations." crimson />
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
              <h3 className="text-3xl leading-tight text-foreground md:text-4xl"><span className="font-display font-bold uppercase">RiverWalk Resort</span>{" "}<span className="font-script font-normal">at Loon Mountain</span></h3>
              <div className="mt-7 space-y-5 text-sm leading-7 text-muted-foreground">
                <p>{riverwalk.introduction}</p>
                <p>{riverwalk.season}</p>
                <p className="text-foreground"><span className="font-bold">{riverwalk.bookingRecommendation}</span><br /><span className="font-normal italic">{riverwalk.availabilityNote}</span></p>
              </div>
            </Reveal>
            <Reveal delay={200} className="mt-9 border-l-2 border-rust bg-muted px-6 py-7">
              <h4 className="eyebrow text-[13px] font-bold text-rust">{riverwalk.bookingHeading}</h4>
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
          <SectionHeading title="The Journey to the Mountains" accent="Getting here is part of the adventure." crimson />
        </Reveal>

        <Reveal className="mt-16 border-t border-foreground/20 pt-10 md:mt-20 md:pt-14">
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
                    <p className="font-display text-lg font-bold uppercase tracking-[0.12em] text-rust">{airport.code}</p>
                    <h4 className="mt-3 font-serif text-xl leading-snug md:text-2xl">{airport.name}</h4>
                    <DriveTime>{airport.driveTime}</DriveTime>
                  </li>
                ))}
              </ul>
              <p className="mt-7 font-serif text-sm italic leading-7 text-muted-foreground">{travelGuide.airportComparison}</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-16 md:mt-24">
          <p className="mx-auto max-w-3xl text-center font-serif text-[17px] font-bold leading-8 text-itinerary-forest md:text-lg">{travelGuide.rentalRecommendation}</p>
        </Reveal>

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
    <section id="gondola" className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-24 md:grid-cols-12 md:px-10 md:py-36">
        <Reveal className="md:col-span-7">
          <PhotoPlaceholder label="Loon Mountain gondolas in autumn" className="aspect-[4/3] w-full md:aspect-[16/11]" />
        </Reveal>
        <Reveal delay={120} className="md:col-span-5">
          <p className="font-script text-5xl leading-tight text-romantic-crimson">A little something from us</p>
          <h2 className="display mt-6 text-4xl uppercase leading-tight md:text-5xl">The Mountain Views Are on Us!</h2>
          <p className="mt-8 text-[15px] leading-8 text-muted-foreground">{travelGuide.gondola.offer}</p>
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
        <p>{travelGuide.independentArrangements}</p>
        <p>Since October is an especially popular time to visit, we recommend making reservations well in advance.</p>
      </Reveal>
      <Reveal delay={200} className="mx-auto mt-12 max-w-3xl border-t border-border pt-10 text-sm leading-7 text-muted-foreground">
        <p>Many popular attractions, restaurants, and experiences can be particularly busy during peak foliage season.</p>
        <p className="mt-4">Guests planning additional activities should check availability and make reservations ahead of time where possible.</p>
      </Reveal>
    </section>
  );
}
