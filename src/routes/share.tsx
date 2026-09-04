import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { listCircle, postCircle } from "@/lib/server/house";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/share")({ component: Share });

function Share() {
  const { user, isPending } = useCurrentUserState();
  const qc = useQueryClient();
  const posts = useQuery({ queryKey: ["circle"], queryFn: () => listCircle() });
  const [body, setBody] = useState("");
  const mutate = useMutation({
    mutationFn: () =>
      postCircle({
        data: { body, name: user?.displayName ?? user?.primaryEmail ?? "Member" },
      }),
    onSuccess: () => {
      setBody("");
      qc.invalidateQueries({ queryKey: ["circle"] });
    },
    onError: () => toast.error("Sign in to speak in the circle"),
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">Share Love</p>
      <h1 className="mt-2 font-display text-5xl">The circle</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Group, conversation, forum. Not a comment section under an ad. A room where
        practice is spoken out loud so it does not die in private.
      </p>
      <img src="/images/share.jpg" alt="" className="mt-8 h-64 w-full rounded-xl object-cover" />

      <form
        className="mt-10 rounded-xl border border-line bg-navy-2 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!user) {
            toast.error("Enter the house first");
            return;
          }
          mutate.mutate();
        }}
      >
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Give with intention. One true sentence is enough."
        />
        <div className="mt-3 flex items-center justify-between">
          {isPending ? (
            <span className="h-4 w-24 animate-pulse rounded bg-line" />
          ) : user ? (
            <span className="text-xs text-muted">Speaking as {user.displayName ?? "member"}</span>
          ) : (
            <Link to="/login" className="text-xs uppercase tracking-[0.14em] text-muted">
              Sign in to post
            </Link>
          )}
          <Button type="submit" size="sm" disabled={mutate.isPending || body.trim().length < 4}>
            Share
          </Button>
        </div>
      </form>

      {posts.isError && (
        <p className="mt-8 text-sm text-danger">The circle could not be reached. Refresh.</p>
      )}
      <ol className="mt-10 space-y-4">
        {(posts.data ?? []).map((p) => (
          <li key={p.id} className="rounded-lg border border-line bg-navy-2 p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
              {p.author_name} · {String(p.created_at).slice(0, 10)}
            </p>
            <p className="mt-2 text-sm leading-relaxed">{p.body}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
