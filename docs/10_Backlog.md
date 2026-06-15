# Product Backlog

## Priority Labels

- P0: Required for MVP habit-loop validation
- P1: Important for MVP quality or early retention
- P2: Post-MVP or advanced version

## Phase 1: Foundation

### RM-001: Create Account And Profile

Priority: P0

As a new user, I want to create an account and basic reading profile so I can start tracking my reading identity.

Acceptance criteria:

- User can sign up and sign in.
- User can set display name and optional profile photo.
- Profile shows current books, completed books, streak, score placeholder, and recent activity placeholders.
- Profile page works on mobile-first layout.

Docs: 04_Features.md, 08_UI_UX.md

### RM-002: Create Private Reading Group

Priority: P0

As a user, I want to create a private reading group so I can build accountability with friends.

Acceptance criteria:

- User can create a group with name and optional description.
- Creator becomes group owner or admin.
- Group has a private member list.
- Group page includes placeholders for feed, check-ins, discussions, and leaderboard.

Docs: 04_Features.md, 06_Data_Model.md

### RM-003: Join Private Reading Group

Priority: P0

As an invited user, I want to join a private group so my friends can see my reading progress.

Acceptance criteria:

- User can join a group through an invite flow or invite code.
- Group membership is recorded.
- Non-members cannot view private group content.
- Members can see other members in the group.

Docs: 04_Features.md, 06_Data_Model.md

### RM-004: Add Current Book

Priority: P0

As a user, I want to add a current book so I can track what I am reading.

Acceptance criteria:

- User can enter title, author, format, genre, and start date.
- User can choose a goal type: pages, chapters, minutes, or sessions.
- User can enter total pages or chapters when relevant.
- User can optionally add a target finish date.
- Book appears on profile and dashboard.

Docs: 04_Features.md, 06_Data_Model.md

## Phase 2: Habit Loop

### RM-005: Log Reading Check-In

Priority: P0

As a user, I want to log reading progress in under 30 seconds so I can keep my habit visible without friction.

Acceptance criteria:

- User can check in for a current book.
- Supported inputs include pages read, chapters completed, minutes read, audiobook minutes, session completed, and skipped today.
- Check-in updates current progress when applicable.
- Check-in creates activity visible to the user and eligible for group feed.
- Mobile flow is short and clear.

Docs: 04_Features.md, 08_UI_UX.md

### RM-006: Basic Streaks With Grace

Priority: P0

As a user, I want my streak to reflect consistent effort without punishing one missed day too harshly.

Acceptance criteria:

- Reading check-ins can increment a streak.
- Missed days can use a grace rule.
- Streak display uses encouraging language.
- Streak logic does not rank users only by raw volume.

Docs: 02_Product_Principles.md, 05_Scoring_System.md

### RM-007: Basic XP Events

Priority: P1

As a user, I want small rewards for positive reading actions so progress feels fun.

Acceptance criteria:

- XP events are recorded for check-ins, discussion responses, replies, book completion, reviews, nominations, streak milestones, and comeback behavior.
- XP totals are visible on profile.
- XP does not replace Reading Momentum as the main weekly score.

Docs: 05_Scoring_System.md

### RM-008: Monday And Thursday Rituals

Priority: P1

As a group member, I want predictable weekly prompts so accountability feels structured but not demanding.

Acceptance criteria:

- Monday check-in prompt is available to users.
- Thursday discussion prompt is available to groups.
- Weekend recap or optional voting placeholder can be enabled later.
- Ritual language is supportive and not guilt-based.

Docs: 04_Features.md, 08_UI_UX.md

## Phase 3: Social Reading

### RM-009: Group Feed

Priority: P0

As a group member, I want to see meaningful reading activity from friends so the group feels alive.

Acceptance criteria:

- Feed shows check-ins, prompt answers, finished books, reviews, nominations, and streak milestones.
- Feed avoids posting every tiny action.
- Feed items include member, activity type, timestamp, and relevant book when available.
- Feed respects private group membership.

Docs: 04_Features.md

### RM-010: Discussion Posts And Replies

Priority: P0

As a group member, I want to post and reply to reading discussions so reading feels social.

Acceptance criteria:

- User can create discussion posts.
- Users can reply to posts.
- Replies support short encouragement.
- Thread structure supports later spoiler controls.

Docs: 04_Features.md

### RM-011: Reactions

Priority: P1

As a group member, I want to react to friends' progress so I can offer quick support.

Acceptance criteria:

- Users can react to posts, replies, milestones, and reviews.
- Reaction types are supportive.
- Reaction counts are visible.

Docs: 04_Features.md, 02_Product_Principles.md

## Phase 4: AI Prompts

### RM-012: Generate Reflection Prompt After Check-In

Priority: P0

As a user, I want a thoughtful prompt after checking in so I can reflect on what I read.

Acceptance criteria:

- Prompt generation uses book title, genre, format, and progress when available.
- Prompt asks the user to think rather than providing an answer.
- User can skip the prompt.
- Prompt history is stored.

Docs: 04_Features.md, 07_AI_Guidelines.md

### RM-013: Spoiler-Aware Prompt Rules

Priority: P1

As a reader, I want prompts that do not spoil later content so I can trust the app.

Acceptance criteria:

- Prompt requests include current progress.
- Prompt wording avoids implying future plot events.
- User-visible prompt copy avoids summaries unless explicitly requested.
- Fail-safe behavior prefers generic reflection over risky specificity.

Docs: 07_AI_Guidelines.md, 04_Features.md

## Phase 5: Reviews

### RM-014: Final Review

Priority: P0

As a user, I want to review a book when I finish it so my reading history captures my opinion.

Acceptance criteria:

- User can mark a book complete.
- User can enter rating, short review, optional long review, recommended audience, and optional category ratings.
- Review appears on profile and group feed when shared.

Docs: 04_Features.md

### RM-015: Live Review Timeline

Priority: P1

As a user, I want to save reactions while reading so my thoughts are captured as they happen.

Acceptance criteria:

- User can create a live review tied to a progress point.
- Live review supports reaction, prediction, quote, confusing section, or character opinion.
- Timeline displays live reviews in reading order.

Docs: 04_Features.md

### RM-016: Spoiler-Aware Review Visibility

Priority: P1

As a group member, I want later-progress reviews hidden until I catch up so I can participate without spoilers.

Acceptance criteria:

- Reviews can store progress location.
- Content beyond the viewer's progress is hidden, blurred, locked, or clearly labeled.
- Users can intentionally reveal spoiler content.

Docs: 04_Features.md

## Phase 6: Fair Scoring

### RM-017: Reading Momentum Weekly Score

Priority: P1

As a user, I want a weekly score that rewards consistency and engagement so I can understand my current momentum.

Acceptance criteria:

- Score uses consistency, volume, reflection, community, and completion pillars.
- Consistency has the highest weight.
- Volume uses diminishing returns.
- Score is calculated weekly.

Docs: 05_Scoring_System.md

### RM-018: Multi-Category Leaderboard

Priority: P1

As a group member, I want leaderboards that recognize different reading strengths so competition stays fair.

Acceptance criteria:

- Leaderboard supports categories beyond pages read.
- Categories include consistency, reflection, support, improvement, books finished, streak, comeback, and discussion.
- Total pages is not the main leaderboard.

Docs: 05_Scoring_System.md

## Phase 7: Book Of The Month

### RM-019: Book Nominations

Priority: P1

As a group member, I want to nominate a book so the group can optionally read something together.

Acceptance criteria:

- Members can nominate books.
- Nominations appear in the group.
- Nominations do not require every member to participate.

Docs: 04_Features.md

### RM-020: Book Voting

Priority: P2

As a group member, I want to vote on nominated books so the group can choose an optional shared read.

Acceptance criteria:

- Members can vote on finalists.
- Winning book is displayed as optional.
- Users can skip without penalty.

Docs: 04_Features.md

## Phase 8: Polish And Measurement

### RM-021: Product Analytics

Priority: P1

As the project team, we want to measure reading behavior so we can tell whether the product is working.

Acceptance criteria:

- Track weekly active users.
- Track weekly check-ins per user.
- Track discussion participation rate.
- Track average streak length.
- Track book completion and review completion.
- Track group retention and return after missed week.
- Avoid optimizing only for time spent in app.

Docs: 03_Research.md, 09_Roadmap.md

### RM-022: Reminder Notifications

Priority: P1

As a user, I want helpful reminders so I return to reading without feeling pressured.

Acceptance criteria:

- Supports Monday check-in reminder.
- Supports Thursday discussion reminder.
- Supports friend reply, friend finished book, Book of the Month voting, and weekly recap notifications.
- Notification copy avoids guilt-based wording.

Docs: 08_UI_UX.md
