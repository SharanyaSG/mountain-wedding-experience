import { Reveal } from "./Reveal";
import { StoryCard } from "./StoryCard";
import { stories } from "./wedding-content";

export function Stories() {
  return (
    <section id="our-stories" className="section-shell section-divider scroll-mt-24 md:scroll-mt-28">
      <span id="stories" aria-hidden="true" />

      <Reveal delay={100}>
        <h2 className="display text-5xl md:text-7xl min-[1200px]:whitespace-nowrap">The stories that <em className="whitespace-nowrap text-crimson">got us here</em></h2>
      </Reveal>
      <Reveal delay={200}>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base min-[1200px]:max-w-none min-[1200px]:whitespace-nowrap">
          Hover over a card to read the story behind it. On a phone, tap the card to turn it over.
        </p>
      </Reveal>
      <div className="section-content grid gap-6 min-[540px]:max-[767px]:grid-cols-2 min-[540px]:max-[767px]:gap-4 min-[768px]:max-[1200px]:grid-cols-2 min-[768px]:max-[1200px]:gap-8 min-[1200px]:grid-cols-4 min-[1200px]:gap-5">
        {stories.map((s, i) => (
          <Reveal key={s.id} delay={(i % 4) * 120}>
            <StoryCard story={s} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

