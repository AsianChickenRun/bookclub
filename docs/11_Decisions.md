# Decision Log

## 2026-06-17: Add Room-Scoped Local Check-Ins

Decision: Sprint 6 group rooms may include local check-ins scoped to the specific room through an optional local `groupId` on reading logs.

Reason: A working group session should let a reader leave a small progress note in the room they are viewing. This reduces navigation friction and fixes the local prototype issue where room counts could rely on general group-visible logs.

Alternatives considered:

- Keep all check-ins on Today only
- Wait for Supabase before adding group-specific check-in targeting
- Add a full multi-group targeting system to Today during this slice

Research support: Sprint 6 is focused on local group-room depth; UX guidance recommends a compact, low-pressure check-in close to the current book/session focus.

Future review date: Supabase-backed group check-in migration.

## 2026-06-17: Add Explicit Local Group Targeting On Today

Decision: Today page group-visible check-ins should require selecting the local group that receives the note.

Reason: The previous local shortcut sent group-visible check-ins to the first local group, which was confusing once multiple groups and specific rooms existed. Explicit targeting makes the local working model more predictable without introducing production membership logic.

Alternatives considered:

- Keep first-group fallback only
- Remove group-visible Today check-ins
- Wait for Supabase membership before fixing local targeting

Research support: QA review identified first-group fallback as the main remaining scoping risk for local room check-ins.

Future review date: Supabase-backed group membership migration.

## 2026-06-17: Add Local Weekly Room Rituals

Decision: Sprint 6 group rooms may include editable local weekly rituals with cadence, prompt, and focus note, using calm table-oriented copy.

Reason: The specific group page needs more depth than stats and threads. A lightweight ritual gives the room a shared rhythm while preserving the product principle that reading should feel low-pressure and optional.

Alternatives considered:

- Add notification scheduling before persistence
- Add streak-like ritual completion
- Leave the room prompt as static copy only

Research support: UX docs recommend Monday/Thursday rituals but warn against guilt-based reminders, streak pressure, and social-media energy. The design language says current reading should remain primary and only one thing should demand attention.

Future review date: Before notification or Supabase-backed ritual scheduling.

## 2026-06-17: Use Local Planning Readers For Group Room Depth

Decision: Sprint 6 may store local planning-reader records for a group room, including display name, reading status, and optional current book, while real account-backed membership remains deferred to Supabase persistence.

Reason: The specific group page needs to feel like a working room before full backend membership exists. Local planning readers let the PM and tester model a group session without implying production-ready identity, privacy, or realtime presence.

Alternatives considered:

- Keep the roster derived only from post and reply author names
- Wait for Supabase membership before showing any roster
- Build fake realtime presence or full invite management

Research support: Sprint 6 is explicitly local-first, with Supabase persistence, realtime updates, and real member lists out of scope until access gates are met.

Future review date: Supabase-backed group migration.

## 2026-06-17: Keep Sprint 6 Group Rooms Same-Browser Local Until Persistence

Decision: Sprint 6 group rooms are approved as same-browser local working rooms. Cross-device invite acceptance, real access control, and account-backed member state remain deferred to the Supabase-backed persistence sprint.

Reason: The local model now supports room sessions, discussions, replies, spoiler controls, planning readers, and book attachments. Treating this as a production shared-room implementation would overclaim the current storage model.

Alternatives considered:

- Block group-room depth until Supabase is connected
- Pretend local invite codes create shared rooms
- Add a complex fake syncing layer

Research support: Sprint 6 scope is local-first while Supabase persistence, realtime updates, and real member lists are explicitly out of scope.

Future review date: Sprint 5/Supabase activation.

## 2026-06-17: Add Book Catalog Search Inside Group Rooms

Decision: Sprint 6 group rooms may include direct Google Books search inside the room discussion composer, saving selected catalog results into local Reading Momentum books before attaching them to the discussion.

Reason: A specific group page should be a working room, not a hub that sends the user elsewhere for core setup. Letting users find and attach a book in context makes room discussions deeper and reduces friction when the group is talking about a book not yet in the local list.

Alternatives considered:

- Require users to go to `/books` before creating a room discussion
- Allow only free-text book titles in room posts
- Defer all book context until Supabase persistence is active

Research support: Existing Sprint 6 catalog mini-sprint already approved Google Books as an external public catalog while Reading Momentum remains the source of truth for saved books and user activity.

Future review date: Before production launch, after the Google Books key is restricted and configured in Vercel.

## 2026-06-17: Make Specific Group Rooms Actionable

Decision: Sprint 6 group rooms should support starting discussions directly inside `/groups/[groupId]`, with local roster and session-prompt depth, before real-time membership or Supabase persistence is introduced.

Reason: The user goal is a working model with more depth on the specific group page. A read-only room does not satisfy that goal; users need to start and continue a room session without returning to the general Groups page.

Alternatives considered:

- Keep discussion creation only on `/groups`
- Wait for Supabase-backed groups before improving the room page
- Add realtime or notifications before the local room model is coherent

Research support: Product docs prioritize small private groups, calm social accountability, spoiler-safe discussion, and working local prototypes while persistence setup remains gated.

Future review date: After Sprint 6 review and before Supabase-backed group-room migration.

## 2026-06-17: Use Google Books As External Catalog, Not User Database

Decision: Reading Momentum may use Google Books API for public book discovery and metadata enrichment, while app-owned user data remains in Reading Momentum persistence.

Reason: The product needs deeper book search and richer current-book context for check-ins, discussions, and group rooms. Google Books provides searchable public volume metadata, but it should not become the source of truth for user progress, groups, discussions, or accountability data.

Alternatives considered:

- Continue manual-only book entry
- Store all user book state in Google Books
- Wait for Supabase before adding book search

Research support: Google Books API documentation defines public volume search through `/books/v1/volumes` with required `q`, optional fielded queries such as `intitle`, `inauthor`, `isbn`, and API-key identification for public data.

Future review date: Before production launch with restricted API key and hosted environment variables.

## 2026-06-16: Harden Vercel Preview Before Persistence Expansion

Decision: Sprint 4 may include deployment hardening that makes the live Vercel preview feel product-ready, while keeping local-first storage and deferring Supabase-backed persistence until access is confirmed.

Reason: The public deployment exists and should no longer expose internal sprint, mock, or placeholder language to users. A cleaner deployed preview helps validate the habit loop while the platform waits on cloud persistence work.

Alternatives considered:

- Move directly into Supabase without confirming access and migration authority
- Keep the deployed site as an engineering prototype
- Start XP, AI, or reviews before the current preview feels coherent

Research support: The synced deployed code contained user-facing sprint/mock language on the landing page, auth, onboarding, settings, books, today, groups, and reviews screens.

Future review date: After Vercel redeploy and live smoke check.

## 2026-06-15: Complete Sprint 2 As Local Current-Book And Check-In Foundation

Decision: Sprint 2 is accepted as complete for local current-book and check-in foundation.

Reason: Users can now add current books, see books, complete basic check-ins, choose visibility, mark skipped days, and view reading log history. The data shape is ready for Supabase migration when credentials are available.

Alternatives considered:

- Keep Sprint 2 open until Supabase persistence is available
- Add scoring before group feed
- Add AI prompts before discussion foundations

Research support: Pending. This is a PM sprint governance decision based on implemented scope and roadmap sequencing.

Future review date: Sprint 3 review.

## 2026-06-15: Start Sprint 3 With Group Activity And Discussion Foundation

Decision: Sprint 3 should focus on group activity feed and discussion foundations.

Reason: Sprint 2 created check-ins with visibility and local reading logs. The next highest-value step is making group-visible activity appear in private groups, then adding basic discussion posts. Scoring, AI, reviews, and notifications still depend on more social and reading data foundations.

Alternatives considered:

- Build scoring next
- Build reviews next
- Build AI prompts next
- Focus only on Supabase migration while credentials are blocked

Research support: Pending.

Future review date: Sprint 3 review.

## 2026-06-15: Complete Sprint 1 As Local Foundation

Decision: Sprint 1 is accepted as complete for local foundation and visible prototype readiness.

Reason: The project now has a working Next.js app shell, local mock account/profile/group flows, Supabase client scaffolding, initial database migration, CI workflow, and passing lint/typecheck/build. Real Supabase persistence, deployment, and GitHub sync require external credentials or connector availability and are tracked as carryover infrastructure blockers.

Alternatives considered:

- Keep Sprint 1 open until Supabase credentials and deployment are available
- Stop after app shell without local functional flows
- Start product features without documenting the credential blockers

Research support: Pending. This is a PM sprint governance decision based on delivery progress and external dependency constraints.

Future review date: Sprint 2 midpoint.

## 2026-06-15: Start Sprint 2 With Local-First Current Book And Check-In Foundation

Decision: Sprint 2 may begin with current book tracking and basic reading check-ins using local persistence first, while keeping data shapes Supabase-ready.

Reason: Local-first implementation lets the product habit loop become visible without waiting on Supabase credentials. The work remains aligned with the roadmap and avoids advanced systems such as scoring, AI, reviews, notifications, and gamification.

Alternatives considered:

- Wait for Supabase credentials before any Sprint 2 feature work
- Build scoring or AI before check-ins
- Continue planning only

Research support: Pending.

Future review date: Sprint 2 review.

## 2026-06-15: Approve Minimum Sprint 0 Gate And Start Sprint 1

Decision: The PM approved the minimum Sprint 0 gate and authorized Sprint 1 infrastructure work to begin.

Reason: The project now has enough planning coverage to safely begin infrastructure: operating model, vision, PRD draft, personas, roadmap, backlog, database architecture, UX flows, technical architecture, API/backend boundaries, security model, testing strategy, analytics strategy, and Sprint 1 plan. Remaining planning gaps are non-blocking and can continue as parallel mini-sprints.

Alternatives considered:

- Wait for every Sprint 0 document to reach final polish before implementation
- Start feature development immediately
- Start only more planning work and keep engineering blocked

Research support: Pending. This is a PM execution decision based on documented sprint gates and project momentum.

Future review date: Sprint 1 review.

## 2026-06-15: Continue Non-Blocking Planning In Parallel With Sprint 1

Decision: Competitive analysis refinement, growth positioning, Sprint 1 UX checklist, Sprint 1 QA checklist, and database migration checklist may continue in parallel while Sprint 1 infrastructure begins.

Reason: These workstreams improve implementation quality but should not block safe infrastructure work such as app scaffold, navigation shell, tooling, and documentation workflow.

Alternatives considered:

- Block Sprint 1 until all mini-sprints finish
- Defer all planning until after implementation

Research support: Pending.

Future review date: During Sprint 1 planning review.

## 2026-06-15: Gate Implementation Behind Sprint 0 Approval

Decision: No production feature development should begin until Sprint 0 planning, architecture, and documentation exit criteria are complete and approved by the Product Manager.

Reason: Reading Momentum depends on tightly connected product systems: private groups, spoiler safety, progress tracking, scoring, AI prompts, and supportive accountability. Starting implementation before the blueprint is complete would increase rework and trust-risk.

Alternatives considered:

- Begin implementation from the existing backlog immediately
- Build the app shell while product systems are still unresolved
- Let each specialist agent define implementation scope independently

Research support: Pending. This is a project management control decision based on complexity and dependency risk.

Future review date: End of Sprint 0.

## 2026-06-15: Sprint 1 Is Infrastructure-Only

Decision: Sprint 1 will focus on project foundation and infrastructure: Next.js, TypeScript, Tailwind, Supabase, auth, profiles, private group foundation, navigation, deployment, and testing workflow.

Reason: The application needs a stable technical base before implementing Reading Momentum, XP, reviews, AI, notifications, or gamification.

Alternatives considered:

- Include check-ins in Sprint 1
- Include scoring in Sprint 1
- Include AI prompts in Sprint 1

Research support: Pending. This is an execution sequencing decision based on dependency order.

Future review date: Sprint 1 review.

## 2026-06-15: Start With A Mobile-First Website

Decision: The first version will be a mobile-first web application, not a native mobile app.

Reason: A website is faster to build, cheaper to test, easier to update, easier to share, and avoids App Store approval overhead.

Alternatives considered:

- Native iOS app
- Native Android app
- Cross-platform mobile app from day one

Research support: Faster iteration improves MVP learning. Mobile-first web supports the main habit loop while preserving a path to PWA and native apps later.

Future review date: After weekly retention is proven and users request mobile-specific features.

## 2026-06-15: Use Small Private Groups For MVP

Decision: The first version will focus on small private groups rather than public communities.

Reason: Trust and comfort matter for progress sharing, reflection, and spoiler-safe discussion.

Alternatives considered:

- Public reading circles
- Creator-led communities
- School or library groups

Research support: Relatedness and supportive accountability are more likely when users know the people seeing their activity.

Future review date: After MVP group retention data is available.

## 2026-06-15: Let Users Read Different Books In The Same Group

Decision: Users can be in the same group while reading different books.

Reason: Autonomy supports motivation and reduces pressure when people read at different speeds or prefer different formats.

Alternatives considered:

- Require a shared group book
- Make Book of the Month mandatory

Research support: Autonomy supports long-term motivation.

Future review date: After evaluating Book of the Month participation.

## 2026-06-15: Prioritize Consistency Over Raw Volume

Decision: Reading Momentum should prioritize weekly consistency and use diminishing returns for volume.

Reason: The product is designed to build a habit, not reward only the fastest or highest-volume readers.

Alternatives considered:

- Page-count leaderboard as primary score
- Total minutes as primary score
- Book completions as primary score

Research support: Small repeated behaviors and self-monitoring support habit formation.

Future review date: After early scoring data shows whether slow, fast, audio, fiction, nonfiction, and dense-material readers all feel fairly recognized.

## 2026-06-15: AI Should Prompt, Not Replace Reading

Decision: AI features should generate prompts, organize user notes, and support reflection, but should not answer prompts for users or create shortcuts that replace reading.

Reason: The product goal is to increase actual reading behavior and human discussion.

Alternatives considered:

- AI summaries as a default feature
- AI-generated discussion answers
- AI-generated fake reviews

Research support: Reflection can deepen engagement, but over-automation can weaken the core behavior.

Future review date: Before expanding AI into recommendations or review assistance.
