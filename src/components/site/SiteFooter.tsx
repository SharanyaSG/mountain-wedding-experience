import { Link, useLocation } from "@tanstack/react-router";
import { navigationItems, plansDestination } from "./navigation-content";

export function SiteFooter() {
  const { pathname } = useLocation();
  return (
    <footer className="section-divider bg-background text-foreground">
      <div className="section-shell">
        <p className="display text-[11vw] leading-none md:text-[6.5rem]">Gowda <span className="text-gold">×</span> Malhotra</p>
        <div className="mt-16 grid gap-10 border-t border-border pt-10 md:grid-cols-3">
          <div className="space-y-2">
            <p className="eyebrow text-muted-foreground">October 8, 2027</p>
            <p className="eyebrow text-muted-foreground">Loon Mountain, New Hampshire</p>
          </div>
          <nav aria-label="Footer" className="flex min-w-0 flex-wrap gap-x-6 gap-y-3">
            {[...navigationItems, { label: "Tell Us Your Plans", to: plansDestination }].map(item => (
              <Link key={item.to} to={item.to} aria-current={pathname === item.to ? "page" : undefined} className={`eyebrow underline-offset-4 hover:text-rust ${pathname === item.to ? "text-rust underline" : ""}`}>{item.label}</Link>
            ))}
          </nav>
          <p className="eyebrow text-muted-foreground md:text-right">Contact details · coming soon</p>
        </div>
        <p className="mt-16 font-hand text-4xl text-footer-crimson">See you at the top.</p>
      </div>
    </footer>
  );
}
