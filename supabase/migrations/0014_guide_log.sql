-- The guide's record. Every question and answer is kept so that what the AI
-- told a client can be reviewed. No browser role can read or write this table:
-- the guide function writes with the service role, advisers read through the
-- function below.

create table if not exists guide_log (
  id bigint generated always as identity primary key,
  organisation_id uuid not null references organisations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  criterion_id text not null,
  question text not null,
  answer text not null,
  covered boolean not null default true,
  cited jsonb not null default '[]',
  related jsonb not null default '[]',
  model text not null,
  input_tokens integer,
  output_tokens integer,
  created_at timestamptz not null default now()
);
create index if not exists guide_log_org_time on guide_log (organisation_id, created_at desc);
alter table guide_log enable row level security;

create or replace function guide_review(p_limit integer default 100) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not is_team() then raise exception 'Advisers only'; end if;
  return coalesce((select jsonb_agg(x) from (
    select jsonb_build_object('at', g.created_at, 'org', o.name, 'criterion', g.criterion_id, 'question', g.question,
      'answer', g.answer, 'covered', g.covered, 'model', g.model, 'tokens', coalesce(g.input_tokens, 0) + coalesce(g.output_tokens, 0)) as x
    from guide_log g join organisations o on o.id = g.organisation_id order by g.created_at desc limit least(p_limit, 500)) q), '[]'::jsonb);
end; $$;
revoke all on function guide_review(integer) from public;
grant execute on function guide_review(integer) to authenticated;
