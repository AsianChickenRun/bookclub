# Sprint 3 QA Checklist

Status: Draft pending PM approval

This checklist is a draft QA acceptance aid for Sprint 3: Group Activity And Discussion Foundation. It is not official until reviewed and approved by the Product Manager, and it must not be synced to GitHub by a specialist agent.

## Purpose

Sprint 3 should make a private group feel alive without adding advanced systems. QA should verify that group-visible check-ins appear in a curated feed, private check-ins stay private, users can create basic discussion posts, spoiler metadata is stored and displayed conservatively, and out-of-scope product systems remain deferred.

## Review Inputs

Source docs:

- docs/44_Sprint_3_Plan.md
- docs/41_Sprint_2_Plan.md
- docs/16_QA_Risk_Register.md
- docs/24_Testing_Strategy.md
- docs/26_Security_Model.md

Suggested implementation files to inspect:

- src/app/(app)/today/page.tsx
- src/app/(app)/groups/page.tsx
- src/lib/mock-app-state.ts
- src/types/database.ts
- supabase/migrations

## Acceptance Summary

Sprint 3 is QA-acceptable only when:

- [ ] Typecheck passes.
- [ ] Build passes.
- [ ] A private check-in does not create a group feed activity.
- [ ] A group-visible check-in creates a group feed activity.
- [ ] Group feed shows curated recent activity.
- [ ] Discussion post creation works for an active group.
- [ ] Discussion posts can optionally attach to a current book.
- [ ] Discussion posts support spoiler metadata.
- [ ] Route smoke checks pass for Sprint 3 routes.
- [ ] Out-of-scope systems remain deferred.
- [ ] Known limitations are documented and accepted by PM.

## 1. Group-Visible Versus Private Check-Ins

Goal:
Visibility must control whether a reading check-in becomes group activity.

Acceptance checks:

- [ ] User can create or join a local group.
- [ ] User can add a current book.
- [ ] User can submit a private check-in.
- [ ] Private check-in appears in personal recent check-ins.
- [ ] Private check-in does not appear in group feed.
- [ ] User can submit a group-visible check-in.
- [ ] Group-visible check-in appears in personal recent check-ins.
- [ ] Group-visible check-in creates one group feed item.
- [ ] Group-visible skipped-day check-in creates supportive feed copy if feed item is created.
- [ ] Check-in feed item includes actor, activity type, related book when available, summary, and timestamp.
- [ ] Check-in feed item does not rank users by pages or raw volume.

Negative checks:

- [ ] Check-in cannot submit a positive amount when skipped is selected.
- [ ] Check-in cannot submit negative progress.
- [ ] Check-in cannot submit progress beyond known total pages or chapters.
- [ ] Check-in without a current book fails safely.

Evidence:

- Tester:
- Date:
- Environment:
- Notes:

## 2. Feed Inclusion And Curation

Goal:
The group feed should show meaningful activity without exposing private actions or becoming noisy.

Acceptance checks:

- [ ] Group page shows a recent activity section.
- [ ] Feed includes group-visible check-ins.
- [ ] Feed excludes private check-ins.
- [ ] Feed includes discussion activity.
- [ ] Feed is scoped to the active group.
- [ ] Feed displays empty state when there is no activity.
- [ ] Feed displays newest or recent items first.
- [ ] Feed item labels distinguish check-ins from discussions.
- [ ] Feed item copy is supportive and low-pressure.
- [ ] Feed does not show XP, scoring, ranking, or leaderboard behavior.

Edge-case checks:

- [ ] Multiple groups do not show each other's activity in the active group view.
- [ ] Activity still renders if related book title is missing.
- [ ] Activity still renders if profile display name is missing, using safe fallback copy.
- [ ] Feed does not crash when local state is empty or partially missing.

Evidence:

- Tester:
- Date:
- Environment:
- Notes:

## 3. Discussion Creation

Goal:
Users can start a lightweight group discussion without introducing comments, full threading, AI, or review systems.

Acceptance checks:

- [ ] User can create or join a group before posting.
- [ ] Discussion form is visible for the active group.
- [ ] Discussion body is required.
- [ ] Empty discussion body is rejected with clear copy.
- [ ] User can create a discussion without attaching a book.
- [ ] User can create a discussion attached to a current book.
- [ ] Created discussion appears in discussion posts list.
- [ ] Created discussion creates a group feed activity.
- [ ] Discussion post includes author fallback, body, optional related book, spoiler metadata, and timestamp.
- [ ] Discussion form resets after successful post.

Negative checks:

- [ ] User without a group cannot post discussion.
- [ ] Empty or whitespace-only discussion cannot be posted.
- [ ] Discussion creation does not create duplicate activity items.
- [ ] Discussion creation does not require AI-generated prompts.

Evidence:

- Tester:
- Date:
- Environment:
- Notes:

## 4. Spoiler Metadata

Goal:
Sprint 3 should store and display conservative spoiler metadata, while full spoiler reveal and locking behavior remain later work.

Acceptance checks:

- [ ] Discussion supports `none` spoiler setting.
- [ ] Discussion supports `progress_locked` spoiler setting.
- [ ] Discussion supports `explicit` spoiler setting.
- [ ] Progress-locked discussion can store page boundary.
- [ ] Progress-locked discussion can store chapter boundary.
- [ ] Spoiler level appears on discussion post display.
- [ ] Spoiler level appears on related feed activity.
- [ ] Check-in feed activity uses `none` spoiler metadata by default.
- [ ] Spoiler metadata is represented in local model.
- [ ] Supabase-ready type shape includes spoiler fields for future persistence if applicable.

Conservative behavior checks:

- [ ] Full reveal workflow is not required for Sprint 3.
- [ ] Spoiler metadata is not treated as a privacy/security boundary.
- [ ] UI does not claim spoiler lock enforcement is complete if reveal/lock logic is not implemented.
- [ ] Explicit spoilers are at least labeled clearly.

Negative checks:

- [ ] Invalid spoiler level cannot be selected from the UI.
- [ ] Negative spoiler page or chapter is blocked by the form control or validation.
- [ ] Non-numeric spoiler page or chapter cannot be submitted from number inputs.

Evidence:

- Tester:
- Date:
- Environment:
- Notes:

## 5. Route And Smoke Checks

Goal:
Core routes should load after Sprint 3 work, and the app should remain buildable.

Required local checks:

- [ ] Lint passes.
- [ ] Typecheck passes.
- [ ] Build passes.
- [ ] App starts locally.

Route checks:

- [ ] `/` loads.
- [ ] `/sign-in` loads.
- [ ] `/onboarding` loads.
- [ ] `/today` loads.
- [ ] `/groups` loads.
- [ ] `/books` loads.
- [ ] `/reviews` loads.
- [ ] `/settings` loads.
- [ ] Unknown route shows not-found state.

Flow smoke checks:

- [ ] Sign in mock or approved auth flow works.
- [ ] Profile setup or existing profile flow works.
- [ ] Create group flow works.
- [ ] Add book flow works.
- [ ] Private check-in flow works.
- [ ] Group-visible check-in flow works.
- [ ] Discussion post flow works.

Evidence:

- Tester:
- Date:
- Environment:
- Commands or CI run:
- Notes:

## 6. Accessibility And Usability Basics

Goal:
Sprint 3 additions should preserve the mobile-first, low-pressure experience.

Acceptance checks:

- [ ] Group feed is usable at mobile width.
- [ ] Discussion form fields have visible labels.
- [ ] Spoiler controls have understandable labels.
- [ ] Form errors are visible and understandable.
- [ ] Keyboard user can reach discussion fields and submit button.
- [ ] Feed item labels are text-based, not color-only.
- [ ] Buttons and controls have adequate tap size.
- [ ] Activity cards do not overlap or clip text on mobile.
- [ ] Empty states provide useful next action or explanation.

Evidence:

- Tester:
- Date:
- Environment:
- Notes:

## 7. Data Shape And Future Persistence

Goal:
Local Sprint 3 data should remain ready to move to Supabase without major product reinterpretation.

Acceptance checks:

- [ ] Activity model includes group id.
- [ ] Activity model includes actor identity or safe actor display fallback.
- [ ] Activity model includes type.
- [ ] Activity model includes related book title or nullable equivalent.
- [ ] Activity model includes related source id.
- [ ] Activity model includes spoiler metadata.
- [ ] Activity model includes timestamp.
- [ ] Discussion model includes group id.
- [ ] Discussion model includes author identity or safe author display fallback.
- [ ] Discussion model includes body.
- [ ] Discussion model includes optional related book.
- [ ] Discussion model includes spoiler metadata.
- [ ] Discussion model includes timestamp.

Risk checks:

- [ ] Local-only behavior is clearly documented if Supabase persistence is not implemented.
- [ ] Group membership security is not overclaimed while localStorage is used.
- [ ] Private check-in exclusion is tested at the app-state level, not only visually.

Evidence:

- Tester:
- Date:
- Environment:
- Notes:

## 8. Out-Of-Scope Guardrails

Goal:
Sprint 3 should avoid pulling in complex product systems too early.

Confirm each item is absent or has an explicit PM-approved exception:

- [ ] Reading Momentum score is absent or approved as an exception.
- [ ] XP is absent or approved as an exception.
- [ ] Achievements are absent or approved as an exception.
- [ ] Leaderboards are absent or approved as an exception.
- [ ] AI prompts are absent or approved as an exception.
- [ ] Reviews and live review timeline remain deferred or placeholder-only.
- [ ] Notifications are absent or approved as an exception.
- [ ] Book of the Month is absent or approved as an exception.
- [ ] Recommendations are absent or approved as an exception.
- [ ] Full spoiler reveal workflow is absent or approved as an exception.
- [ ] Full comment/reply threading is absent or approved as an exception.

If any item above is present:

- PM-approved exception:
- Reason:
- Risk:
- Follow-up needed:

## 9. Known Risk Checks

Use these scenarios before recommending Sprint 3 acceptance.

- [ ] User creates a group, adds a book, submits private check-in, and confirms group feed remains empty.
- [ ] User submits group-visible check-in and confirms exactly one feed item appears.
- [ ] User creates a discussion without a book and confirms it appears in feed and discussion list.
- [ ] User creates a discussion attached to a book and confirms book title appears.
- [ ] User creates a progress-locked discussion with page or chapter metadata.
- [ ] User creates an explicit spoiler discussion and confirms it is labeled.
- [ ] User switches active group or creates a second group and confirms feed scoping remains correct.
- [ ] User refreshes and confirms local Sprint 3 data persists.
- [ ] User clears local session and confirms local data reset behavior is understood.

## Final QA Recommendation

QA result:

- [ ] Accept Sprint 3
- [ ] Accept with documented follow-ups
- [ ] Do not accept yet

Blocking issues:

- 

Non-blocking follow-ups:

- 

PM decisions needed:

- 

Recommended Sprint 4 carry-forward risks:

- 

Reviewer:

Date:

Environment reviewed:
