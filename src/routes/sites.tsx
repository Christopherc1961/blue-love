import { createFileRoute } from "@tanstack/react-router";
import { mercator, SACRED_SITES } from "@/lib/sites";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sites")({ component: Sites });

function Sites() {
  const [id, setId] = useState(SACRED_SITES[0].id);
  const active = SACRED_SITES.find((s) => s.id === id) ?? SACRED_SITES[0];

  return (
    <main className="bg-navy pb-24 text-ivory">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-xs uppercase tracking-[0.22em] text-ivory/50">Be Love · Geography</p>
        <h1 className="mt-2 font-display text-5xl">Seven sanctuaries</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory/70">
          Real holy ground. Not a fantasy map. The companion carries the pins so a
          seeker can stand in the right dust with the right breath. Travel is optional.
          Attention is not.
        </p>

        <div className="relative mt-10 overflow-hidden rounded-xl border border-navy-line">
          <img src="/images/map.jpg" alt="World of the seven" className="h-[52vh] w-full object-cover" />
          {SACRED_SITES.map((s) => {
            const { x, y } = mercator(s.lat, s.lng);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setId(s.id)}
                style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
                className={cn(
                  "absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ivory",
                  s.id === id ? "bg-accent" : "bg-ivory/70",
                )}
                aria-label={s.name}
              />
            );
          })}
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
          <ol className="space-y-1">
            {SACRED_SITES.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setId(s.id)}
                  className={cn(
                    "w-full rounded-md px-3 py-2 text-left text-sm",
                    s.id === id ? "bg-navy-2" : "hover:bg-navy-2/50",
                  )}
                >
                  <span className="text-ivory/40">{String(i + 1).padStart(2, "0")} </span>
                  {s.place}
                </button>
              </li>
            ))}
          </ol>
          <article>
            <img
              src="/images/sedona.jpg"
              alt=""
              className="h-56 w-full rounded-xl object-cover"
            />
            <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-ivory/50">
              {active.frequency}
            </p>
            <h2 className="mt-2 font-display text-4xl">{active.name}</h2>
            <p className="text-sm text-ivory/60">{active.place}</p>
            <p className="mt-4 text-sm leading-relaxed text-ivory/80">{active.why}</p>
            <p className="mt-4 font-display text-2xl leading-snug">{active.practice}</p>
          </article>
        </div>
      </div>
    </main>
  );
}
