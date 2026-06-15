# Sprint 4 Plan: Group Detail And Replies

Status: Draft
Version: 0.1
Owner: Product Manager
Date: 2026-06-15

## Objective

Sprint 4 should turn the Sprint 3 social foundation into a clearer group experience by adding explicit group selection, discussion detail behavior, and lightweight replies.

## Entry Criteria

Sprint 4 may begin when Sprint 3 passes verification and PM review.

Minimum gates:

- Group feed exists locally.
- Discussion posts exist locally.
- Spoiler metadata exists locally and in the database plan.
- Sprint 3 decisions are recorded.

## Goals

- Add active group selection.
- Improve group feed organization.
- Add discussion replies locally.
- Add basic spoiler reveal affordance.
- Prepare ticket structure for persistence-backed group discussions.

## Tickets

### S4-001: Add Active Group Selection

Priority: P0

As a member of multiple groups, I want to switch between groups so I can see the right activity and discussions.

Acceptance criteria:

- Groups page supports choosing an active group.
- Feed and discussion posts update based on active group.
- Empty states remain clear when a selected group has no activity.

### S4-002: Add Discussion Replies

Priority: P0

As a group member, I want to reply to a discussion so conversations can continue.

Acceptance criteria:

- Discussion posts show local replies.
- Users can add a reply.
- Replies remain scoped to a discussion post.
- Reply UI avoids notifications and AI.

### S4-003: Add Basic Spoiler Reveal Control

Priority: P1

As a reader, I want spoiler-marked discussion content to be visibly protected so I do not accidentally read beyond my progress.

Acceptance criteria:

- Explicit spoiler posts are visually guarded.
- Progress-locked metadata is displayed.
- User can reveal protected content locally.
- No automated progress matching is required yet.

### S4-004: Refine Activity Feed

Priority: P1

As a group member, I want a feed that is easy to scan so I can see what happened without noise.

Acceptance criteria:

- Feed items have clear labels.
- Discussion activity links visually to discussion content.
- Check-ins and discussions remain differentiated.

## Out Of Scope

Sprint 4 should not implement:

- XP.
- Achievements.
- Leaderboards.
- AI prompts.
- Notifications.
- Full review system.
- Real-time sync.

## Specialist Assignments

UX:

- Draft group switching and reply interaction requirements.

Database:

- Review whether the Sprint 3 comments table is sufficient for replies.

QA:

- Create regression checks for multi-group activity and spoiler reveal.

Security:

- Review RLS implications for discussion comments and spoiler content.
