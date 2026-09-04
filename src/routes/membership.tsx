import { createFileRoute, Link } from "@tanstack/react-router";
import { MEMBERSHIPS } from "@/lib/memberships";
import { money } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { getMembership, setMembership } from "@/lib/server/house";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/membership")({ component: Membership });

function Membership() {
  const { user } = useCurrentUserState();
  const qc = useQueryClient();
  const mine = useQuery({
    queryKey: ["membership"],
    queryFn: () => getMembership(),
    enabled: !!user,
  });
  const join = useMutation({
    mutationFn: (tier: "seeker" | "circle" | "devotee") => setMembership({ data: { tier } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["membership"] });
      toast.success("You are inside. The discount is already on the house.");
    },
    onError: () => toast.error("Sign in to take a seat"),
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">Three seats</p>
      <h1 className="mt-2 font-display text-5xl">Membership</h1>
      <p className="mt-4 max-w-xl text-sm text-muted">
        Find, Share, Be — priced as a current, not a club. Cancel when the practice
        ends. Stay when it does not.
      </p>
      {mine.data && (
        <p className="mt-4 text-sm">
          Current seat: <strong className="capitalize">{mine.data.tier}</strong>
        </p>
      )}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {MEMBERSHIPS.map((t, i) => (
          <article
            key={t.id}
            className={
              i === 1
                ? "rounded-xl border border-navy bg-navy p-6 text-ivory"
                : "rounded-xl border border-line bg-navy-2 p-6"
            }
          >
            <p className="text-[11px] uppercase tracking-[0.18em] opacity-60">{t.path}</p>
            <h2 className="mt-2 font-display text-4xl">{t.name}</h2>
            <p className="mt-2 font-display text-3xl tabular-nums">
              {money(t.priceCents)}
              <span className="text-base opacity-60"> / mo</span>
            </p>
            <p className="text-xs opacity-60">{money(t.annualCents)} if you pay the year</p>
            <p className="mt-4 text-sm leading-relaxed opacity-80">{t.promise}</p>
            <ul className="mt-6 space-y-2 text-sm opacity-80">
              {t.perks.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <Button
              className="mt-8 w-full"
              variant={i === 1 ? "ivory" : "default"}
              type="button"
              onClick={() => {
                if (!user) {
                  toast.error("Sign in first");
                  return;
                }
                join.mutate(t.id);
              }}
            >
              Take this seat
            </Button>
          </article>
        ))}
      </div>
      <p className="mt-10 text-center text-xs text-muted">
        Prefer the monthly Love Letter only? <Link to="/newsletter">Subscribe free</Link>.
      </p>
    </main>
  );
}
