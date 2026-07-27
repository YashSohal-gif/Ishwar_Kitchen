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
