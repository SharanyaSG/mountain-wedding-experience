import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

export function FaqCallout({ category, hash, className = "", delay = 0 }: { category: string; hash: string; className?: string; delay?: number }) {
  return (
    <Reveal delay={delay} className={`border-l-2 border-info-forest bg-info-sage px-6 py-7 text-left ${className}`}>
      <h4 className="eyebrow text-[14px] font-bold text-itinerary-forest">Have any additional questions?</h4>
      <p className="mt-4 text-sm leading-7 text-foreground">
        Visit our <Link to="/faqs" className="font-bold text-romantic-crimson underline-offset-4 hover:underline focus-visible:underline">FAQs</Link>, particularly {" "}
        <Link to="/faqs" hash={hash} className="font-bold text-romantic-crimson underline-offset-4 hover:underline focus-visible:underline">{category}</Link>, for more information.
      </p>
    </Reveal>
  );
}