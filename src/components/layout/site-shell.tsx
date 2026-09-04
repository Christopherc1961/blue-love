import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useCartCount } from "@/lib/cart";
import { img } from "@/lib/assets";

const NAV = [
  { to: "/find", label: "Find Love" },
  { to: "/share", label: "Share Love" },
  { to: "/practice", label: "Be Love" },
  { to: "/shop", label: "Shop" },
  { to: "/membership", label: "Membership" },
];

const SOCIALS = [
  { href: "https://x.com/bebluelove", label: "X" },
  { href: "https://instagram.com/bebluelove", label: "Instagram" },
  { href: "https://facebook.com/bebluelove", label: "Facebook" },
  { href: "https://www.tiktok.com/@bebluelove", label: "TikTok" },
];

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="size-8 animate-pulse rounded-full bg-navy-2" />;
  }
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link to="/account" className="hidden text-xs uppercase tracking-[0.14em] sm:inline">
          Account
        </Link>
        <UserButton />
      </div>
    );
  }
  return (
    <Link
      to="/login"
      className="text-xs uppercase tracking-[0.16em] text-ink/80 hover:text-accent"
    >
      Sign in
    </Link>
  );
}

function Mark({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)}>
      <img src={img("/images/infinity.jpg")} alt="" className="size-9 rounded-full object-cover infinity-glow" />
      <span className="text-lg font-extrabold tracking-[0.18em]">BLUE LOVE</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const count = useCartCount();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-navy-line/80 bg-navy/90 text-ink backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Mark />
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "text-xs uppercase tracking-[0.16em] text-ink/70 hover:text-accent",
                path === n.to && "text-accent",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative inline-flex size-11 items-center justify-center">
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-fg">
                {count}
              </span>
            )}
          </Link>
          <div className="hidden sm:block">
            <AuthSlot />
          </div>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-navy-line px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 text-sm">
                {n.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="py-2 text-sm">
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-navy-line bg-navy text-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={img("/images/infinity.jpg")} alt="" className="h-16 w-16 rounded-full object-cover" />
          <p className="mt-4 text-2xl font-extrabold tracking-[0.18em]">BLUE LOVE</p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-accent">
            Find Love · Share Love · Be Love
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            Distributed by Blue Love, LLC. The house circulates product, practice, and
            money in one loop. Love is the Answer.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">The house</p>
          <ul className="mt-4 space-y-2 text-sm text-ink/80">
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/newsletter">Monthly Love Letter</Link>
            </li>
            <li>
              <Link to="/sites">Seven sanctuaries</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Socials</p>
          <ul className="mt-4 space-y-2 text-sm text-ink/80">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-line px-4 py-6 text-center text-xs tracking-[0.14em] text-muted">
        LOVE IS THE ANSWER · ETERNITY IS THE NOW · © {new Date().getFullYear()} BLUE LOVE, LLC
      </div>
    </footer>
  );
}

export function Marquee() {
  const phrase =
    "LOVE IS THE ANSWER  ·  FIND LOVE  ·  SHARE LOVE  ·  BE LOVE  ·  100% LOVE  ·  ETERNITY IS THE NOW  ·  ";
  return (
    <div className="overflow-hidden border-y border-navy-line bg-navy py-2 text-[11px] uppercase tracking-[0.22em] text-accent/80">
      <div className="marquee-track flex w-max">
        <span className="px-4">{phrase.repeat(2)}</span>
        <span className="px-4">{phrase.repeat(2)}</span>
      </div>
    </div>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const companion = path.startsWith("/practice") || path.startsWith("/sites");
  return (
    <div className="min-h-dvh bg-bg text-ink">
      <SiteHeader />
      <Marquee />
      <div>{children}</div>
      <SiteFooter />
      {companion && (
        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-navy-line bg-navy/95 pb-[env(safe-area-inset-bottom)] md:hidden">
          {[
            { to: "/practice", label: "Today" },
            { to: "/sites", label: "Sites" },
            { to: "/share", label: "Circle" },
            { to: "/shop", label: "Shop" },
          ].map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="flex h-14 items-center justify-center text-[11px] uppercase tracking-[0.14em] text-ink/80"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
