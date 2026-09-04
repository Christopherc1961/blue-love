import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MOVEMENT, NOURISHMENT } from "@/lib/practice-content";
import { LIBRARY, libraryToday } from "@/lib/library";
import { logPractice, listPractice } from "@/lib/server/house";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/practice")({ component: Practice });

const NAVAL = [
  "Fast, lift, sprint, stretch, and meditate.",
  "Build, sell, write, create, invest, and own.",
  "Read, reflect, love, seek truth, and ignore society.",
  "Make these habits. Say no to everything else.",
  "Avoid debt, jail, addiction, disgrace, shortcuts, and media.",
  "Relax. Victory is assured.",
];

function Practice() {
  const today = libraryToday();
  const weekday = new Date().getDay();
  const { user, isPending } = useCurrentUserState();
  const qc = useQueryClient();
  const logs = useQuery({
    queryKey: ["practice"],
    queryFn: () => listPractice(),
    enabled: !!user,
  });
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [phase, setPhase] = useState("Inhale");
  const total = today.minutes * 60;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    const cycle = 4 + 4 + 6 + 2;
    const t = seconds % cycle;
    if (t < 4) setPhase("Inhale");
    else if (t < 8) setPhase("Hold");
    else if (t < 14) setPhase("Exhale");
    else setPhase("Rest");
  }, [seconds]);

  const remaining = Math.max(0, total - seconds);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const doneToday = useMemo(() => {
    const d = new Date().toISOString().slice(0, 10);
    return new Set(
      (logs.data ?? []).filter((l) => String(l.day).slice(0, 10) === d).map((l) => l.kind),
    );
  }, [logs.data]);

  const save = useMutation({
    mutationFn: (kind: string) =>
      logPractice({ data: { kind, minutes: kind === "meditation" ? today.minutes : 10 } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["practice"] }),
    onError: () => toast.error("Sign in to keep a streak across devices"),
  });

  async function enableNotices() {
    if (!("Notification" in window)) {
      toast.error("This browser will not permit notices");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      localStorage.setItem("bluelove-notices", "1");
      toast.success("Dawn notices armed. Keep this tab in the house.");
      window.setTimeout(() => {
        new Notification("Blue Love", { body: `Day ${today.day}: ${today.title} is waiting.` });
      }, 4000);
    }
  }

  return (
    <main className="bg-bg pb-24 text-ink">
      <div className="mx-auto max-w-3xl px-4 py-14">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">Be Love · Companion</p>
        <h1 className="mt-2 text-5xl font-extrabold">Foundation Series</h1>
        <p className="mt-3 text-sm text-muted">
          Day {today.day} of 30. {today.theme}. Fast, lift, sprint, stretch, and meditate.
        </p>

        <div className="mt-10 grid place-items-center rounded-xl border border-line bg-navy px-6 py-12">
          <div className="breath-orb size-40 rounded-full ring-1 ring-accent/30" />
          <p className="mt-8 text-center text-3xl font-extrabold md:text-4xl">{today.title}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-accent">{phase}</p>
          <p className="mt-4 text-5xl font-extrabold tabular-nums">
            {mm}:{ss}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              type="button"
              onClick={() => {
                setRunning((v) => !v);
                if (!running) setSeconds(0);
              }}
            >
              {running ? "Pause" : "Sit"}
            </Button>
            <Button
              variant="navyGhost"
              type="button"
              onClick={() => {
                setRunning(false);
                if (user) save.mutate("meditation");
                toast.success("Logged. The streak is a spine, not a trophy.");
              }}
            >
              Complete
            </Button>
            <Button variant="navyGhost" type="button" onClick={enableNotices}>
              <Bell className="size-4" />
              Dawn notice
            </Button>
          </div>
        </div>

        <p className="mt-10 text-center text-lg font-semibold text-accent">
          {NAVAL[weekday % NAVAL.length]}
        </p>

        <section className="mt-10 space-y-5 text-sm leading-relaxed text-ink/85">
          {today.meditation.split("\n\n").map((para) => (
            <p key={para.slice(0, 40)}>{para}</p>
          ))}
        </section>

        <blockquote className="mt-8 border-l-2 border-accent pl-4 text-lg font-semibold">
          {today.affirmation}
        </blockquote>
        <p className="mt-4 text-sm text-muted">
          <span className="uppercase tracking-[0.16em] text-accent">Journal · </span>
          {today.prompt}
        </p>

        <section className="mt-14 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-line p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Nourish</p>
            <p className="mt-3 text-sm leading-relaxed">{NOURISHMENT[weekday]}</p>
            <Button
              className="mt-4"
              size="sm"
              variant="navyGhost"
              type="button"
              onClick={() => (user ? save.mutate("nourish") : toast.error("Sign in to log"))}
            >
              {doneToday.has("nourish") ? "Done" : "Mark done"}
            </Button>
          </div>
          <div className="rounded-xl border border-line p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Move</p>
            <p className="mt-3 text-sm leading-relaxed">{MOVEMENT[weekday]}</p>
            <Button
              className="mt-4"
              size="sm"
              variant="navyGhost"
              type="button"
              onClick={() => (user ? save.mutate("move") : toast.error("Sign in to log"))}
            >
              {doneToday.has("move") ? "Done" : "Mark done"}
            </Button>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">Thirty days</h2>
            <Link to="/sites" className="text-xs uppercase tracking-[0.16em] text-muted">
              Map the seven
            </Link>
          </div>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {LIBRARY.map((m) => (
              <div
                key={m.day}
                className={
                  m.day === today.day
                    ? "rounded-lg border border-accent bg-navy-2 p-4"
                    : "rounded-lg border border-line p-4"
                }
              >
                <p className="text-[11px] uppercase tracking-[0.14em] text-accent">Day {m.day}</p>
                <p className="mt-1 font-bold">{m.title}</p>
                <p className="text-xs text-muted">
                  {m.theme} · {m.minutes} min
                </p>
              </div>
            ))}
          </div>
        </section>

        {!isPending && !user && (
          <p className="mt-10 text-center text-sm text-muted">
            <Link to="/login" className="text-accent underline">
              Sign in
            </Link>{" "}
            so the streak follows you.
          </p>
        )}
      </div>
    </main>
  );
}
