# Sprint 1 QA Acceptance Checklist

Status: Draft pending PM approval

This checklist is a draft QA acceptance aid for Sprint 1. It is not official until reviewed and approved by the Product Manager, and it must not be synced to GitHub by a specialist agent.

## Purpose

Sprint 1 should prove that Reading Momentum has a stable foundation: authentication, app shell, profiles, private group foundation, Supabase connectivity, RLS, testing workflow, and deployment. This checklist helps the PM and QA reviewer decide whether Sprint 1 is ready to close.

Sprint 1 must not accept major product systems such as Reading Momentum scoring, XP, achievements, leaderboards, AI prompts, reviews, notifications, Book of the Month, or gamification.

## Review Inputs

Source docs:

- 18_Sprint_1_Plan.md
- 24_Testing_Strategy.md
- 26_Security_Model.md
- 12_Database_Architecture.md
- 13_UX_Flows.md

Suggested evidence to collect:

- Sprint 1 ticket list and implementation notes
- Local verification output
- CI run link or screenshot
- Deployment URL
- Test account credentials or PM-accessible test accounts
- Supabase migration and RLS policy summary
- Known issues list

## Acceptance Summary

Sprint 1 is QA-acceptable only when:

- [ ] Authentication is operational.
- [ ] Protected app routes are gated.
- [ ] Profile setup and editing work.
- [ ] Private group create and join foundation works.
- [ ] Initial RLS policies are enabled and verified.
- [ ] Navigation and placeholder pages exist.
- [ ] Smoke tests pass locally and in deployment.
- [ ] Accessibility basics pass for core screens.
- [ ] Deployment is reachable and configured safely.
- [ ] Out-of-scope product systems were not implemented.
- [ ] Remaining known issues are documented and accepted by PM.

## 1. Auth Shell

Goal:
Users can create an account, log in, log out, and access the private app shell only when authenticated.

Acceptance checks:

- [ ] Sign-up flow is available.
- [ ] Login flow is available.
- [ ] Logout flow is available.
- [ ] Auth pages include loading states.
- [ ] Auth pages include useful error states.
- [ ] Auth redirects are predictable after sign-up, login, and logout.
- [ ] Logged-out users cannot access protected app routes.
- [ ] Authenticated users without profiles are routed to profile setup.
- [ ] Logout clears access to private app views.
- [ ] No private app data flashes before redirect on protected pages.

Negative checks:

- [ ] Invalid credentials show a safe, understandable error.
- [ ] Logged-out user cannot reach dashboard by direct URL.
- [ ] Logged-out user cannot reach profile edit by direct URL.
- [ ] Logged-out user cannot reach group page by direct URL.

Evidence:

- Tester:
- Date:
- Environment:
- Notes:

## 2. Profile Setup And Editing

Goal:
Authenticated users can create and edit their basic reading profile, while profile writes remain protected by ownership rules.

Acceptance checks:

- [ ] New authenticated user is prompted to create a profile.
- [ ] Display name is required.
- [ ] Profile photo is optional if present in the UI.
- [ ] Favorite genres are optional if present in the UI.
- [ ] Time zone is defaulted or captured according to the implementation plan.
- [ ] User can complete profile setup with only required fields.
- [ ] User can edit their own profile.
- [ ] Profile changes persist after refresh.
- [ ] Optional fields do not block onboarding.
- [ ] Profile page works on mobile-sized viewport.

Validation checks:

- [ ] Empty required display name is rejected.
- [ ] Overly long display name is rejected or handled safely.
- [ ] Error copy is clear and not technical.
- [ ] Form preserves user input after recoverable errors.

Security checks:

- [ ] User A cannot edit User B's profile.
- [ ] User A cannot directly write another user's profile row through the app path.

Evidence:

- Tester:
- Date:
- Environment:
- Notes:

## 3. Group Foundation

Goal:
Users can create or join a private group foundation that Sprint 2 can build social features on top of.

Acceptance checks:

- [ ] Authenticated user can create a group.
- [ ] Group name is required.
- [ ] Optional group description does not block group creation.
- [ ] Group creator becomes owner or active member.
- [ ] Group page or placeholder loads for active members.
- [ ] User can join a group through the approved Sprint 1 invite or join flow.
- [ ] Join flow shows enough group identity to avoid joining the wrong group.
- [ ] Invalid invite or join attempts fail safely.
- [ ] Non-members cannot view private group pages or group records.
- [ ] Removed or left member behavior is documented if implemented.

Out-of-scope checks:

- [ ] No full group feed is required for Sprint 1.
- [ ] No discussion system is required for Sprint 1.
- [ ] No Book of the Month voting is required for Sprint 1.
- [ ] No leaderboard is required for Sprint 1.

Evidence:

- Tester:
- Date:
- Environment:
- Notes:

## 4. RLS And Security Expectations

Goal:
Private group and profile access are enforced by Supabase/Postgres policies and trusted server boundaries, not only by UI hiding.

Acceptance checks:

- [ ] RLS is enabled for `profiles`.
- [ ] RLS is enabled for `groups`.
- [ ] RLS is enabled for `group_members`.
- [ ] User can read and update their own profile according to Sprint 1 policy.
- [ ] User cannot update another user's profile.
- [ ] Active group members can read their group record.
- [ ] Non-members cannot read private group records.
- [ ] Active group members can read appropriate group membership rows.
- [ ] Group create and owner/member creation happen through controlled logic.
- [ ] Group join happens through controlled logic.
- [ ] Service-role keys are not exposed to client code.
- [ ] Real secrets are not committed.
- [ ] Required environment variables are documented in an example file without real values.

Suggested RLS test matrix:

| Scenario | Expected Result | Pass |
| --- | --- | --- |
| User A reads User A profile | Allowed | [ ] |
| User A updates User A profile | Allowed | [ ] |
| User A updates User B profile | Denied | [ ] |
| User A reads own group | Allowed | [ ] |
| User B reads User A private group without membership | Denied | [ ] |
| User B joins through valid approved flow | Allowed | [ ] |
| User B joins through invalid invite/code | Denied | [ ] |
| Browser bundle contains service-role secret | Denied / not present | [ ] |

Evidence:

- Tester:
- Date:
- Environment:
- Notes:

## 5. Navigation And App Shell

Goal:
The app has a mobile-first shell that lets authenticated users move through Sprint 1 pages and future feature placeholders without confusion.

Acceptance checks:

- [ ] Authenticated dashboard shell renders.
- [ ] Primary navigation is visible and usable.
- [ ] Navigation respects auth state.
- [ ] Today or dashboard page exists.
- [ ] Profile page exists.
- [ ] Group page or group placeholder exists.
- [ ] Books page or placeholder exists if included in Sprint 1 scope.
- [ ] Reading page or placeholder exists if included in Sprint 1 scope.
- [ ] Review page or placeholder exists if included in Sprint 1 scope.
- [ ] Settings page exists or PM-approved deferral is documented.
- [ ] Error page or not-found state exists.
- [ ] Loading states exist for async page transitions or data loads.
- [ ] Placeholder copy does not imply out-of-scope features are ready.

Mobile checks:

- [ ] Navigation works at mobile width.
- [ ] Primary actions are reachable.
- [ ] Text does not overlap or clip.
- [ ] Buttons and controls are large enough to tap comfortably.

Evidence:

- Tester:
- Date:
- Environment:
- Notes:

## 6. Smoke Tests

Goal:
Confirm the app is alive and the most important routes and commands work.

Local smoke checks:

- [ ] App starts locally.
- [ ] Public landing or auth route loads.
- [ ] Login/signup route loads.
- [ ] Protected route redirects or blocks correctly when logged out.
- [ ] Test user can log in.
- [ ] Dashboard shell loads after login.
- [ ] Profile page loads.
- [ ] Group page or placeholder loads.
- [ ] Lint command passes.
- [ ] Typecheck command passes.
- [ ] Test command passes.
- [ ] Build command passes.

Deployment smoke checks:

- [ ] Production URL loads.
- [ ] No blank screen on first load.
- [ ] No obvious console errors on first load.
- [ ] Auth callback or redirect URL is configured.
- [ ] Protected route behavior works in deployed environment.
- [ ] Test user can complete approved deployed smoke flow.

Evidence:

- Tester:
- Date:
- Environment:
- Commands or CI run:
- Deployment URL:
- Notes:

## 7. Accessibility Basics

Goal:
Sprint 1 screens should meet basic usability and accessibility expectations before future product complexity is added.

Acceptance checks:

- [ ] Auth pages have labeled inputs.
- [ ] Profile setup form has labeled inputs.
- [ ] Group create/join form has labeled inputs.
- [ ] Form errors are visible and associated with the relevant field or region.
- [ ] Keyboard user can navigate auth pages.
- [ ] Keyboard user can navigate app shell.
- [ ] Focus states are visible.
- [ ] Buttons and links have understandable accessible names.
- [ ] Color is not the only signal for errors or status.
- [ ] Core pages have sensible headings or landmarks.
- [ ] Loading states are understandable.
- [ ] Mobile viewport does not show major layout overlap.

Suggested pages to check:

- [ ] Sign up
- [ ] Login
- [ ] Profile setup
- [ ] Dashboard shell
- [ ] Group create/join
- [ ] Group placeholder
- [ ] Profile page

Evidence:

- Tester:
- Date:
- Environment:
- Tool/manual method:
- Notes:

## 8. Deployment Readiness

Goal:
The deployed app is reachable, configured safely, and ready for Sprint 2 development and PM review.

Acceptance checks:

- [ ] App is deployed to approved host.
- [ ] Production URL is recorded in the appropriate project docs or PM handoff.
- [ ] Production environment variables are configured securely.
- [ ] `.env.example` or equivalent documents required variables without secrets.
- [ ] Main branch deployment flow is documented.
- [ ] CI or deployment checks run before production deployment.
- [ ] Production build uses the intended Supabase project.
- [ ] Auth redirect URLs are configured for production.
- [ ] No real secrets are committed.
- [ ] Logs do not expose secrets or sensitive user data in normal flows.

Evidence:

- Tester:
- Date:
- Deployment URL:
- CI/deployment run:
- Notes:

## 9. Testing And CI Baseline

Goal:
Sprint 1 leaves the project with a repeatable verification workflow.

Acceptance checks:

- [ ] Unit test framework is configured.
- [ ] At least one meaningful smoke or baseline test exists.
- [ ] Test command is documented.
- [ ] Lint command is documented.
- [ ] Typecheck command is documented.
- [ ] Build command is documented.
- [ ] CI can run required checks.
- [ ] CI does not require production secrets.
- [ ] Test data is synthetic.
- [ ] Flaky or skipped tests are documented with follow-up tickets.

Minimum expected checks:

- [ ] Install dependencies
- [ ] Typecheck
- [ ] Lint
- [ ] Unit tests
- [ ] Build
- [ ] Basic smoke test where feasible

Evidence:

- Tester:
- Date:
- CI run:
- Notes:

## 10. Sprint 1 Scope Guardrails

Goal:
Verify Sprint 1 stayed focused on foundation and did not implement major product systems prematurely.

Confirm each item is absent or has an explicit PM-approved exception:

- [ ] Reading Momentum weekly scoring is absent or approved as an exception.
- [ ] XP is absent or approved as an exception.
- [ ] Achievements are absent or approved as an exception.
- [ ] Leaderboards are absent or approved as an exception.
- [ ] Book reviews are absent or approved as an exception.
- [ ] Live review timeline is absent or approved as an exception.
- [ ] AI discussion questions are absent or approved as an exception.
- [ ] Book recommendations are absent or approved as an exception.
- [ ] Book of the Month is absent or approved as an exception.
- [ ] Notifications are absent or approved as an exception.
- [ ] Advanced analytics are absent or approved as an exception.
- [ ] Recommendation algorithms are absent or approved as an exception.
- [ ] Gamification is absent or approved as an exception.

If any item above is present:

- PM-approved exception:
- Reason:
- Risk:
- Follow-up needed:

## Final QA Recommendation

QA result:

- [ ] Accept Sprint 1
- [ ] Accept with documented follow-ups
- [ ] Do not accept yet

Blocking issues:

- 

Non-blocking follow-ups:

- 

PM decisions needed:

- 

Recommended Sprint 2 carry-forward risks:

- 

Reviewer:

Date:

Environment reviewed:
