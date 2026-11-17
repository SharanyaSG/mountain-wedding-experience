import gondolaPhoto from "@/assets/loon-mountain-gondola.jpg";
import { Reveal } from "@/components/site/Reveal";
import { travelGuide } from "@/components/site/wedding-content";
import { FaqCallout } from "./FaqCallout";
import { SectionHeading } from "./SectionHeading";

/** Things To Do: exploring Lincoln (our guide, still in progress) and the gondola rides that are on us. */
export function ThingsToDo() {
  return (
    <div className="bg-card text-foreground">
      <Adventure />
      <GondolaGift />
    </div>
  );
}

function Adventure() {
  const guide = travelGuide.newHampshireGuide;
  return (
    <section id="adventure" className="section-divider scroll-mt-20 md:scroll-mt-24">
      <div className="page-lead section-shell text-left">
        <Reveal>
          <SectionHeading
            label="Exploring Lincoln, New Hampshire"
            title="Make an Adventure of It"
            accent="There’s more to explore."
            crimson
          />
        </Reveal>
        <Reveal
          delay={100}
          className="section-content font-serif text-[15px] leading-8 text-foreground md:text-base md:leading-9"
        >
          <p>{guide.intro}</p>
        </Reveal>
        {guide.url ? (
          <Reveal delay={180} className="section-content flex justify-start">
            <a
              href={guide.url}
              target="_blank"
              rel="noreferrer"
              className="btn-label border border-forest bg-forest px-7 py-4 font-bold text-ivory shadow-none transition-colors hover:border-rust hover:bg-rust"
            >
              {guide.label}
              <span aria-hidden="true" className="ml-2">
                ↗
              </span>
            </a>
          </Reveal>
        ) : (
          <Reveal delay={180} className="section-content">
            {/* Greyed out and not a link until the guide exists. */}
            <p className="flex flex-wrap items-center gap-3">
              <span
                role="link"
                aria-disabled="true"
                className="btn-label inline-block cursor-not-allowed border border-border bg-muted px-7 py-4 font-bold text-muted-foreground/70"
              >
                {guide.label}
              </span>
              <span className="eyebrow font-bold text-muted-foreground">Coming soon</span>
            </p>
          </Reveal>
        )}
        <FaqCallout
          className="section-content w-full min-[1200px]:max-w-[95%]"
          category="The Wedding Experience"
          hash="experience"
          additionalCategory={{ label: "Explore the Mountains", hash: "explore" }}
        />
      </div>
    </section>
  );
}

function GondolaGift() {
  const [offerBefore, offerAfter] = travelGuide.gondola.offer.split(travelGuide.gondola.highlight);
  return (
    <section id="gondola" className="section-divider scroll-mt-20 bg-card md:scroll-mt-24">
      <div className="section-shell grid items-center gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <img
            src={gondolaPhoto}
            alt="A guest standing between two Loon Mountain scenic gondola cabins at the base station"
            width={1440}
            height={1920}
            loading="lazy"
            className="aspect-[3/4] h-full w-full object-contain"
          />
        </Reveal>
        <Reveal delay={120} className="md:col-span-7">
          <p className="font-script text-5xl leading-tight text-romantic-crimson">
            A gift from us to you.
          </p>
          <h2 className="display mt-6 text-4xl uppercase leading-tight md:text-5xl">
            The Mountain Views Are on Us!
          </h2>
          <p className="mt-8 text-[15px] leading-8 text-muted-foreground">
            {travelGuide.gondola.intro}
          </p>
          <p className="mt-5 text-[15px] leading-8 text-muted-foreground">
            {travelGuide.gondola.climb}
          </p>
          <p className="mt-5 text-[15px] leading-8 text-muted-foreground">
            {offerBefore}
            <span className="font-bold text-itinerary-forest">{travelGuide.gondola.highlight}</span>
            {offerAfter}
          </p>
          <p className="mt-7 border-l border-rust pl-5 font-serif text-sm italic leading-7 text-romantic-crimson">
            {travelGuide.gondola.accessDetails}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
