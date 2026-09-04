import { createFileRoute, Link } from "@tanstack/react-router";
import { cartTotals, useCart } from "@/lib/cart";
import { FIRST_ORDER_RATE, getProduct, money } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { getMembership, listOrders, placeOrder } from "@/lib/server/house";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { img } from "@/lib/assets";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({ component: Cart });

function Cart() {
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const { user, isPending } = useCurrentUserState();
  const [checkingOut, setCheckingOut] = useState(false);
  const [needAuth, setNeedAuth] = useState(false);

  const mem = useQuery({
    queryKey: ["membership"],
    queryFn: () => getMembership(),
    enabled: !!user,
  });
  const orders = useQuery({
    queryKey: ["orders"],
    queryFn: () => listOrders(),
    enabled: !!user,
  });

  const firstOrder = !!user && (orders.data?.length ?? 0) === 0 && !orders.isPending;
  const tier = mem.data?.tier ?? null;
  const { subtotal, list, saved, circulation } = cartTotals(lines, { firstOrder, tier });

  async function checkout() {
    if (isPending) return;
    if (!user) {
      setNeedAuth(true);
      return;
    }
    if (!lines.length) return;
    setCheckingOut(true);
    try {
      const items = lines
        .map((l) => {
          const p = getProduct(l.slug);
          if (!p) return null;
          const unit = cartTotals([{ ...l, qty: 1 }], { firstOrder, tier }).subtotal;
          return { slug: l.slug, name: p.name, qty: l.qty, unitCents: unit, subscribe: l.subscribe };
        })
        .filter(Boolean) as {
        slug: string;
        name: string;
        qty: number;
        unitCents: number;
        subscribe: boolean;
      }[];
      await placeOrder({ data: { items, totalCents: subtotal } });
      clear();
      toast.success("Received. 3% already belongs to the Circle.");
    } catch {
      toast.error("The order did not land. Sign in again and retry.");
    } finally {
      setCheckingOut(false);
    }
  }

  if (needAuth && !isPending && !user) return <RedirectToSignIn />;

  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-5xl font-extrabold">Basket</h1>
      {lines.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          Empty. <Link to="/shop">Find Love</Link>.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {lines.map((l) => {
            const p = getProduct(l.slug);
            if (!p) return null;
            return (
              <li key={l.slug + String(l.subscribe)} className="flex items-center gap-4 py-4">
                <img src={img(p.image)} alt="" className="size-20 rounded-md object-cover" />
                <div className="flex-1">
                  <p className="text-xl font-extrabold">{p.name}</p>
                  <p className="text-xs text-muted">
                    {l.subscribe ? "Subscribe · 15% less" : "One-time"} · {money(p.priceCents)}
                  </p>
                </div>
                <input
                  type="number"
                  min={1}
                  max={p.onHand}
                  value={l.qty}
                  onChange={(e) => setQty(l.slug, Number(e.target.value))}
                  className="h-10 w-16 rounded-md border border-line bg-navy-2 px-2 text-sm"
                />
                <button type="button" className="text-xs text-muted" onClick={() => remove(l.slug)}>
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {lines.length > 0 && (
        <div className="mt-8 space-y-2 text-sm">
          <div className="flex justify-between text-muted">
            <span>List</span>
            <span className="tabular-nums">{money(list)}</span>
          </div>
          {saved > 0 && (
            <div className="flex justify-between text-accent">
              <span>
                {firstOrder
                  ? `First order ${Math.round(FIRST_ORDER_RATE * 100)}%`
                  : tier
                    ? `${tier} membership`
                    : "Savings"}
              </span>
              <span className="tabular-nums">−{money(saved)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="tabular-nums">{money(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Labeled for the Circle (3%)</span>
            <span className="tabular-nums">{money(circulation)}</span>
          </div>
          {!user && (
            <p className="pt-2 text-xs text-accent">
              Sign in at checkout to take 30% off this first order.
            </p>
          )}
          <Button className="mt-6 w-full" type="button" onClick={checkout} disabled={checkingOut}>
            Place the order
          </Button>
          <p className="text-center text-xs text-muted">
            House order — no card is charged yet. Wire a processor when you are ready to take money.
          </p>
        </div>
      )}
    </main>
  );
}
