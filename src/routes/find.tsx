import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/find")({ component: Find });

function Find() {
  const picks = PRODUCTS.filter((p) => p.onHand > 0).slice(0, 6);
  return (
    <main>
      <section className="relative bg-navy text-ivory">
        <img src="/images/hero.jpg" alt="" className="h-[48vh] w-full object-cover opacity-50" />
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-xs uppercase tracking-[0.22em] text-ivory/60">Find Love</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">The seeking</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/75">
            Product, learning, experiences. You came looking for a bottle, a book, a
            place. Start there. Do not pretend the object is the love — it is a door.
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to="/shop"
            className="rounded-xl border border-line bg-navy-2 p-6"
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{c.pillar}</p>
            <h2 className="mt-2 font-display text-3xl">{c.label}</h2>
            <p className="mt-3 text-sm text-muted">{c.copy}</p>
          </Link>
        ))}
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl">First-order stack</h2>
          <Button asChild variant="outline">
            <Link to="/shop">All offerings</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
