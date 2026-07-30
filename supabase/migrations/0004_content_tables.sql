-- 0004_content_tables.sql
-- Move the library's prose out of the shipped browser bundle and into the
-- database, so it is *withheld* rather than merely hidden.
--
-- Before this migration the full text of 64 criterion briefings, 86 glossary
-- definitions and the product guides shipped inside the public JavaScript —
-- downloadable by anyone, no account required. A login screen would not have
-- fixed that: in a static site the login only hides the interface, while the
-- data sits in a file anyone can fetch directly.
--
-- Now: titles, categories and standfirsts stay client-side (so the library
-- still browses, searches and teases), and the bodies live here behind
-- row-level security keyed to the caller's plan.
--
--   briefings      — signed in AND (a free sample OR a paid plan)
--   glossary_terms — signed in
--   guides         — signed in
--
-- Anonymous visitors receive nothing from these tables at all.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists briefings (
  criterion_id text primary key,            -- "1.1" .. "8.8"
  body         jsonb not null,              -- array of paragraph strings
  is_sample    boolean not null default false,
  updated_at   timestamptz not null default now()
);

create table if not exists glossary_terms (
  term       text primary key,
  def        text not null,
  updated_at timestamptz not null default now()
);

create table if not exists guides (
  id         text primary key,
  body       jsonb not null,                -- array of paragraph strings
  updated_at timestamptz not null default now()
);

alter table briefings      enable row level security;
alter table glossary_terms enable row level security;
alter table guides         enable row level security;

-- ---------------------------------------------------------------------------
-- The caller's plan.
--
-- SECURITY DEFINER for the same reason auth_org_id() needs it (see 0002):
-- reading profiles/organisations from inside a policy would re-enter RLS and
-- recurse. Returns 'none' when signed out.
-- ---------------------------------------------------------------------------
create or replace function current_plan() returns text
  language sql stable security definer set search_path = public as $$
    select coalesce(
      (select o.plan
         from profiles p
         join organisations o on o.id = p.organisation_id
        where p.id = auth.uid()),
      'none')
  $$;

revoke all on function current_plan() from public;
grant execute on function current_plan() to authenticated;

-- ---------------------------------------------------------------------------
-- Policies — read-only to end users; writes are service-role only (the seed
-- migration and any future content deploy run as service role, which bypasses
-- RLS). No insert/update/delete policy is defined on purpose.
-- ---------------------------------------------------------------------------

-- Briefings: the paid product. Samples are the shop window for signed-in
-- free accounts; the other 56 require Governance or Governance+.
drop policy if exists briefings_read on briefings;
create policy briefings_read on briefings for select
  using (
    auth.uid() is not null
    and (is_sample or current_plan() in ('governance', 'governance_plus'))
  );

-- Glossary and guides: supporting material. Any signed-in user, free or paid —
-- gating these behind payment would punish free users without protecting the
-- asset that actually matters. The point here is that anonymous bulk
-- extraction is impossible, not that free users are starved.
drop policy if exists glossary_read on glossary_terms;
create policy glossary_read on glossary_terms for select
  using (auth.uid() is not null);

drop policy if exists guides_read on guides;
create policy guides_read on guides for select
  using (auth.uid() is not null);
