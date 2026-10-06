-- Client profile: five yes/no facts about the organisation, asked at first
-- sign-in, used to weight the order of priorities (never the score).
-- Stored as { "eu": true, "decisions": false, ... }.

alter table organisations add column if not exists profile jsonb;

create or replace function save_org_profile(p_profile jsonb) returns void
language plpgsql security definer set search_path = public as $$
declare org uuid; my_role text; clean jsonb;
begin
  select organisation_id, role into org, my_role from profiles where id = auth.uid();
  if org is null then raise exception 'No organisation for this account'; end if;
  if my_role not in ('owner', 'admin') then raise exception 'Only the account owner can change the organisation profile'; end if;
  -- keep only the known questions, and only true/false answers
  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb) into clean
    from jsonb_each(p_profile)
   where key in ('eu', 'decisions', 'special', 'regulated', 'bought') and jsonb_typeof(value) = 'boolean';
  update organisations set profile = clean where id = org;
end; $$;
revoke all on function save_org_profile(jsonb) from public;
grant execute on function save_org_profile(jsonb) to authenticated;

-- The adviser's pack carries the profile, so the adviser sees the same ranking as the client.
create or replace function review_get(p_id uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare r report_reviews;
begin
  if not is_team() then raise exception 'Advisers only'; end if;
  select * into r from report_reviews where id = p_id;
  if r.id is null then raise exception 'No such review'; end if;
  return jsonb_build_object(
    'review', to_jsonb(r),
    'org', (select jsonb_build_object('orgName', o.name, 'sector', coalesce(o.sector, ''), 'size', coalesce(o.size, ''), 'plan', o.plan, 'profile', coalesce(o.profile, '{}'::jsonb)) from organisations o where o.id = r.organisation_id),
    'reader', (select jsonb_build_object('fullName', coalesce(p.full_name, ''), 'jobTitle', coalesce(p.job_title, '')) from profiles p where p.id = r.requested_by),
    'owners', coalesce((select jsonb_object_agg(m.metric_id, jsonb_build_object('metricId', m.metric_id, 'personName', m.person_name, 'role', coalesce(m.role, ''), 'ring', m.ring, 'assignedAt', m.assigned_at))
                        from metric_owners m where m.organisation_id = r.organisation_id), '{}'::jsonb));
end; $$;
