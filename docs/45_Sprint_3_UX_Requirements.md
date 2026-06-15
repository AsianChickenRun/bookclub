# Sprint 3 UX Requirements: Group Activity And Discussion

Status: Draft for PM review. This document is not approved until the Product Manager accepts it. Do not sync this draft to GitHub without PM approval.

## Purpose

Sprint 3 should make private groups feel alive without adding heavy social networking, scoring, notifications, AI, reviews, or leaderboards. This document defines UX requirements for:

- Group activity feed
- Discussion post creation
- Spoiler metadata controls
- Empty states
- Low-noise feed behavior

It is grounded in the current app after Sprint 2, where users can locally add current books, complete check-ins, mark skipped days, choose private or group-visible visibility, create/join local groups, and view recent check-ins.

## Product Direction

Sprint 3 should answer:

- What are my friends reading?
- Who checked in recently?
- Is there a safe place to say something about what I am reading?
- Can I avoid spoilers while still participating?

The experience should remain calm, private, and lightweight. The group feed should create presence, not pressure.

## Scope

### In Scope

- Local group activity model
- Feed items from group-visible check-ins
- Basic discussion post creation
- Optional book attachment on discussion posts
- Spoiler metadata fields on discussion posts
- Group feed empty states
- Low-noise feed rules
- Basic post display in the group feed

### Out Of Scope

- Reading Momentum score
- XP
- Achievements
- Leaderboards
- AI prompts
- Reviews and review timelines
- Notifications
- Book of the Month
- Recommendations
- Full spoiler reveal workflow
- Advanced moderation
- Rich threaded replies unless PM explicitly adds them to Sprint 3

## Group Page Information Architecture

The Groups page should shift from only create/join and list management into a simple group activity space.

Recommended group page sections:

- Group switcher or selected group summary
- Primary group action: `Start discussion`
- Secondary action: `Invite or join group`
- Recent activity feed
- Discussion composer or modal
- Group details and member/invite info

If multiple groups exist:

- Default to the most recently created/joined group or the last viewed group.
- Provide a simple selector.
- Do not mix activities from different groups unless clearly labeled.

Acceptance notes:

- Non-members should not see private group activity.
- Group feed must not show private check-ins.
- The feed should not rank users or emphasize raw page volume.

## Activity Feed Requirements

### Feed Item Sources

Sprint 3 feed should support:

- Group-visible check-ins
- Skipped-day check-ins if group-visible and PM accepts sharing them
- Discussion posts

Future feed sources should remain deferred:

- Finished books
- Reviews
- Nominations
- Streak milestones
- XP events
- AI prompts

### Feed Item Anatomy

Each feed item should include:

- Actor display name
- Activity type
- Timestamp
- Related book title when available
- Summary text
- Visibility state if useful
- Spoiler label when relevant
- Lightweight action area, such as `Reply coming later` or `View discussion`

Check-in item examples:

- `Maya checked in on The Fifth Season.`
- `Jordan logged 20 minutes of audiobook time.`
- `Sam marked today as skipped.`

Discussion item examples:

- `Maya started a discussion about The Fifth Season.`
- `Possible spoiler - progress locked to chapter 8.`

Acceptance notes:

- Feed copy should use plain language, not database terms.
- Group-visible check-ins should create feed items.
- Private check-ins should not create feed items.
- Skipped check-ins should be worded neutrally if shown.
- Feed items should be ordered newest first.

## Low-Noise Feed Behavior

The group feed should show meaningful activity without becoming a firehose.

### Sprint 3 Rules

- Create feed items only for group-visible actions.
- Do not create feed items for private check-ins.
- Do not create feed items for profile edits.
- Do not create feed items for book edits unless the PM explicitly wants book-added activity.
- Do not create separate activity for validation changes or local state resets.
- Do not show XP, score, or leaderboard prompts.

### Bundling Recommendation

For Sprint 3, bundling can be simple:

- If a user makes multiple check-ins for the same book on the same day, show either the most recent item or a compact grouped item.
- Discussion posts should remain individual items.
- Skipped-day check-ins should not be repeated multiple times in the same day.

Acceptance notes:

- The feed should avoid making a high-volume reader dominate the group.
- No feed copy should imply that more pages equals better participation.
- Group activity should support encouragement and presence, not competition.

## Discussion Post Creation

Purpose: let a group member start a lightweight conversation about what they are reading.

### Entry Points

- Group page primary action: `Start discussion`
- Empty feed state action
- Feed section action
- Optional book card action later

### Composer Fields

Required:

- Body text

Optional:

- Related book
- Spoiler setting
- Progress boundary when spoiler setting is progress locked

Spoiler settings:

- No spoilers
- Progress locked
- Explicit spoiler

### Recommended Composer Layout

Mobile-first order:

1. Textarea: `What do you want to share?`
2. Related book selector
3. Spoiler setting control
4. Progress boundary fields if needed
5. Submit action: `Post discussion`
6. Secondary action: `Cancel`

Acceptance notes:

- Body is required.
- The composer should preserve entered text after validation errors.
- A related book should be optional because groups may discuss reading habits or general reflections.
- If a related book is selected, default progress boundary options from that book when available.
- The post should appear in the selected group's feed after creation.
- The UI should not generate AI discussion prompts in Sprint 3.

## Spoiler Metadata Controls

Sprint 3 introduces spoiler metadata, not full spoiler reveal behavior.

### Spoiler Setting: No Spoilers

Use when:

- The post contains general thoughts.
- The post is safe for anyone in the group.

UI behavior:

- No extra progress fields required.
- Feed item displays normally.

### Spoiler Setting: Progress Locked

Use when:

- The post discusses content through a specific page or chapter.

Required metadata:

- Page boundary or chapter boundary
- Related book is strongly recommended

UI behavior:

- Show fields for page or chapter boundary.
- Use plain helper copy: `Hide this later until others reach this point.`
- In Sprint 3, display the metadata label even if full hiding/reveal logic is deferred.

Acceptance notes:

- If progress locked is selected without a related book, warn that the boundary may be harder to compare.
- Page and chapter boundary values must be zero or greater.
- Boundary values must not exceed known book totals when totals are available.

### Spoiler Setting: Explicit Spoiler

Use when:

- The user knows the post could spoil major events.
- Progress comparison may not be enough.

UI behavior:

- Require an intentional selection.
- Show a clear feed label: `Possible spoiler`.
- Full reveal/hide behavior may be deferred, but the metadata must be stored.

Acceptance notes:

- Explicit spoiler should never be the default.
- Do not reveal explicit spoiler content through previews if a hidden-preview pattern is added.
- Do not use frightening or punitive language.

## Empty States

### No Groups

Heading:

- `Read with a private group`

Body:

- `Create a small group or join friends with an invite code. Everyone can read at their own pace.`

Primary action:

- `Create a group`

Secondary action:

- `Join with invite code`

### Group Has No Activity

Heading:

- `Start the group rhythm`

Body:

- `Group-visible check-ins and discussions will appear here.`

Primary action:

- `Start discussion`

Secondary action:

- `Post a group-visible check-in`

Acceptance notes:

- If the user has no current book, secondary action should send them to Books instead of check-in.
- Do not say only `No activity.`

### No Group-Visible Check-Ins

Heading:

- `Nothing shared yet`

Body:

- `Private check-ins stay private. Group-visible check-ins will show up here.`

Primary action:

- `Check in`

### No Discussions

Heading:

- `Start a spoiler-safe conversation`

Body:

- `Share a thought, question, or reaction from what you have read so far.`

Primary action:

- `Start discussion`

Acceptance notes:

- Empty states should provide one clear next action.
- Empty states should not make the user feel responsible for entertaining the group.

## Group Feed Screen Acceptance Criteria

The Sprint 3 group feed is UX-ready when:

- Group page has a selected group context.
- Feed shows group-visible check-ins from local reading logs.
- Feed excludes private check-ins.
- Feed supports discussion post items.
- Discussion composer can create a post with body text.
- Discussion posts can attach to a book.
- Discussion posts can store spoiler setting metadata.
- Progress-locked posts can store page or chapter boundary.
- Explicit spoiler posts are clearly labeled.
- Empty states are warm, action-oriented, and not dead-ended.
- Feed items are ordered newest first.
- Feed copy avoids raw competition and page-count ranking.
- No scoring, XP, AI, reviews, notifications, or leaderboards appear.

## Recommended Data Shape For UX

This is a UX-facing shape recommendation, not a final engineering contract.

Activity item:

- `id`
- `groupId`
- `actorName`
- `activityType`: checkin, discussion
- `bookTitle`
- `summary`
- `sourceId`
- `createdAt`
- `spoilerLevel`: none, progress_locked, explicit
- `spoilerPage`
- `spoilerChapter`

Discussion post:

- `id`
- `groupId`
- `authorName`
- `body`
- `relatedBookId`
- `spoilerLevel`
- `spoilerPage`
- `spoilerChapter`
- `createdAt`

UX note:

- Activity should be curated. It should not mirror every local state change.

## Implementation Notes For Designers And PM

- Prefer a compact feed list over large social cards.
- Keep discussion creation as a simple form or bottom sheet.
- Use spoiler controls as segmented choices or radio options, not hidden advanced settings.
- Use helper text for progress-locked content.
- Avoid visible labels like `local`, `mock`, `Sprint 3`, or `database` in user-facing UI.
- Keep internal implementation status in docs or development notes.

## Open PM Decisions

- Should skipped group-visible check-ins appear in the group feed?
- Should discussion replies be included in Sprint 3 or deferred with a placeholder?
- Should group feed be per selected group only, or should a combined all-groups feed exist later?
- Should book-added activity be shown in Sprint 3 or kept out to reduce noise?
- Should explicit spoiler posts hide body previews immediately, or only carry labels until full reveal logic is built?

## Source Docs Reviewed

- `04_Features.md`
- `13_UX_Flows.md`
- `41_Sprint_2_Plan.md`
- `43_Sprint_2_Review.md`
- `44_Sprint_3_Plan.md`

Until PM approval, this document remains a draft specialist deliverable and should not be synced to GitHub.
