# Sprint 2 Preview: Core Reading Setup

## Status

This is a preview, not an approved sprint plan.

Sprint 2 should be planned after Sprint 1 is complete and reviewed. The exact scope may change based on Sprint 1 technical debt, implementation discoveries, and Product Manager approval.

## Likely Objective

Sprint 2 should begin the core reading product foundation without implementing advanced scoring, AI, or gamification.

The likely focus is:

- Current book tracking
- Basic reading logs
- Fast check-in flow
- Private versus group-visible check-in behavior
- Dashboard current-book state
- Basic group feed activity for check-ins

## Candidate Sprint 2 Goals

- Allow users to add current books.
- Allow users to log simple reading check-ins.
- Support pages, chapters, minutes, audiobook minutes, sessions, and skipped-day logs.
- Store reading logs in Supabase.
- Update user book progress from check-ins.
- Show current books on the Today dashboard.
- Create group-visible check-in activity when sharing is enabled.
- Keep check-in flow under 30 seconds.
- Define conservative spoiler behavior for progress-sensitive content.

## Candidate Tickets

### S2-001: Add Current Book Flow

Priority: P0

As a user, I want to add a current book so I can track what I am reading.

Source backlog: RM-004

### S2-002: Create User Books Database Migration

Priority: P0

As the system, we need `books` and `user_books` tables so reading progress can be stored separately from account identity.

Source docs: 12_Database_Architecture.md

### S2-003: Implement Fast Check-In Flow

Priority: P0

As a busy reader, I want to log progress quickly so the app supports my habit instead of becoming another task.

Source backlog: RM-005, QA-RM-005

### S2-004: Implement Reading Logs

Priority: P0

As the system, we need append-only reading logs so check-ins can power future streaks, scoring, analytics, and feed activity.

Source docs: 12_Database_Architecture.md

### S2-005: Add Check-In Visibility Control

Priority: P0

As a private group member, I want to choose whether a check-in is private or shared so I can participate comfortably.

Source backlog: QA-RM-006

### S2-006: Show Current Book On Today

Priority: P0

As a user, I want my current book visible on the dashboard so I know what to do next.

Source docs: 13_UX_Flows.md

### S2-007: Create Basic Group Feed Check-In Activity

Priority: P1

As a group member, I want to see meaningful shared check-ins so the group feels active.

Source backlog: RM-009, QA-RM-009

### S2-008: Validate Progress Inputs

Priority: P0

As a user, I want the check-in form to prevent obvious mistakes so my progress stays accurate.

Source backlog: QA-RM-004

## Explicitly Out Of Scope For Sprint 2 Preview

- Reading Momentum weekly score
- XP
- Achievements
- Leaderboards
- AI-generated prompts
- Reviews and live review timeline
- Book of the Month
- Notifications
- Recommendation engine

## Planning Notes

Sprint 2 should not begin until Sprint 1 is reviewed. If Sprint 1 leaves unresolved auth, RLS, deployment, or testing debt, Sprint 2 should first reserve capacity for stabilization.

