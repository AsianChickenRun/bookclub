# QA Risk Register

This document captures requirements-level QA risks for Reading Momentum. It is intended to help the PM thread turn unclear behavior into backlog tickets, product decisions, and acceptance criteria before implementation.

## Review Scope

Reviewed docs:

- 01_Vision.md
- 02_Product_Principles.md
- 04_Features.md
- 05_Scoring_System.md
- 07_AI_Guidelines.md
- 08_UI_UX.md
- 10_Backlog.md
- 11_Decisions.md

No production app was tested. Findings are based on requirements, user flows, and likely edge cases for confused, busy, inconsistent, or spoiler-sensitive readers.

## Highest-Risk Areas

### QA-001: Spoiler Protection Is Not Yet Deterministic

Risk level: High

Related backlog: RM-010, RM-013, RM-015, RM-016

Risk:
Spoiler protection is a core trust promise, but the current requirements allow multiple behaviors: hidden, blurred, locked, or labeled. Users who are worried about spoilers need one predictable default. If the app exposes later-progress reviews, final reviews, AI prompts, or comments unexpectedly, users may stop trusting group activity.

Edge cases:

- A user posts a live review at chapter 20 while another member is on chapter 8.
- A user writes a comment that contains a spoiler, not a formal review.
- A final review appears in the group feed before another member has finished the book.
- A user reads an audiobook while another reads print, so progress points do not map cleanly.
- Two editions of the same book have different page counts.
- AI generates a prompt that hints at a future plot event.
- A user intentionally reveals locked content, leaves the page, then returns later.

Recommended product decisions:

- Use locked spoiler content as the default, not blur-only. Blurring can still leak length, tone, names, or structure.
- Require a progress point for live reviews and progress-sensitive posts.
- Treat comments and replies as spoiler-capable content, not only reviews.
- Add an intentional reveal action for locked content.
- Prefer generic prompts when progress cannot be trusted or normalized.

Backlog candidate tickets:

### QA-RM-001: Define Default Spoiler Lock Behavior

Priority: P0

As a spoiler-sensitive reader, I want later-progress content to be locked by default so I can safely participate in group activity.

Acceptance criteria:

- Content tied to a later progress point is hidden from viewers who have not reached that point.
- Locked content does not expose the body text by default.
- User can intentionally reveal locked content.
- Revealed state is clearly communicated.
- The same default applies across live reviews, feed items, posts, comments, and replies where progress metadata exists.

Docs: 04_Features.md, 07_AI_Guidelines.md, 10_Backlog.md

### QA-RM-002: Add Spoiler Reporting Or Marking Flow

Priority: P1

As a group member, I want to mark my own post or another visible post as spoiler-sensitive so accidental spoilers can be contained.

Acceptance criteria:

- User can mark their own post, review, comment, or reply as containing spoilers.
- Group members can flag visible content as possible spoiler content.
- Flagged content is hidden or softened until reviewed or confirmed.
- Spoiler marking does not delete the original content.

Docs: 04_Features.md, 08_UI_UX.md

## QA-002: Progress Units Need A Normalization Rule

Risk level: High

Related backlog: RM-004, RM-005, RM-013, RM-016, RM-017

Risk:
Reading Momentum supports pages, chapters, minutes, audiobook minutes, and sessions. This supports autonomy, but it creates ambiguity for progress updates, scoring, spoiler gates, and leaderboards.

Edge cases:

- User changes a book from page tracking to minute tracking mid-book.
- User logs page 350 for a book with 320 total pages.
- User logs negative progress by correcting a mistaken entry.
- User reads a 12-hour audiobook and a friend reads a 400-page paperback.
- User tracks by sessions only, but spoiler visibility requires progress.
- User adds a book without total pages or chapters.
- User reads multiple books and logs progress for more than one on the same day.

Recommended product decisions:

- Store original progress units and a normalized progress percentage when possible.
- Allow session-only tracking, but treat it as insufficient for spoiler unlocking unless the user manually sets progress.
- Define correction behavior separately from ordinary check-ins.
- Prevent impossible progress values at input time.

Backlog candidate tickets:

### QA-RM-003: Define Progress Normalization Rules

Priority: P0

As a reader using different formats, I want my progress to be represented fairly so check-ins, spoiler protection, and scoring work predictably.

Acceptance criteria:

- Each reading log stores the original unit entered by the user.
- Books with known totals calculate normalized progress percentage.
- Books without known totals can still be checked in, but progress-sensitive unlocks remain conservative.
- Sessions can count toward habit tracking without automatically unlocking later-progress spoiler content.
- Product rules define whether users can switch tracking units mid-book.

Docs: 04_Features.md, 06_Data_Model.md, 10_Backlog.md

### QA-RM-004: Validate Check-In Progress Inputs

Priority: P0

As a busy user, I want the check-in form to prevent obvious mistakes so my progress and streaks stay accurate.

Acceptance criteria:

- User cannot submit negative pages, chapters, or minutes.
- User receives a clear warning when progress exceeds a known book total.
- User can correct a mistaken log without creating duplicate streak or XP rewards.
- Current progress cannot accidentally move backward without confirmation.
- Validation copy is supportive and not blame-based.

Docs: 04_Features.md, 08_UI_UX.md

## QA-003: Check-In Flow May Exceed The 30-Second Requirement

Risk level: High

Related backlog: RM-005, RM-008, RM-012

Risk:
The check-in flow is expected to take less than 30 seconds while supporting many input types, feed eligibility, streaks, XP, and optional reflection. If this becomes too busy, the habit loop may fail for the exact users the app is meant to help.

Edge cases:

- User opens the app while walking between classes and wants to log quickly.
- User has multiple current books and does not remember which one is selected.
- User wants to check in without sharing to the group.
- User skipped reading today and worries that tapping "skipped" hurts their score.
- AI prompt generation is slow or fails after check-in.

Recommended product decisions:

- Keep check-in as a fast primary action with reflection as an optional second step.
- Include a privacy/share control in the check-in flow.
- Make "skipped today" supportive and clearly different from failure.
- Do not block check-in completion on AI prompt generation.

Backlog candidate tickets:

### QA-RM-005: Design One-Screen Fast Check-In

Priority: P0

As a busy reader, I want to log progress quickly so the app supports my habit instead of becoming another task.

Acceptance criteria:

- User can complete a basic check-in from one mobile-first screen.
- User can choose the relevant current book when more than one exists.
- User can enter one progress value or choose "skipped today."
- User can choose whether the check-in is shared with the group.
- AI reflection is optional and does not block check-in submission.

Docs: 04_Features.md, 08_UI_UX.md, 10_Backlog.md

## QA-004: Sharing And Privacy Defaults Are Unclear

Risk level: High

Related backlog: RM-002, RM-003, RM-005, RM-009, RM-014

Risk:
The product relies on small private groups for trust, but private group membership does not answer what each member shares. Users may want accountability without exposing every book, skipped day, review, or reflection.

Edge cases:

- User reads a personal book they do not want shown in the group.
- User wants the streak benefit of checking in but does not want to share today's progress.
- User leaves a group and expects past activity to disappear.
- User joins two groups and wants different sharing settings in each.
- User completes a book and does not want the final review posted to the group feed.

Recommended product decisions:

- Add clear default sharing rules for check-ins, current books, reviews, and reflections.
- Support per-item sharing controls for MVP-critical actions.
- Define what happens to historical posts after leaving a group.
- Make group privacy language visible in onboarding and invite flows.

Backlog candidate tickets:

### QA-RM-006: Define Group Sharing Defaults

Priority: P0

As a private group member, I want to understand what my friends can see so I can participate comfortably.

Acceptance criteria:

- Product defines default visibility for current books, check-ins, skipped days, prompt answers, live reviews, final reviews, and completed books.
- User can see the visibility state before posting.
- Private items do not appear in group feed.
- Group members cannot view content from groups they do not belong to.
- Leaving a group has defined behavior for past activity.

Docs: 04_Features.md, 08_UI_UX.md, 10_Backlog.md

## QA-005: Reflection Quality Scoring Could Feel Judgmental

Risk level: Medium

Related backlog: RM-012, RM-017, RM-018

Risk:
The scoring system includes "reflection quality." Without a careful definition, users may feel judged for short responses, casual reactions, accessibility needs, language differences, or private writing style. It could also encourage AI-written reflections.

Edge cases:

- User writes "This chapter confused me" and gets a low quality signal.
- User writes very short but sincere reflections.
- User uses AI to generate long but hollow responses.
- User writes in a language or style the scoring system handles poorly.
- User skips prompts but reads consistently.

Recommended product decisions:

- For MVP, score reflection participation rather than subjective quality.
- Avoid user-facing language that ranks someone's thoughts as low quality.
- If quality is used later, define it with transparent, lightweight criteria.

Backlog candidate ticket:

### QA-RM-007: Replace Reflection Quality With Reflection Participation For MVP

Priority: P1

As a reflective reader, I want my participation recognized without feeling judged on whether my thoughts are good enough.

Acceptance criteria:

- MVP scoring rewards prompt responses or saved reflections.
- MVP scoring does not assign visible quality grades to reflections.
- Short original responses can receive participation credit.
- Prompt skipping does not erase reading consistency credit.

Docs: 02_Product_Principles.md, 05_Scoring_System.md, 10_Backlog.md

## QA-006: Streak And Weekly Rhythm Rules Need Time Zone Decisions

Risk level: Medium

Related backlog: RM-006, RM-008, RM-022

Risk:
Streaks, grace days, Monday check-ins, Thursday prompts, and weekly scores depend on dates. If time zones are not defined, users may lose streaks unfairly or receive rituals at strange times.

Edge cases:

- User checks in at 12:05 AM while traveling.
- Group members live in different time zones.
- Monday reminder arrives Sunday night for one user.
- Weekly score resets while a user is still in their local Sunday.
- User changes time zone during the week.

Recommended product decisions:

- Use the user's local time zone for personal streaks and reminders.
- Use group owner's or group-selected time zone for group rituals.
- Define the weekly scoring window explicitly.
- Define the grace rule before scoring implementation.

Backlog candidate ticket:

### QA-RM-008: Define Time Zone And Grace Rules

Priority: P0

As a reader with an inconsistent schedule, I want streaks and weekly rituals to respect my real day so the app feels fair.

Acceptance criteria:

- Personal streaks use a defined user time zone.
- Group rituals use a defined group time zone.
- Weekly score start and end times are documented.
- Grace day quantity and reset period are documented.
- Streak copy explains grace behavior in supportive language.

Docs: 05_Scoring_System.md, 08_UI_UX.md, 10_Backlog.md

## QA-007: Feed Rules Are Too Broad For MVP

Risk level: Medium

Related backlog: RM-009, RM-011, RM-014, RM-015

Risk:
The feed should show meaningful activity and avoid every small action, but "meaningful" is not defined. Without rules, the feed could become noisy, empty, or spoiler-prone.

Edge cases:

- User logs several small check-ins in one day.
- User reacts to many posts and floods activity.
- User creates a private check-in that should not show in feed.
- User finishes a book but marks the review private.
- User posts a live review with spoiler restrictions.

Recommended product decisions:

- Define feed inclusion rules per activity type.
- Collapse repeated check-ins from the same user and book.
- Exclude private activity from group feed.
- Ensure feed cards preserve spoiler locks.

Backlog candidate ticket:

### QA-RM-009: Define Group Feed Inclusion Rules

Priority: P1

As a group member, I want the feed to show useful activity without becoming noisy or unsafe for spoilers.

Acceptance criteria:

- Product defines which activity types appear in the feed.
- Repeated check-ins can be grouped or summarized.
- Private activity never appears in group feed.
- Feed items include spoiler-lock state where relevant.
- Reaction-only activity does not flood the feed.

Docs: 04_Features.md, 08_UI_UX.md, 10_Backlog.md

## QA-008: Book Completion Flow Is Ambiguous

Risk level: Medium

Related backlog: RM-004, RM-005, RM-014, RM-017

Risk:
The app supports current books, completed books, final reviews, scoring, and feed activity, but does not define exactly when a book becomes complete.

Edge cases:

- User reaches 100% progress but did not actually finish appendices or bonus material.
- User marks complete manually before reaching the final page.
- User finishes an audiobook with no page count.
- User completes a book but skips the final review.
- User accidentally marks complete and wants to undo.

Recommended product decisions:

- Let users explicitly mark books complete.
- Use 100% progress as a prompt, not automatic completion.
- Allow undo or correction.
- Do not require a final review to complete a book.

Backlog candidate ticket:

### QA-RM-010: Define Book Completion And Review Prompt Flow

Priority: P1

As a reader finishing a book, I want to mark it complete without being forced into a long review.

Acceptance criteria:

- User can explicitly mark a current book complete.
- Reaching known 100% progress prompts completion but does not force it.
- Final review is optional after completion.
- User can correct accidental completion.
- Completion sharing uses the user's visibility settings.

Docs: 04_Features.md, 10_Backlog.md

## QA-009: Notifications Need Preference And Frequency Rules

Risk level: Medium

Related backlog: RM-008, RM-022

Risk:
The notification strategy avoids guilt-based reminders, but it does not define opt-in, opt-out, quiet hours, batching, or frequency caps. Busy users may perceive reminders as pressure even with friendly copy.

Edge cases:

- User receives Monday check-in, friend reply, friend finished book, and recap notifications close together.
- User wants reply notifications but not streak reminders.
- User is in multiple groups and receives duplicate ritual reminders.
- User checks in before the Monday reminder but still receives it.
- User wants no notifications during class, work, or sleep.

Recommended product decisions:

- Add notification categories and user preferences.
- Use frequency caps and batching.
- Suppress reminders when the user already completed the target action.
- Avoid streak-loss warnings in MVP.

Backlog candidate ticket:

### QA-RM-011: Define Notification Preferences And Frequency Caps

Priority: P1

As a busy reader, I want reminders to be useful and limited so the app encourages me without adding pressure.

Acceptance criteria:

- User can enable or disable major notification categories.
- Ritual reminders are suppressed after the user completes the relevant action.
- Product defines maximum reminders per day.
- Product defines quiet hours or a future path for quiet hours.
- Notification copy avoids guilt-based wording.

Docs: 08_UI_UX.md, 10_Backlog.md

## QA-010: Invite And Membership Controls Need Abuse Handling

Risk level: Medium

Related backlog: RM-002, RM-003

Risk:
Private groups require trustworthy membership. Invite codes and membership flows need basic controls to avoid accidental exposure or unwanted members.

Edge cases:

- Invite code is forwarded to someone outside the friend group.
- User joins the wrong group by code.
- Admin wants to revoke an invite.
- Member leaves and later tries to rejoin.
- Removed member attempts to access old group links.

Recommended product decisions:

- Make invite codes revocable.
- Allow group owners/admins to remove members.
- Define whether removed users can see historical content.
- Show clear group identity before final join.

Backlog candidate ticket:

### QA-RM-012: Add Basic Invite And Membership Safety Rules

Priority: P1

As a private group owner, I want control over who can join so the group remains comfortable and trusted.

Acceptance criteria:

- Invite flow shows group name before joining.
- Invite codes or links can expire or be revoked.
- Group owner/admin can remove a member.
- Non-members and removed members cannot view private group content.
- Product defines whether removed members' past posts remain visible.

Docs: 04_Features.md, 10_Backlog.md

## Cross-Feature Test Scenarios

Use these as early acceptance or exploratory test scenarios.

- New user signs up, joins a private group, and has no current book yet.
- User adds a book with no total pages or chapters.
- User has two current books and checks into both on the same day.
- User logs "skipped today" several days in a row.
- User checks in privately and verifies no group feed item appears.
- User in a different time zone checks in near midnight.
- User changes progress format mid-book.
- User corrects an accidental check-in.
- User reaches 100% progress and chooses not to mark complete yet.
- User marks a book complete and skips the final review.
- User posts a live review at a later progress point than another member has reached.
- User comments with spoiler content outside the review timeline.
- User intentionally reveals a locked spoiler and returns to the feed.
- AI prompt generation fails after a successful check-in.
- Group owner revokes an invite link after it was shared.
- User leaves a group and checks whether old posts are still visible.
- User belongs to two groups and uses different sharing expectations in each.

## PM Merge Notes

Recommended first merge targets:

- Add QA-RM-001 through QA-RM-006 before or alongside the current MVP backlog because they affect trust, check-ins, privacy, and spoiler safety.
- Fold QA-RM-008 into RM-006 before streak work begins.
- Fold QA-RM-009 into RM-009 before feed work begins.
- Fold QA-RM-011 into RM-022 before notification work begins.

Most important product decisions to make before implementation:

- What is the default spoiler behavior?
- How is progress normalized across pages, chapters, minutes, audiobooks, and sessions?
- What is shared to the group by default?
- What is the exact streak grace rule?
- Which check-in fields are required for the MVP under-30-second flow?
