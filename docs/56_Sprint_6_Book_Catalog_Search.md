# Sprint 6 Mini-Sprint: Book Catalog Search

Status: Implemented for local working model  
Version: 1.0  
Owner: Product Manager  
Date: 2026-06-17

## Objective

Add depth to the Books feature by connecting Reading Momentum to an external public book catalog. Users should be able to search for real books, inspect richer metadata, and save the right book into their local reading list.

## Product Decision

Google Books is used as a book catalog, not as the Reading Momentum database.

Reading Momentum still owns:

- User-selected current books
- Reading progress
- Groups
- Check-ins
- Discussions
- Replies
- Local backup/import state

Google Books provides:

- Search results
- Volume IDs
- Titles and authors
- Publisher and publication date
- Page count
- Categories
- ISBNs
- Cover image links
- Public descriptions

## Implemented

- Added `GOOGLE_BOOKS_API_KEY` to environment configuration.
- Added `/api/books/search` server route.
- Added search by all fields, title, author, ISBN, and subject.
- Added result cards with cover treatment, metadata, description, categories, and ISBN.
- Added one-click `Add to my books` behavior.
- Extended local book records with catalog metadata.
- Added compatibility normalization for older local books and imported backups.

## Security Notes

- The API key must not be committed to GitHub.
- The key should be restricted in Google Cloud before production use.
- The production hosting environment must define `GOOGLE_BOOKS_API_KEY`.
- If the exposed key has already been used outside local development, rotate it before production.

## Verification

- Lint passed.
- Typecheck passed.
- Production build passed.
- Direct Google Books request with the configured key returned matching book results.

## Remaining Work

- Add production environment variable in Vercel.
- Restrict the Google Books key by API and allowed origins/referrers.
- Add direct book search entry points from group discussion creation.
- Use book metadata in group-room session cards and spoiler context.
