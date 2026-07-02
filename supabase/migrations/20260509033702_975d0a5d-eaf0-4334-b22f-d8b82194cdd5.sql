
-- Fix function search_path
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Restrict listing on post-images: drop broad SELECT, replace with no SELECT policy.
-- Public access still works via direct URLs since the bucket is public.
drop policy if exists "Public can view post images" on storage.objects;
