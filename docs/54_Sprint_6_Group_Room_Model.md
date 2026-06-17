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
- Added discussion creation directly inside a specific group room.
- Added a lightweight local room roster derived from local profile and room activity.
- Added a session prompt card to make the group page feel more like an active reading session.

## Acceptance Criteria

- A user can open a specific group from the Groups page.
- Missing group state has a clear fallback.
- Group room shows session context, stats, discussions, replies, and activity.
- Group room allows starting a new discussion without leaving the specific group page.
- Spoiler-marked discussions are protected until revealed.
- Build, lint, and typecheck pass.
- Vercel deployment remains reachable after sync.

## Next Recommended Slice

After this page lands, the next useful group improvements are:

1. Add editable or scheduled weekly room rituals.
2. Add member-specific reading progress once real membership exists.
3. Add direct book search entry points from room discussion creation.
4. Move group room data to Supabase when Sprint 5 access gates are met.

## Group Room Depth Update

Status: Implemented for local working model.

The specific group page is now a working room surface rather than only a detail view.

Completed:

- Users can start a discussion from inside `/groups/[groupId]`.
- New room discussions can attach to the current room book or a selected saved book.
- New room discussions support no-spoiler, progress-locked, and explicit spoiler labels.
- Optional spoiler page and chapter inputs are available at creation time.
- The empty thread state now points users to the in-room discussion composer.
- The room includes a lightweight local roster based on local profile, posts, replies, and activity.
- The room includes a session prompt card grounded in the current book when one exists.

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
