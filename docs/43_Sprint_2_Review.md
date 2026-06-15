# Sprint 2 Review

Status: Complete for local current-book and check-in foundation
Version: 0.1
Owner: Product Manager

## Sprint Objective

Sprint 2 focused on the first core reading habit loop:

- Add current books.
- Show current books.
- Complete fast check-ins.
- Store reading logs locally.
- Preserve Supabase-ready data shape.

Advanced product systems remained out of scope.

## Completion Summary

Sprint 2 is complete as a local feature foundation sprint.

Completed:

- Current book add flow
- Current books list
- Today current-book card
- Fast check-in form
- Check-in visibility control
- Skipped-day check-in
- Reading log history
- Progress validation
- Supabase-ready type updates
- Sprint 2 reading foundation migration

## Accepted Local Functional Requirements

Users can now:

- Add a current book.
- Add book metadata such as title, author, format, goal type, page totals, chapter totals, and current progress.
- See current books on Books.
- See the most recent current book on Today.
- Complete a basic check-in.
- Mark skipped today without shame-based copy.
- Choose private or group-visible check-in visibility.
- See recent check-ins.

## Scope Control

Sprint 2 did not implement:

- Reading Momentum score
- XP
- Achievements
- Leaderboards
- AI prompts
- Reviews
- Notifications
- Book of the Month
- Recommendations

## Verification

Passed:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

Route checks passed:

- `/`
- `/today`
- `/groups`
- `/books`
- `/reviews`
- `/settings`
- `/sign-in`
- `/onboarding`

## Technical Debt

- Replace local persistence with Supabase-backed persistence when credentials are available.
- Apply and test Sprint 1 and Sprint 2 migrations in Supabase.
- Add route protection after real auth is connected.
- Add browser/e2e tests when visual automation is available.
- Add current-book editing and deletion later.
- Decide whether page check-ins represent absolute current page or pages read. Current local implementation treats page and chapter check-ins as absolute progress points.

## PM Decision

Sprint 2 is accepted as complete for local current-book and check-in foundation.

The app has moved from shell to first usable reading habit prototype.

## Transition Recommendation

Start Sprint 3.

Recommended Sprint 3 focus:

- Group-visible check-in activity feed
- Basic discussion post foundation
- Local feed activity model
- Conservative spoiler metadata model
- Preserve scoring, AI, reviews, and notifications as deferred unless needed for placeholders

