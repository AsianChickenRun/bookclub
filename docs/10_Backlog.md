# Product Backlog

## Priority Labels

- P0: Required for MVP habit-loop validation
- P1: Important for MVP quality or early retention
- P2: Post-MVP or advanced version

## Sprint Gate

Sprint 0 is the active sprint. No production feature development should begin until Sprint 0 exit criteria are met and the Product Manager approves Sprint 1.

Sprint 1 is infrastructure-only. Major product systems such as Reading Momentum, XP, achievements, leaderboards, reviews, AI prompts, notifications, and Book of the Month are out of scope for Sprint 1.

## Sprint 0: Planning And Documentation

### S0-001: Consolidate Product Requirements Document

Priority: P0

Create a PRD that combines vision, problem, audience, MVP scope, core features, non-goals, assumptions, and success metrics.

Acceptance criteria:

- MVP is clearly defined.
- MVP, post-MVP, and future ideas are separated.
- Success metrics are included.
- Source docs are referenced.

Docs: 01_Vision.md, 04_Features.md, 09_Roadmap.md

### S0-002: Define User Personas

Priority: P0

Create personas for the primary user segments.

Acceptance criteria:

- Includes casual reader, busy student, young professional, remote friend group member, audiobook listener, and spoiler-sensitive reader.
- Each persona includes goals, motivations, pain points, trust concerns, and MVP needs.
- Personas inform feature priorities.

Docs: 01_Vision.md, 13_UX_Flows.md

### S0-003: Complete Competitive Analysis

Priority: P0

Compare Reading Momentum against direct and adjacent competitors.

Acceptance criteria:

- Includes reading apps and habit apps.
- Identifies table-stakes features, gaps, and differentiation.
- Verified sources are used before claims are treated as evidence.

Docs: 14_Research_Plan.md

### S0-004: Define Technical Architecture

Priority: P0

Document the Sprint 1 technical architecture.

Acceptance criteria:

- Covers app structure, Supabase integration, environment variables, deployment, and local workflow.
- Defines Sprint 1 scaffold versus deferred systems.
- Provides enough direction for engineering implementation.

Docs: 12_Database_Architecture.md, 18_Sprint_1_Plan.md

### S0-005: Define API And Backend Boundaries

Priority: P0

Document server/client responsibilities and initial API contracts.

Acceptance criteria:

- Defines client-side Supabase access allowed by RLS.
- Defines trusted server operations.
- Covers profile, group, book, and check-in boundaries.

Docs: 12_Database_Architecture.md

### S0-006: Define Security And Authorization Model

Priority: P0

Document auth, authorization, privacy, RLS, and secrets handling.

Acceptance criteria:

- Private group access rules are explicit.
- Profile and group membership permissions are explicit.
- Spoiler controls are separated from privacy/security controls.
- Sprint 1 security acceptance criteria are defined.

Docs: 12_Database_Architecture.md, 16_QA_Risk_Register.md

### S0-007: Define Testing Strategy

Priority: P0

Document testing expectations for Sprint 1 and later sprints.

Acceptance criteria:

- Includes unit, integration, end-to-end, accessibility, RLS, and smoke testing.
- Defines minimum Sprint 1 tests.
- Defines Definition of Done.

Docs: 16_QA_Risk_Register.md

### S0-008: Define Analytics Strategy

Priority: P1

Document analytics that measure reading behavior rather than app addiction.

Acceptance criteria:

- Includes activation, retention, check-in, group, review, and comeback metrics.
- Defines initial events for implementation planning.
- Avoids optimizing for time spent in app.

Docs: 03_Research.md, 14_Research_Plan.md

### S0-009: Define Style Guide And Brand Direction

Priority: P1

Document brand, tone, color, typography, accessibility, and component strategy.

Acceptance criteria:

- Reinforces calm, warm, motivating, low-pressure identity.
- Includes accessibility constraints.
- Gives enough direction for Sprint 1 UI shell.

Docs: 08_UI_UX.md, 13_UX_Flows.md

## Sprint 1: Project Foundation And Infrastructure

### S1-001: Initialize Next.js Application

Priority: P0

Initialize the app foundation.

Acceptance criteria:

- Next.js app is created with TypeScript.
- Tailwind CSS is configured.
- App runs locally.
- Initial folder structure is created.

Docs: 18_Sprint_1_Plan.md

### S1-002: Configure Code Quality Tooling

Priority: P0

Set up consistent linting and formatting.

Acceptance criteria:

- ESLint is configured.
- Prettier is configured.
- Lint and format commands are documented.
- Initial skeleton passes lint.

Docs: 18_Sprint_1_Plan.md

### S1-003: Configure Supabase And Environment Variables

Priority: P0

Connect the app to Supabase safely.

Acceptance criteria:

- Supabase client strategy is implemented.
- Required environment variables are documented.
- Example environment file contains no real secrets.
- Missing configuration fails safely.

Docs: 12_Database_Architecture.md, 18_Sprint_1_Plan.md

### S1-004: Create Initial Database Migrations

Priority: P0

Create initial database tables for profiles, groups, and membership.

Acceptance criteria:

- `profiles`, `groups`, and `group_members` exist.
- Constraints and key indexes are included.
- RLS is enabled.
- Basic policies are implemented.

Docs: 12_Database_Architecture.md

### S1-005: Implement Authentication Pages

Priority: P0

Allow users to sign up, log in, and log out.

Acceptance criteria:

- Sign up works.
- Log in works.
- Log out works.
- Auth loading and error states exist.
- Redirects are predictable.

Docs: 13_UX_Flows.md, 18_Sprint_1_Plan.md

### S1-006: Implement Profile Creation And Editing

Priority: P0

Allow users to create and edit basic profiles.

Acceptance criteria:

- New users are prompted to create a profile.
- Display name is required.
- Optional fields do not block completion.
- Users can edit their own profile.
- Profile writes are protected by RLS.

Docs: 04_Features.md, 12_Database_Architecture.md, 13_UX_Flows.md

### S1-007: Build Application Shell And Navigation

Priority: P0

Create the mobile-first app shell.

Acceptance criteria:

- Authenticated app layout exists.
- Primary navigation exists.
- Placeholder pages exist for major future areas.
- Navigation respects auth state.

Docs: 13_UX_Flows.md

### S1-008: Build Group Create And Join Foundation

Priority: P0

Create the private group foundation.

Acceptance criteria:

- User can create a group.
- Creator becomes owner/member.
- User can join through a basic controlled flow.
- Non-members cannot view private group pages.

Docs: 04_Features.md, 12_Database_Architecture.md, 16_QA_Risk_Register.md

### S1-009: Configure Testing Framework

Priority: P0

Set up testing baseline.

Acceptance criteria:

- Unit test framework is configured.
- Basic smoke test exists.
- CI can run tests.
- Test commands are documented.

Docs: 18_Sprint_1_Plan.md

### S1-010: Configure Deployment

Priority: P0

Deploy the application skeleton.

Acceptance criteria:

- App is deployed.
- Production environment variables are configured securely.
- Deployment workflow is documented.
- Production URL is recorded.

Docs: 18_Sprint_1_Plan.md

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

- User can search an external book catalog by title, author, subject, or ISBN.
- User can add a searched book into their current reading list.
- Saved searched books preserve useful metadata such as source ID, author, publisher, published date, page count, categories, ISBN, cover image URL, and description when available.
- User can still enter title, author, format, genre, and start date manually.
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
- User can create discussion posts from a specific group room.
- Users can reply to posts.
- Replies support short encouragement.
- Thread structure supports later spoiler controls.
- Discussion creation supports spoiler labels and optional progress locations.

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
