-- Waitlist table
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  handicap text,
  frequency text,
  pain_point text,
  constraint waitlist_email_unique unique (email)
);

-- Row Level Security: lock down the table so only the service role can touch it.
-- The API route uses the service role key server-side, so RLS stays on.
alter table public.waitlist enable row level security;
