import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProduct, inStock, money, PRODUCTS } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/product/$slug")({
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug);
  const add = useCart((s) => s.add);
  if (!product) throw notFound();
  const live = inStock(product);
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug && p.onHand > 0,
  ).slice(0, 3);

  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">
        <Link to="/shop">Shop</Link> / {product.category}
      </p>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-line bg-navy">
          <img src={product.image} alt={product.name} className="aspect-3/4 w-full object-cover" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-accent">
            {live ? "In stock" : "Coming soon"}
          </p>
          <h1 className="mt-3 text-5xl font-extrabold">{product.name}</h1>
          <p className="mt-3 text-lg tabular-nums text-accent">{money(product.priceCents)}</p>
          <p className="mt-2 text-sm text-muted">
            {product.size}
            {product.dose ? ` · ${product.dose}` : ""}
          </p>
          <p className="mt-6 text-sm leading-relaxed text-muted">{product.description}</p>
          {product.benefits.length > 0 && (
            <ul className="mt-6 space-y-2 text-sm text-ink/85">
              {product.benefits.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-muted">
            These statements have not been evaluated by the Food and Drug Administration.
            This product is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              type="button"
              disabled={!live}
              onClick={() => {
                add(product.slug);
                toast.success("In the basket");
              }}
            >
              {live ? "Add to basket" : "Not in stock"}
            </Button>
            {product.subscribeEligible && live && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  add(product.slug, 1, true);
                  toast.success("Subscribe & save 15%");
                }}
              >
                Subscribe · 15% less
              </Button>
            )}
          </div>
          <p className="mt-6 text-xs text-muted">
            SKU {product.sku} · 3% of this order is labeled for the Circle · 30% off first
            order when you sign in
          </p>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-3xl font-extrabold">Alongside</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
