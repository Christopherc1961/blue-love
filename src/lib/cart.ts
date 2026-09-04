import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import { CIRCULATION_RATE, getProduct, unitCents, type Product } from "./catalog";

export type CartLine = {
  slug: string;
  qty: number;
  subscribe: boolean;
};

type CartState = {
  lines: CartLine[];
  add: (slug: string, qty?: number, subscribe?: boolean) => void;
  setQty: (slug: string, qty: number) => void;
  toggleSub: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (slug, qty = 1, subscribe = false) => {
        const p = getProduct(slug);
        if (!p || p.onHand <= 0) return;
        const lines = [...get().lines];
        const i = lines.findIndex((l) => l.slug === slug && l.subscribe === subscribe);
        const nextQty = i >= 0 ? lines[i].qty + qty : qty;
        const capped = Math.min(nextQty, p.onHand);
        if (i >= 0) lines[i] = { ...lines[i], qty: capped };
        else lines.push({ slug, qty: capped, subscribe });
        set({ lines });
      },
      setQty: (slug, qty) =>
        set({
          lines: get()
            .lines.map((l) => {
              if (l.slug !== slug) return l;
              const p = getProduct(slug);
              const max = p?.onHand ?? qty;
              return { ...l, qty: Math.min(qty, max) };
            })
            .filter((l) => l.qty > 0),
        }),
      toggleSub: (slug) =>
        set({
          lines: get().lines.map((l) =>
            l.slug === slug ? { ...l, subscribe: !l.subscribe } : l,
          ),
        }),
      remove: (slug) => set({ lines: get().lines.filter((l) => l.slug !== slug) }),
      clear: () => set({ lines: [] }),
    }),
    { name: "bluelove-cart" },
  ),
);

export function cartCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.qty, 0);
}

export function useCartCount() {
  const lines = useCart((s) => s.lines);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready ? cartCount(lines) : 0;
}

export function lineUnit(p: Product, line: CartLine, opts: { firstOrder?: boolean; tier?: string | null }) {
  return unitCents(p, { subscribe: line.subscribe, firstOrder: opts.firstOrder, tier: opts.tier });
}

export function cartTotals(
  lines: CartLine[],
  opts: { firstOrder?: boolean; tier?: string | null } = {},
) {
  const subtotal = lines.reduce((n, l) => {
    const p = getProduct(l.slug);
    if (!p) return n;
    return n + lineUnit(p, l, opts) * l.qty;
  }, 0);
  const list = lines.reduce((n, l) => {
    const p = getProduct(l.slug);
    if (!p) return n;
    return n + p.priceCents * l.qty;
  }, 0);
  const circulation = Math.round(subtotal * CIRCULATION_RATE);
  return { subtotal, list, saved: list - subtotal, circulation, total: subtotal };
}
