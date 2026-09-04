import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">The house</p>
      <h1 className="mt-2 font-display text-5xl">Blue Love</h1>
      <p className="mt-6 font-display text-2xl leading-snug">
        Born from a single, unshakeable truth. Love is the most powerful force in the
        Universe.
      </p>
      <p className="mt-6 text-sm leading-relaxed text-muted">
        We are here to guide you to find Love within the depths of your soul, share it
        with intention, and purify your heart so you are Unconditional Love. Fully.
        Fearlessly. Forever. Eternity is the Now.
      </p>
      <p className="mt-6 text-sm leading-relaxed text-muted">
        The store is not a costume. Supplements that sell because they work and reorder.
        Ritual objects sourced without theft. Apparel that does not shout. A companion
        that asks you to sit. A circle that spends 3% of every dollar on someone who
        cannot. Distributed by Blue Love, LLC — Miami.
      </p>
      <img src="/images/hero.jpg" alt="" className="mt-10 rounded-xl" />
      <div className="mt-10 flex gap-3">
        <Button asChild>
          <Link to="/membership">Sit with us</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/contact">Write the house</Link>
        </Button>
      </div>
    </main>
  );
}
