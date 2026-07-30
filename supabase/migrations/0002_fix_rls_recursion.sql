-- Fix: row-level-security recursion.
-- auth_org_id() reads `profiles`, but the `profiles` policy called
-- auth_org_id() in turn -> infinite recursion (Postgres "stack depth
-- exceeded", error 54001). Marking the helper SECURITY DEFINER makes it read
-- profiles with the function owner's rights, bypassing RLS on that read and
-- breaking the loop. search_path is pinned for safety.

create or replace function auth_org_id() returns uuid
  language sql
  stable
  security definer
  set search_path = public
  as $$
    select organisation_id from profiles where id = auth.uid()
  $$;
