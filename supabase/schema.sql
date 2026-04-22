-- Waitlist table
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  handicap text,
  frequency text,
  current_solution text,
  priorities text[],
  price_willingness text,
  attribution text,
  attribution_other text,
  club text,
  environment text not null default 'test',
  constraint waitlist_email_unique unique (email)
);

alter table public.waitlist
  add column if not exists environment text not null default 'test';
alter table public.waitlist add column if not exists current_solution text;
alter table public.waitlist add column if not exists price_willingness text;
alter table public.waitlist add column if not exists attribution text;
alter table public.waitlist add column if not exists club text;
alter table public.waitlist add column if not exists priorities text[];
alter table public.waitlist add column if not exists attribution_other text;

-- Row Level Security: lock down the table so only the service role can touch it.
-- The API route uses the service role key server-side, so RLS stays on.
alter table public.waitlist enable row level security;
