import { useState, type MouseEvent, type ReactNode } from "react";
import { Reveal } from "@/components/site/Reveal";
import { faqCategories, faqIntro, type FaqBlock } from "@/components/site/faq-content";

function scrollToSection(e: MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const header = document.querySelector("header");
  const offset = (header?.getBoundingClientRect().height ?? 80) + 16;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
  history.replaceState(null, "", `#${id}`);
}

function renderInline(text: string): ReactNode[] {
  return text.split(/(\[\[[^\]]+\]\])/g).map((part, i) => {
    const m = part.match(/^\[\[(.+)\|(.+)\]\]$/);
    if (!m) return part;
    return (
      <a key={i} href={`#${m[2]}`} onClick={(e) => scrollToSection(e, m[2])}
        className="font-bold text-itinerary-forest underline decoration-romantic-crimson/50 underline-offset-4 transition-colors hover:text-romantic-crimson">
        {m[1]}
      </a>
    );
  });
}

function Block({ block }: { block: FaqBlock }) {
  if (typeof block === "string") return <p>{renderInline(block)}</p>;
  if ("heading" in block) return <h4 className="pt-4 font-display text-[13px] font-bold uppercase tracking-[0.18em] text-rust">{block.heading}</h4>;
  return <p className="font-bold text-itinerary-forest">{block.emphasis}</p>;
}

export function FaqSection() {
  const [active, setActive] = useState(faqCategories[0]!.id);
  const category = faqCategories.find((c) => c.id === active) ?? faqCategories[0]!;

  return (
    <section id="faqs" className="scroll-mt-24 border-t border-border md:scroll-mt-28">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <Reveal>
          <h2 className="display text-5xl md:text-6xl">A few <em className="text-romantic-crimson">early answers</em></h2>
          <p className="mt-6 max-w-2xl font-serif text-[15px] leading-relaxed text-foreground md:text-base">{faqIntro}</p>
        </Reveal>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-12">
          {/* Mobile selector */}
          <div className="md:hidden">
            <label htmlFor="faq-category" className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-rust">Choose a topic</label>
            <select id="faq-category" value={active} onChange={(e) => setActive(e.target.value)}
              className="mt-2 w-full border-0 border-b border-itinerary-forest bg-transparent py-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-itinerary-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-rust">
              {faqCategories.map((c, i) => <option key={c.id} value={c.id}>{`${i + 1}. ${c.label}`}</option>)}
            </select>
          </div>

          {/* Desktop table of contents */}
          <nav aria-label="FAQ topics" className="hidden md:col-span-4 md:block">
            <ol className="sticky top-32 space-y-1">
              {faqCategories.map((c, i) => {
                const on = c.id === active;
                return (
                  <li key={c.id}>
                    <button type="button" onClick={() => setActive(c.id)} aria-pressed={on}
                      className={`flex w-full items-baseline gap-4 border-l-2 py-3 pl-5 text-left font-display text-[13px] uppercase tracking-[0.16em] transition-colors lg:text-sm ${on ? "border-romantic-crimson font-bold text-itinerary-forest" : "border-transparent text-foreground hover:text-itinerary-forest"}`}>
                      <span className="font-serif text-xs tracking-normal text-rust">{String(i + 1).padStart(2, "0")}</span>
                      {c.label}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="md:col-span-8">
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.18em] text-itinerary-forest md:hidden">{category.label}</h3>
            <div key={category.id} className="animate-in fade-in duration-500">
              {category.items.map((f) => (
                <details key={f.q} className="group border-t border-foreground/20 last:border-b">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-rust [&::-webkit-details-marker]:hidden">
                    <span className="font-serif text-xl leading-snug md:text-2xl">{f.q}</span>
                    <span aria-hidden className="mt-1 text-2xl leading-none text-rust transition-transform duration-500 group-open:rotate-45">+</span>
                  </summary>
                  <div className="max-w-2xl space-y-3 pb-8 font-serif text-[15px] leading-relaxed text-foreground md:text-base">
                    {f.a.map((b, i) => <Block key={i} block={b} />)}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
