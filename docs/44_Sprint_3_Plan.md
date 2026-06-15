# Sprint 3 Plan: Group Activity And Discussion Foundation

Status: Ready To Start
Version: 0.1
Owner: Product Manager

## Objective

Sprint 3 should make the private group feel alive without adding advanced systems.

The sprint should connect group-visible check-ins to a simple activity feed and add a basic discussion post foundation. Spoiler metadata should be introduced conservatively, but full spoiler reveal workflows and review timelines can wait.

## Entry Criteria

Sprint 3 can begin because:

- Sprint 1 app foundation is complete locally.
- Sprint 2 current books and check-ins are complete locally.
- Check-ins include visibility.
- Groups exist locally.
- Supabase-ready data shapes exist.

## Goals

- Add local activity model.
- Add group feed page content.
- Create feed items from group-visible check-ins.
- Add discussion post creation.
- Add basic replies or defer replies with documented placeholder.
- Add spoiler metadata fields to discussion posts.
- Keep activity feed curated and low-noise.

## Tickets

### S3-001: Add Local Activity Feed Model

Priority: P0

As the app, we need a local activity feed model so group-visible actions can appear in groups.

Acceptance criteria:

- Activity items store actor, type, related book, summary, visibility, and timestamp.
- Group-visible check-ins create activity items.
- Private check-ins do not create group feed items.

### S3-002: Show Group Feed

Priority: P0

As a group member, I want to see meaningful group activity so the group feels alive.

Acceptance criteria:

- Group page shows recent activity.
- Feed includes group-visible check-ins.
- Feed avoids private actions.
- Feed does not rank by pages.

### S3-003: Add Discussion Post Foundation

Priority: P0

As a group member, I want to start a discussion so reading can become social.

Acceptance criteria:

- User can create a discussion post.
- Post can optionally attach to a book.
- Post appears in group activity.
- Post supports spoiler metadata.

### S3-004: Add Conservative Spoiler Metadata

Priority: P1

As a spoiler-sensitive reader, I want content to carry spoiler metadata before full reveal flows are built.

Acceptance criteria:

- Discussion post supports no spoiler, progress locked, and explicit spoiler settings.
- Progress locked posts can store page or chapter boundary.
- Full reveal logic can remain a later ticket.

## Out Of Scope

Sprint 3 should not implement:

- Reading Momentum score
- XP
- Achievements
- Leaderboards
- AI prompts
- Reviews
- Notifications
- Book of the Month
- Recommendations

