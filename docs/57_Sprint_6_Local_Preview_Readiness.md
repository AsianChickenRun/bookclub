# Sprint 6 Local Reading Room Preview Readiness

Status: Local preview ready with known cloud setup gaps  
Version: 1.0  
Owner: Product Manager  
Date: 2026-06-17

## Readiness Decision

Sprint 6 is approved as a same-browser local reading-room preview.

The preview is strong enough to demonstrate the core Reading Momentum group-session loop without claiming production persistence, real private membership, or cross-device collaboration.

## Verified Local User Loop

The following loop passed on 2026-06-17 using a local production server and headless Chrome:

- Add a manual current book.
- Create a private group.
- Open the specific group room.
- Confirm the room session focus shows current-book context.
- Use the weekly ritual prompt to fill the discussion composer.
- Start a room discussion.
- Confirm the thread shows attached-book context.
- Add a reply.
- Add a room-scoped check-in.
- Refresh and confirm the room state persists in the same browser.
- Resize to a 390px mobile viewport and confirm there is no horizontal overflow.

## Local Preview Scripts

Use these commands for repeatable local verification:

```bash
pnpm run build
pnpm run start:local
```

Then open:

```text
http://localhost:3001
```

For development:

```bash
pnpm run dev:local
```

## Current Pass Criteria

- `pnpm run lint` passes.
- `pnpm run typecheck` passes.
- `pnpm run build` passes.
- `/books` loads locally.
- `/groups` loads locally and on Vercel.
- `/groups/[groupId]` works for same-browser local groups.
- Group-room discussion, reply, check-in, ritual, and metadata flows work locally.

## Known Gaps Before Production

- Vercel needs `GOOGLE_BOOKS_API_KEY` before hosted catalog search can pass.
- Google Books key should be restricted and rotated before production use.
- Supabase persistence remains intentionally deferred.
- Real account-backed membership, invite acceptance, private access rules, and cross-device group state are not part of the local preview.
- Realtime updates, notifications, leaderboards, reviews, and AI prompts remain later sprint work.

## Next Recommended Sprint

Start the Supabase persistence readiness sprint only after the user provides:

- Supabase project URL.
- Supabase anon key.
- Approval to run migrations.
- Vercel environment variable access.
- Two test users for privacy and Row Level Security checks.

Until then, the best next local-only work is browser QA polish, documentation cleanup, and small UX refinements found during hands-on preview use.
