# Sprint 1 Shell UX Review

Status: Draft for PM review. This document is not approved until the Product Manager accepts it. Do not sync this draft to GitHub without PM approval.

## Review Scope

This review compares the current visible app shell against:

- `13_UX_Flows.md`
- `30_Sprint_1_UX_Checklist.md`
- Current app files under `src/app`, `src/components`, and `src/lib/mock-app-state.ts`

No production code was changed as part of this review.

## Current UX Summary

The app now has a coherent visible shell with routes for:

- `/`
- `/sign-in`
- `/onboarding`
- `/today`
- `/groups`
- `/books`
- `/reviews`
- `/settings`

The implementation has moved beyond a pure Sprint 1 shell. It includes local Sprint 2-style behavior for adding current books, completing check-ins, storing recent logs, creating local groups, joining local groups, editing profile fields, and clearing local state.

Overall, the UX direction is aligned with Reading Momentum's calm, mobile-first tone, but several screens still read like internal sprint demos rather than user-facing product screens.

## What Is Working Well

### App Shell

- The authenticated shell has clear navigation across Today, Group, Books, Reviews, and Settings.
- Page headers are consistent through `PageHeader`.
- Placeholder surfaces are visually consistent through `PlaceholderCard`.
- Bottom/sticky navigation supports the mobile-first direction.
- The route set satisfies the Sprint 1 checklist requirement for first visible app areas.

### Tone And Scope Control

- Most copy avoids guilt, streak pressure, leaderboards, and page-count competition.
- Reviews remain clearly deferred.
- Scoring, XP, achievements, AI, recommendations, notifications, and Book of the Month remain out of the active UI.
- Skipped check-ins are supported without shame-based language.

### Forms And Inputs

- Auth, onboarding, settings, groups, books, and check-in forms use visible labels.
- Required validation exists for display name, book title, progress values, and skipped check-ins.
- Optional fields generally do not block progress.
- Touch targets appear reasonably mobile-friendly through `min-h-11` controls and full-width form sections.

### Sprint 2 Readiness

- Books and Today now support the basic local reading habit loop.
- Check-ins include visibility.
- Multiple units are supported: pages, chapters, minutes, audiobook minutes, and sessions.
- Local state survives refresh through `localStorage`.

## UX Gaps

### 1. Auth Experience Is Still Demo-Oriented

Current state:

- `/sign-in` is labeled `Sign in mock`.
- The form defaults to `reader@example.com` and `reading`.
- Primary action is `Continue`, not `Sign in`.
- There is no visible create-account path, even though Sprint 1 checklist expected sign up and log in access.

UX impact:

- Users see an internal testing artifact instead of a real entry point.
- The first impression does not fully match the product tone or trust goals.

Recommendation:

- Replace demo framing with user-facing copy.
- Add visible `Create account` and `Sign in` language, even if both route through the local mock for now.
- Keep a small development note out of the primary user flow if PM wants the mock status visible.

### 2. App Routes Are Not Protected In The UX

Current state:

- The home page links directly to `/today`.
- App pages can be opened without completing sign-in or onboarding.
- The app does not consistently redirect logged-out users to auth or profile setup.

UX impact:

- First-time users can land in the product shell without identity context.
- Empty or local-only states may feel confusing.

Recommendation:

- Add route gating once auth strategy is ready.
- Until then, add user-facing empty/session copy that explains what to do next without exposing implementation details.

### 3. Navigation Has Too Many Primary Items For Mobile

Current state:

- Bottom navigation includes Today, Group, Books, Reviews, and Settings plus a Reading Momentum brand link.
- `Reviews` is a top-level destination even though review systems are deferred.

UX impact:

- Mobile navigation risks feeling crowded.
- A deferred feature receives the same prominence as active habit and group areas.

Recommendation:

- For near-term mobile, consider four primary items: Today, Groups, Books, Settings/Profile.
- Move Reviews under Books or keep it as a secondary placeholder until review work starts.

### 4. Internal Sprint Copy Leaks Into User Screens

Current state:

- Today: `Sprint 2 adds the first local reading habit loop...`
- Groups: `Sprint 1 will establish...`
- Books: `Sprint 2 adds current book tracking...`
- Settings: `Sprint 1 prepares...`
- Reviews: `out of Sprint 1`

UX impact:

- The app feels like a project demo rather than a reader-facing app.
- This weakens the calm personal reading-space direction.

Recommendation:

- Move sprint references to docs, QA notes, or development-only banners.
- Rewrite visible copy around user value:
  - Today: what the reader can do now.
  - Groups: private support with friends.
  - Books: current reading list and progress.
  - Settings: profile and preferences.

### 5. Check-In Flow May Not Meet The 30-Second UX Bar Yet

Current state:

- Check-in form includes book, unit, amount, skipped, visibility, note, and submit on one card.
- Book and unit are separate selects.
- The form does not adapt to the selected book's goal type.

UX impact:

- Functional, but still more form-like than quick.
- Users must decide too much on every check-in.

Recommendation:

- Preselect the most recent current book.
- Default unit to the selected book's goal type.
- Collapse optional note behind a secondary affordance.
- Keep visibility defaulted to the user's last safe choice.
- Use a single primary input with clear helper text.

### 6. Page And Chapter Check-In Semantics Are Ambiguous

Current state:

- Sprint 2 review notes the implementation treats page and chapter check-ins as absolute progress points.
- UI labels say `Amount`, which may imply pages read or chapters completed.

UX impact:

- Users may log incorrectly.
- Future scoring/feed copy may misrepresent progress.

Recommendation:

- Decide and label clearly:
  - `Current page` for absolute progress, or
  - `Pages read today` for delta progress.
- Apply the same distinction to chapters.

### 7. Empty States Still Include Some Negative Or Internal Framing

Current examples:

- `No current book`
- `No check-ins yet.`
- `No groups yet. Create or join one to verify the Sprint 1 foundation.`

UX impact:

- These are understandable, but less warm and action-oriented than the UX checklist recommends.

Recommendation:

- Use next-action empty states:
  - `Add what you are already reading.`
  - `Your first check-in will appear here.`
  - `Read with a private group.`

### 8. Group Join Flow Accepts Any Invite Code Locally

Current state:

- `joinMockGroup` creates a group for any code, including empty fallback behavior.

UX impact:

- Useful for local prototyping, but it does not model invalid-code recovery.
- The Sprint 1 UX checklist expected invalid invite code feedback.

Recommendation:

- Add a local validation rule or explicit prototype label.
- Show clear recoverable error copy for invalid or empty codes.

### 9. Loading And Error State Coverage Is Partial

Current state:

- Global loading and not-found pages exist.
- Form-level validation messages exist.
- Submitting/loading disabled states are not visible in the local forms.

UX impact:

- The app may feel instant locally, but later async Supabase flows will need loading, duplicate-submit prevention, and service-error states.

Recommendation:

- Add explicit button loading states for auth, profile save, group create/join, book add, and check-in submit as soon as async persistence is introduced.
- Keep inline validation messages but distinguish success and error states visually and semantically.

### 10. Text Encoding Issue Appears In UI Strings

Current state:

- Some rendered strings show `Â·` and password placeholder artifacts such as `â€¢`.

UX impact:

- The interface looks unpolished and may reduce trust.

Recommendation:

- Replace encoded characters with safe ASCII alternatives or ensure source encoding renders correctly.
- Use ` - ` or plain words if needed.

## Recommended Next Tasks

Priority order:

1. Remove or hide internal sprint/mock language from primary user-facing screens.
2. Clarify auth entry: sign in, create account, and onboarding routing.
3. Decide mobile navigation: keep Reviews top-level or move it under Books/Profile until reviews begin.
4. Tighten check-in into a faster goal-aware form.
5. Decide absolute-versus-delta semantics for page and chapter progress.
6. Improve empty states with next-action copy.
7. Add invalid invite-code feedback in the local group join prototype.
8. Add async-ready loading and disabled states for form submissions.
9. Fix text encoding artifacts.
10. Prepare group feed UX for Sprint 3 using the group-visible check-in visibility already present.

## PM Decisions Needed

- Should user-facing screens retain any local/demo language before real Supabase auth is active?
- Should Reviews remain a primary nav item during Sprint 3?
- Should check-ins record absolute progress or daily amount for pages and chapters?
- Should group-visible check-ins appear in one combined group feed or inside each group detail view first?
- Should notification preference placeholders stay in Settings before notification persistence exists?

## Review Conclusion

The current shell is a solid local prototype foundation and has already crossed into the Sprint 2 habit loop. The main UX risk is not missing routes; it is that visible copy and interaction details still expose the build process instead of presenting a calm reader-facing app. Sprint 3 should preserve the working local book/check-in foundation while making Groups feel alive through a low-noise feed and discussion creation.
