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
