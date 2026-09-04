import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/newsletter")({ component: Newsletter });

function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">Monthly</p>
      <h1 className="mt-2 font-display text-5xl">The Love Letter</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Once a month. Practice, what is new in the collection, one honest paragraph,
        no daily drip. The daily sitting lives in the companion. This is the letter.
      </p>
      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          localStorage.setItem("bluelove-letter", email);
          toast.success("You are on the letter.");
          setEmail("");
        }}
      >
        <Input
          type="email"
          required
          placeholder="you@domain"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit">Subscribe</Button>
      </form>
    </main>
  );
}
