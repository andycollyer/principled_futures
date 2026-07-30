-- 0006_enquiries.sql
-- Real enquiry capture, replacing the mailto: hand-off.
--
-- The old "Talk to us" form opened the visitor's email client and hoped they
-- pressed send. Anyone who didn't was simply lost, and we had no record that
-- they ever asked. For a £480–£1,250/month product that is the wrong place to
-- drop a lead.
--
-- Security posture: the public may INSERT and nothing else. There is
-- deliberately no select/update/delete policy, so an enquiry cannot be read
-- back out through the public API — not by its sender, not by a stranger
-- enumerating ids. Reading them is a service-role operation.

create table if not exists enquiries (
  id         bigint generated always as identity primary key,
  name       text not null,
  email      text not null,
  org        text,
  sector     text,
  role       text,
  org_size   text,
  message    text,
  intent     text,                                   -- e.g. "Governance+ plan"
  source     text,                                   -- page it was sent from
  created_at timestamptz not null default now()
);

alter table enquiries enable row level security;

-- Write-only for the public. Basic shape checks live here rather than in the
-- browser, because the browser is not a place to enforce anything.
drop policy if exists enquiries_insert on enquiries;
create policy enquiries_insert on enquiries for insert
  with check (
    length(name)  between 1 and 200
    and length(email) between 3 and 320
    and email like '%_@_%._%'
    and coalesce(length(message), 0) <= 4000
  );

-- ---------------------------------------------------------------------------
-- briefing_leads: RLS was enabled in 0001 but no policy was ever added, so
-- every insert was silently refused. The lead-magnet capture has been writing
-- to localStorage only, which masked it. Give it the same write-only shape.
-- ---------------------------------------------------------------------------
drop policy if exists briefing_leads_insert on briefing_leads;
create policy briefing_leads_insert on briefing_leads for insert
  with check (
    length(email) between 3 and 320
    and email like '%_@_%._%'
    and lang in ('en', 'fr', 'de')
  );
