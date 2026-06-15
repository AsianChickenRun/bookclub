# API And Backend Boundaries

Status: Draft pending PM approval

Owner: Backend Architecture specialist

Do not sync this document to GitHub until the Product Manager reviews and approves it.

## Purpose

This document defines the initial backend boundary for Reading Momentum. It explains what the client may do directly through Supabase, what must run through trusted server code, how route handlers or server actions should be used, and what Sprint 1 should scaffold versus defer.

The goal is a practical MVP boundary: enough structure to protect private groups and multi-table writes, without creating a large custom API before the product needs it.

## Assumptions

- The app will use Next.js with the App Router.
- Supabase Auth is the identity provider.
- Supabase Postgres with Row Level Security is the authorization foundation.
- The browser client uses the anon key and relies on RLS.
- Trusted server operations use a server Supabase client, database RPC, or service-role client depending on risk.
- Sprint 1 focuses on auth, profiles, groups, membership, and app scaffolding.
- Sprint 1 does not implement scoring, XP, AI prompts, reviews, notifications, or Book of the Month beyond placeholder-safe architecture.

## Boundary Principles

- RLS is the primary protection for user and group data.
- The client can perform simple single-row reads and writes when RLS can safely enforce the rule.
- Multi-table workflows should use trusted server code or database RPC so partial writes do not leave broken state.
- The service-role key must never be available to browser code.
- Derived data should be written only by trusted code.
- The backend should expose product workflows, not raw administrative powers.
- API responses should be shaped for mobile-first screens and avoid leaking private group data.

## Supabase Access Model

### Browser Supabase Client

Use for:

- Reading the signed-in user's profile.
- Updating the signed-in user's basic profile fields.
- Reading groups where the user is an active member.
- Reading group member lists for groups the user belongs to.
- Reading the signed-in user's current books.
- Reading books from the shared `books` table.
- Creating basic user-owned book records when the write is covered by RLS.
- Reading the user's own check-ins.
- Reading group feed data when RLS confirms membership.

Do not use browser access for:

- Creating a group and owner membership together.
- Joining a group by invite code.
- Awarding XP.
- Updating cached totals, streaks, or scores.
- Creating activities from another source action.
- Running AI prompt generation.
- Sending notifications.
- Any write that requires bypassing RLS.

### Server Supabase Client With User Session

Use for operations that need the user's identity plus stricter orchestration:

- Validating form input before database writes.
- Creating a group through a workflow function.
- Joining a group through a controlled invite flow.
- Logging a reading check-in and updating current progress.
- Creating a book and `user_books` row together.
- Performing authorization checks before returning shaped page data.

This client should still respect the user's permissions unless a specific operation is intentionally delegated to a trusted RPC or service-role path.

### Service-Role Supabase Client

Use sparingly. Only server-only code may instantiate it.

Allowed uses:

- Admin-only maintenance scripts.
- Scheduled jobs for weekly momentum calculations.
- Trusted creation of derived records such as XP events, activities, achievements, or notifications.
- Invite-code rotation or recovery workflows that require elevated access.
- Backfill and repair jobs approved by the PM or engineering lead.

Not allowed:

- General page data loading.
- Convenience reads that could use the user-session client.
- Browser code.
- Client-triggered operations without explicit server validation.

## Route Handlers And Server Actions

Sprint 1 may use either Next.js server actions or route handlers, but the project should keep one convention per workflow type.

Recommended split:

- Server actions for authenticated form submissions from app pages.
- Route handlers for webhook-like endpoints, future scheduled jobs, health checks, or client code that needs a stable HTTP contract.
- Database RPC for atomic workflows that are primarily data mutations and should be protected close to the database.

Initial server action candidates:

- `createProfile`
- `updateProfile`
- `createGroup`
- `joinGroupByInviteCode`
- `addCurrentBook`
- `logReadingCheckIn`

Initial route handler candidates:

- `GET /api/health`
- Future `POST /api/jobs/calculate-weekly-momentum`
- Future `POST /api/ai/reflection-prompt`

Sprint 1 should scaffold the structure for server actions and route handlers, but only implement the actions required by approved Sprint 1 tickets.

## Trusted Operations

These operations should not be implemented as direct client-side writes.

### `create_group`

Reason:

- Must create `groups` and `group_members` together.
- Must assign the creator as owner.
- Must generate or store a safe invite code.

Recommended implementation:

- Server action calls a database RPC such as `create_group(name, description)`.
- RPC inserts group and membership in one transaction.
- RPC returns the created group summary.

### `join_group_by_invite`

Reason:

- Invite code lookup should not reveal private group information to non-members.
- Must prevent duplicate active memberships.
- May later support expired invites, invite limits, or audit logs.

Recommended implementation:

- Server action validates the code format.
- RPC checks invite code and inserts or reactivates membership.
- Return a minimal group summary only after membership is established.

### `add_current_book`

Reason:

- May create or reuse a `books` row.
- Must create a matching `user_books` row.
- Must validate goal type, format, and progress fields together.

Recommended implementation:

- Server action for Sprint 1 or Sprint 2, depending on scope.
- Direct RLS writes are acceptable for a very simple first version, but an action is preferred once book creation and user progress are combined.

### `log_reading_checkin`

Reason:

- Must insert `reading_logs`.
- Must update `user_books` current progress.
- May create a group activity.
- Later may award XP, update streaks, and trigger reflection prompts.

Recommended implementation:

- Server action or database RPC.
- Sprint 1 should define the contract only unless check-ins are explicitly pulled into scope.

### Derived Rewards And Scores

Reason:

- XP, achievements, momentum scores, and leaderboard snapshots should not be user-writable.

Recommended implementation:

- Service-role scheduled jobs or trusted server workflows.
- Defer implementation until the relevant sprint.

## Initial API Contracts

These contracts describe the expected backend shape. Exact function names may change during implementation.

### Profiles

#### Read Current Profile

Client-side access:

- Query `profiles` where `id = auth.uid()`.

Response shape:

```ts
type CurrentProfile = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  favoriteGenres: string[];
  timezone: string;
  totalXp: number;
  currentStreakDays: number;
  longestStreakDays: number;
};
```

#### Create Or Update Profile

Recommended boundary:

- Server action for form handling.
- Direct client update is acceptable only for simple fields protected by RLS.

Request:

```ts
type SaveProfileInput = {
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  favoriteGenres?: string[];
  timezone?: string;
};
```

Validation:

- `displayName` is required and trimmed.
- `displayName` max length is 80.
- `bio` max length should be modest for MVP.
- `favoriteGenres` should be an array of short strings.
- `timezone` should default to the user's browser timezone or project default.

Response:

```ts
type SaveProfileResult = {
  profile: CurrentProfile;
};
```

### Groups

#### List My Groups

Client-side access:

- Query active `group_members` for the signed-in user and join readable group summaries.

Response:

```ts
type GroupSummary = {
  id: string;
  name: string;
  description: string | null;
  role: 'owner' | 'admin' | 'member';
  memberCount: number;
  createdAt: string;
};
```

#### Create Group

Trusted boundary:

- Server action or RPC.

Request:

```ts
type CreateGroupInput = {
  name: string;
  description?: string | null;
};
```

Validation:

- `name` is required and max 100 characters.
- Description is optional and length-limited.
- Authenticated user must have a profile.

Response:

```ts
type CreateGroupResult = {
  group: GroupSummary & {
    inviteCode: string | null;
  };
};
```

#### Join Group By Invite Code

Trusted boundary:

- Server action or RPC.

Request:

```ts
type JoinGroupInput = {
  inviteCode: string;
};
```

Validation:

- Code is trimmed and normalized.
- Invalid codes return a generic failure.
- Existing members get an idempotent success response.

Response:

```ts
type JoinGroupResult = {
  group: GroupSummary;
};
```

Security note:

- Do not expose whether a group exists until the join succeeds.

#### Read Group Detail

Client-side or server-side user-session access:

- Allowed only for active members through RLS.

Response:

```ts
type GroupDetail = GroupSummary & {
  description: string | null;
  members: Array<{
    id: string;
    displayName: string;
    avatarUrl: string | null;
    role: 'owner' | 'admin' | 'member';
  }>;
};
```

### Books

#### Search Or List Books

Client-side access:

- Query shared `books`.
- Sprint 1 may use simple title/author search.

Request:

```ts
type BookSearchInput = {
  query: string;
  limit?: number;
};
```

Response:

```ts
type BookSummary = {
  id: string;
  title: string;
  author: string | null;
  coverUrl: string | null;
  defaultPageCount: number | null;
  defaultChapterCount: number | null;
  genres: string[];
};
```

#### Add Current Book

Boundary:

- Defer unless Sprint 1 explicitly includes current-book creation.
- Prefer server action once implemented.

Request:

```ts
type AddCurrentBookInput = {
  bookId?: string;
  title?: string;
  author?: string | null;
  format: 'print' | 'ebook' | 'audiobook' | 'mixed';
  goalType: 'pages' | 'chapters' | 'minutes' | 'sessions';
  totalPages?: number | null;
  totalChapters?: number | null;
  currentPage?: number | null;
  currentChapter?: number | null;
  startedAt?: string;
  targetFinishDate?: string | null;
};
```

Validation:

- Either `bookId` or `title` is required.
- Progress fields must match the selected goal type where applicable.
- Current progress cannot exceed total progress.

Response:

```ts
type AddCurrentBookResult = {
  userBook: {
    id: string;
    book: BookSummary;
    status: 'current' | 'paused' | 'finished' | 'abandoned';
    format: 'print' | 'ebook' | 'audiobook' | 'mixed';
    goalType: 'pages' | 'chapters' | 'minutes' | 'sessions';
    currentPage: number | null;
    currentChapter: number | null;
    totalPages: number | null;
    totalChapters: number | null;
  };
};
```

### Check-Ins

#### Log Reading Check-In

Boundary:

- Defer implementation until the habit-loop sprint unless PM pulls it into Sprint 1.
- Contract should be scaffolded early because it defines several backend boundaries.

Request:

```ts
type LogReadingCheckInInput = {
  userBookId: string;
  groupId?: string | null;
  loggedForDate?: string;
  pagesRead?: number;
  chaptersRead?: number;
  minutesRead?: number;
  audiobookMinutes?: number;
  sessionCompleted?: boolean;
  skipped?: boolean;
  note?: string | null;
  visibility?: 'private' | 'groups';
};
```

Validation:

- Authenticated user must own the `userBookId`.
- If `groupId` is provided, the user must be an active member.
- Reading amounts must be non-negative.
- A skipped check-in cannot include positive reading amounts.
- At least one meaningful check-in field must be present.

Response:

```ts
type LogReadingCheckInResult = {
  readingLog: {
    id: string;
    loggedForDate: string;
    createdAt: string;
  };
  updatedUserBook: {
    id: string;
    currentPage: number | null;
    currentChapter: number | null;
    minutesReadTotal: number;
    sessionsTotal: number;
  };
  activityId: string | null;
};
```

Future side effects:

- XP event
- streak update
- activity feed item
- reflection prompt generation
- notification fanout

Sprint 1 should not implement those side effects.

## Error Handling

Return predictable, user-safe errors.

Recommended error shape:

```ts
type ActionError = {
  code:
    | 'unauthenticated'
    | 'forbidden'
    | 'not_found'
    | 'validation_error'
    | 'conflict'
    | 'rate_limited'
    | 'unexpected_error';
  message: string;
  fieldErrors?: Record<string, string>;
};
```

Guidelines:

- Do not expose private group names for failed invite attempts.
- Treat missing access and missing records similarly where privacy matters.
- Log server-side details without returning secrets or internal traces to the client.
- Keep user-facing messages calm and actionable.

## Environment Variables

Sprint 1 should document these without committing real secrets:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET` only if a specific server verification path requires it
- `NEXT_PUBLIC_APP_URL`

Future variables:

- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `POSTHOG_KEY`
- `POSTHOG_HOST`
- Scheduled job secrets or deployment provider cron tokens

Rules:

- `NEXT_PUBLIC_*` values may be exposed to the browser.
- Service-role and third-party API keys must be server-only.
- Local examples should use placeholders only.

## Sprint 1 Scaffold

Sprint 1 should scaffold:

- Supabase browser client.
- Supabase server client for authenticated server code.
- Optional service-role helper kept server-only and unused unless needed.
- Environment variable validation.
- Basic action result and error types.
- Server action folder/module convention.
- Route handler convention with a health endpoint.
- Initial database migrations for `profiles`, `groups`, and `group_members`.
- RLS helper functions and policies for those initial tables.
- Auth callback and session handling.
- Profile create/update action.
- Group create action.
- Group join action.
- Minimal typed data mappers for profile and group summaries.

Sprint 1 may scaffold, but should not fully implement:

- Book search.
- Add current book.
- Check-in logging.
- Activity feed creation.

These can appear as placeholder modules or contracts if useful for Sprint 2 planning.

## Defer

Defer until later sprints:

- AI prompt generation routes.
- Weekly scoring jobs.
- XP and achievement awarding.
- Notification delivery.
- Book of the Month nomination and voting endpoints.
- Review and spoiler timeline endpoints.
- Public community APIs.
- Admin moderation tools.
- Global search.
- Webhooks from external book providers.
- Complex analytics pipelines.

## Open Questions For PM

- Should Sprint 1 include adding a current book, or stop at profile and group foundation?
- Should joining a group use a human-readable invite code in Sprint 1, or a temporary controlled test flow?
- Should the project standardize on server actions for form mutations immediately, or keep route handlers for all mutations?
- Should book records be user-created only in the MVP, or should Sprint 1 prepare for external book lookup?
- What is the minimum production deployment health check expected for Sprint 1 approval?

## Recommended Sprint 1 Acceptance Criteria

- Browser Supabase client exists and uses only anon-key access.
- Server Supabase client exists and reads the authenticated user session.
- Service-role helper, if present, is server-only and unused by client code.
- Required environment variables are documented with placeholders.
- Profile create/update flow works with RLS enabled.
- Group create flow creates owner membership atomically.
- Group join flow does not leak private group details before successful join.
- Non-members cannot read private group data.
- Server actions return consistent success and error shapes.
- Check-in, AI, scoring, XP, notification, and review systems remain out of Sprint 1 implementation unless PM explicitly changes scope.

