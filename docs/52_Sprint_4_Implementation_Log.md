# Sprint 4 Implementation Log: Deployment Hardening

Status: In Progress
Version: 0.1
Owner: Product Manager
Date: 2026-06-16

## Objective

Move the Vercel deployment closer to a working product experience by removing internal build-process language from public screens while preserving the current local-first reading, book, group, and discussion flows.

## Completed In This Slice

- Updated the landing page to describe what users can do now: private groups, books, check-ins, and discussions.
- Replaced user-facing `Sprint`, `mock`, and engineering placeholder copy with product-facing preview language.
- Clarified that the deployed preview stores data in the current browser until cloud accounts are connected.
- Cleaned sign-in, onboarding, settings, books, today, groups, and reviews copy.
- Kept Supabase/cloud persistence out of scope for this slice.

## Verification

- `pnpm run lint` passed.
- `pnpm run build` passed.
- Production build generated all current routes:
  - `/`
  - `/today`
  - `/books`
  - `/groups`
  - `/reviews`
  - `/settings`
  - `/sign-in`
  - `/onboarding`

## Remaining Platform Blockers

- Real account persistence requires Supabase project access and environment variables.
- Private group privacy is not enforceable until database-backed auth and RLS are connected.
- Vercel preview should be smoke-tested after GitHub sync completes.
- Review tools remain inactive until book progress, spoiler rules, and persistence are ready.

## Next Recommended Sprint Slice

Make the deployed preview functionally stronger by adding one of:

1. Group discussion replies and spoiler reveal controls.
2. Repository abstraction cleanup so app pages can switch from local storage to Supabase with less rewrite.
3. Supabase-backed auth/profile/group persistence if credentials and migration approval are available.
