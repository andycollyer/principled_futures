-- 0008_briefing_sources.sql
-- Evidence briefs replace the legacy briefings (decision 2 October 2026). Each
-- carries a reading list and the date it was last checked against its sources,
-- so both are stored with the body and released under the same access rule.
alter table briefings add column if not exists sources jsonb not null default '[]'::jsonb;
alter table briefings add column if not exists checked date;
