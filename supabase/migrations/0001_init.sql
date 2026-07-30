-- Principled Futures — initial schema
-- Mirrors the localStorage seams: store.ts (answers), history.ts
-- (score_history), telemetry-owners.ts (metric_owners), plus organisations,
-- profiles (auth users) and briefing leads. Row-level security throughout:
-- a user sees only their own organisation's data.

-- ── Organisations ──────────────────────────────────────────────
create table if not exists organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  companies_house_number text,
  sector text,
  plan text not null default 'diagnostic',       -- diagnostic | governance | governance_plus
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

-- ── Profiles (1:1 with auth.users) ─────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organisation_id uuid references organisations(id) on delete set null,
  full_name text,
  role text not null default 'member',            -- owner | admin | member | viewer
  created_at timestamptz not null default now()
);

-- ── Assessment answers (criterion id "1.1".."8.8" -> 0..4) ─────
create table if not exists answers (
  organisation_id uuid not null references organisations(id) on delete cascade,
  criterion_id text not null,                     -- "1.1" .. "8.8"
  value smallint not null check (value between 0 and 4),
  updated_at timestamptz not null default now(),
  primary key (organisation_id, criterion_id)
);

-- ── Score history (dated snapshots for trends) ─────────────────
create table if not exists score_history (
  id bigint generated always as identity primary key,
  organisation_id uuid not null references organisations(id) on delete cascade,
  snapshot_date date not null,
  overall smallint,
  domains jsonb not null default '{}',            -- { "1": 75, "2": 50, ... }
  answered smallint not null default 0,
  unique (organisation_id, snapshot_date)
);

-- ── Metric owners (telemetry) ──────────────────────────────────
create table if not exists metric_owners (
  organisation_id uuid not null references organisations(id) on delete cascade,
  metric_id text not null,                        -- "scaling-status", ...
  person_name text not null,
  role text,
  ring smallint not null check (ring between 1 and 3),
  assigned_at timestamptz not null default now(),
  primary key (organisation_id, metric_id)
);

-- ── Briefing leads (lead-magnet email capture) ─────────────────
create table if not exists briefing_leads (
  id bigint generated always as identity primary key,
  email text not null,
  lang text not null,                             -- en | fr | de
  path text,
  created_at timestamptz not null default now()
);

-- ── Row-level security ─────────────────────────────────────────
alter table organisations enable row level security;
alter table profiles       enable row level security;
alter table answers        enable row level security;
alter table score_history  enable row level security;
alter table metric_owners  enable row level security;
alter table briefing_leads enable row level security;

-- Helper: the caller's organisation.
create or replace function auth_org_id() returns uuid
  language sql stable security definer set search_path = public as $$
    select organisation_id from profiles where id = auth.uid()
  $$;

-- A user reads/writes only their own organisation's rows.
create policy org_read   on organisations for select using (id = auth_org_id());
create policy org_update on organisations for update using (id = auth_org_id());

create policy prof_self  on profiles for select using (id = auth.uid() or organisation_id = auth_org_id());
create policy prof_write on profiles for all using (id = auth.uid()) with check (id = auth.uid());

create policy ans_all on answers       for all using (organisation_id = auth_org_id()) with check (organisation_id = auth_org_id());
create policy hist_all on score_history for all using (organisation_id = auth_org_id()) with check (organisation_id = auth_org_id());
create policy own_all on metric_owners for all using (organisation_id = auth_org_id()) with check (organisation_id = auth_org_id());

-- Leads: no client reads (RLS denies all by default); inserts happen
-- server-side with the service-role key, which bypasses RLS.
-- Fix: a brand-new user can't create their organisation.
-- On first sign-in the app must create an organisation + profile, but a new
-- user has no profile yet, so the RLS policy helpers can't resolve their org
-- during creation, and there was no INSERT policy on organisations anyway.
-- This SECURITY DEFINER function provisions both atomically, past RLS, and
-- returns the organisation id. The client calls it via rpc('provision_org').

create or replace function provision_org(org_name text default 'My organisation')
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare existing uuid; new_org uuid;
begin
  -- already provisioned? return it.
  select organisation_id into existing from profiles where id = auth.uid();
  if existing is not null then return existing; end if;

  insert into organisations (name) values (org_name) returning id into new_org;
  insert into profiles (id, organisation_id, role)
    values (auth.uid(), new_org, 'owner')
    on conflict (id) do update set organisation_id = excluded.organisation_id;
  return new_org;
end;
$$;

grant execute on function provision_org(text) to authenticated;
