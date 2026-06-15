# UX Flows And Screen Requirements

Reading Momentum should feel like a calm mobile reading companion for small private groups. The core UX must help users answer three questions quickly:

- What am I reading right now?
- Did I keep my momentum today?
- What are my friends reading or discussing without spoiling me?

This document translates the product principles, feature requirements, backlog, and database architecture into implementation-ready UX requirements. It does not define production code.

## UX Priorities

1. Keep the daily habit loop under 30 seconds.
2. Make reading progress visible without making users feel judged.
3. Default to private, trusted group spaces.
4. Protect users from spoilers by progress point.
5. Let users read different books, formats, goals, and paces in the same group.
6. Keep mobile screens focused, thumb-friendly, and low clutter.
7. Use notifications as helpful cues, not pressure.

## Mobile-First Information Architecture

The first version should use a simple bottom navigation on mobile:

- Today: dashboard, current book, check-in, streak, next prompt
- Group: group feed, discussion prompts, replies, member activity
- Books: current books, add book, paused and completed books
- Profile: reading identity, XP, achievements, notification preferences

Desktop may widen these views into two-column layouts, but mobile is the source of truth.

Primary action:

- The most prominent action on Today should be `Check in`.
- If the user has no current book, the primary action becomes `Add a book`.
- If the user has no group, the secondary action should invite them to create or join one.

## Onboarding Flow

Purpose: get a new user from account creation to first meaningful reading state without over-explaining the product.

### Flow

1. Create account or sign in.
2. Create profile.
3. Choose starting path:
   - Add a current book
   - Join a group with invite code
   - Create a private group
4. Set first reading goal.
5. Land on Today with a clear next action.

### Required Screens

#### Welcome

Content requirements:

- One short value statement about reading with supportive accountability.
- Primary action: `Get started`
- Secondary action: `Sign in`

UX notes:

- Do not present the app as a formal book club, productivity tracker, or competitive leaderboard.
- Keep copy short enough to scan in under 10 seconds.

#### Profile Setup

Inputs:

- Display name, required
- Profile photo, optional
- Favorite genres, optional
- Timezone, defaulted automatically when possible

Acceptance notes:

- User can complete profile setup with only a display name.
- The screen must work without photo upload.
- Empty optional fields should not block progress.

#### First Reading Step

The user chooses one:

- `Add my current book`
- `Join my friends`
- `Create a group`

Acceptance notes:

- A user who skips group setup can still add a book and check in.
- A user who joins a group before adding a book is prompted to add a current book after joining.
- The app should never imply that a shared group book is required.

## Dashboard: Today

Purpose: give the user a fast sense of current momentum and guide them back to reading.

### Required Content

- Current book card or empty book state
- Primary check-in button
- Current streak or comeback-friendly status
- Weekly Reading Momentum preview or placeholder
- Next group ritual, such as Monday check-in or Thursday discussion
- Small group activity preview

### Current Book Card

Display:

- Book title
- Author when available
- Format
- Current progress
- Goal type
- Progress indicator when total pages or chapters are known
- Last check-in date

Primary actions:

- `Check in`
- `Update progress`

Secondary actions:

- `Mark finished`
- `Pause`

Acceptance notes:

- If the user has multiple current books, Today should show the most recently checked-in book first and allow quick switching.
- Audiobook and minutes-based goals should not be forced into page language.
- If total length is unknown, show progress as a human-readable status rather than a percentage.

### Momentum Status

Tone requirements:

- Use supportive wording such as "You checked in today" or "A small check-in keeps the week visible."
- Avoid guilt wording such as "You failed", "You broke your streak", or "You are behind."

Acceptance notes:

- Grace days must be reflected in the message when relevant.
- Raw pages should not be the main dashboard success signal.

## Add Book Flow

Purpose: let users add a current book quickly while capturing enough structure for progress, scoring, prompts, and spoiler protection.

### Flow

1. Enter book basics.
2. Choose format.
3. Choose goal type.
4. Enter current progress.
5. Optionally enter total length and target finish date.
6. Confirm and return to Today.

### Required Fields

- Title, required
- Author, optional
- Format: print, ebook, audiobook, mixed
- Goal type: pages, chapters, minutes, sessions
- Start date, default today

### Conditional Fields

- Pages goal: current page and optional total pages
- Chapters goal: current chapter and optional total chapters
- Minutes goal: minutes read total or target minutes
- Sessions goal: sessions completed or target sessions
- Audiobook: audiobook minutes and optional timestamp label

### Acceptance Notes

- The user can add a book even if they do not know the total page or chapter count.
- The form must preserve user-entered values if they move back a step.
- The user can add a book in under one minute with only title, format, and goal type.
- After adding the first book, Today should show the book and make check-in the primary action.
- If a book was added from inside a group, the book should still belong to the user, not the group.

## Under-30-Second Check-In

Purpose: make the core habit loop fast enough to use before or after reading.

### Entry Points

- Today primary action
- Current book card
- Group Monday prompt
- Book detail screen
- Notification deep link

### Flow

1. Select book if needed.
2. Enter one progress value.
3. Optionally add a short note or mood.
4. Choose visibility: private or groups.
5. Submit.
6. Show lightweight success state with optional reflection prompt.

### Input Modes

The check-in form should adapt to the user's book goal type:

- Pages read
- Chapters completed
- Minutes read
- Audiobook minutes listened
- Session completed
- Skipped today

### Fast Defaults

- Preselect the most recently active current book.
- Preselect the user's last visibility choice when safe.
- Keep the first screen focused on one input and one submit action.
- Keep note and reflection optional.

### Success State

Show:

- Confirmation that the check-in was saved
- Updated progress when applicable
- Streak or momentum feedback
- Optional reflection prompt
- Option to share or view in group feed when visibility allows

Acceptance notes:

- A user must be able to complete a check-in with one value and one submit action after opening the form.
- "Skipped today" should be treated as an honest check-in, not a failure state.
- A skipped check-in cannot be submitted with positive reading amounts.
- The flow should not require answering a reflection prompt.
- The app should create a meaningful feed activity only when the action is group-visible and worth sharing.

## Group Feed

Purpose: make a private group feel alive without turning every small action into noise.

### Feed Item Types

Show curated activity:

- Check-ins
- Reflection answers
- Discussion posts
- Finished books
- Reviews
- Book nominations
- Streak milestones

Avoid:

- Every minor progress edit
- Every XP event
- Repeated tiny actions from the same user in a short window

### Feed Item Anatomy

Each item should include:

- Member name and avatar
- Activity type
- Book title when relevant
- Timestamp
- Progress context when relevant
- Spoiler state when relevant
- Supportive reactions
- Reply entry point

### Interaction Patterns

- Tap feed item to open detail or discussion.
- React with supportive reaction types only: encourage, same, insightful, celebrate, thanks.
- Reply actions should feel lightweight.
- Long discussions should open a dedicated thread view.

Acceptance notes:

- Feed content must only be visible to active group members.
- Feed should respect post, review, and comment spoiler settings.
- The first version should support one or two visual levels of comment nesting.
- The feed should not rank people by pages read.

## Discussion Flow

Purpose: help users discuss what they have read while keeping the group safe for different paces.

### Entry Points

- Thursday discussion prompt
- Group feed
- Book detail
- Check-in reflection success state
- Live review timeline

### Create Discussion

Inputs:

- Body, required
- Related book, optional but encouraged
- Progress point, optional unless spoiler locked
- Spoiler setting:
  - No spoilers
  - Progress locked
  - Explicit spoiler

UX notes:

- If a user attaches a current book, default the progress point to their current progress.
- If progress is unknown, default to no-spoiler or ask the user to add a boundary.
- Use plain language such as "Hide this until others reach this point."

### Prompt Answer

For AI or system prompts:

- Prompt should be short and answerable in under two minutes.
- User can skip prompt.
- User answer should not be prefilled by AI.

Acceptance notes:

- AI prompt copy must ask, guide, or organize rather than answer.
- Prompt generation must use the user's current progress as the spoiler boundary when available.
- If progress is ambiguous, use general spoiler-safe prompts.

## Spoiler Reveal Flow

Purpose: make spoiler protection understandable and trustworthy without making discussion feel heavy.

### Spoiler States

No spoiler:

- Content is visible.

Progress locked:

- Content is hidden or blurred when the viewer is behind the saved progress point.
- The lock explains the required progress in simple terms.

Explicit spoiler:

- Content is hidden by default.
- User must intentionally reveal it.

### Reveal Interaction

When content is hidden, show:

- A short label such as "Hidden until chapter 8" or "Possible spoiler"
- A `Reveal` action
- Optional context: "You can reveal this now, but the app will not auto-hide it again in this session."

Acceptance notes:

- Spoiler reveal must require an explicit tap or click.
- The reveal state should apply only to that item unless the user chooses a broader preference later.
- Spoiler hiding is an experience control, not a privacy control; private group access still depends on membership.
- Progress comparison should use matching book progress when available.
- If the viewer has not added the same book, default to hidden for progress-locked content and offer reveal.

## Empty States

Empty states should help users take the next useful step without making the app feel unfinished.

### No Current Book

Message goal:

- Encourage adding whatever the user is already reading.

Primary action:

- `Add a book`

Secondary action:

- `Join a group`

Acceptance notes:

- Do not imply the user must start a new book.
- Do not show score, streak, or leaderboard pressure before the first book exists.

### No Group

Message goal:

- Explain private groups as optional support from friends.

Primary action:

- `Create a group`

Secondary action:

- `Join with invite code`

Acceptance notes:

- The user must still be able to use personal check-ins without a group.
- Group creation should not require a Book of the Month.

### Empty Group Feed

Message goal:

- Give the group a first shared action.

Primary action:

- `Post a check-in`

Secondary action:

- `Invite a friend`

Acceptance notes:

- Avoid "nothing here yet" as the only message.
- If the user has no current book, prioritize adding a book before posting.

### No Discussions

Message goal:

- Offer a lightweight starter prompt.

Primary action:

- `Start a discussion`

Secondary action:

- `Use a prompt`

Acceptance notes:

- Starter prompts must be spoiler-safe by default.
- If the group contains different books, prompts should work across books or ask the user to choose a book.

### No Notifications

Message goal:

- Reassure the user that important group updates will appear here.

Primary action:

- `Notification settings`

Acceptance notes:

- Empty notification state should not ask the user to enable more alerts immediately.

## Notification Preferences

Purpose: give users control over reminders while preserving the weekly habit rhythm.

### Preference Categories

Reading rhythm:

- Monday check-in reminder
- Thursday discussion reminder
- Weekly recap

Group activity:

- Friend replied to your post
- Friend finished a book
- Book of the Month voting opened

Delivery:

- In-app
- Email, future
- Push, future PWA or native

### Controls

- Each notification type should have its own toggle.
- Group activity notifications may also have an "important only" option later.
- Reading rhythm reminders should allow preferred time of day.
- Defaults should be modest.

Recommended MVP defaults:

- Monday check-in: on
- Thursday discussion: on
- Weekly recap: on
- Replies: on
- Friend finished book: on
- Voting opened: on when the group uses Book of the Month

Acceptance notes:

- Users can turn off all reminders.
- Notification copy must avoid guilt, pressure, and streak threats.
- The app should not send multiple reading reminders in one day by default.
- Notification settings should be reachable from Profile and from notification empty state.
- Deep links should open the relevant check-in, discussion, reply, vote, or recap screen.

## Screen-Level Accessibility And Usability

Mobile requirements:

- Primary actions must be reachable near the lower half of the screen when practical.
- Forms should use large tap targets and clear labels.
- Long text inputs should not be required for daily check-ins.
- Key actions must remain usable with one hand.
- Avoid dense dashboards and nested cards.

Accessibility requirements:

- All controls need visible labels, not only icons.
- Spoiler-hidden content must be announced as hidden content to assistive technology.
- Color cannot be the only signal for status, progress, or warning.
- Reaction controls need text labels or accessible names.
- Confirmation messages should be perceivable without relying only on animation.

## MVP Acceptance Summary

The UX is ready for MVP implementation when:

- A new user can create a profile, add a book, and land on Today without joining a group.
- A new group member can join a private group and understand what to do next.
- A current user can complete a normal reading check-in in under 30 seconds.
- A user can skip today without shame-based copy.
- Group feed shows meaningful activity and does not mirror every small action.
- Discussion posts and replies support spoiler settings.
- Progress-locked and explicit spoiler content require intentional reveal.
- Empty states always provide one useful next action.
- Notification preferences are editable and default to a limited weekly rhythm.
- The mobile layout supports the product goal: helping someone keep reading when they otherwise might stop.
