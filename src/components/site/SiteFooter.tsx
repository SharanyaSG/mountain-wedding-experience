import { Link, useLocation } from "@tanstack/react-router";
import { navigationItems, plansDestination } from "./navigation-content";

/*
 * Footer links are separated by small dots. Each link carries a dot on the side its line starts from
 * (left on phones, where the list is left-aligned; right from md up, where it is right-aligned), and the
 * list is pulled out by one dot's width and clipped, so a wrapped line never starts or ends with a dot.
 */
const dot =
  "flex items-center before:mx-2.5 before:size-1 before:shrink-0 before:rounded-full before:bg-gold before:content-[''] " +
  "md:before:hidden md:after:mx-2.5 md:after:block md:after:size-1 md:after:shrink-0 md:after:rounded-full md:after:bg-gold md:after:content-['']";

export function SiteFooter() {
  const { pathname } = useLocation();
  return (
    <footer className="site-footer section-divider bg-background text-foreground">
      <div className="section-shell">
        <p className="display text-[11vw] leading-none md:text-[6.5rem]">Gowda <span className="text-gold">×</span> Malhotra</p>
        <div className="mt-6 grid gap-5 border-t border-border pt-5 md:mt-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-10">
          <div className="space-y-2">
            <p className="eyebrow text-muted-foreground">October 7 – 9, 2027</p>
            <p className="eyebrow text-muted-foreground">Loon Mountain, New Hampshire</p>
          </div>
          <nav aria-label="Footer" className="min-w-0 overflow-hidden py-1">
            <ul className="-ml-6 flex flex-wrap gap-y-3 md:-mr-6 md:ml-0 md:justify-end">
              {[...navigationItems, { label: "Tell Us Your Plans", to: plansDestination }].map(item => (
                <li key={item.to} className={dot}>
                  <Link to={item.to} aria-current={pathname === item.to ? "page" : undefined} className={`eyebrow underline-offset-4 hover:text-rust ${pathname === item.to ? "text-rust underline" : ""}`}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-1 font-hand text-4xl leading-[0.85] text-footer-crimson">See you at the top.</p>
      </div>
    </footer>
  );
}
