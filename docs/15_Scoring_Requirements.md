# Scoring Requirements

Reading Momentum scoring should reward sustainable reading behavior across formats without turning the product into a page-count race.

The MVP scoring system has three separate layers:

- Reading Momentum: weekly score for current habit strength and engagement
- XP: lifetime reward ledger for positive actions and cosmetic progression
- Achievements: long-term identity markers and milestones

This document defines MVP requirements for Reading Momentum, XP events, streak grace, leaderboard categories, diminishing returns, format fairness, safeguards, and open questions.

## Goals

- Reward consistency more than raw volume.
- Make slow, dense, audio, visual, casual, and fast reading styles feel legitimate.
- Encourage reflection and community without rewarding spam.
- Keep the scoring model understandable enough for users to trust.
- Keep the first version configurable so weights can change after early data.

## Non-Goals

- Do not use total pages as the main score.
- Do not rank users globally in MVP.
- Do not judge literary value or book difficulty automatically.
- Do not require every user to read the same book.
- Do not make AI-written text eligible for reflection rewards.

## Reading Momentum Weekly Score

Reading Momentum is the main weekly score. It should be calculated per user and optionally per group for the week starting on the user's configured week boundary.

MVP requirement:

- Score range: 0-100
- Calculation cadence: daily refresh during the active week, final snapshot after week end
- Scope: personal score and group-specific score where group activity is involved
- Storage: `momentum_scores` with pillar scores and total score

Recommended MVP weights:

- Consistency: 40%
- Volume: 20%
- Reflection: 20%
- Community: 10%
- Completion: 10%

### Consistency Pillar

Purpose: reward showing up repeatedly.

Inputs:

- Days with a qualifying reading check-in
- Completed reading sessions
- Skipped-day logs for accountability, with limited value
- Comeback after missed days

MVP scoring:

- 1 reading day in week: 25 pillar points
- 2 reading days: 45 pillar points
- 3 reading days: 65 pillar points
- 4 reading days: 80 pillar points
- 5 reading days: 92 pillar points
- 6 or 7 reading days: 100 pillar points

Rules:

- A qualifying reading day requires positive reading activity or a completed session.
- A skipped-day log does not count as a reading day, but can support comeback messaging.
- Multiple check-ins on the same date count as one consistency day.
- Reading days should use the user's profile timezone.

### Volume Pillar

Purpose: reward meaningful reading effort without letting high-volume readers dominate.

Inputs:

- Minutes read
- Audiobook minutes listened
- Pages read
- Chapters read
- Session completed

MVP scoring should convert progress into normalized effort units, then apply diminishing returns.

Recommended effort assumptions:

- 10 minutes reading = 1 effort unit
- 10 audiobook minutes = 1 effort unit
- 10 standard text pages = 1 effort unit
- 1 chapter = 2 effort units when page data is unavailable
- Session completed with no quantity = 1 effort unit

Weekly volume pillar:

- 2 effort units: 25 pillar points
- 5 effort units: 50 pillar points
- 10 effort units: 75 pillar points
- 18 effort units: 90 pillar points
- 25 effort units: 100 pillar points

Rules:

- Use the highest-confidence input available, not every input stacked together.
- If a log includes pages and minutes, count the larger normalized effort value, not the sum.
- If a log includes audiobook minutes and pages for the same book, count the larger normalized effort value unless the user marks them as separate sessions.
- Cap weekly volume pillar at 100.

### Reflection Pillar

Purpose: reward thinking about reading, not just consuming it.

Inputs:

- Prompt answers
- Live review entries
- Final review text
- Saved notes or reactions tied to progress
- Discussion posts that include original thought

MVP scoring:

- Short reflection, 1-49 words: 20 pillar points, max 1 per day
- Substantial reflection, 50+ words: 40 pillar points, max 1 per day
- Live review tied to a progress point: 25 pillar points, max 3 per week
- Final review with original text: 60 pillar points
- Reflection on a group discussion prompt: 35 pillar points, max 2 per week

Rules:

- Reflection pillar caps at 100 per week.
- AI-generated answers should not earn reflection credit.
- Empty, duplicate, or near-duplicate reflections should not earn repeated credit.
- Reflection quality should be lightly validated by structure and originality signals in MVP, not by subjective grading.

### Community Pillar

Purpose: reward supportive accountability and group participation.

Inputs:

- Discussion posts
- Replies
- Supportive reactions
- Book nominations
- Group ritual participation

MVP scoring:

- Create a discussion post: 25 pillar points, max 2 per week
- Reply constructively to another member: 20 pillar points, max 4 per week
- Give supportive reactions: 5 pillar points each, max 25 per week
- Participate in Monday or Thursday ritual: 20 pillar points each
- Nominate a book with a reason: 20 pillar points, max 1 per week

Rules:

- Community pillar caps at 100 per week.
- Self-replies and self-reactions do not count.
- Reactions are intentionally low value to avoid popularity farming.
- Receiving likes or reactions should not be a major scoring source in MVP.

### Completion Pillar

Purpose: reward finishing meaningful reading without making short works exploitable.

Inputs:

- Book completion
- Audiobook completion
- Manga or graphic novel volume completion
- Academic article, paper, or assigned chapter completion
- Book of the Month completion when participating

MVP scoring:

- Full-length book or audiobook: 100 pillar points
- Novella or short book: 70 pillar points
- Manga volume: 45 pillar points
- Graphic novel: 65 pillar points
- Academic article or chapter: 50 pillar points
- Book of the Month completion: +20 bonus within the pillar, still capped at 100

Rules:

- Completion pillar caps at 100 per week.
- First completion in a week receives full value.
- Additional completions in the same week receive 50% value for this pillar.
- Users should be able to complete books outside group books without penalty.

## XP Events

XP is separate from Reading Momentum. XP should feel rewarding but should not determine the main weekly leaderboard.

MVP requirement:

- Store all XP awards in `xp_events`.
- Cache lifetime XP in `profiles.total_xp`.
- XP events should be append-only and tied to a source record when possible.

Recommended MVP XP values:

- Reading check-in: 10 XP
- Completed reading session: +5 XP
- 3 reading days in a week: 25 XP
- 5 reading days in a week: 50 XP
- 7 reading days in a week: 75 XP
- Comeback after 3+ missed days: 30 XP
- Discussion response: 20 XP
- Constructive reply: 15 XP
- Supportive reaction given: 2 XP, max 20 XP per day
- Book completed: 75 XP
- Final review submitted: 50 XP
- Live review or reading note: 20 XP
- Book nomination with reason: 25 XP

Rules:

- XP can exceed weekly Momentum caps because it is a lifetime progression system.
- Daily XP from reactions should be capped.
- Repeated duplicate actions should not create repeated XP.
- XP should unlock cosmetics, badges, profile displays, bookshelf customization, or group titles.

## Streak Grace Rules

Streaks should support habit recovery without creating guilt.

MVP streak requirements:

- A qualifying reading day increments or maintains the current streak.
- A missed day can be protected by grace.
- Grace should be visible but low-pressure.
- Streak copy should avoid shame-based language.

Recommended MVP grace model:

- Users get 1 grace day per rolling 7-day period.
- A grace day preserves the streak but does not increment it.
- Grace is automatically applied to the first missed day that would otherwise break the streak.
- Two consecutive missed days break the streak unless the first day used grace and the second day has a qualifying check-in before the user's day ends.
- A skipped-day log does not preserve the streak by itself.

Comeback rule:

- If a user returns after 3 or more missed days, award a comeback XP event.
- Comeback messaging should celebrate returning, not highlight failure.
- Comeback can contribute to Reading Momentum consistency only through the new qualifying reading day.

## Leaderboard Categories

Leaderboards should recognize different strengths and should be group-scoped in MVP.

Required MVP categories:

- Weekly Momentum: total Reading Momentum score
- Most Consistent: consistency pillar
- Most Reflective: reflection pillar
- Community Builder: community pillar
- Completion Progress: completion pillar
- Best Comeback: users who returned after missed days
- Most Improved: improvement against the user's previous 4-week average

Optional later categories:

- Longest Current Streak
- Most Active Discussion
- Genre Explorer
- Audiobook Momentum
- Deep Reader
- Supportive Friend

Rules:

- Do not make total pages the primary leaderboard.
- Do not show global public leaderboards in MVP.
- Leaderboards should show multiple categories, not one winner-take-all ranking.
- Ties should be handled gracefully and can show shared placement.
- Users with no score should not be publicly shamed; show "No check-ins yet" privately or neutrally.

## Diminishing Returns

Diminishing returns are required anywhere volume, reactions, or repeated completions could dominate.

MVP rules:

- Volume uses threshold scoring and caps at 100 pillar points.
- Reflection caps at 100 pillar points per week.
- Community caps at 100 pillar points per week.
- Completion caps at 100 pillar points per week.
- Additional completions after the first count at 50% for the completion pillar.
- Reactions given have low point value and daily caps.
- Multiple logs on the same day can add volume, but not extra consistency days.

Product rationale:

- A long reading session should feel worthwhile.
- A short daily habit should still compete fairly.
- A fast reader should not permanently crowd out slower readers.
- Community activity should reward support, not chatter.

## Format Fairness Assumptions

Reading Momentum should support multiple reading formats in MVP.

Supported MVP formats:

- Print
- Ebook
- Audiobook
- Mixed

Additional format tags should be considered for scoring or analytics:

- Manga
- Graphic novel
- Academic
- Poetry
- Short story
- Novella
- Article

Recommended MVP assumptions:

- Audiobook minutes count the same as reading minutes.
- Manga and graphic novels count as legitimate reading, with completion values tuned to shorter volume length.
- Academic reading may be logged by minutes, chapters, articles, or sessions when pages are not meaningful.
- Fast fiction should not be penalized, but its volume should still face weekly caps.
- Dense reading should be recognized through time, reflection, and completion, not guessed difficulty.

Avoid in MVP:

- Automatic difficulty scoring by genre or title.
- Penalizing audiobooks.
- Penalizing manga as "not real reading."
- Assuming pages are comparable across editions, formats, or genres.

Future option:

- Let users choose a reading context tag such as casual, academic, visual, audio, reread, or book club. Use it for analytics and prompt tone before using it to modify score.

## Safeguards

Scoring safeguards should prevent accidental unfairness and obvious farming while staying low-friction.

MVP safeguards:

- Cap Reading Momentum at 100 per week.
- Store pillar scores separately so users can understand why they scored well.
- Require source records for XP events where possible.
- Prevent duplicate XP for the same source action.
- Limit reaction XP and community pillar value.
- Treat skipped days as accountability, not reading.
- Make manual logs allowed, but soften extreme spikes through caps.
- Keep private logs out of group leaderboards unless the user shares them to the group.
- Use service-role jobs or trusted RPC functions for score and XP writes.

Anti-abuse examples:

- A user cannot earn repeated XP by editing the same reflection.
- A user cannot farm reactions on their own posts.
- A user cannot earn unlimited completion credit from many very short works in one week.
- A user cannot earn extra consistency from logging five sessions on the same day.

Trust and UX safeguards:

- Show users what contributed to their weekly score.
- Use encouraging labels instead of failure states.
- Prefer "Your week is still alive" over pressure-heavy streak copy.
- Allow users to hide competitive leaderboard modules if they only want personal progress.

## MVP Acceptance Criteria

Reading Momentum weekly score:

- Calculates a 0-100 weekly score from five pillars.
- Stores total and pillar scores in `momentum_scores`.
- Uses consistency as the highest-weighted pillar.
- Applies diminishing returns to volume.
- Supports personal and group-scoped scoring.

XP:

- Records XP events for check-ins, discussions, replies, completions, reviews, nominations, streak milestones, and comeback behavior.
- Updates lifetime XP separately from weekly score.
- Prevents duplicate XP for the same source action.

Streaks:

- Tracks qualifying reading days.
- Supports 1 grace day per rolling 7-day period.
- Awards comeback XP after 3+ missed days.
- Uses supportive language.

Leaderboards:

- Supports at least Weekly Momentum, Most Consistent, Most Reflective, Community Builder, Completion Progress, Best Comeback, and Most Improved.
- Does not use pages as the main ranking.
- Is scoped to private groups for MVP.

Format fairness:

- Supports pages, chapters, minutes, audiobook minutes, sessions, and completion.
- Treats audiobooks as equal effort by time.
- Allows manga, graphic novels, and academic reading to be represented without page-only scoring.

## Open Questions

- Should week start be user-specific, group-specific, or fixed to Monday for all groups?
- Should a user have one personal Momentum score plus separate group scores, or should group scores reuse the same personal weekly score?
- How should mixed-format reading be logged when a user reads and listens to the same book in one week?
- Should manga, graphic novel, academic, and poetry be stored as book formats, genre tags, or reading context tags?
- Should reflection scoring use only word count and duplication checks in MVP, or should moderators/group settings affect eligibility?
- Should users be able to opt out of leaderboards while still keeping personal scores?
- Should Book of the Month participation grant a small bonus for group alignment, or would that pressure users away from autonomy?
- What weekly score distribution feels motivating after real user testing: generous, balanced, or challenging?
- Should streak grace reset weekly, roll every 7 days, or be earned through prior consistency?
- What analytics threshold should trigger scoring adjustment after MVP launch?
