import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const featured = PRODUCTS.filter((p) => p.bestseller && p.onHand > 0).slice(0, 8);

  return (
    <main>
      <section className="relative min-h-[92vh] overflow-hidden bg-navy text-ink">
        <img
          src="/images/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/hero.mp4"
          poster="/images/hero.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy via-navy/50 to-navy/10" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col items-center justify-end px-4 pb-20 pt-24 text-center">
          <p className="text-xs uppercase tracking-[0.42em] text-accent">
            Find Love · Share Love · Be Love
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-extrabold leading-[0.95] md:text-7xl">
            BLUE LOVE
          </h1>
          <p className="mt-4 text-lg font-medium text-ivory md:text-xl">Love is the Answer.</p>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-ivory/75">
            30% off your first order when you sign in. Find Love within. Share it
            with intention. Be unconditional love.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/shop">Begin your journey</Link>
            </Button>
            <Button asChild variant="navyGhost">
              <Link to="/practice">Today's sitting</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-20 md:grid-cols-3">
        {[
          {
            to: "/find" as const,
            kicker: "Find",
            title: "Love Within",
            copy: "The collection. Learning. The seven sanctuaries. The seeking is not shopping — shopping is one of the tools.",
          },
          {
            to: "/share" as const,
            kicker: "Share",
            title: "Love With Intention",
            copy: "The circle. The forum. X, Instagram, Facebook, TikTok. Money and attention that keep moving.",
          },
          {
            to: "/practice" as const,
            kicker: "Be",
            title: "Unconditional Love",
            copy: "Thirty days of sitting. Breath. Food. Movement. Fast, lift, sprint, stretch, meditate. Then say no to everything else.",
          },
        ].map((c) => (
          <Link
            key={c.kicker}
            to={c.to}
            className="group rounded-xl border border-line bg-navy-2 p-6 transition-colors hover:border-accent"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-accent">{c.kicker}</p>
            <h2 className="mt-2 text-3xl font-extrabold">{c.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.copy}</p>
          </Link>
        ))}
      </section>

      <section className="bg-navy px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">The unshakeable truth</p>
          <p className="mt-6 text-3xl font-extrabold leading-snug md:text-4xl">
            Love is the most powerful force in the Universe. We guide you to find it
            in the depths of your soul, share it with intention, and purify the heart
            until you are unconditional love.
          </p>
          <p className="mt-6 text-xl italic text-muted">Eternity is the Now.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">The collection</p>
            <h2 className="mt-2 text-4xl font-extrabold">What we carry</h2>
          </div>
          <Button asChild variant="outline">
            <Link to="/shop">The collection</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-navy px-4 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Circulation</p>
            <h2 className="mt-2 text-4xl font-extrabold">Energy and money in one loop</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Three percent of every order is labeled for the Circle. Membership
              discounts are real at checkout — 10, 18, or 25 percent, whichever beats
              the first-order 30. Seats do not invent live rooms that do not exist.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/membership">Three memberships</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/newsletter">Monthly Love Letter</Link>
              </Button>
            </div>
          </div>
          <img
            src="/images/nmn.png"
            alt="Blue Love NMN"
            className="h-[420px] w-full rounded-xl object-cover object-center"
          />
        </div>
      </section>
    </main>
  );
}
