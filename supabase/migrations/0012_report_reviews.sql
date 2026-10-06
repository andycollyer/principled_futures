-- Adviser review of the advisory report.
-- A client asks for review; a named Principled Futures adviser reads the report
-- built from a frozen copy of the client's answers and approves it or asks for
-- changes. The client sees the report only once a version has been approved.
--
-- Advisers are the addresses in team_emails. They read a client's answers and
-- owners only through the functions below, and only for organisations that have
-- asked for a review. No browser role is granted any table access here.

alter table team_emails add column if not exists display_name text;
update team_emails set display_name = 'Dr Andrew Collyer' where email = 'andy@andycollyer.com' and display_name is null;

create table if not exists report_reviews (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  requested_by uuid references auth.users(id) on delete set null,
  requested_at timestamptz not null default now(),
  status text not null default 'requested' check (status in ('requested', 'approved', 'changes')),
  answers jsonb not null,                 -- frozen copy: { "1.1": 2, ... }
  overall smallint,
  reviewer_name text,
  reviewed_at timestamptz,
  note text
);
create index if not exists report_reviews_org on report_reviews (organisation_id, requested_at desc);
alter table report_reviews enable row level security;   -- no policies: access is through the functions only

create or replace function is_team() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from auth.users u join team_emails t on lower(u.email) = lower(t.email) where u.id = auth.uid());
$$;

-- Client: ask for a review of the current answers. One open request per organisation.
create or replace function request_report_review(p_overall smallint) returns uuid
language plpgsql security definer set search_path = public as $$
declare org uuid; snap jsonb; rid uuid;
begin
  select organisation_id into org from profiles where id = auth.uid();
  if org is null then raise exception 'No organisation for this account'; end if;
  select coalesce(jsonb_object_agg(criterion_id, value), '{}'::jsonb) into snap from answers where organisation_id = org;
  select id into rid from report_reviews where organisation_id = org and status = 'requested' order by requested_at desc limit 1;
  if rid is not null then
    update report_reviews set answers = snap, overall = p_overall, requested_at = now(), requested_by = auth.uid() where id = rid;
  else
    insert into report_reviews (organisation_id, requested_by, answers, overall) values (org, auth.uid(), snap, p_overall) returning id into rid;
  end if;
  return rid;
end; $$;

-- Client: where my organisation's report stands. The latest request, and the latest approved version.
create or replace function my_report_review() returns jsonb
language sql stable security definer set search_path = public as $$
  with org as (select organisation_id as id from profiles where id = auth.uid())
  select jsonb_build_object(
    'latest',   (select to_jsonb(r) - 'answers' from report_reviews r, org where r.organisation_id = org.id order by requested_at desc limit 1),
    'approved', (select to_jsonb(r) from report_reviews r, org where r.organisation_id = org.id and r.status = 'approved' order by reviewed_at desc limit 1)
  );
$$;

-- Adviser: the queue.
create or replace function review_queue() returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not is_team() then raise exception 'Advisers only'; end if;
  return coalesce((
    select jsonb_agg(x order by (x->>'requested_at') desc) from (
      select jsonb_build_object('id', r.id, 'status', r.status, 'requested_at', r.requested_at, 'reviewed_at', r.reviewed_at,
        'reviewer_name', r.reviewer_name, 'overall', r.overall, 'org', o.name, 'sector', o.sector, 'size', o.size,
        'requested_by', p.full_name, 'job_title', p.job_title) as x
      from report_reviews r join organisations o on o.id = r.organisation_id left join profiles p on p.id = r.requested_by
    ) q), '[]'::jsonb);
end; $$;

-- Adviser: everything needed to read one report.
create or replace function review_get(p_id uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare r report_reviews;
begin
  if not is_team() then raise exception 'Advisers only'; end if;
  select * into r from report_reviews where id = p_id;
  if r.id is null then raise exception 'No such review'; end if;
  return jsonb_build_object(
    'review', to_jsonb(r),
    'org', (select jsonb_build_object('orgName', o.name, 'sector', coalesce(o.sector, ''), 'size', coalesce(o.size, ''), 'plan', o.plan) from organisations o where o.id = r.organisation_id),
    'reader', (select jsonb_build_object('fullName', coalesce(p.full_name, ''), 'jobTitle', coalesce(p.job_title, '')) from profiles p where p.id = r.requested_by),
    'owners', coalesce((select jsonb_object_agg(m.metric_id, jsonb_build_object('metricId', m.metric_id, 'personName', m.person_name, 'role', coalesce(m.role, ''), 'ring', m.ring, 'assignedAt', m.assigned_at))
                        from metric_owners m where m.organisation_id = r.organisation_id), '{}'::jsonb));
end; $$;

-- Adviser: approve, or ask for changes.
create or replace function review_decide(p_id uuid, p_status text, p_note text) returns void
language plpgsql security definer set search_path = public as $$
declare who text;
begin
  if not is_team() then raise exception 'Advisers only'; end if;
  if p_status not in ('approved', 'changes') then raise exception 'Unknown decision'; end if;
  select coalesce(t.display_name, u.email) into who from auth.users u join team_emails t on lower(u.email) = lower(t.email) where u.id = auth.uid();
  update report_reviews set status = p_status, note = nullif(trim(left(p_note, 2000)), ''), reviewer_name = who, reviewed_at = now() where id = p_id;
end; $$;

revoke all on function is_team(), request_report_review(smallint), my_report_review(), review_queue(), review_get(uuid), review_decide(uuid, text, text) from public;
grant execute on function is_team(), request_report_review(smallint), my_report_review(), review_queue(), review_get(uuid), review_decide(uuid, text, text) to authenticated;
