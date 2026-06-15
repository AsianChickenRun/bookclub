create table if not exists public.discussion_posts (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid references public.books(id) on delete set null,
  body text not null,
  spoiler_level text not null default 'none',
  spoiler_page integer,
  spoiler_chapter numeric(6, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint discussion_posts_body_non_empty check (char_length(trim(body)) > 0),
  constraint discussion_posts_spoiler_level_check check (
    spoiler_level in ('none', 'progress_locked', 'explicit')
  ),
  constraint discussion_posts_spoiler_page_non_negative check (
    spoiler_page is null or spoiler_page >= 0
  ),
  constraint discussion_posts_spoiler_chapter_non_negative check (
    spoiler_chapter is null or spoiler_chapter >= 0
  )
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  activity_type text not null,
  related_reading_log_id uuid references public.reading_logs(id) on delete cascade,
  related_discussion_post_id uuid references public.discussion_posts(id) on delete cascade,
  book_id uuid references public.books(id) on delete set null,
  summary text not null,
  spoiler_level text not null default 'none',
  spoiler_page integer,
  spoiler_chapter numeric(6, 2),
  created_at timestamptz not null default now(),
  constraint activities_type_check check (activity_type in ('check_in', 'discussion')),
  constraint activities_summary_non_empty check (char_length(trim(summary)) > 0),
  constraint activities_spoiler_level_check check (
    spoiler_level in ('none', 'progress_locked', 'explicit')
  ),
  constraint activities_single_related_source check (
    num_nonnulls(related_reading_log_id, related_discussion_post_id) = 1
  ),
  constraint activities_spoiler_page_non_negative check (
    spoiler_page is null or spoiler_page >= 0
  ),
  constraint activities_spoiler_chapter_non_negative check (
    spoiler_chapter is null or spoiler_chapter >= 0
  )
);

create table if not exists public.discussion_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.discussion_posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint discussion_comments_body_non_empty check (char_length(trim(body)) > 0)
);

create index if not exists discussion_posts_group_created_idx
on public.discussion_posts(group_id, created_at desc);

create index if not exists activities_group_created_idx
on public.activities(group_id, created_at desc);

create index if not exists discussion_comments_post_created_idx
on public.discussion_comments(post_id, created_at asc);

alter table public.discussion_posts enable row level security;
alter table public.activities enable row level security;
alter table public.discussion_comments enable row level security;

create policy "Group members can read discussion posts"
on public.discussion_posts
for select
using (public.is_group_member(group_id));

create policy "Group members can create discussion posts"
on public.discussion_posts
for insert
with check (auth.uid() = author_id and public.is_group_member(group_id));

create policy "Authors can update own discussion posts"
on public.discussion_posts
for update
using (auth.uid() = author_id)
with check (auth.uid() = author_id and public.is_group_member(group_id));

create policy "Group members can read activities"
on public.activities
for select
using (public.is_group_member(group_id));

create policy "Group members can create activities"
on public.activities
for insert
with check (
  (actor_id is null or actor_id = auth.uid())
  and public.is_group_member(group_id)
);

create policy "Group members can read discussion comments"
on public.discussion_comments
for select
using (
  exists (
    select 1
    from public.discussion_posts posts
    where posts.id = discussion_comments.post_id
      and public.is_group_member(posts.group_id)
  )
);

create policy "Group members can create discussion comments"
on public.discussion_comments
for insert
with check (
  auth.uid() = author_id
  and exists (
    select 1
    from public.discussion_posts posts
    where posts.id = discussion_comments.post_id
      and public.is_group_member(posts.group_id)
  )
);
