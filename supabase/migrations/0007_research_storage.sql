-- 0007_research_storage.sql
-- A private home for the board papers.
--
-- The 11 branded PDFs were served from /research/*.pdf on the public site:
-- 2.4MB of original research, downloadable by anyone who guessed a filename,
-- with no account, no entitlement check and no trace of who took a copy.
--
-- They now live in a private bucket that has no public policy at all. Nothing
-- in the browser can read it. The only route to a paper is the issue-paper
-- edge function, which checks the caller's session and plan, stamps the
-- reader's identity onto every page, and returns the bytes.

insert into storage.buckets (id, name, public)
values ('research', 'research', false)
on conflict (id) do update set public = false;

-- Deliberately no storage.objects policies for this bucket: with RLS on and no
-- policy, neither anonymous nor signed-in clients can list or download it. The
-- edge function reaches it with the service role, having already made the
-- entitlement decision as the caller.
