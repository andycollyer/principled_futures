-- Team accounts get the full plan from the moment they are created.
-- While the product is private the Salveus team needs to see everything a
-- top-plan client sees. Addresses listed in team_emails are provisioned on
-- 'governance_plus'; everyone else stays on the default plan. The table has
-- row-level security with no policies, so only the database owner can read
-- or change the list. Review this list before the site reopens.

create table if not exists team_emails (email text primary key);
alter table team_emails enable row level security;

insert into team_emails (email) values ('andy@andycollyer.com') on conflict do nothing;

create or replace function provision_org(org_name text default 'My organisation')
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare existing uuid; new_org uuid; is_team boolean;
begin
  -- already provisioned? return it.
  select organisation_id into existing from profiles where id = auth.uid();
  if existing is not null then return existing; end if;

  select exists (
    select 1 from auth.users u join team_emails t on lower(u.email) = lower(t.email)
    where u.id = auth.uid()
  ) into is_team;

  insert into organisations (name, plan)
    values (org_name, case when is_team then 'governance_plus' else 'diagnostic' end)
    returning id into new_org;
  insert into profiles (id, organisation_id, role)
    values (auth.uid(), new_org, 'owner')
    on conflict (id) do update set organisation_id = excluded.organisation_id;
  return new_org;
end;
$$;

grant execute on function provision_org(text) to authenticated;
