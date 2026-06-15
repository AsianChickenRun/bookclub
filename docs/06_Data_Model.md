# Data Model Overview

Initial database tables may include:

- users
- profiles
- groups
- group_members
- books
- user_books
- reading_logs
- discussion_prompts
- discussion_posts
- comments
- reviews
- review_sections
- book_nominations
- book_votes
- xp_events
- momentum_scores
- achievements
- user_achievements
- notifications

## Modeling Notes

The data model should separate:

- User identity and profile data
- Groups and membership
- Books and user-specific reading progress
- Reading logs and check-ins
- Prompts, posts, comments, and reviews
- Scoring, XP, achievements, and notifications

This separation keeps the app flexible as social activity, scoring, reviews, and Book of the Month features evolve.
