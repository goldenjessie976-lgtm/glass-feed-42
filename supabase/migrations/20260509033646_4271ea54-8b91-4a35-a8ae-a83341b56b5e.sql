
-- Category enum
create type public.post_category as enum ('announcement', 'issue', 'message');

-- Posts table
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null default '',
  category public.post_category not null default 'announcement',
  image_url text,
  links jsonb not null default '[]'::jsonb,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "Posts are viewable by everyone"
  on public.posts for select using (true);

create policy "Authenticated users can insert posts"
  on public.posts for insert to authenticated
  with check (auth.uid() is not null);

create policy "Authenticated users can update posts"
  on public.posts for update to authenticated
  using (auth.uid() is not null);

create policy "Authenticated users can delete posts"
  on public.posts for delete to authenticated
  using (auth.uid() is not null);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- Storage bucket for post images
insert into storage.buckets (id, name, public) values ('post-images', 'post-images', true)
on conflict (id) do nothing;

create policy "Public can view post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

create policy "Authenticated can upload post images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'post-images');

create policy "Authenticated can update post images"
  on storage.objects for update to authenticated
  using (bucket_id = 'post-images');

create policy "Authenticated can delete post images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'post-images');
