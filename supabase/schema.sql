-- Waitlist table.
-- Column order mirrors the submission form: metadata first, then form-facing
-- fields in the order the user sees them, then server-set metadata.
--
-- Stored values always match the English answer text (slugified) so a DB row
-- is self-explanatory without looking up a label mapping.
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
  consent_at timestamptz not null default now(),
  locale text not null default 'nb',
  environment text not null default 'test',
  constraint waitlist_email_unique unique (email)
);

-- Row Level Security: lock down the table so only the service role can touch it.
-- The API route uses the service role key server-side (bypasses RLS), so RLS stays on
-- and an explicit deny policy makes the intent clear to Supabase's linter.
alter table public.waitlist enable row level security;

drop policy if exists "No public access" on public.waitlist;
create policy "No public access"
  on public.waitlist
  for all
  to public
  using (false)
  with check (false);
