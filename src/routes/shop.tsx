import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop")({ component: Shop });

function Shop() {
  const [cat, setCat] = useState<Category | "all" | "stock">("stock");
  const list =
    cat === "stock"
      ? PRODUCTS.filter((p) => p.onHand > 0)
      : cat === "all"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === cat);

  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-xs uppercase tracking-[0.2em] text-accent">Find Love</p>
      <h1 className="mt-2 text-5xl font-extrabold">The collection</h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Bottles you can take home now. Ritual, stones, and apparel land next.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCat("stock")}
          className={cn(
            "h-10 rounded-full border px-4 text-xs uppercase tracking-[0.14em]",
            cat === "stock" ? "border-accent bg-accent text-accent-fg" : "border-line",
          )}
        >
          In stock
        </button>
        <button
          type="button"
          onClick={() => setCat("all")}
          className={cn(
            "h-10 rounded-full border px-4 text-xs uppercase tracking-[0.14em]",
            cat === "all" ? "border-accent bg-accent text-accent-fg" : "border-line",
          )}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            className={cn(
              "h-10 rounded-full border px-4 text-xs uppercase tracking-[0.14em]",
              cat === c.id ? "border-accent bg-accent text-accent-fg" : "border-line",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted">{list.length} offerings</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </main>
  );
}
