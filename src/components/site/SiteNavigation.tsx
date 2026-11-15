import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationItems, plansDestination } from "./navigation-content";
export { navigationItems, plansDestination } from "./navigation-content";

export function SiteNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => { setOpen(false); }, [location.href]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); toggleRef.current?.focus(); }
      if (e.key !== "Tab") return;
      const controls = [toggleRef.current, ...Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [])].filter((el): el is HTMLButtonElement | HTMLAnchorElement => el !== null);
      const first = controls[0], last = controls.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    const resize = () => { if (window.innerWidth >= 1200) setOpen(false); };
    window.addEventListener("keydown", onKey); window.addEventListener("resize", resize);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); window.removeEventListener("resize", resize); };
  }, [open]);
  const active = (to: string) => location.pathname === to;
  return (
    <header className={`fixed inset-x-0 top-0 z-40 text-foreground transition-colors duration-500 ${scrolled || open || location.pathname !== "/" ? "border-b border-border bg-background/90 backdrop-blur-md" : ""}`}>
      <div className="relative z-10 mx-auto grid h-16 max-w-[1680px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 md:h-20 min-[1200px]:flex min-[1200px]:justify-between min-[1200px]:gap-2">
        <Link to="/" onClick={() => setOpen(false)} className="shrink-0 font-serif text-lg tracking-[0.18em]">G <span className="text-gold">×</span> M</Link>
        <nav aria-label="Primary" className="hidden items-center gap-3 min-[1200px]:flex min-[1440px]:gap-4">
          {navigationItems.map(item => <Link key={item.to} to={item.to} aria-current={active(item.to) ? "page" : undefined} className={`whitespace-nowrap border-b-2 pb-1 font-display text-[15px] font-normal tracking-normal transition-colors hover:text-rust ${active(item.to) ? "border-rust text-rust" : "border-transparent text-foreground"}`}>{item.label === "FAQs" ? "FAQs" : item.label.toUpperCase()}</Link>)}
          <Link to={plansDestination} aria-current={active(plansDestination) ? "page" : undefined} className="h-auto whitespace-nowrap rounded-none border border-forest bg-forest px-4 py-2.5 font-display text-[16px] font-bold tracking-normal text-card uppercase leading-[1.3] shadow-none transition-colors hover:border-rust hover:bg-rust min-[1440px]:px-5 min-[1440px]:py-3">Tell Us Your Plans</Link>
        </nav>
        <Button ref={toggleRef} variant="ghost" onClick={() => setOpen(value => !value)} aria-label={open ? "Close menu" : "Menu"} aria-expanded={open} aria-controls="mobile-menu" className="eyebrow h-auto shrink-0 rounded-none p-2 text-foreground hover:bg-transparent hover:text-rust min-[1200px]:hidden">{open ? <>Close <X className="ml-2 h-4 w-4" /></> : <>Menu <Menu className="ml-2 h-4 w-4" /></>}</Button>
      </div>
      {open && <nav ref={panelRef} id="mobile-menu" aria-label="Mobile" className="fixed inset-0 overflow-y-auto bg-background px-6 pb-10 pt-24 md:pt-28 min-[1200px]:hidden">
        {navigationItems.map(item => <Link key={item.to} to={item.to} onClick={() => setOpen(false)} aria-current={active(item.to) ? "page" : undefined} className={`block border-t border-border py-3 font-display text-xl font-medium md:text-3xl ${active(item.to) ? "text-rust" : "text-foreground"}`}>{item.label === "FAQs" ? "FAQs" : item.label.toUpperCase()}</Link>)}
        <Link to={plansDestination} onClick={() => setOpen(false)} aria-current={active(plansDestination) ? "page" : undefined} className="btn-label mt-6 block h-auto w-full rounded-none bg-forest py-5 text-center text-card shadow-none transition-colors hover:bg-rust">Tell Us Your Plans</Link>
      </nav>}
    </header>
  );
}
