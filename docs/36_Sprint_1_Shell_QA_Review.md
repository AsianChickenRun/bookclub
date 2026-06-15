# Sprint 1 Shell QA Review

Status: Draft pending PM approval

This review is a draft QA assessment of the current workspace shell implementation. It is not official until reviewed and approved by the Product Manager, and it must not be synced to GitHub by a specialist agent.

## Review Scope

Reviewed on: 2026-06-15

Reviewed files and docs:

- README.md
- package.json
- src/app routes
- src/components shell components
- src/lib/mock-app-state.ts
- src/lib/supabase helpers
- src/types/database.ts
- supabase/migrations/202606150001_sprint1_foundation.sql
- docs/18_Sprint_1_Plan.md
- docs/24_Testing_Strategy.md
- docs/26_Security_Model.md
- docs/31_Sprint_1_QA_Checklist.md
- docs/35_Sprint_1_Implementation_Log.md
- docs/40_Sprint_1_Review.md

No production code was modified.

## Current QA Summary

Result: Do not accept the current workspace as clean until the typecheck/build blocker is resolved.

The Sprint 1 shell exists and the local mock flows cover the intended foundation shape: landing page, sign-in mock, onboarding/profile setup, app navigation, Today, Groups, Books, Reviews, and Settings. The workspace has also advanced beyond pure Sprint 1 into Sprint 2/Sprint 3 local prototype work, including current books, check-ins, group-visible activity, and discussion metadata.

The main current blocker is that TypeScript verification and production build fail in the current workspace. That means the shell is not currently in an acceptable release-ready state, even though lint passes and the visible route structure is present.

## Verification Performed

Used bundled Node runtime because `pnpm` and `npm` were not available on PATH in this shell.

| Check | Result | Notes |
| --- | --- | --- |
| Lint | Pass | `node node_modules/eslint/bin/eslint.js .` completed without errors. |
| Typecheck | Fail | `tsc --noEmit` fails on `MockActivity` typing in check-in activity creation. |
| Build | Fail | `next build` compiles, then fails during type checking on the same issue. |
| Browser visual QA | Not run | No browser automation was used in this review. |
| Supabase RLS live test | Not run | Migration was inspected, but policies were not applied/tested against a live Supabase project. |

## Blocking Findings

### QA-S1-001: Typecheck And Build Fail On Activity Type Inference

Severity: P0

Files:

- src/lib/mock-app-state.ts
- src/app/(app)/today/page.tsx

Finding:
`addMockReadingLog` creates a group activity object with `type: "check_in"` and `spoilerLevel: "none"`, but TypeScript infers those values as generic strings inside the composed `nextState`. The returned object is therefore not assignable to `MockAppState`, causing both typecheck and build to fail.

Evidence:

- `src/app/(app)/today/page.tsx` fails at `setState(nextState)`.
- `src/lib/mock-app-state.ts` fails at `writeMockState(nextState)`.
- Error cites `type: string` not assignable to `"check_in" | "discussion"`.

Impact:
The current app cannot be considered Sprint-close ready because the production build fails.

Recommended next ticket:

### QA-S1-FIX-001: Fix Mock Activity Typing So Typecheck And Build Pass

Priority: P0

Acceptance criteria:

- `pnpm typecheck` or equivalent bundled-node TypeScript check passes.
- `pnpm build` or equivalent Next build passes.
- Group-visible check-in activity remains typed as `MockActivity`.
- No production feature scope is expanded while fixing the type issue.

## Non-Blocking Findings And Risks

### QA-S1-002: Current Workspace Has Advanced Beyond Sprint 1 Scope

Severity: P1

Finding:
The current workspace includes Sprint 2/Sprint 3 local prototype behavior: current books, check-ins, visibility, activities, discussion posts, and spoiler metadata. This is expected if later sprint work has started, but it makes a pure Sprint 1 shell review harder.

Risk:
Sprint 1 acceptance evidence may become mixed with later sprint behavior. PM should distinguish "Sprint 1 local foundation accepted earlier" from "current workspace is clean."

Recommended next ticket:

### QA-S1-FOLLOW-001: Separate Sprint 1 Acceptance Notes From Current Workspace Health

Priority: P1

Acceptance criteria:

- Sprint 1 review states whether acceptance applies to the historical Sprint 1 checkpoint or current workspace.
- Current workspace health is tracked separately with typecheck/build status.
- Later sprint prototype behavior is not used to retroactively satisfy Sprint 1 auth/security requirements.

### QA-S1-003: Auth Shell Is Mock-Only And Does Not Gate App Routes

Severity: P1

Finding:
The sign-in and onboarding flows use local storage mock state. The app route layout renders navigation and child routes without enforcing an authenticated Supabase session. Direct access to `/today`, `/groups`, `/books`, `/reviews`, and `/settings` appears available as route scaffolding.

Risk:
This is acceptable as a visible local prototype only if documented as mock behavior. It does not satisfy real auth or protected-route acceptance.

Recommended next ticket:

### QA-S1-FOLLOW-002: Add Real Auth Route Protection When Supabase Auth Is Connected

Priority: P0 for Supabase integration

Acceptance criteria:

- Logged-out users cannot access protected app routes.
- Authenticated users without profiles are routed to onboarding/profile setup.
- Logout clears access to private app views.
- Protected data does not flash before redirect.

### QA-S1-004: RLS Is Migration-Defined But Not Live-Verified

Severity: P1

Finding:
The Sprint 1 migration defines `profiles`, `groups`, `group_members`, helper functions, RLS enablement, policies, and controlled group functions. However, this review did not verify the migration against a real Supabase project or local Supabase instance.

Risk:
Policy syntax and intended behavior may look correct in review but still fail once applied or tested with authenticated roles.

Recommended next ticket:

### QA-S1-FOLLOW-003: Run RLS Policy Test Matrix Against Supabase

Priority: P0 for external-service completion

Acceptance criteria:

- Migration applies cleanly.
- User A can read/update User A profile.
- User A cannot update User B profile.
- Active member can read their group.
- Non-member cannot read private group records.
- `create_group` creates group and owner membership together.
- `join_group_by_invite` rejects invalid invite codes.

### QA-S1-005: Visual And Accessibility QA Remain Unverified

Severity: P2

Finding:
The shell uses semantic labels for many form controls and has a mobile-first structure, but no browser visual pass or automated accessibility scan was run in this review.

Risk:
Layout issues, keyboard gaps, focus visibility issues, and text clipping may exist even though static review looks reasonable.

Recommended next ticket:

### QA-S1-FOLLOW-004: Run Browser Smoke And Accessibility Pass

Priority: P1

Acceptance criteria:

- Auth, onboarding, Today, Groups, Books, Reviews, and Settings pages are checked at mobile and desktop widths.
- Keyboard navigation is verified.
- Form labels and error messages are verified.
- No major overlapping text or clipped controls appear.
- Findings are logged with screenshots where possible.

### QA-S1-006: Mojibake Characters Appear In Some UI Copy

Severity: P2

Finding:
Some UI strings render encoded characters such as `Â·` and `â€¢` in source output. These appear in sign-in password placeholder and book/check-in metadata separators.

Risk:
Visible text polish may look broken to users and PM reviewers.

Recommended next ticket:

### QA-S1-FOLLOW-005: Normalize UI Copy Encoding

Priority: P2

Acceptance criteria:

- Password placeholder renders cleanly.
- Metadata separators render cleanly.
- Source files use consistent UTF-8 or ASCII-safe copy.
- Visual pass confirms no mojibake appears in core routes.

## Pass/Fail Checklist

### App Shell And Navigation

- [x] Landing page exists.
- [x] App layout exists.
- [x] Navigation exists for Today, Group, Books, Reviews, and Settings.
- [x] Today page exists.
- [x] Groups page exists.
- [x] Books page exists.
- [x] Reviews placeholder exists.
- [x] Settings page exists.
- [ ] Current workspace builds successfully.

Result: Fail until build passes.

### Auth Shell

- [x] Sign-in mock route exists.
- [x] Sign-in mock validates required email/password fields.
- [x] Onboarding/profile setup route exists.
- [x] Profile setup requires display name.
- [ ] Real Supabase auth is connected.
- [ ] Protected app routes are gated by real auth.
- [ ] Logout clears real authenticated access.

Result: Pass for local mock shell; fail for real auth readiness.

### Profile Setup

- [x] Profile setup mock exists.
- [x] Display name is required.
- [x] Favorite genres are optional.
- [x] Time zone is captured/defaulted locally.
- [x] Settings page can edit local profile data.
- [ ] Profile writes are live-verified against RLS.

Result: Pass for mock profile flow; RLS verification pending.

### Group Foundation

- [x] Local group creation exists.
- [x] Local join-by-code flow exists.
- [x] Group role is displayed.
- [x] Sprint 1 migration includes groups and group_members.
- [x] Migration includes controlled `create_group` and `join_group_by_invite` functions.
- [ ] Non-member access is live-verified through Supabase/RLS.
- [ ] Direct route access is protected by real auth.

Result: Pass for local shell; security verification pending.

### RLS And Security

- [x] Initial migration enables RLS for Sprint 1 tables.
- [x] Initial profile/group/member policies exist.
- [x] Supabase browser/server client factories exist.
- [x] Environment helper fails when Supabase env vars are missing.
- [ ] Policies are applied and tested in Supabase.
- [ ] Service-role exposure check is automated.

Result: Pending external-service verification.

### Smoke And CI

- [x] Lint currently passes.
- [ ] Typecheck currently passes.
- [ ] Build currently passes.
- [ ] Test framework exists.
- [ ] CI result was verified in this review.

Result: Fail due to typecheck/build failure.

### Scope Guardrails

- [x] No real Reading Momentum scoring found.
- [x] No XP found as implemented product behavior.
- [x] No achievements found as implemented product behavior.
- [x] No leaderboards found.
- [x] No AI prompts found.
- [x] No Book of the Month found.
- [x] Reviews remain placeholder-only.
- [x] Notifications remain deferred.

Result: Pass, with note that Sprint 2/Sprint 3 local prototype behavior is now present.

## Risks

- Build failure blocks acceptance of current workspace health.
- Mock auth may be mistaken for real protected-route behavior.
- RLS is designed but not proven.
- Current local state uses browser localStorage, so privacy/security behavior is not representative of production.
- Visual QA and accessibility QA are still needed.
- Sprint 1 review evidence may be stale because the workspace has moved into Sprint 2/Sprint 3 implementation.

## Recommended Next Tickets

### QA-S1-FIX-001: Fix Mock Activity Typing So Typecheck And Build Pass

Priority: P0

### QA-S1-FOLLOW-002: Add Real Auth Route Protection When Supabase Auth Is Connected

Priority: P0 for Supabase integration

### QA-S1-FOLLOW-003: Run RLS Policy Test Matrix Against Supabase

Priority: P0 for external-service completion

### QA-S1-FOLLOW-004: Run Browser Smoke And Accessibility Pass

Priority: P1

### QA-S1-FOLLOW-005: Normalize UI Copy Encoding

Priority: P2

## Final QA Recommendation

Do not mark the current workspace as clean until typecheck and build pass.

Historical Sprint 1 local foundation may remain accepted per PM decision in `docs/40_Sprint_1_Review.md`, but the current shell state needs a build-fix ticket before it should be used as a stable baseline for the next sprint.
