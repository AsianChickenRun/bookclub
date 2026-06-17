# Sprint 6 Plan: Group Room Working Model

Status: In Progress
Version: 0.1
Owner: Product Manager
Date: 2026-06-17

## Objective

Turn groups from a shared feed into a deeper working room experience. A user should be able to enter a specific group, understand the current reading session, see room activity, and continue discussion threads with spoiler protection.

## Why This Sprint

The deployed app already supports local books, check-ins, groups, discussion posts, replies, spoiler reveal, and a Reading Momentum summary. The next product gap is depth: groups need to feel like persistent reading rooms instead of a single dashboard section.

## Scope

This sprint focuses on the local-first group room model while Supabase persistence remains gated by access.

In scope:

- Dedicated group room route.
- Better group navigation from the Groups page.
- Group session summary.
- Room-level stats.
- Thread/reply experience inside the group room.
- Spoiler reveal controls inside the room.
- Room activity summary.

Out of scope:

- Supabase persistence.
- Real member list from auth.
- Real-time updates.
- Notifications.
- AI-generated prompts.
- Leaderboards.

## Completed In This Slice

- Added `/groups/[groupId]` route.
- Added `Open group room` links from group cards.
- Added group session focus with current book context.
- Added room stats for check-ins, discussions, replies, and invite code.
- Added deeper room thread UI with spoiler reveal/hide behavior.
- Added room-specific reply forms.
- Added room activity summary.
- Added book-catalog mini-sprint support so current books can be searched from Google Books and saved locally with richer metadata for future room context.

## Acceptance Criteria

- A user can open a specific group from the Groups page.
- Missing group state has a clear fallback.
- Group room shows session context, stats, discussions, replies, and activity.
- Spoiler-marked discussions are protected until revealed.
- Build, lint, and typecheck pass.
- Vercel deployment remains reachable after sync.

## Next Recommended Slice

After this page lands, the next useful group improvements are:

1. Create discussions directly from the group room.
2. Add a lightweight local member roster.
3. Add a group session prompt or ritual card.
4. Move group room data to Supabase when Sprint 5 access gates are met.

## Book Catalog Mini-Sprint

Status: Approved and implemented for local working model.

Purpose: deepen current-book setup so group rooms and discussions can rely on real book metadata instead of only manual title entry.

Completed:

- Added a server-side Google Books search endpoint at `/api/books/search`.
- Kept the Google Books key out of committed source by using `GOOGLE_BOOKS_API_KEY`.
- Added catalog search modes for all fields, title, author, ISBN, and subject.
- Added catalog result cards with title, author, publication date, page count, categories, ISBN, description, and cover treatment.
- Added one-click saving from catalog search into the local Reading Momentum book list.
- Extended local book records with source, external ID, publisher, published date, description, categories, cover image URL, and ISBN fields.
- Added compatibility normalization for older local book data and imported backups.

Boundaries:

- Google Books is treated as an external catalog, not the Reading Momentum user-data database.
- User progress, groups, discussions, check-ins, and selected current books remain in the app repository layer.
- Production requires the API key to be configured and restricted in the hosting environment.
