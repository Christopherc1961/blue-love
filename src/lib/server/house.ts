import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

const SEED_POSTS: [string, string][] = [
  [
    "Blue Love Circle",
    "Love is the most powerful force in the Universe. This house is a place to find it, share it, and become it. Fully. Fearlessly. Forever. Eternity is the Now.",
  ],
  [
    "House Guide",
    "Today's practice: four minutes of box breath at dawn, then a slow walk without your phone. If you take a supplement, take it with water and a sentence of gratitude — not as a fix, as a vow.",
  ],
];

export const listCircle = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  let rows = await sql<{
    id: number;
    author_name: string;
    body: string;
    created_at: string;
  }>`select id, author_name, body, created_at::text as created_at from circle_posts order by created_at desc limit 80`;
  if (rows.length === 0) {
    for (const [name, body] of SEED_POSTS) {
      await sql`insert into circle_posts (user_id, author_name, body) values (${"blue-love"}, ${name}, ${body})`;
    }
    rows = await sql<{
      id: number;
      author_name: string;
      body: string;
      created_at: string;
    }>`select id, author_name, body, created_at::text as created_at from circle_posts order by created_at desc limit 80`;
  }
  return rows;
});

export const postCircle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      body: z.string().min(4).max(1200),
      name: z.string().max(48).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const name = (data.name ?? "Member").trim() || "Member";
    await sql`insert into circle_posts (user_id, author_name, body) values (${context.userId}, ${name}, ${data.body.trim()})`;
    return { ok: true as const };
  });

export const listOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{
      id: number;
      items: string;
      total_cents: number;
      status: string;
      created_at: string;
    }>`select id, items::text as items, total_cents, status, created_at::text as created_at from orders where user_id = ${context.userId} order by created_at desc`;
  });

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      items: z.array(
        z.object({
          slug: z.string(),
          name: z.string(),
          qty: z.number().int().positive(),
          unitCents: z.number().int().nonnegative(),
          subscribe: z.boolean(),
        }),
      ),
      totalCents: z.number().int().nonnegative(),
    }),
  )
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const payload = JSON.stringify(data.items);
    const rows = await sql.query<{ id: number }>(
      "insert into orders (user_id, items, total_cents, status) values ($1, $2::jsonb, $3, 'received') returning id",
      [context.userId, payload, data.totalCents],
    );
    return { id: rows[0]?.id ?? 0 };
  });

export const getMembership = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ tier: string; started_at: string }>`
      select tier, started_at::text as started_at from memberships where user_id = ${context.userId}
    `;
    return rows[0] ?? null;
  });

export const setMembership = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ tier: z.enum(["seeker", "circle", "devotee"]) }))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    await sql`
      insert into memberships (user_id, tier, started_at)
      values (${context.userId}, ${data.tier}, now())
      on conflict (user_id) do update set tier = excluded.tier, started_at = now()
    `;
    return { ok: true as const };
  });

export const listPractice = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{
      id: number;
      day: string;
      kind: string;
      minutes: number;
      note: string;
    }>`select id, day::text as day, kind, minutes, note from practice_logs where user_id = ${context.userId} order by day desc, id desc limit 60`;
  });

export const logPractice = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      kind: z.string().min(2).max(40),
      minutes: z.number().int().min(0).max(180),
      note: z.string().max(800).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    await sql`
      insert into practice_logs (user_id, day, kind, minutes, note)
      values (${context.userId}, current_date, ${data.kind}, ${data.minutes}, ${data.note ?? ""})
    `;
    return { ok: true as const };
  });
