# Sprint 3 Activity And Discussion Data

Status: Draft pending PM approval

Owner: Database Architecture specialist

Do not sync this document to GitHub until the Product Manager reviews and approves it.

## Purpose

Sprint 3 introduces the first social layer after current books and check-ins:

- local group activity feed
- discussion posts
- optional replies or reply-ready shape
- conservative spoiler metadata

This document defines local data shapes for the current prototype and future Supabase-ready shapes that should align with `12_Database_Architecture.md`.

## Scope

In scope for Sprint 3:

- Activity items created from group-visible check-ins.
- Activity items created from discussion posts.
- Basic discussion post records.
- Reply/comment shape if implementation has time.
- Spoiler metadata fields on discussion content.
- Future-ready Supabase table definitions for `activities`, `discussion_posts`, and `comments`.

Out of scope:

- XP
- Reading Momentum score
- Achievements
- Leaderboards
- AI prompts
- Reviews
- Notifications
- Book of the Month
- Full spoiler reveal workflow
- Moderation queues

## Current Local Context

The app currently stores prototype state in `src/lib/mock-app-state.ts`.

Existing local data:

- `MockUser`
- `MockProfile`
- `MockGroup`
- `MockUserBook`
- `MockReadingLog`

Sprint 2 check-ins already include:

- `visibility: "private" | "groups"`
- `userBookId`
- `loggedForDate`
- `unit`
- `amount`
- `skipped`
- `note`
- `createdAt`

Sprint 3 should build on that shape instead of replacing it.

## Local Type Additions

### Shared Enums

```ts
export type ActivityType =
  | "checkin"
  | "discussion_post"
  | "comment"
  | "finished_book";

export type ActivitySubjectType =
  | "reading_log"
  | "discussion_post"
  | "comment"
  | "user_book";

export type SpoilerLevel = "none" | "progress_locked" | "explicit";

export type SpoilerProgressUnit = "page" | "chapter" | null;
```

Notes:

- `finished_book` can be present in the type for compatibility, but Sprint 3 does not need to implement completion activities unless already available.
- `progress_locked` means content has a page or chapter boundary.
- `explicit` means the user says the content may contain spoilers, but the app cannot safely infer an unlock point yet.

### `MockActivity`

Recommended local shape:

```ts
export type MockActivity = {
  id: string;
  groupId: string;
  actorId: string;
  actorName: string;
  type: ActivityType;
  subjectType: ActivitySubjectType;
  subjectId: string;
  bookId: string | null;
  bookTitle: string | null;
  summary: string;
  createdAt: string;
};
```

Creation rules:

- Create a `checkin` activity only when `MockReadingLog.visibility === "groups"`.
- Do not create activity for private check-ins.
- Create a `discussion_post` activity when a group member creates a discussion post.
- Keep activity summary short and non-spoilery.
- Do not store full post/comment bodies in activity summaries.

Recommended `MockAppState` addition:

```ts
activities: MockActivity[];
```

### `MockDiscussionPost`

Recommended local shape:

```ts
export type MockDiscussionPost = {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  userBookId: string | null;
  bookId: string | null;
  bookTitle: string | null;
  body: string;
  spoilerLevel: SpoilerLevel;
  spoilerProgressUnit: SpoilerProgressUnit;
  spoilerPage: number | null;
  spoilerChapter: number | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};
```

Validation:

- `body` is required and trimmed.
- `body` should have an MVP max length, recommended 2,000 characters.
- `spoilerLevel = "none"` should store no progress boundary.
- `spoilerLevel = "progress_locked"` should require either `spoilerPage` or `spoilerChapter`.
- `spoilerLevel = "explicit"` may have no progress boundary.
- Page and chapter boundaries must be positive integers when present.

Recommended `MockAppState` addition:

```ts
discussionPosts: MockDiscussionPost[];
```

### `MockComment`

Sprint 3 can implement or defer comments. If deferred, keep this as the expected future local shape.

```ts
export type MockComment = {
  id: string;
  postId: string;
  parentCommentId: string | null;
  authorId: string;
  authorName: string;
  body: string;
  spoilerLevel: SpoilerLevel;
  spoilerProgressUnit: SpoilerProgressUnit;
  spoilerPage: number | null;
  spoilerChapter: number | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};
```

Recommended `MockAppState` addition if comments are implemented:

```ts
comments: MockComment[];
```

MVP note:

- Even if nested replies are supported in data, the UI should show only one or two levels until discussion complexity is validated.

## Local Helper Expectations

### `createActivityFromCheckIn`

Expected behavior:

- Takes a `MockReadingLog`, matching `MockUserBook`, and group context.
- Returns `null` if check-in visibility is private.
- Returns a `MockActivity` if visibility is groups.
- Uses a summary like `Checked in on Book Title`.
- Avoids exposing private notes in the feed summary.

### `createMockDiscussionPost`

Expected behavior:

- Validates group membership exists in local state.
- Creates a post.
- Creates a matching activity.
- Stores spoiler metadata on the post, not only on the activity.

### `createMockComment`

Expected behavior if comments are included:

- Validates the target post exists.
- Creates a comment.
- Optionally creates a comment activity only if PM wants comments in the feed.
- Stores spoiler metadata on the comment.

## Supabase-Ready Tables

These shapes preserve the future schema from `12_Database_Architecture.md` while staying narrow for Sprint 3.

## Table: `activities`

Purpose:

- Curated group feed entries.
- Avoid deriving every feed item from raw source tables at read time.

Columns:

```sql
id uuid primary key default gen_random_uuid(),
group_id uuid not null references public.groups(id) on delete cascade,
actor_id uuid not null references public.profiles(id) on delete cascade,
activity_type text not null,
subject_type text,
subject_id uuid,
book_id uuid references public.books(id) on delete set null,
summary text,
is_hidden boolean not null default false,
created_at timestamptz not null default now()
```

Sprint 3 activity types:

```sql
constraint activities_type_check check (
  activity_type in ('checkin', 'discussion_post', 'comment', 'finished_book')
)
```

Recommended broader future set:

```sql
activity_type in (
  'checkin',
  'reflection',
  'post',
  'discussion_post',
  'comment',
  'finished_book',
  'review',
  'nomination',
  'streak_milestone'
)
```

Recommended subject types:

```sql
subject_type in ('reading_log', 'discussion_post', 'comment', 'user_book')
```

Indexes:

```sql
create index activities_group_created_idx
on public.activities(group_id, created_at desc)
where is_hidden = false;

create index activities_actor_created_idx
on public.activities(actor_id, created_at desc);
```

RLS:

- Active group members can read visible activities in their groups.
- Active group members can create activities only through trusted app logic or RPC.
- Authors should not directly edit activity rows.
- Admins can hide activities later.

Implementation recommendation:

- For Sprint 3 local prototype, create activities in local state.
- For future Supabase implementation, create activity rows in the same trusted operation that creates the source event.

## Table: `discussion_posts`

Purpose:

- Top-level group discussion posts.
- Can optionally attach to a user's book.
- Carries spoiler metadata before full spoiler reveal workflows exist.

Columns:

```sql
id uuid primary key default gen_random_uuid(),
group_id uuid not null references public.groups(id) on delete cascade,
author_id uuid not null references public.profiles(id) on delete cascade,
user_book_id uuid references public.user_books(id) on delete set null,
prompt_id uuid references public.discussion_prompts(id) on delete set null,
post_type text not null default 'discussion',
body text not null,
spoiler_level text not null default 'none',
spoiler_page integer,
spoiler_chapter integer,
is_deleted boolean not null default false,
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

Sprint 3 note:

- `prompt_id` can be omitted locally because AI prompts are out of scope.
- Keep the future SQL shape compatible with `prompt_id`.

Constraints:

```sql
constraint discussion_posts_type_check
  check (post_type in ('discussion', 'prompt_answer', 'checkin_reflection', 'milestone')),
constraint discussion_posts_spoiler_level_check
  check (spoiler_level in ('none', 'progress_locked', 'explicit')),
constraint discussion_posts_body_length
  check (is_deleted or char_length(trim(body)) between 1 and 2000),
constraint discussion_posts_spoiler_page_positive
  check (spoiler_page is null or spoiler_page > 0),
constraint discussion_posts_spoiler_chapter_positive
  check (spoiler_chapter is null or spoiler_chapter > 0),
constraint discussion_posts_progress_locked_has_boundary
  check (
    spoiler_level <> 'progress_locked'
    or spoiler_page is not null
    or spoiler_chapter is not null
  ),
constraint discussion_posts_none_has_no_boundary
  check (
    spoiler_level <> 'none'
    or (spoiler_page is null and spoiler_chapter is null)
  )
```

Indexes:

```sql
create index discussion_posts_group_created_idx
on public.discussion_posts(group_id, created_at desc)
where is_deleted = false;

create index discussion_posts_author_created_idx
on public.discussion_posts(author_id, created_at desc);

create index discussion_posts_user_book_idx
on public.discussion_posts(user_book_id)
where user_book_id is not null;
```

RLS:

- Active group members can read non-deleted posts in their groups.
- Active group members can create posts in their groups as themselves.
- Authors can update their own posts.
- Authors can soft-delete their own posts.
- Admin moderation can be added later.

Important RLS check:

- If `user_book_id` is provided, the `user_books.user_id` should match the author.

## Table: `comments`

Purpose:

- Replies to discussion posts.
- Supports future threaded discussion without requiring a separate replies table.

Columns:

```sql
id uuid primary key default gen_random_uuid(),
post_id uuid not null references public.discussion_posts(id) on delete cascade,
parent_comment_id uuid references public.comments(id) on delete cascade,
author_id uuid not null references public.profiles(id) on delete cascade,
body text not null,
spoiler_level text not null default 'none',
spoiler_page integer,
spoiler_chapter integer,
is_deleted boolean not null default false,
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

Constraints:

```sql
constraint comments_spoiler_level_check
  check (spoiler_level in ('none', 'progress_locked', 'explicit')),
constraint comments_body_length
  check (is_deleted or char_length(trim(body)) between 1 and 1000),
constraint comments_spoiler_page_positive
  check (spoiler_page is null or spoiler_page > 0),
constraint comments_spoiler_chapter_positive
  check (spoiler_chapter is null or spoiler_chapter > 0),
constraint comments_progress_locked_has_boundary
  check (
    spoiler_level <> 'progress_locked'
    or spoiler_page is not null
    or spoiler_chapter is not null
  ),
constraint comments_none_has_no_boundary
  check (
    spoiler_level <> 'none'
    or (spoiler_page is null and spoiler_chapter is null)
  )
```

Indexes:

```sql
create index comments_post_created_idx
on public.comments(post_id, created_at);

create index comments_parent_created_idx
on public.comments(parent_comment_id, created_at)
where parent_comment_id is not null;

create index comments_author_created_idx
on public.comments(author_id, created_at desc);
```

RLS:

- Active group members can read comments on posts in their groups.
- Active group members can create comments on posts in their groups.
- Authors can update or soft-delete their own comments.
- Admin moderation can be added later.

Important integrity rule:

- If `parent_comment_id` is present, the parent comment must belong to the same `post_id`.
- This may require a trigger or trusted application validation; it is acceptable to enforce in app logic for Sprint 3 local prototype.

## Spoiler Metadata Rules

Spoiler metadata is an experience control, not a privacy boundary.

Shared fields:

- `spoiler_level`
- `spoiler_page`
- `spoiler_chapter`

Allowed levels:

- `none`: safe by default; no progress boundary.
- `progress_locked`: content should be hidden until the viewer reaches a page or chapter boundary.
- `explicit`: content may contain spoilers and should require intentional reveal.

Rules:

- `none` must not store page or chapter boundary.
- `progress_locked` must store at least one boundary.
- `explicit` may optionally store a boundary, but does not require one.
- Store only page/chapter metadata for Sprint 3.
- Do not attempt automatic unlocks for minutes-only or sessions-only readers in Sprint 3.

Display guidance:

- `none`: show normally.
- `progress_locked`: show locked/hidden copy such as `Hidden until page 120`.
- `explicit`: show locked/hidden copy such as `Possible spoiler`.
- Full reveal state can remain local UI state and does not need a database table in Sprint 3.

## Activity Creation Rules

Create feed activity for:

- Group-visible check-in.
- New discussion post.
- Finished book, if completion is available.

Do not create feed activity for:

- Private check-ins.
- Every profile edit.
- Every book edit.
- Every tiny progress correction.
- Hidden or deleted posts.

Maybe create later:

- Comments, only if the feed needs to show replies.
- Reviews, when review system exists.
- Streak milestones, when scoring/streak system exists.

## Supabase Workflow Recommendations

Future trusted functions or server actions:

- `create_discussion_post(...)`
- `create_comment(...)`
- `create_activity_for_checkin(...)`

Recommended behavior:

- `create_discussion_post` inserts a post and matching activity in one trusted operation.
- `create_comment` inserts a comment and optionally an activity.
- Group-visible check-in activity should be created by the same workflow that logs the check-in.
- The browser should not directly insert arbitrary activity rows.

## RLS Policy Outline

`activities`:

- Select when `is_group_member(group_id)` and `is_hidden = false`.
- Insert through trusted workflow only, or allow authenticated insert only with strict checks that actor is `auth.uid()` and actor is a group member.
- Update/hide by group admin later.

`discussion_posts`:

- Select when `is_group_member(group_id)` and `is_deleted = false`.
- Insert when author is `auth.uid()` and `is_group_member(group_id)`.
- Update when author is `auth.uid()`.
- Admin hide/moderation can be deferred.

`comments`:

- Select when the viewer is a member of the parent post's group.
- Insert when author is `auth.uid()` and the author is a member of the parent post's group.
- Update when author is `auth.uid()`.
- Admin hide/moderation can be deferred.

## Local-To-Supabase Mapping

| Local field | Supabase field |
| --- | --- |
| `groupId` | `group_id` |
| `actorId` | `actor_id` |
| `authorId` | `author_id` |
| `type` | `activity_type` |
| `subjectType` | `subject_type` |
| `subjectId` | `subject_id` |
| `bookId` | `book_id` |
| `bookTitle` | joined from `books.title` or denormalized local helper only |
| `spoilerLevel` | `spoiler_level` |
| `spoilerPage` | `spoiler_page` |
| `spoilerChapter` | `spoiler_chapter` |
| `createdAt` | `created_at` |
| `updatedAt` | `updated_at` |

Local-only convenience fields:

- `actorName`
- `authorName`
- `bookTitle`

These should be joined from `profiles` and `books` in Supabase-backed reads rather than stored redundantly in final tables.

## Sprint 3 Acceptance Data Checklist

- [ ] Local app state includes activities.
- [ ] Group-visible check-ins create activity items.
- [ ] Private check-ins do not create activity items.
- [ ] Activity items carry group id, actor, type, subject id, summary, and created timestamp.
- [ ] Discussion posts can be stored locally.
- [ ] Discussion posts can attach to a book or user book when available.
- [ ] Discussion posts carry spoiler metadata.
- [ ] Progress-locked posts require page or chapter boundary.
- [ ] Explicit spoiler posts can be created without a boundary.
- [ ] Comments are either implemented with the documented shape or explicitly deferred.
- [ ] No XP, scoring, notification, AI, or review data is introduced in Sprint 3.

## Open Questions For PM

- Should comments be implemented in Sprint 3 or deferred to Sprint 4?
- Should comments create feed activity, or should only top-level discussion posts appear in the feed?
- Should progress-locked spoiler metadata allow both page and chapter at once, or require exactly one boundary?
- Should activity summaries include check-in notes, or keep notes only inside the source check-in?
- Should deleted posts remain visible as placeholders in discussions, or disappear from MVP views?

