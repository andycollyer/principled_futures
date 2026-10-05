-- Close a loophole: a signed-in user could update their own organisation row,
-- including its plan, and so upgrade without paying. The product never edits
-- this table from the browser (organisations are created by provision_org and
-- plans are changed by the payment webhook, both server-side), so browser
-- roles lose every write on it. Reading your own organisation is unchanged.

drop policy if exists org_update on organisations;
revoke insert, update, delete, truncate on organisations from anon, authenticated;
