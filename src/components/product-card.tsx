import { Link } from "@tanstack/react-router";
import { inStock, money, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { img } from "@/lib/assets";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const live = inStock(product);
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-navy-2">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block overflow-hidden bg-navy">
        <img
          src={img(product.image)}
          alt={product.name}
          className="aspect-3/4 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <Link to="/product/$slug" params={{ slug: product.slug }}>
            <h3 className="text-lg font-extrabold leading-snug">{product.name}</h3>
          </Link>
          <p className="tabular-nums text-sm text-accent">{money(product.priceCents)}</p>
        </div>
        <p className="line-clamp-2 flex-1 text-sm text-muted">{product.blurb}</p>
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
          {live ? "In stock" : "Coming soon"}
        </p>
        <Button
          type="button"
          size="sm"
          disabled={!live}
          onClick={() => {
            add(product.slug);
            toast.success("Added to the basket");
          }}
        >
          {live ? "Add" : "Not in stock"}
        </Button>
      </div>
    </article>
  );
}
