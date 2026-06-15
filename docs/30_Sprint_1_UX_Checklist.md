# Sprint 1 UX Checklist: First Visible App Shell

Status: Draft for PM review. This document is not approved until the Product Manager accepts it. Do not sync this draft to GitHub without PM approval.

## Purpose

This checklist defines the concrete UX requirements for the first visible Reading Momentum app shell in Sprint 1. It translates the UX flows, Sprint 1 plan, and draft style guide into screen-level requirements for implementation.

Sprint 1 should make the app feel coherent and usable, but it must not implement major product systems such as check-ins, scoring, XP, achievements, reviews, AI prompts, notifications, Book of the Month, or leaderboards.

## Sprint 1 UX Principles

- Mobile-first layout is the source of truth.
- The app should feel calm, warm, and supportive.
- Each screen should have one obvious next action.
- Empty states should look intentional, not unfinished.
- Placeholder screens should prepare users for future product areas without pretending the features are live.
- Copy must avoid guilt, pressure, page-count competition, and public-community assumptions.
- Private groups should feel central to the social experience.
- Spoiler safety language may appear in placeholders, but spoiler logic is not required for Sprint 1 unless tied to a future stub.

## Global App Shell

### Required Screens In Shell

Sprint 1 should include routes or pages for:

- Auth: sign up, log in, log out handling
- Onboarding/profile setup
- Today dashboard shell
- Groups
- Books
- Reviews
- Settings
- Loading states
- Error and not-found states

### Navigation Requirements

Mobile navigation:

- Use bottom navigation for authenticated users.
- Include Today, Groups, Books, and Settings or Profile.
- Reviews may be reachable from Books, Profile/Settings, or a visible placeholder route depending on approved navigation structure.
- The active tab must be visually clear and accessible.
- Navigation labels must remain visible; do not rely on icons alone.

Desktop navigation:

- May use a wider layout, sidebar, or top navigation.
- Must preserve the same primary destinations.
- Should not introduce extra feature areas beyond Sprint 1 scope.

Authentication state:

- Logged-out users should only see auth/welcome flows.
- Logged-in users without a profile should be directed to profile setup.
- Logged-in users with a profile should land on Today.
- Users should not see private group pages they are not allowed to access.

Acceptance notes:

- The app shell should never show a broken blank screen during auth checks.
- Placeholder pages should include useful copy and a next action.
- Navigation must remain usable on small mobile screens.

## Auth Screens

### Sign Up

Required elements:

- Product name
- Short value statement
- Email field
- Password field or approved auth provider option
- Primary action: `Create account`
- Secondary action: `Sign in`
- Inline error area
- Loading/submitting state

Copy direction:

- Warm and direct.
- Emphasize private reading momentum, not public social networking.

Acceptance notes:

- Form labels must be visible.
- Password requirements should be stated before submission when possible.
- Errors should explain what happened and how to recover.
- Successful sign-up should route predictably to profile setup or email confirmation handling.

### Log In

Required elements:

- Email field
- Password field or approved auth provider option
- Primary action: `Sign in`
- Secondary action: `Create account`
- Optional password reset entry point if technically supported
- Inline error area
- Loading/submitting state

Acceptance notes:

- Authentication failures should not expose sensitive technical details.
- The user should remain on the form with their email preserved after recoverable errors.
- A signed-in user should not remain on the login page.

### Log Out

Required behavior:

- User can sign out from Settings or Profile.
- Signing out returns the user to the logged-out auth experience.
- A loading state should prevent duplicate sign-out actions.

## Onboarding And Profile Setup

Purpose: collect the minimum profile data needed for a private reading identity.

### Required Screen: Profile Setup

Fields:

- Display name, required
- Profile photo, optional or placeholder only
- Favorite genres, optional if easy to support
- Timezone, default automatically when possible

Primary action:

- `Continue`

Secondary action:

- `Skip optional fields` or equivalent if optional sections are visually prominent

Acceptance notes:

- The user must be able to complete setup with only a display name.
- Empty optional fields must not block completion.
- Display name validation should be clear and friendly.
- Photo upload can be deferred; if deferred, show initials fallback.
- The screen should not ask for reading goals yet unless the add-book flow is also implemented.

### Optional First Step Choice

If included in Sprint 1, the first step choice should offer:

- `Create a group`
- `Join with invite code`
- `Go to Today`

Do not include `Add my current book` unless an add-book flow or clear placeholder exists.

Acceptance notes:

- Users can reach Today without creating or joining a group.
- Users who create or join a group should return to Today or the group page with clear confirmation.
- Copy must not imply that a shared group book is required.

## Today Dashboard Shell

Purpose: establish the app home for future reading check-ins while staying honest about Sprint 1 scope.

### Required Content

- Page title: `Today`
- Short supportive status message
- Empty current-book state
- Placeholder for future check-in action
- Placeholder for weekly rhythm or group activity
- Optional profile completion or group setup prompt

### Empty Current Book State

Recommended copy:

- Heading: `Add what you are already reading`
- Body: `Your current book will live here once book tracking is ready.`

Primary action:

- If add-book is not implemented: disabled or placeholder action labeled `Add book coming soon`
- If add-book placeholder route exists: `Add a book`

Secondary action:

- `Create a group` or `Join with invite code` if the user has no group

Acceptance notes:

- Do not show fake streaks, fake scores, fake XP, or fake reading data.
- Do not implement check-in submission in Sprint 1.
- Do not show a leaderboard or page-count comparison.
- The dashboard should feel useful even before books and check-ins are live.
- Placeholder copy should point toward reading, not app engagement.

## Groups Screen

Purpose: support Sprint 1 private group create/join foundation and provide a placeholder for future group activity.

### No Group State

Required content:

- Heading: `Read with a private group`
- Body explaining that groups help friends keep momentum at their own pace
- Primary action: `Create a group`
- Secondary action: `Join with invite code`

Acceptance notes:

- Do not mention public communities.
- Do not require a Book of the Month.
- Do not imply everyone must read the same book.

### Create Group

Fields:

- Group name, required
- Description, optional

Primary action:

- `Create group`

Acceptance notes:

- Creator should become group owner/member after successful creation.
- Empty or invalid group names should show inline errors.
- Success should route to the group page or group detail placeholder.

### Join Group

Fields:

- Invite code, required

Primary action:

- `Join group`

Acceptance notes:

- Invalid invite codes should show a clear recoverable error.
- Joining should not expose private group data before membership is confirmed.
- Success should route to the group page or group detail placeholder.

### Group Detail Placeholder

Required content:

- Group name
- Member count or member list if available
- Placeholder sections for feed, discussions, and future check-ins
- Invite code or invite action if technically supported and allowed

Placeholder copy:

- Feed: `Group activity will appear here as members check in and discuss books.`
- Discussion: `Discussion prompts are planned for a later sprint.`

Acceptance notes:

- The page should not show fake feed posts.
- The page should not implement discussion posts or replies in Sprint 1.
- Non-members should not be able to view the group page.

## Books Placeholder

Purpose: reserve the future home for current books while avoiding incomplete tracking behavior.

### Required Content

- Page title: `Books`
- Empty state explaining that current books will appear here
- Primary action placeholder for `Add a book`
- Optional list sections shown as empty or disabled:
  - Current
  - Paused
  - Finished

Recommended copy:

- Heading: `Your reading list starts here`
- Body: `Soon you will be able to add current books, choose a goal type, and track progress at your own pace.`

Acceptance notes:

- Do not implement full add-book tracking unless Sprint 1 scope changes.
- Do not collect pages, chapters, minutes, or sessions unless the full flow is approved.
- Do not show fake completed books.
- The placeholder should align with future goal types: pages, chapters, minutes, sessions.

## Reviews Placeholder

Purpose: acknowledge the future reviews area without building review systems in Sprint 1.

### Required Content

- Page title: `Reviews`
- Empty state explaining future live and final reviews
- Optional spoiler-safe reminder

Recommended copy:

- Heading: `Reviews will come after reading tracking`
- Body: `Later, you will be able to save thoughts while reading and write final reviews when you finish a book.`

Acceptance notes:

- Do not implement final reviews, live review timelines, ratings, or review submission.
- Do not show fake review cards.
- If spoiler safety is mentioned, keep it simple: `Future reviews will support spoiler-safe visibility.`

## Settings Screen

Purpose: give users control over account basics and app preferences available in Sprint 1.

### Required Content

- Profile summary
- Edit profile entry point
- Account section
- Group membership links if available
- Notification preferences placeholder
- Sign out action

### Edit Profile

Fields:

- Display name
- Profile photo placeholder or upload if supported
- Favorite genres, optional
- Timezone

Acceptance notes:

- User can update profile fields that were collected in onboarding.
- Optional fields remain optional.
- Save states should include loading, success, and error feedback.

### Notification Preferences Placeholder

Required content:

- Explain that detailed notification controls are planned.
- Show future categories if useful:
  - Monday check-in reminder
  - Thursday discussion reminder
  - Replies
  - Weekly recap

Acceptance notes:

- Do not send or schedule real notifications in Sprint 1.
- Do not display toggles as functional unless backed by persisted settings.
- Copy must avoid pressure or streak threats.

### Sign Out

Acceptance notes:

- Sign out should be visually separate from normal profile edits.
- It should be clear but not styled like a destructive danger action unless account deletion is nearby.

## Loading States

Loading states should make the app feel stable during auth, profile, and group checks.

### Required Loading States

- Initial auth/session check
- Sign up submission
- Log in submission
- Profile save
- Group create
- Group join
- Route-level content loading

UX requirements:

- Use short text where helpful, such as `Checking your session...` or `Creating your group...`
- Disable duplicate submit actions while loading.
- Preserve layout shape when possible to reduce visual jump.
- Do not use playful or overly dramatic loading copy.

Acceptance notes:

- Loading states should not trap the user indefinitely without an error fallback.
- Buttons should communicate loading state accessibly.
- Skeletons may be used for dashboard or group placeholders, but simple spinners are acceptable for Sprint 1 forms.

## Error States

Error states should be recoverable and human-readable.

### Required Error Scenarios

- Invalid login
- Sign-up failure
- Missing required profile display name
- Profile save failure
- Invalid group invite code
- Group create failure
- Unauthorized group access
- Missing environment or service connection failure, if surfaced to the UI
- Not found route

UX requirements:

- Explain what happened in plain language.
- Provide one next action where possible.
- Keep user-entered data intact after recoverable form errors.
- Avoid raw technical errors in user-facing UI.
- Use color plus icon/text, not color alone.

Recommended patterns:

- Inline errors for field-specific problems.
- Page-level error state for unauthorized, not found, or service unavailable cases.
- Toast or inline confirmation for successful saves.

## First Visible Shell Acceptance Checklist

The Sprint 1 app shell is UX-ready for PM review when:

- Logged-out users can reach sign up and log in screens.
- Logged-in users without profiles are directed to profile setup.
- Users can create and edit a basic profile.
- Auth forms include loading and error states.
- Auth redirects are predictable.
- The authenticated shell includes mobile-first navigation.
- Today, Groups, Books, Reviews, and Settings exist as visible areas or approved routes.
- Today shows an intentional dashboard shell with no fake reading data.
- Groups supports create/join foundation or clearly scoped placeholders.
- Books and Reviews placeholders are honest about future functionality.
- Settings includes profile editing and sign out.
- Loading, empty, error, and success states are present for implemented flows.
- Copy matches the calm, supportive Reading Momentum tone.
- No Sprint 1 screen implements out-of-scope scoring, XP, achievements, AI prompts, notifications, reviews, Book of the Month, or leaderboards.
- The UI uses accessible labels, visible focus states, readable contrast, and mobile-sized tap targets.

## PM Review Notes

This checklist should be reviewed against:

- `13_UX_Flows.md`
- `18_Sprint_1_Plan.md`
- `22_Style_Guide.md`

Open PM decisions:

- Should the fourth primary navigation item be `Profile` or `Settings` for Sprint 1?
- Should `Reviews` be a top-level route, a Books sub-route, or only a placeholder page in Sprint 1?
- Should Sprint 1 include an add-book placeholder button only, or a minimal non-persisted preview of the future flow?
- Should notification preferences show disabled future toggles or a simple explanatory placeholder?

Until PM approval, this document remains a draft specialist deliverable and should not be synced to GitHub.
