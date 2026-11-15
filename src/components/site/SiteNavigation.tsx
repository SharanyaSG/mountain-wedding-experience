import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const navigationItems = [
  { label: "Home", hash: "home" },
  { label: "Wedding Itinerary", hash: "wedding-itinerary" },
  { label: "Plan Your Trip", hash: "plan-your-trip" },
  { label: "Our Stories", hash: "our-stories" },
  { label: "Gallery", hash: "gallery" },
  { label: "FAQs", hash: "faqs" },
  { label: "A Message From Us", hash: "message-from-us" },
] as const;

export const plansHash = "tell-us-your-plans";

export function SiteNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => { setOpen(false); }, [location.href]);
  const items = navigationItems;
  const active = (hash: string) => location.pathname === "/" && (location.hash || "home") === hash;
  return (
    <header className={`fixed inset-x-0 top-0 z-40 text-foreground transition-colors duration-500 ${scrolled || open || location.pathname !== "/" ? "border-b border-border bg-background/90 backdrop-blur-md" : ""}`}>
      <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between gap-4 px-5 md:h-20 lg:gap-2 lg:px-3 xl:px-5">
        <Link to="/" hash="home" onClick={() => setOpen(false)} className="shrink-0 font-serif text-lg tracking-[0.18em]">G <span className="text-gold">×</span> M</Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex min-[1100px]:gap-2 xl:gap-3 min-[1440px]:gap-4">
          {items.map((item) => (
            <Link key={item.label} to="/" hash={item.hash} onClick={() => setOpen(false)} aria-current={active(item.hash) ? "location" : undefined} className={`whitespace-nowrap border-b-2 pb-1 font-display text-[15px] font-normal tracking-normal text-foreground transition-colors hover:text-rust ${active(item.hash) ? "border-rust" : "border-transparent"}`}>
              {item.label === "FAQs" ? "FAQs" : item.label.toUpperCase()}
            </Link>
          ))}
          <Link to="/" hash={plansHash} onClick={() => setOpen(false)} aria-current={active("tell-us-your-plans") ? "location" : undefined} className="h-auto whitespace-nowrap rounded-none border border-forest bg-forest px-4 py-2.5 font-display text-[16px] font-bold tracking-normal text-card uppercase leading-[1.3] shadow-none transition-colors hover:border-rust hover:bg-rust min-[1440px]:px-5 min-[1440px]:py-3">Tell Us Your Plans</Link>
        </nav>
        <Button variant="ghost" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" className="eyebrow h-auto rounded-none p-2 text-foreground hover:bg-transparent hover:text-rust lg:hidden">{open ? "Close" : "Menu"}</Button>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="max-h-[calc(100dvh-4rem)] overflow-y-auto bg-background px-6 pb-10 pt-4 md:max-h-[calc(100dvh-5rem)] lg:hidden">
          {items.map((item) => (
            <Link key={item.label} to="/" hash={item.hash} onClick={() => setOpen(false)} aria-current={active(item.hash) ? "location" : undefined} className="block border-t border-border py-3 font-display text-xl font-medium text-foreground transition-colors hover:text-rust md:text-3xl">
              {item.label === "FAQs" ? "FAQs" : item.label.toUpperCase()}
            </Link>
          ))}
          <Link to="/" hash={plansHash} onClick={() => setOpen(false)} aria-current={active("tell-us-your-plans") ? "location" : undefined} className="btn-label mt-6 block h-auto w-full rounded-none bg-forest py-5 text-center text-card shadow-none transition-colors hover:bg-rust">Tell Us Your Plans</Link>
        </nav>
      )}
    </header>
  );
}

