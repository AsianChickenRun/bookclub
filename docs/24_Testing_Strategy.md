# Testing Strategy

Status: Draft pending PM approval

This document defines the draft testing strategy for Reading Momentum. It is not official until reviewed and approved by the Product Manager, and it must not be synced to GitHub by a specialist agent.

## Purpose

Reading Momentum depends on trust: private groups must stay private, check-ins must feel reliable, and spoiler-sensitive content must not surprise users. Testing should protect the habit loop, privacy boundaries, and basic product quality without slowing early learning.

The strategy starts with a practical Sprint 1 baseline and expands as product systems are added.

## Testing Principles

- Test the highest-risk behavior closest to where it can break.
- Keep fast tests fast enough to run during normal development.
- Treat RLS and authorization as product-critical, not optional backend details.
- Verify user flows on mobile-sized screens before considering a feature done.
- Prefer clear, stable smoke tests over brittle coverage theater.
- Add regression tests for every production bug that reaches users or QA.
- Do not use real secrets, production user data, or private user content in tests.

## Test Layers

### Unit Tests

Purpose:
Verify isolated functions, validation rules, formatting helpers, small components, and business logic.

Expected coverage:

- Form validation
- Date and time helpers
- Progress input validation
- Visibility and sharing helpers
- Display formatting
- Lightweight UI component behavior
- Future scoring calculations
- Future spoiler-lock calculations

Sprint 1 minimum:

- Profile validation tests.
- Group name or invite-code validation tests if implemented as local helpers.
- Environment variable parsing or safe failure tests if implemented as code.
- At least one basic component render test for the app shell or auth/profile form.

Suggested tools:

- Vitest or Jest for TypeScript unit tests.
- React Testing Library for component behavior.

### Integration Tests

Purpose:
Verify connected behavior across app logic, database access, auth state, and server boundaries.

Expected coverage:

- Sign-up creates or leads to profile creation.
- Profile create and edit writes persist correctly.
- Group creation creates owner membership.
- Group join creates active membership.
- Non-members cannot read private group content.
- Server actions or route handlers enforce expected validation.
- Future check-in flow writes logs and updates current progress consistently.

Sprint 1 minimum:

- Authenticated user can create a profile.
- Authenticated user can edit their own profile.
- Authenticated user can create a group and become owner/member.
- Authenticated user can join a group through the approved Sprint 1 join flow.
- Non-member access to a group page or group data is denied.

Suggested tools:

- Supabase local development stack where feasible.
- Test database seeded with synthetic users and groups.
- Server action or API route tests where app architecture supports them.

### End-To-End Tests

Purpose:
Verify real user journeys in the browser across routing, UI state, auth, and data persistence.

Expected coverage:

- First-run onboarding.
- Sign up, log in, log out.
- Create profile.
- Edit profile.
- Create group.
- Join group.
- Navigate through authenticated app shell.
- Mobile-first layout and basic responsive behavior.
- Error and loading states for core flows.

Sprint 1 minimum:

- New user can sign up or log in in a test environment.
- New authenticated user can create a profile.
- User can create a private group.
- Second test user can join through the approved invite or join path.
- Non-member cannot open the private group page.
- User can log out and protected pages redirect or block access.

Suggested tools:

- Playwright for browser automation.
- Dedicated test users and test Supabase project or local Supabase instance.

### Accessibility Tests

Purpose:
Ensure the app is usable for keyboard users, screen readers, mobile users, and users with visual or cognitive load concerns.

Expected coverage:

- Semantic headings and landmarks.
- Form labels and error messages.
- Keyboard navigation.
- Visible focus states.
- Color contrast.
- Touch target size.
- Loading and error states announced or exposed accessibly.
- Mobile viewport layout.
- No text overlap or clipped controls on common screen sizes.

Sprint 1 minimum:

- Auth pages have labeled inputs and accessible errors.
- Profile form has labeled inputs and accessible errors.
- Navigation works with keyboard.
- App shell has clear landmarks or equivalent structure.
- Automated accessibility scan passes for auth, dashboard shell, profile, and group placeholder pages.
- Manual mobile viewport check confirms text and controls do not overlap.

Suggested tools:

- Playwright accessibility checks with axe where available.
- Manual keyboard pass.
- Browser screenshots at mobile and desktop widths.

### RLS And Security Tests

Purpose:
Verify that private data is protected at the database and server boundary, not only hidden in the UI.

Expected coverage:

- RLS enabled on every application table.
- Users can read and update their own profile only where intended.
- Users cannot update another user's profile.
- Group members can read their group.
- Non-members cannot read private group content.
- Group owner/admin permissions are enforced.
- Removed or left members have defined access behavior.
- Trusted workflows use server-side logic or RPC when multiple rows must be written atomically.
- Service-role keys are never exposed to the browser.

Sprint 1 minimum:

- RLS is enabled on `profiles`, `groups`, and `group_members`.
- User A cannot update User B's profile.
- User A cannot read a group they do not belong to.
- Group creation records the creator as owner/member.
- Join flow cannot add membership to an invalid or unauthorized group.
- Environment variable checks prevent service-role secrets from being bundled client-side.

Suggested tools:

- SQL policy tests against Supabase local or test project.
- Integration tests with separate authenticated test users.
- Static checks for forbidden environment variable usage in client code.

### Smoke Tests

Purpose:
Quickly confirm that the app is basically alive after local changes, deployment, or environment updates.

Sprint 1 smoke test checklist:

- App loads without a blank screen.
- Public landing or auth route loads.
- Login/signup route loads.
- Authenticated route redirects or protects correctly when logged out.
- Test user can log in.
- Dashboard shell loads after login.
- Profile page loads.
- Group page or placeholder loads.
- Build command completes.
- Test command completes.
- Lint command completes.

Deployment smoke test checklist:

- Production URL returns a valid page.
- Auth callback or redirect URL is configured.
- Required environment variables are present.
- No obvious console errors on initial page load.
- Protected route behavior works in deployed environment.

## CI Expectations

Sprint 1 CI should run on pull requests and main branch updates.

Minimum CI checks:

- Install dependencies.
- Typecheck.
- Lint.
- Unit tests.
- Build.
- Basic smoke test where feasible.

Recommended CI checks as soon as infrastructure allows:

- Integration tests against local Supabase or a disposable test database.
- Playwright e2e smoke suite.
- Automated accessibility scan for core pages.
- RLS policy test suite.

CI rules:

- A failing required check blocks merge unless the PM and engineering lead explicitly accept the risk.
- CI must not require production secrets.
- Test data must be synthetic.
- Flaky tests should be fixed or quarantined quickly with a tracking ticket.
- Main branch should remain deployable.

## Definition Of Done

A Sprint 1 implementation ticket is done only when:

- Acceptance criteria are implemented.
- The happy path is manually verified.
- Relevant unit or integration tests are added or updated.
- RLS/security expectations are verified for data-writing features.
- Loading and error states are handled for user-facing flows.
- Mobile layout is checked for the affected screens.
- Basic accessibility expectations are met.
- Lint, typecheck, tests, and build pass locally or in CI.
- Documentation is updated if behavior, setup, environment variables, or commands changed.
- No out-of-scope product systems were added without PM approval.

For later product sprints, also require:

- Spoiler behavior tests for spoiler-sensitive content.
- Privacy/sharing tests for group-visible activity.
- Regression tests for scoring, streaks, and progress normalization.
- AI prompt safety checks when AI features are introduced.

## Minimum Sprint 1 Verification

Sprint 1 should not be accepted until the following checks pass.

### Local Developer Verification

- App starts locally.
- Typecheck passes.
- Lint passes.
- Unit tests pass.
- Build passes.
- Required environment variables are documented in an example file without real secrets.
- Missing environment variables fail safely with understandable developer feedback.

### Auth Verification

- User can sign up in the test environment.
- User can log in.
- User can log out.
- Logged-out user cannot access protected app pages.
- Auth redirects are predictable after login and logout.
- Auth pages show useful loading and error states.

### Profile Verification

- New authenticated user can create a profile.
- User can edit their own profile.
- User cannot edit another user's profile.
- Profile form validates required fields.
- Optional fields do not block onboarding.

### Group Verification

- User can create a group.
- Group creator becomes owner/member.
- User can join a group through the approved Sprint 1 flow.
- Members can see the group page or placeholder.
- Non-members cannot view group content.
- Invalid invite or join attempts fail safely.

### RLS Verification

- RLS is enabled for Sprint 1 tables.
- Separate test users cannot read or write each other's private rows except through approved group membership rules.
- Group membership policies match the documented MVP rules.
- Service-role operations, if any, only run server-side.

### UI And Accessibility Verification

- Core pages work at mobile width.
- Navigation is usable with keyboard.
- Forms have labels.
- Errors are visible and understandable.
- Focus states are visible.
- No major text overlap or clipped buttons on auth, onboarding/profile, dashboard shell, and group placeholder pages.

### Deployment Verification

- App is deployed to the approved host.
- Production environment variables are configured securely.
- Production URL loads.
- Auth redirect settings work in production.
- Smoke checklist passes against the deployed app.

## Test Data Guidelines

- Use synthetic users and groups.
- Do not use real book club content, private reflections, or personal emails outside approved test accounts.
- Use obvious test names such as "QA User A" and "QA Private Group."
- Reset or isolate test data between runs where possible.
- Keep test accounts out of real user groups.

## Future Test Expansion

As product systems enter active development, add targeted test coverage for:

- Reading check-ins and progress correction.
- Progress normalization across pages, chapters, minutes, audiobooks, and sessions.
- Streaks, grace days, and time zones.
- Feed inclusion rules and private activity exclusion.
- Spoiler locks for posts, comments, live reviews, and final reviews.
- AI prompt generation fallback behavior.
- Review creation, completion, and visibility.
- XP event creation and duplicate prevention.
- Weekly Reading Momentum score calculation.
- Notification preferences and frequency caps.
- Invite revocation, member removal, and former-member access rules.

## Open Questions For PM Approval

- Which test framework should be the Sprint 1 default: Vitest or Jest?
- Should Sprint 1 use local Supabase for CI, a hosted test project, or both?
- Which e2e flows are required before Sprint 1 can close?
- Should accessibility scans be required in CI immediately or manual-only during Sprint 1?
- Who owns final sign-off on RLS policy tests before Sprint 1 approval?
