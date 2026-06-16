# Sprint 5 Plan: Persistence Activation

Status: Ready For Access
Version: 0.1
Owner: Product Manager
Date: 2026-06-16

## Objective

Move Reading Momentum from browser-local preview behavior to a real cloud-backed platform using Supabase Auth, Postgres tables, and Row Level Security.

Sprint 4 created the deployed local product loop and an app-facing repository boundary. Sprint 5 should replace the local repository internals with Supabase-backed operations while preserving the current user flows.

## Entry Gates

Sprint 5 implementation may begin when:

- Supabase project URL is confirmed.
- Supabase anon key is available through an approved secret channel.
- Migration execution is approved for the target project.
- Vercel environment variable ownership is confirmed.
- A disposable test path or approved test data strategy exists.

## Current Readiness

Already complete:

- Vercel deployment exists and responds.
- App-facing repository boundary exists in `src/lib/persistence/repository.ts`.
- Pages no longer call local storage helpers directly.
- Local flows exist for sign-in, profile, books, check-ins, groups, discussions, replies, spoiler reveal, and momentum summary.
- Supabase migrations exist for foundation, reading, activity, and discussion tables.
- CI runs lint, typecheck, and build.

## Sprint 5 Tickets

### S5-001: Add Supabase Repository Implementation

Priority: P0

Replace the repository internals with Supabase-backed reads and writes when Supabase env vars are configured.

Acceptance criteria:

- `getRepository()` chooses Supabase mode only when required env vars are present.
- Local mode still works when env vars are absent.
- Repository methods preserve the current app-facing contract.
- No page imports Supabase helpers directly.

### S5-002: Implement Auth And Profile Persistence

Priority: P0

Connect sign-in and profile setup to Supabase Auth and `profiles`.

Acceptance criteria:

- Users can create or resume a Supabase-authenticated session.
- Profile reads and writes persist across browsers.
- Missing profile redirects to onboarding.
- Sign out clears the session.

### S5-003: Persist Books And Check-Ins

Priority: P0

Persist current books and reading logs through Supabase tables.

Acceptance criteria:

- Added books persist after refresh and across devices.
- Check-ins update current book progress.
- Private check-ins remain private.
- Group-visible check-ins create eligible activity rows.

### S5-004: Persist Groups, Discussions, And Replies

Priority: P0

Persist private groups, discussion posts, and replies.

Acceptance criteria:

- Users can create and join groups.
- Active group data loads from Supabase.
- Discussion posts and comments persist.
- Spoiler metadata persists with posts and activities.

### S5-005: Validate RLS And Privacy Rules

Priority: P0

Prove private group isolation before calling the platform real.

Acceptance criteria:

- Non-members cannot read private group data.
- Users can read only their own private check-ins.
- Members can read group-visible activity in shared groups.
- RLS checks are documented with evidence.

### S5-006: Configure Vercel Environment

Priority: P0

Set production env vars and verify the deployed site uses Supabase mode.

Acceptance criteria:

- Vercel has required public Supabase env vars.
- Build remains green.
- Live deployment supports real account and persistence flows.
- Local fallback remains documented.

## Risks

- Supabase schema may need small alignment fixes before repository writes succeed.
- Auth strategy may need a product choice: password, magic link, or temporary passwordless preview.
- RLS validation requires at least two test users.
- Vercel env changes can break local fallback if mode detection is too loose.

## PM Decision

Sprint 5 should begin as soon as access gates are satisfied. Until then, continue only with local-safe platform hardening, repository contract checks, and documentation.
