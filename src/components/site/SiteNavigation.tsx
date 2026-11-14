import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const items = [
  { label: "Home", to: "/", hash: "top" },
  { label: "Wedding Itinerary", to: "/", hash: "itinerary" },
  { label: "Plan Your Trip", to: "/plan-your-trip" },
  { label: "Our Stories", to: "/", hash: "stories" },
  { label: "Gallery", to: "/", hash: "gallery" },
  { label: "FAQs", to: "/", hash: "faqs" },
  { label: "A Message From Us", to: "/a-message-from-us" },
] as const;

export function SiteNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => { setOpen(false); }, [location.href]);
  const showPlans = () => { setOpen(false); setNotice(true); };
  const active = (item: (typeof items)[number]) => location.pathname === item.to &&
    (item.to !== "/" || (location.hash || "top") === item.hash);
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 text-foreground transition-colors duration-500 ${scrolled || open || location.pathname !== "/" ? "border-b border-border bg-background/90 backdrop-blur-md" : ""}`}>
        <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between gap-6 px-5 md:h-20 md:px-10">
          <Link to="/" hash="top" onClick={() => setOpen(false)} className="shrink-0 font-serif text-lg tracking-[0.18em]">G <span className="text-gold">×</span> M</Link>
          <nav aria-label="Primary" className="hidden items-center gap-5 min-[1440px]:flex">
            {items.map((item) => (
              <Link key={item.label} to={item.to} hash={"hash" in item ? item.hash : ""} onClick={() => setOpen(false)} aria-current={active(item) ? "page" : undefined} className={`whitespace-nowrap border-b-2 pb-1 font-display text-[14px] font-medium text-foreground transition-colors hover:text-rust ${active(item) ? "border-rust" : "border-transparent"}`}>
                {item.label === "FAQs" ? "FAQs" : item.label.toUpperCase()}
              </Link>
            ))}
            <Button onClick={showPlans} className="btn-label h-auto rounded-none border border-forest bg-forest px-5 py-3 text-card shadow-none hover:border-rust hover:bg-rust">Tell Us Your Plans</Button>
          </nav>
          <Button variant="ghost" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" className="eyebrow h-auto rounded-none p-2 text-foreground hover:bg-transparent hover:text-rust min-[1440px]:hidden">{open ? "Close" : "Menu"}</Button>
        </div>
        {open && (
          <nav id="mobile-menu" aria-label="Mobile" className="max-h-[calc(100dvh-4rem)] overflow-y-auto bg-background px-6 pb-10 pt-4 md:max-h-[calc(100dvh-5rem)] min-[1440px]:hidden">
            {items.map((item) => (
              <Link key={item.label} to={item.to} hash={"hash" in item ? item.hash : ""} onClick={() => setOpen(false)} aria-current={active(item) ? "page" : undefined} className="block border-t border-border py-3 font-display text-xl font-medium text-foreground transition-colors hover:text-rust md:text-3xl">
                {item.label === "FAQs" ? "FAQs" : item.label.toUpperCase()}
              </Link>
            ))}
            <Button onClick={showPlans} className="btn-label mt-6 h-auto w-full rounded-none bg-forest py-5 text-card shadow-none hover:bg-rust">Tell Us Your Plans</Button>
          </nav>
        )}
      </header>
      {notice && <PlansNotice onClose={() => setNotice(false)} />}
    </>
  );
}

function PlansNotice({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="notice-title" className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/60 p-4 backdrop-blur-sm animate-in fade-in sm:items-center" onClick={onClose}>
      <div className="w-full max-w-md bg-background p-8 text-center md:p-12" onClick={(e) => e.stopPropagation()}>
        <p className="eyebrow text-rust">Almost there</p>
        <h3 id="notice-title" className="display mt-4 text-4xl">Hold that thought.</h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Personalized responses will open here soon. Each invitation is personal, and we'll share a link when it's ready.</p>
        <Button autoFocus onClick={onClose} className="btn-label mt-8 h-auto w-full rounded-none bg-forest py-4 text-ivory shadow-none hover:bg-rust">Sounds good</Button>
      </div>
    </div>
  );
}