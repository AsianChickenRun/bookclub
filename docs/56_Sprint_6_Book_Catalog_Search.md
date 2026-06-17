# Sprint 6 Mini-Sprint: Book Catalog Search

Status: Implemented for local working model  
Version: 1.1  
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
- Added deeper search modes for publisher, LCCN, and OCLC.
- Added catalog pagination through `Load more`.
- Added compact sort, edition/filter, and language refinements on the Books page.
- Added compact sort and `Load more` support inside group-room book search.
- Added result cards with cover treatment, metadata, description, categories, and ISBN.
- Added one-click `Add to my books` behavior.
- Added duplicate-save protection so matching Google volume IDs or ISBNs reuse the existing local book.
- Extended local book records with catalog metadata.
- Added group-room metadata display for session focus, composer attachment preview, and thread cards.
- Added compatibility normalization for older local books and imported backups.
- Added direct book search entry points from group discussion creation.

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
- API search returns pagination metadata: `totalItems`, `startIndex`, `maxResults`, `hasMore`, and `nextStartIndex`.

## Remaining Work

- Add production environment variable in Vercel.
- Restrict the Google Books key by API and allowed origins/referrers.
- Add browser smoke coverage for search refinements, load-more pagination, and duplicate-save prevention.
- Consider storing a small discussion attachment snapshot later, such as cover URL, author, published year, ISBN, and page count, so thread cards remain rich after future cleanup or persistence migrations.
