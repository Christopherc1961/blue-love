create table if not exists circle_posts (
  id serial primary key,
  user_id text not null,
  author_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists circle_posts_created_idx on circle_posts (created_at desc);

create table if not exists practice_logs (
  id serial primary key,
  user_id text not null,
  day date not null,
  kind text not null,
  minutes integer not null default 0,
  note text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists practice_logs_user_day_idx on practice_logs (user_id, day);

create table if not exists orders (
  id serial primary key,
  user_id text not null,
  items jsonb not null,
  total_cents integer not null,
  status text not null default 'received',
  created_at timestamptz not null default now()
);
create index if not exists orders_user_idx on orders (user_id, created_at desc);

create table if not exists memberships (
  user_id text primary key,
  tier text not null,
  started_at timestamptz not null default now()
);

insert into circle_posts (user_id, author_name, body)
select 'blue-love', 'Blue Love Circle', 'Love is the most powerful force in the Universe. This house is a place to find it, share it, and become it. Fully. Fearlessly. Forever. Eternity is the Now.'
where not exists (select 1 from circle_posts limit 1);

insert into circle_posts (user_id, author_name, body)
select 'blue-love', 'House Guide', 'Today''s practice: four minutes of box breath at dawn, then a slow walk without your phone. If you take a supplement, take it with water and a sentence of gratitude — not as a fix, as a vow.'
where not exists (select 1 from circle_posts having count(*) >= 2);
