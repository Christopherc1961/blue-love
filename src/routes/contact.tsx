import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({ component: Contact });

function Contact() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-5xl">Contact</h1>
      <p className="mt-3 text-sm text-muted">
        Blue Love, LLC — Miami. Socials in this order: X, Instagram, Facebook, TikTok
        — @bebluelove.
      </p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Received. A human will answer.");
          (e.target as HTMLFormElement).reset();
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="n">Name</Label>
          <Input id="n" name="name" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e">Email</Label>
          <Input id="e" type="email" name="email" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="m">Message</Label>
          <Textarea id="m" name="message" required />
        </div>
        <Button type="submit">Send</Button>
      </form>
    </main>
  );
}
