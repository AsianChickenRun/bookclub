create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  isbn_10 text,
  isbn_13 text,
  cover_url text,
  default_page_count integer,
  default_chapter_count integer,
  genres text[] not null default '{}',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  constraint books_title_non_empty check (char_length(title) > 0),
  constraint books_default_page_count_positive check (default_page_count is null or default_page_count > 0),
  constraint books_default_chapter_count_positive check (default_chapter_count is null or default_chapter_count > 0)
);

create table if not exists public.user_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  status text not null default 'current',
  format text not null,
  goal_type text not null,
  total_pages integer,
  total_chapters integer,
  current_page integer,
  current_chapter integer,
  minutes_read_total integer not null default 0,
  sessions_total integer not null default 0,
  started_at date not null default current_date,
  target_finish_date date,
  finished_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_books_status_check check (status in ('current', 'paused', 'finished', 'abandoned')),
  constraint user_books_format_check check (format in ('print', 'ebook', 'audiobook', 'mixed')),
  constraint user_books_goal_type_check check (goal_type in ('pages', 'chapters', 'minutes', 'sessions')),
  constraint user_books_total_pages_positive check (total_pages is null or total_pages > 0),
  constraint user_books_total_chapters_positive check (total_chapters is null or total_chapters > 0),
  constraint user_books_current_page_non_negative check (current_page is null or current_page >= 0),
  constraint user_books_current_chapter_non_negative check (current_chapter is null or current_chapter >= 0),
  constraint user_books_minutes_non_negative check (minutes_read_total >= 0),
  constraint user_books_sessions_non_negative check (sessions_total >= 0),
  constraint user_books_current_page_within_total check (
    total_pages is null or current_page is null or current_page <= total_pages
  ),
  constraint user_books_current_chapter_within_total check (
    total_chapters is null or current_chapter is null or current_chapter <= total_chapters
  ),
  constraint user_books_finished_at_required check (status <> 'finished' or finished_at is not null)
);

create table if not exists public.reading_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  user_book_id uuid references public.user_books(id) on delete set null,
  group_id uuid references public.groups(id) on delete set null,
  logged_for_date date not null default current_date,
  pages_read integer not null default 0,
  chapters_read numeric(6, 2) not null default 0,
  minutes_read integer not null default 0,
  audiobook_minutes integer not null default 0,
  session_completed boolean not null default false,
  skipped boolean not null default false,
  note text,
  visibility text not null default 'private',
  created_at timestamptz not null default now(),
  constraint reading_logs_visibility_check check (visibility in ('private', 'groups')),
  constraint reading_logs_pages_non_negative check (pages_read >= 0),
  constraint reading_logs_chapters_non_negative check (chapters_read >= 0),
  constraint reading_logs_minutes_non_negative check (minutes_read >= 0),
  constraint reading_logs_audiobook_minutes_non_negative check (audiobook_minutes >= 0),
  constraint reading_logs_skipped_has_no_amount check (
    skipped = false or (
      pages_read = 0 and
      chapters_read = 0 and
      minutes_read = 0 and
      audiobook_minutes = 0 and
      session_completed = false
    )
  )
);

create unique index if not exists user_books_one_active_per_book_idx
on public.user_books(user_id, book_id)
where status in ('current', 'paused');

create index if not exists books_title_author_idx on public.books(lower(title), lower(author));
create unique index if not exists books_isbn_10_unique_idx on public.books(isbn_10) where isbn_10 is not null;
create unique index if not exists books_isbn_13_unique_idx on public.books(isbn_13) where isbn_13 is not null;
create index if not exists user_books_user_status_idx on public.user_books(user_id, status);
create index if not exists user_books_book_id_idx on public.user_books(book_id);
create index if not exists reading_logs_user_date_idx on public.reading_logs(user_id, logged_for_date desc);
create index if not exists reading_logs_group_created_idx
on public.reading_logs(group_id, created_at desc)
where visibility = 'groups';

alter table public.books enable row level security;
alter table public.user_books enable row level security;
alter table public.reading_logs enable row level security;

create policy "Authenticated users can read books"
on public.books
for select
to authenticated
using (true);

create policy "Authenticated users can create books"
on public.books
for insert
to authenticated
with check (auth.uid() = created_by or created_by is null);

create policy "Users can read their own user books"
on public.user_books
for select
using (auth.uid() = user_id);

create policy "Users can create their own user books"
on public.user_books
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own user books"
on public.user_books
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can read own reading logs"
on public.reading_logs
for select
using (auth.uid() = user_id);

create policy "Group members can read group-visible reading logs"
on public.reading_logs
for select
using (
  visibility = 'groups'
  and group_id is not null
  and public.is_group_member(group_id)
);

create policy "Users can create own reading logs"
on public.reading_logs
for insert
with check (auth.uid() = user_id);
