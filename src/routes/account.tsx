import { createFileRoute, Link } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listOrders, listPractice, getMembership } from "@/lib/server/house";
import { useQuery } from "@tanstack/react-query";
import { money } from "@/lib/catalog";

export const Route = createFileRoute("/account")({ component: Account });

function Account() {
  const { user, isPending } = useCurrentUserState();
  const orders = useQuery({
    queryKey: ["orders"],
    queryFn: () => listOrders(),
    enabled: !!user,
  });
  const logs = useQuery({
    queryKey: ["practice"],
    queryFn: () => listPractice(),
    enabled: !!user,
  });
  const mem = useQuery({
    queryKey: ["membership"],
    queryFn: () => getMembership(),
    enabled: !!user,
  });

  if (isPending) return <main className="min-h-[40vh]" />;
  if (!user) return <RedirectToSignIn />;

  const orderRows = orders.data ?? [];
  const logRows = logs.data ?? [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-5xl">Your house key</h1>
      <p className="mt-2 text-sm text-muted">{user.primaryEmail ?? user.displayName}</p>
      <p className="mt-4 text-sm">
        Seat: {mem.data ? <span className="capitalize">{mem.data.tier}</span> : "none yet"} ·{" "}
        <Link to="/membership">change</Link>
      </p>
      <h2 className="mt-10 font-display text-3xl">Orders</h2>
      <ul className="mt-4 space-y-3">
        {orderRows.length === 0 && <li className="text-sm text-muted">None yet.</li>}
        {orderRows.map((o) => (
          <li key={o.id} className="rounded-lg border border-line bg-navy-2 p-4 text-sm">
            #{o.id} · {money(o.total_cents)} · {o.status}
          </li>
        ))}
      </ul>
      <h2 className="mt-10 font-display text-3xl">Practice log</h2>
      <ul className="mt-4 space-y-2 text-sm">
        {logRows.slice(0, 12).map((l) => (
          <li key={l.id}>
            {String(l.day).slice(0, 10)} · {l.kind} · {l.minutes}m
          </li>
        ))}
      </ul>
    </main>
  );
}
