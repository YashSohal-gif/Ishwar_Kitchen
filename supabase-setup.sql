-- Run this once in your Supabase project's SQL Editor
-- (Supabase dashboard → SQL Editor → New query → paste → Run)
-- This is the same Supabase project already used by admin.html.

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text unique not null,
  subscription jsonb not null,
  customer_name text,
  created_at timestamptz not null default now()
);

-- Row Level Security: the serverless functions use the SERVICE ROLE key
-- (which bypasses RLS entirely), so no public read/write policy is
-- needed or wanted here — this table should not be reachable by the
-- anon/publishable key at all.
alter table push_subscriptions enable row level security;


-- ── Engagement tracking for the admin dashboard ──────────────────────

-- One row per "Order Now" click, logged from script.js using the
-- publishable key (same exposure level as the orders table admin.html
-- already reads directly with that key).
create table if not exists order_clicks (
  id uuid primary key default gen_random_uuid(),
  page text,
  created_at timestamptz not null default now()
);
alter table order_clicks enable row level security;
create policy "anon can log order clicks" on order_clicks
  for insert to anon with check (true);
create policy "anon can read order click counts" on order_clicks
  for select to anon using (true);

-- One row per push notification broadcast (manual or automatic daily
-- cron), so the admin dashboard can total "people notified today".
-- Only written by the serverless functions (service role key, bypasses
-- RLS) — anon only needs read access here.
create table if not exists notification_sends (
  id uuid primary key default gen_random_uuid(),
  title text,
  recipients_count int not null default 0,
  type text,
  sent_at timestamptz not null default now()
);
alter table notification_sends enable row level security;
create policy "anon can read notification send counts" on notification_sends
  for select to anon using (true);
