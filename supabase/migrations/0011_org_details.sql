-- Who the client is: asked once at first sign-in, used across the product and
-- on the report. Browser roles cannot write to organisations directly (0010),
-- so details are saved through this function, which touches only the caller's
-- own organisation and profile and never the plan.

alter table organisations add column if not exists size text;
alter table profiles add column if not exists job_title text;

create or replace function save_org_details(
  p_org_name text, p_sector text, p_size text, p_full_name text, p_job_title text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare org uuid; my_role text;
begin
  select organisation_id, role into org, my_role from profiles where id = auth.uid();
  if org is null then raise exception 'No organisation for this account'; end if;

  update profiles
     set full_name = nullif(trim(left(p_full_name, 120)), ''),
         job_title = nullif(trim(left(p_job_title, 120)), '')
   where id = auth.uid();

  -- Only the people who run the account may rename the organisation.
  if my_role in ('owner', 'admin') then
    update organisations
       set name   = coalesce(nullif(trim(left(p_org_name, 160)), ''), name),
           sector = nullif(trim(left(p_sector, 80)), ''),
           size   = nullif(trim(left(p_size, 40)), '')
     where id = org;
  end if;
end;
$$;

revoke all on function save_org_details(text, text, text, text, text) from public;
grant execute on function save_org_details(text, text, text, text, text) to authenticated;
