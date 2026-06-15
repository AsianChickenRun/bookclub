# Database Architecture

Reading Momentum should start with a small, relational Supabase schema that protects private groups, supports fast check-ins, and leaves room for richer scoring and review features later.

## Design Priorities

- Keep identity, group membership, reading progress, discussion, reviews, and scoring separate.
- Store user actions as append-only events where history matters.
- Store current state where the app needs a fast dashboard.
- Make private group access enforceable in row-level security, not only in the app.
- Avoid public community assumptions in the MVP.

## Extensions

Recommended Supabase/Postgres extensions:

- `pgcrypto` for `gen_random_uuid()`
- `citext` only if case-insensitive invite codes or handles are needed

## Core Tables

### `profiles`

One row per authenticated user. Supabase Auth remains the source of login identity.

Columns:

- `id uuid primary key references auth.users(id) on delete cascade`
- `display_name text not null`
- `avatar_url text`
- `bio text`
- `favorite_genres text[] not null default '{}'`
- `timezone text not null default 'America/New_York'`
- `total_xp integer not null default 0`
- `current_streak_days integer not null default 0`
- `longest_streak_days integer not null default 0`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Integrity:

- `display_name` should be 1-80 characters.
- `total_xp`, `current_streak_days`, and `longest_streak_days` must be non-negative.

### `groups`

Private reading groups.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `name text not null`
- `description text`
- `owner_id uuid not null references profiles(id)`
- `invite_code text unique`
- `is_archived boolean not null default false`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Integrity:

- `name` should be 1-100 characters.
- `invite_code` should be generated server-side and rotated when needed.

### `group_members`

Membership and role table.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `group_id uuid not null references groups(id) on delete cascade`
- `user_id uuid not null references profiles(id) on delete cascade`
- `role text not null default 'member'`
- `status text not null default 'active'`
- `joined_at timestamptz not null default now()`
- `last_seen_at timestamptz`

Constraints:

- `unique (group_id, user_id)`
- `role in ('owner', 'admin', 'member')`
- `status in ('invited', 'active', 'left', 'removed')`

MVP rule:

- Keep former members as `left` or `removed` if historical posts should remain visible to active members.

### `books`

Canonical-ish book records. This can start user-entered and be cleaned up later.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `title text not null`
- `author text`
- `isbn_10 text`
- `isbn_13 text`
- `cover_url text`
- `default_page_count integer`
- `default_chapter_count integer`
- `genres text[] not null default '{}'`
- `created_by uuid references profiles(id)`
- `created_at timestamptz not null default now()`

Integrity:

- `title` should be non-empty.
- Page and chapter counts must be positive when present.
- Add unique indexes on `isbn_10` and `isbn_13` where not null.

### `user_books`

A user's relationship to a book, including current progress.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references profiles(id) on delete cascade`
- `book_id uuid not null references books(id)`
- `status text not null default 'current'`
- `format text not null`
- `goal_type text not null`
- `total_pages integer`
- `total_chapters integer`
- `current_page integer`
- `current_chapter integer`
- `minutes_read_total integer not null default 0`
- `sessions_total integer not null default 0`
- `started_at date not null default current_date`
- `target_finish_date date`
- `finished_at date`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:

- `status in ('current', 'paused', 'finished', 'abandoned')`
- `format in ('print', 'ebook', 'audiobook', 'mixed')`
- `goal_type in ('pages', 'chapters', 'minutes', 'sessions')`
- Progress counts must be non-negative.
- `current_page <= total_pages` when both are present.
- `current_chapter <= total_chapters` when both are present.
- `finished_at` is required when `status = 'finished'`.

Recommended index:

- Partial unique index for one active row per user/book: `unique (user_id, book_id) where status in ('current', 'paused')`

### `reading_logs`

Append-only check-ins. This powers streaks, feed activity, scoring, and analytics.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references profiles(id) on delete cascade`
- `user_book_id uuid references user_books(id) on delete set null`
- `group_id uuid references groups(id) on delete set null`
- `logged_for_date date not null default current_date`
- `pages_read integer not null default 0`
- `chapters_read numeric(6,2) not null default 0`
- `minutes_read integer not null default 0`
- `audiobook_minutes integer not null default 0`
- `session_completed boolean not null default false`
- `skipped boolean not null default false`
- `note text`
- `visibility text not null default 'groups'`
- `created_at timestamptz not null default now()`

Constraints:

- `visibility in ('private', 'groups')`
- Reading amounts must be non-negative.
- A row cannot be both `skipped = true` and contain positive reading amounts.
- At least one of pages, chapters, minutes, audiobook minutes, session completed, skipped, or note should be present.

MVP rule:

- Allow multiple logs per day, but dashboard scoring should aggregate by `user_id` and `logged_for_date`.

### `discussion_prompts`

Reusable or generated prompts.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `group_id uuid references groups(id) on delete cascade`
- `user_book_id uuid references user_books(id) on delete cascade`
- `prompt_type text not null`
- `prompt_text text not null`
- `progress_page integer`
- `progress_chapter integer`
- `source text not null default 'system'`
- `created_by uuid references profiles(id)`
- `created_at timestamptz not null default now()`

Constraints:

- `prompt_type in ('monday_checkin', 'thursday_discussion', 'reflection', 'review', 'recap')`
- `source in ('system', 'ai', 'user')`

### `discussion_posts`

Top-level group posts and prompt answers.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `group_id uuid not null references groups(id) on delete cascade`
- `author_id uuid not null references profiles(id) on delete cascade`
- `user_book_id uuid references user_books(id) on delete set null`
- `prompt_id uuid references discussion_prompts(id) on delete set null`
- `post_type text not null default 'discussion'`
- `body text not null`
- `spoiler_level text not null default 'none'`
- `spoiler_page integer`
- `spoiler_chapter integer`
- `is_deleted boolean not null default false`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:

- `post_type in ('discussion', 'prompt_answer', 'checkin_reflection', 'milestone')`
- `spoiler_level in ('none', 'progress_locked', 'explicit')`
- `body` should be non-empty unless `is_deleted = true`.

### `comments`

Threaded replies. Keep one table for comments; avoid separate reply tables.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `post_id uuid not null references discussion_posts(id) on delete cascade`
- `parent_comment_id uuid references comments(id) on delete cascade`
- `author_id uuid not null references profiles(id) on delete cascade`
- `body text not null`
- `spoiler_level text not null default 'none'`
- `spoiler_page integer`
- `spoiler_chapter integer`
- `is_deleted boolean not null default false`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

MVP rule:

- Support one or two visual levels of nesting even though the schema allows deeper threading.

### `reactions`

One table for supportive reactions across posts, comments, reviews, and feed items.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references profiles(id) on delete cascade`
- `target_type text not null`
- `target_id uuid not null`
- `reaction_type text not null`
- `created_at timestamptz not null default now()`

Constraints:

- `target_type in ('post', 'comment', 'review', 'activity')`
- `reaction_type in ('encourage', 'same', 'insightful', 'celebrate', 'thanks')`
- `unique (user_id, target_type, target_id, reaction_type)`

Note:

- This polymorphic table cannot enforce target foreign keys directly. For MVP that is acceptable if writes happen through application code or RPC functions. If this becomes fragile, split reactions by target type.

### `reviews`

Final reviews and live review entries.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references profiles(id) on delete cascade`
- `user_book_id uuid not null references user_books(id) on delete cascade`
- `review_type text not null`
- `rating numeric(2,1)`
- `short_review text`
- `long_review text`
- `recommended_audience text`
- `favorite_moment text`
- `pacing_rating integer`
- `writing_rating integer`
- `character_rating integer`
- `emotional_impact_rating integer`
- `reread_potential integer`
- `live_review_kind text`
- `progress_page integer`
- `progress_chapter integer`
- `spoiler_level text not null default 'none'`
- `visibility text not null default 'groups'`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:

- `review_type in ('live', 'final')`
- `live_review_kind in ('reaction', 'prediction', 'quote', 'confusing_section', 'character_opinion')` when `review_type = 'live'`
- `rating between 0.5 and 5.0` when present.
- Category ratings should be 1-5 when present.
- `visibility in ('private', 'groups')`
- One final review per `user_book_id`: `unique (user_book_id) where review_type = 'final'`

### `activities`

Group feed items. Store curated feed entries instead of deriving every feed row at read time.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `group_id uuid not null references groups(id) on delete cascade`
- `actor_id uuid not null references profiles(id) on delete cascade`
- `activity_type text not null`
- `subject_type text`
- `subject_id uuid`
- `book_id uuid references books(id) on delete set null`
- `summary text`
- `is_hidden boolean not null default false`
- `created_at timestamptz not null default now()`

Constraints:

- `activity_type in ('checkin', 'reflection', 'post', 'comment', 'finished_book', 'review', 'nomination', 'streak_milestone')`

MVP rule:

- Create feed items only for meaningful actions. Do not mirror every database write.

### `xp_events`

Append-only reward ledger.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references profiles(id) on delete cascade`
- `event_type text not null`
- `points integer not null`
- `source_type text`
- `source_id uuid`
- `created_at timestamptz not null default now()`

Constraints:

- `points > 0`
- `event_type in ('checkin', 'discussion_response', 'reply', 'book_completed', 'review_submitted', 'nomination', 'streak_milestone', 'comeback')`

MVP rule:

- Treat `profiles.total_xp` as a cached total updated by trusted server code.

### `momentum_scores`

Weekly score snapshots.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references profiles(id) on delete cascade`
- `group_id uuid references groups(id) on delete cascade`
- `week_start date not null`
- `score numeric(5,2) not null`
- `consistency_score numeric(5,2) not null default 0`
- `volume_score numeric(5,2) not null default 0`
- `reflection_score numeric(5,2) not null default 0`
- `community_score numeric(5,2) not null default 0`
- `completion_score numeric(5,2) not null default 0`
- `calculated_at timestamptz not null default now()`

Constraints:

- `score between 0 and 100`
- Pillar scores should be 0-100.
- `unique (user_id, group_id, week_start)`

Note:

- `group_id` may be null for a personal score.

### `achievements`

Achievement definitions.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `code text not null unique`
- `name text not null`
- `description text not null`
- `category text not null`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`

### `user_achievements`

Earned achievements.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references profiles(id) on delete cascade`
- `achievement_id uuid not null references achievements(id)`
- `earned_at timestamptz not null default now()`
- `source_type text`
- `source_id uuid`

Constraints:

- `unique (user_id, achievement_id)`

### `notifications`

In-app notification queue. Push/email can come later.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references profiles(id) on delete cascade`
- `notification_type text not null`
- `title text not null`
- `body text not null`
- `target_type text`
- `target_id uuid`
- `read_at timestamptz`
- `created_at timestamptz not null default now()`

Constraints:

- `notification_type in ('monday_checkin', 'thursday_discussion', 'reply', 'friend_finished_book', 'voting_opened', 'weekly_recap')`

## Book Of The Month Tables

These are P1/P2 but cheap to include if the MVP already needs nominations.

### `book_nominations`

Columns:

- `id uuid primary key default gen_random_uuid()`
- `group_id uuid not null references groups(id) on delete cascade`
- `book_id uuid not null references books(id)`
- `nominated_by uuid not null references profiles(id) on delete cascade`
- `cycle_start date`
- `reason text`
- `status text not null default 'active'`
- `created_at timestamptz not null default now()`

Constraints:

- `status in ('active', 'shortlisted', 'selected', 'withdrawn')`
- `unique (group_id, book_id, cycle_start)`

### `book_votes`

Columns:

- `id uuid primary key default gen_random_uuid()`
- `nomination_id uuid not null references book_nominations(id) on delete cascade`
- `user_id uuid not null references profiles(id) on delete cascade`
- `vote_weight integer not null default 1`
- `created_at timestamptz not null default now()`

Constraints:

- `unique (nomination_id, user_id)`
- `vote_weight > 0`

## Relationship Summary

- `auth.users` has one `profiles`.
- `profiles` own and join many `groups` through `group_members`.
- `books` are shared records; `user_books` stores personal reading state.
- `reading_logs` belong to a user and optionally a `user_book` and group.
- `discussion_posts` belong to groups and can attach to prompts and user books.
- `comments` belong to posts and can self-reference for replies.
- `reviews` belong to a user's book record.
- `activities` are curated group feed entries that point back to source records.
- `xp_events`, `momentum_scores`, and `user_achievements` are derived from user behavior but stored as durable history.

## Row-Level Security Assumptions

Enable RLS on every application table.

### Helper predicates

Create SQL helper functions to keep policies readable:

- `is_group_member(group_id uuid)`: current user has active membership.
- `is_group_admin(group_id uuid)`: current user has owner or admin membership.
- `owns_profile(user_id uuid)`: `auth.uid() = user_id`.

All helper functions should be `security definer`, stable, and set a safe `search_path`.

### Policy Model

`profiles`:

- Users can read profiles for themselves and active members of groups they belong to.
- Users can insert and update only their own profile.

`groups`:

- Active members can read their groups.
- Authenticated users can create groups.
- Owners/admins can update group details.
- Owners can archive groups.

`group_members`:

- Active members can read membership rows for their groups.
- Group admins can invite, remove, and change member roles.
- Users can join with a valid invite code through a controlled RPC.
- Users can mark their own membership as `left`.

`books`:

- Authenticated users can read books.
- Authenticated users can create books.
- Updates should be restricted to the creator or service role until moderation rules exist.

`user_books`, `reading_logs`, `reviews`:

- Users can create and update their own rows.
- Group members can read rows shared to a group when the owner is an active member of that same group.
- Private rows are readable only by the owner.

`discussion_prompts`, `discussion_posts`, `comments`, `activities`:

- Active group members can read group content.
- Active group members can create content in the group.
- Authors can edit or soft-delete their own posts/comments.
- Admins can hide or moderate content.

`reactions`:

- Active group members can read reactions on content they can read.
- Users can create and delete their own reactions.

`xp_events`, `momentum_scores`, `achievements`, `user_achievements`:

- Users can read their own reward history.
- Group members can read score snapshots needed for group leaderboards.
- Writes should be service role or trusted RPC only.

`notifications`:

- Users can read and update only their own notifications.
- Creation should be service role or trusted RPC only.

## Spoiler Visibility

RLS should protect private group boundaries. Spoiler hiding can mostly live in application logic because users may intentionally reveal content.

Recommended rule:

- Store `spoiler_level`, `spoiler_page`, and `spoiler_chapter` on posts, comments, and reviews.
- Fetch the viewer's matching `user_books` progress when rendering.
- Hide, blur, or lock content if the viewer is behind the content progress point.
- Do not rely on spoiler fields for hard security; they are experience controls, not privacy controls.

## Indexes

High-value MVP indexes:

- `group_members (user_id, status)`
- `group_members (group_id, status)`
- `groups (owner_id)`
- `books (lower(title), lower(author))`
- `books (isbn_13) where isbn_13 is not null`
- `user_books (user_id, status)`
- `user_books (book_id)`
- `reading_logs (user_id, logged_for_date desc)`
- `reading_logs (group_id, created_at desc) where visibility = 'groups'`
- `discussion_posts (group_id, created_at desc) where is_deleted = false`
- `comments (post_id, created_at)`
- `reviews (user_book_id, created_at desc)`
- `activities (group_id, created_at desc) where is_hidden = false`
- `xp_events (user_id, created_at desc)`
- `momentum_scores (group_id, week_start desc)`
- `momentum_scores (user_id, week_start desc)`
- `notifications (user_id, created_at desc) where read_at is null`

Add full-text search later if book discovery or post search becomes important.

## Data Integrity Rules

Use database constraints for invariants that should never be broken:

- Positive or zero progress values.
- Valid enum-like values through check constraints.
- One active membership per user per group.
- One final review per user book.
- One reaction per user, target, and reaction type.
- Score and rating bounds.
- Finished books must have `finished_at`.

Use trusted RPC functions or service-role jobs for workflows that touch multiple tables:

- `create_group(name, description)` creates group and owner membership together.
- `join_group_by_invite(invite_code)` validates invite and inserts membership.
- `log_reading_checkin(...)` inserts `reading_logs`, updates `user_books`, creates feed activity when appropriate, and awards XP.
- `complete_book(...)` marks a book finished, creates completion activity, and may award XP.
- `calculate_weekly_momentum(week_start)` writes score snapshots.

## MVP Cut Line

Build now:

- `profiles`
- `groups`
- `group_members`
- `books`
- `user_books`
- `reading_logs`
- `discussion_prompts`
- `discussion_posts`
- `comments`
- `reviews`
- `activities`
- `xp_events`
- `momentum_scores`
- `notifications`

Seed or stub now:

- `achievements`
- `user_achievements`

Add when the feature enters active development:

- `book_nominations`
- `book_votes`

Avoid for MVP:

- Public communities
- Follower graphs
- Direct messages
- Complex moderation queues
- Global book clubs
- Separate tables for every feed activity type
- Hard-coded leaderboard tables before scoring behavior is validated

