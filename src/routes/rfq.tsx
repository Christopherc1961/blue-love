import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS, SKIP_SUNDRY, type Product } from "@/lib/catalog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/rfq")({ component: Rfq });

function mid(p: Product) {
  return (p.cogsLow + p.cogsHigh) / 2;
}

function Table({ rows }: { rows: Product[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="text-[11px] uppercase tracking-[0.14em] text-muted">
          <tr>
            <th className="py-3">SKU</th>
            <th>Name</th>
            <th className="text-right">Buy</th>
            <th className="text-right">Retail</th>
            <th className="text-right">Mid COGS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.sku} className="border-t border-line">
              <td className="py-3 font-mono text-xs">{p.sku}</td>
              <td>
                {p.name}
                <span className="block text-[11px] text-muted">{p.notes.split(".")[0]}.</span>
              </td>
              <td className="text-right tabular-nums text-accent">{p.rfqUnits}</td>
              <td className="text-right tabular-nums">${(p.priceCents / 100).toFixed(0)}</td>
              <td className="text-right tabular-nums">${(mid(p) * p.rfqUnits).toFixed(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Rfq() {
  const bottles = PRODUCTS.filter((p) => p.category === "supplements");
  const sundry = PRODUCTS.filter((p) => p.category !== "supplements" && !p.digital);
  const digital = PRODUCTS.filter((p) => p.digital);
  const spend = bottles.reduce((n, p) => n + mid(p) * p.rfqUnits, 0);
  const sundrySpend = sundry.reduce((n, p) => n + mid(p) * p.rfqUnits, 0);
  const sundryUnits = sundry.reduce((n, p) => n + p.rfqUnits, 0);
  const units = bottles.reduce((n, p) => n + p.rfqUnits, 0);
  const ritual = sundry.filter((p) => p.category === "aromatics");
  const stones = sundry.filter((p) => p.category === "stones");
  const apparel = sundry.filter((p) => p.category === "apparel");
  const paper = sundry.filter((p) => p.category === "books-audio");

  function csv() {
    const header = [
      "SKU",
      "Name",
      "Buy units",
      "Category",
      "Phase",
      "Retail",
      "COGS low",
      "COGS high",
      "Ext. mid COGS",
      "Notes",
    ];
    const rows = PRODUCTS.map((p) =>
      [
        p.sku,
        p.name,
        p.digital ? "n/a" : p.rfqUnits,
        p.category,
        p.phase,
        (p.priceCents / 100).toFixed(2),
        p.cogsLow.toFixed(2),
        p.cogsHigh.toFixed(2),
        p.digital ? p.cogsHigh.toFixed(0) : (mid(p) * p.rfqUnits).toFixed(2),
        p.notes.replaceAll(",", ";"),
      ].join(","),
    );
    const blob = new Blob([[header.join(","), ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "blue-love-buy-list.csv";
    a.click();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-xs uppercase tracking-[0.2em] text-accent">Trade</p>
      <h1 className="mt-2 text-5xl font-extrabold">Buy list</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
        Two checks. First: bottles. Second: sundry — incense, smoke, one candle, five
        stones, three jewels, tee/cap/tote, house paper. Bid the COGS. These are
        ranges, not vendor quotes.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-navy-2 p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Bottles mid COGS</p>
          <p className="mt-2 text-4xl font-extrabold tabular-nums">
            ${spend.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </p>
          <p className="mt-1 text-xs text-muted">{units} units</p>
        </div>
        <div className="rounded-xl border border-line bg-navy-2 p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Sundry mid COGS</p>
          <p className="mt-2 text-4xl font-extrabold tabular-nums">
            ${sundrySpend.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </p>
          <p className="mt-1 text-xs text-muted">{sundryUnits} units</p>
        </div>
      </div>
      <div className="mt-6">
        <Button type="button" onClick={csv}>
          Download CSV
        </Button>
      </div>

      <h2 className="mt-16 text-3xl font-extrabold">What actually moves</h2>
      <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-muted">
        <p>
          Sundry in this aisle is a gift-and-AOV machine, not a second supplement
          line. Metaphysical wholesalers going into 2026 still rank incense, candles,
          and a short crystal list as the turns. Health and wellbeing converts around
          4%; apparel converts around 3% and eats cash in leftover XL. Jewelry AOV is
          higher and conversion is lower. Paper you own (a journal, a deck) beats
          paper Amazon already owns (Tolle, Singer, Coelho).
        </p>
        <p>
          Cut the first sundry check for incense, the smudge kit, one candle, matches,
          the five-stone starter, the rose quartz heart, the cap, the tote, and the
          30-day deck. Necklace, mala, tee, journal are tests. Hoodie waits. Singing
          bowls, wild sage, and a crystal mall are a no.
        </p>
      </div>

      <h2 className="mt-14 text-3xl font-extrabold">Bottles</h2>
      <Table rows={bottles} />

      <h2 className="mt-14 text-3xl font-extrabold">Ritual — smoke, wax, mist</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Incense is the highest-turn SKU because it is consumed. The kit is the gift:
        cultivated sage, deadfall palo santo or copal, dish, matches, one rose quartz.
      </p>
      <Table rows={ritual} />

      <h2 className="mt-14 text-3xl font-extrabold">Stones & jewelry</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Five stones. Three jewels. Not a crystal mall. Gold-fill or sterling — not
        costume plate.
      </p>
      <Table rows={stones} />

      <h2 className="mt-14 text-3xl font-extrabold">Apparel</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Cap and tote first. Tee at 96. Hoodie after the tee proves size mix.
      </p>
      <Table rows={apparel} />

      <h2 className="mt-14 text-3xl font-extrabold">Paper you own</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        House journal and the 30-day deck. Do not resell books Amazon already owns.
      </p>
      <Table rows={paper} />

      <h2 className="mt-14 text-3xl font-extrabold">Do not buy</h2>
      <ul className="mt-4 space-y-3">
        {SKIP_SUNDRY.map((s) => (
          <li key={s.name} className="rounded-xl border border-line bg-navy-2 p-4">
            <p className="font-bold">{s.name}</p>
            <p className="mt-1 text-sm text-muted">{s.reason}</p>
          </li>
        ))}
      </ul>

      {digital.length > 0 && (
        <p className="mt-10 text-xs text-muted">
          Digital production (not a PO):{" "}
          {digital.map((d) => `${d.name} ~$${d.cogsHigh.toFixed(0)}`).join(" · ")}
        </p>
      )}
    </main>
  );
}
