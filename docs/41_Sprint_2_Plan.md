# Sprint 2 Plan: Current Books And Check-In Foundation

Status: Active
Version: 0.1
Owner: Product Manager

## Objective

Sprint 2 begins the core reading habit loop while keeping advanced systems deferred.

The sprint should let users add current books and complete basic reading check-ins. It should preserve the under-30-second check-in principle and keep the implementation ready for Supabase persistence.

## Entry Criteria

Sprint 2 can begin because:

- Sprint 1 local app foundation is complete.
- App shell builds successfully.
- Navigation exists.
- Local account/profile/group flows exist.
- Database architecture exists.
- Initial migration exists.
- Product systems out of scope for Sprint 1 remained deferred.

External credentials remain blocked but should not stop local feature prototyping.

## Sprint 2 Goals

- Add current book flow.
- Store current books locally first, with Supabase-ready data shape.
- Show current books on Today.
- Add fast check-in flow.
- Store reading logs locally first, with Supabase-ready data shape.
- Support pages, chapters, minutes, audiobook minutes, sessions, and skipped-day logs.
- Add check-in visibility control.
- Add progress validation.
- Keep scoring, XP, AI prompts, reviews, notifications, and Book of the Month out of scope.

## Sprint 2 Tickets

### S2-001: Add Current Book Flow

Priority: P0

As a user, I want to add a current book so I can track what I am reading.

Acceptance criteria:

- User can add title.
- User can add author.
- User can choose format.
- User can choose goal type.
- User can add optional total pages or chapters.
- User can add current progress.
- Book appears on Today and Books.

### S2-002: Add Current Book Local Persistence

Priority: P0

As the app, we need local book persistence with a Supabase-ready shape so the flow can later move to the database.

Acceptance criteria:

- Local book shape maps to planned `books` and `user_books` concepts.
- User can have multiple current books.
- Local state survives refresh.
- No scoring is calculated.

### S2-003: Add Fast Check-In Flow

Priority: P0

As a busy reader, I want to log progress quickly so the app supports my habit without friction.

Acceptance criteria:

- User can select a current book.
- User can enter one progress value.
- User can choose skipped today.
- User can set visibility to private or group-visible.
- User can submit without answering a reflection prompt.

### S2-004: Add Reading Log Local Persistence

Priority: P0

As the app, we need append-only reading logs so future streaks, scoring, and analytics have a reliable source.

Acceptance criteria:

- Each check-in creates a reading log.
- Logs include date, book, unit, amount, skipped state, and visibility.
- Logs persist locally.
- Logs are displayed in a simple history view.

### S2-005: Add Progress Validation

Priority: P0

As a user, I want the app to prevent obvious progress mistakes.

Acceptance criteria:

- Negative progress cannot be submitted.
- Progress beyond known total warns the user.
- Skipped check-ins cannot include positive reading amount.
- Validation copy is supportive.

### S2-006: Update Dashboard Current Book State

Priority: P0

As a user, I want Today to show my current book and next action.

Acceptance criteria:

- Today shows the most recently active book.
- Today links to check-in flow.
- Today shows no-book empty state when appropriate.
- Today does not show scoring or XP.

## Out Of Scope

Sprint 2 must not implement:

- Reading Momentum score
- XP
- Achievements
- Leaderboards
- AI prompts
- Reviews
- Notifications
- Book of the Month
- Recommendations

## Success Criteria

Sprint 2 is complete when:

- User can add a current book.
- User can see current books.
- User can complete a basic check-in.
- User can view recent check-ins.
- Local data shape is ready to migrate to Supabase.
- Lint, typecheck, and build pass.

