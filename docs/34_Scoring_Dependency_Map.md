# Scoring Dependency Map

Status: Draft pending PM approval

Owner: Product Manager

Do not sync this document to GitHub until the Product Manager reviews and approves it.

## Purpose

This document maps the Sprint 1 and Sprint 2 foundations that must exist before Reading Momentum weekly scoring, XP, achievements, and leaderboards can be implemented.

The goal is to protect scope. Sprint 1 and Sprint 2 should build the foundations that later gamification depends on, without pulling scoring, XP, achievements, or leaderboards into those sprints before the required data, UX, analytics, and trust controls exist.

## Scope Position

Sprint 1 is infrastructure-only.

Sprint 2 is core reading setup.

Scoring systems should remain deferred until the foundations below are complete, reviewed, and stable enough to trust as scoring inputs.

Deferred gamification systems:

- Reading Momentum weekly score
- XP event awarding
- Achievements
- Leaderboards
- Weekly scoring jobs
- Score explanations
- Gamified notifications

## Dependency Summary

| System | Earliest Safe Implementation | Hard Dependencies | Soft Dependencies |
| --- | --- | --- | --- |
| Reading Momentum | After Sprint 2 review | Profiles, groups, user books, reading logs, check-in visibility, activity basics, analytics events | Discussion posts, reviews, reactions, weekly rituals |
| XP | After check-in logging is stable; limited basic XP may be planned after Sprint 2 | Profiles, trusted server actions, `xp_events`, source records, duplicate prevention | Achievements, profile display, onboarding copy |
| Achievements | After XP/event patterns are stable | Profiles, event history, achievement definitions, earned achievement storage | More behavior types, profile customization, notification strategy |
| Leaderboards | After Momentum score snapshots exist | Group membership, `momentum_scores`, group-scoped reads, privacy rules | Score explanations, opt-out settings, enough active groups for usefulness |

## Sprint 1 Foundations

Sprint 1 should create the application and trust foundation that later scoring depends on.

Required Sprint 1 foundations:

- Next.js application foundation
- TypeScript and Tailwind configuration
- Supabase client setup
- Environment variable handling
- Authentication
- Profile creation and editing
- Private group create/join foundation
- RLS helper functions and policies
- App shell and navigation
- Dashboard shell and placeholder states
- Testing framework
- Deployment workflow
- Basic analytics preparation

### Sprint 1 Data Dependencies

Required before later scoring work:

- `profiles` exists with stable user identity.
- `profiles.timezone` exists so reading days and weeks can be calculated correctly.
- `profiles.total_xp`, `current_streak_days`, and `longest_streak_days` may exist as placeholders, but no reward logic should write them yet.
- `groups` exists for private group-scoped scoring.
- `group_members` exists with active membership status and role.
- RLS prevents non-members from reading group data.
- Trusted group creation and join workflows exist or are clearly defined.

Sprint 1 should not require:

- `books`
- `user_books`
- `reading_logs`
- `activities`
- `xp_events`
- `momentum_scores`
- `achievements`
- `user_achievements`
- `reactions`
- `reviews`

Dependency risk:

- If group membership rules are weak, leaderboards may leak private activity or include non-members.
- If timezone is missing or unreliable, streaks and weekly scoring will feel unfair.
- If profile identity is unstable, XP and achievement history may become hard to reconcile.

### Sprint 1 UX Dependencies

Required before scoring:

- Users can reliably sign up, log in, and return.
- Users can create a profile with enough identity for group contexts.
- Users can create or join a private group.
- Navigation includes clear future homes for Today, Group, Books, and Profile.
- Placeholder score or streak surfaces are clearly non-functional if shown.
- App tone is calm and low-pressure.

UX dependency risk:

- If the shell implies scoring exists before data exists, users may distrust later scores.
- If group pages do not clearly communicate privacy, users may avoid sharing check-ins in Sprint 2.
- If onboarding does not capture timezone or profile basics, streaks may need later correction.

### Sprint 1 Analytics Dependencies

Required before scoring:

- Event naming conventions are defined.
- Privacy rules prevent raw notes, reflections, review text, invite codes, and emails from being sent to analytics.
- Activation events are planned or implemented for account, profile, group create, and group join.
- Analytics implementation is optional in Sprint 1, but architecture should leave room for event hooks.

Analytics dependency risk:

- If Sprint 1 analytics are absent, the team can still build Sprint 2, but will have weaker evidence about onboarding and group activation.
- If privacy constraints are not defined early, later scoring analytics may accidentally capture sensitive reading or discussion content.

## Sprint 2 Foundations

Sprint 2 should create the reading behavior foundation that future scoring systems will consume.

Candidate Sprint 2 foundations:

- Add current book flow
- `books` and `user_books` tables
- Fast check-in flow
- `reading_logs` table
- Progress input validation
- Private versus group-visible check-in control
- Dashboard current-book state
- Basic group feed activity for shared check-ins

Sprint 2 should still exclude:

- Reading Momentum weekly score
- XP awarding
- Achievements
- Leaderboards
- AI prompts
- Reviews
- Notifications

### Sprint 2 Data Dependencies

Required before Reading Momentum:

- `books` exists with title, author, optional cover, optional default page/chapter counts, and genre fields where available.
- `user_books` exists with user-owned reading state.
- `user_books.format` supports at least print, ebook, audiobook, and mixed.
- `user_books.goal_type` supports pages, chapters, minutes, and sessions.
- `reading_logs` exists as append-only check-in history.
- `reading_logs.logged_for_date` is stored and can be interpreted in the user's timezone.
- `reading_logs` captures pages, chapters, minutes, audiobook minutes, session completed, skipped, note, visibility, user, book, and optional group.
- Reading logs can be aggregated by user and date.
- Reading logs can be filtered by group visibility.
- Current book progress updates from check-ins.
- Basic `activities` exist if shared check-ins appear in the group feed.

Required before XP:

- Source records exist for check-ins and later social actions.
- Trusted server workflow for `logReadingCheckIn` exists or is planned.
- Duplicate prevention strategy exists for source-based reward events.
- User-owned writes are separated from derived reward writes.

Required before achievements:

- Durable event history exists for behaviors that achievements recognize.
- Profiles and source records can support first-time and milestone checks.
- Achievement definitions are approved before visible awards are issued.

Required before leaderboards:

- Group membership data is stable.
- Shared activity can be safely scoped to groups.
- Private check-ins are excluded from group views unless the user explicitly shares them.
- Enough weekly reading data exists to produce meaningful ranking categories.

### Sprint 2 UX Dependencies

Required before Reading Momentum:

- Add-book flow captures enough format and goal-type data to normalize effort later.
- Check-in flow is fast enough that users log honestly instead of avoiding it.
- Check-in flow supports pages, chapters, minutes, audiobook minutes, sessions, and skipped-day logs.
- Check-in visibility control is understandable.
- Dashboard shows current books and recent check-in state.
- Group feed distinguishes meaningful shared check-ins from private logs.
- Empty and first-week states avoid competitive pressure.

Required before XP:

- Profile can eventually show XP without making it look like the main success metric.
- Check-in success state can support a small reward moment later.
- UX copy separates encouragement from judgment.

Required before achievements:

- Profile has a place for badges or milestones.
- Achievement language is identity-affirming, not status-heavy.
- Hidden or future achievements do not create anxiety.

Required before leaderboards:

- Group page has a clear leaderboard area or placeholder.
- Leaderboard categories can be explained in plain language.
- Users with no activity are represented neutrally.
- PM decides whether leaderboard opt-out is required before launch.

### Sprint 2 Analytics Dependencies

Required before Reading Momentum:

- `book_added`
- `checkin_started`
- `checkin_completed`
- `checkin_marked_skipped`
- `checkin_shared_to_group`
- `checkin_kept_private`
- `progress_validation_warning_seen`

Recommended event properties:

- Book format
- Goal type
- Visibility
- Has positive progress
- Has note
- Count fields as numeric ranges or booleans where possible
- Group id only when needed for group metrics

Avoid analytics properties:

- Raw note text
- Private reflections
- Book title unless explicitly needed and approved
- Invite codes
- Email addresses

Analytics required before scoring calibration:

- Weekly reading days per user
- Weekly check-ins per user
- Shared versus private check-in rate
- Check-in completion rate
- Skip rate
- Return after missed week
- Group activity rate
- Progress input validation warnings

Dependency risk:

- Without Sprint 2 analytics, the team can implement scoring mechanically but cannot tell whether it rewards the right behaviors.
- Without visibility analytics, group leaderboards may over-represent users comfortable sharing publicly.
- Without check-in start and completion events, the team cannot confirm the under-30-second check-in requirement.

## System-Specific Dependency Detail

## Reading Momentum

Reading Momentum requires stable weekly inputs across consistency, volume, reflection, community, and completion.

Minimum viable input set after Sprint 2:

- Consistency: `reading_logs` grouped by user and date
- Volume: `reading_logs` effort fields
- Reflection: check-in notes only, unless discussion and reviews are implemented
- Community: shared check-in activity only, unless discussions and reactions are implemented
- Completion: `user_books.status = finished`, only if complete-book flow exists

PM recommendation:

- Do not implement full Reading Momentum immediately after Sprint 2 unless discussion, reflection, reviews, and completion flows are also ready.
- If a score is needed early, label it as a limited "Reading Rhythm" prototype and use only consistency and check-in effort.

Hard blockers:

- No reliable reading logs
- No timezone-aware date handling
- No visibility rules
- No trusted write path for derived scores

Risks:

- Early score may overvalue volume because reflection and community inputs are not ready.
- Users may anchor on the first scoring model even if it is explicitly temporary.
- Scoring private and group-visible logs incorrectly could break trust.

## XP

XP can be implemented before full Reading Momentum, but only after source events and duplicate prevention exist.

Minimum viable input set:

- Profile identity
- Check-in source records
- Trusted reward writer
- `xp_events`
- Cached `profiles.total_xp`

PM recommendation:

- Start with check-in XP only if PM wants an early reward loop.
- Keep XP visually secondary to the reading habit.
- Do not add social XP until posts, replies, and reactions are stable.

Hard blockers:

- No source records
- No trusted server write path
- No duplicate prevention
- No product decision on XP display

Risks:

- XP may incentivize check-in spam if caps and source uniqueness are missing.
- XP may distract from reading if the UI makes it too prominent.
- Retroactive XP backfills may annoy users if early actions were not recorded consistently.

## Achievements

Achievements require stable definitions and reliable event history.

Minimum viable input set:

- `achievements` definitions
- `user_achievements` earned records
- Source events for milestones
- Profile display surface

Good first achievements after foundations exist:

- First Check-In
- First Book Added
- First Group Joined
- 3-Day Reader
- Comeback Reader
- First Book Finished

PM recommendation:

- Seed achievement definitions before awarding them.
- Award only simple, unambiguous achievements first.
- Defer subjective achievements such as Deep Reader or Supportive Friend until reflection and community signals are stronger.

Hard blockers:

- No event history
- No achievement definitions
- No deduped earned-record table
- No UX surface for earned milestones

Risks:

- Awarding achievements too early can create inconsistent histories.
- Subjective achievements may feel unfair without transparent criteria.
- Too many first-version badges can cheapen the system.

## Leaderboards

Leaderboards should be implemented after score snapshots and privacy rules are reliable.

Minimum viable input set:

- Active `group_members`
- `momentum_scores`
- Group-scoped score reads
- Category definitions
- Empty and tie states
- Privacy handling for private logs

Recommended MVP leaderboard categories:

- Weekly Momentum
- Most Consistent
- Most Reflective
- Community Builder
- Completion Progress
- Best Comeback
- Most Improved

PM recommendation:

- Do not launch leaderboards with only pages, minutes, or total check-ins.
- If leaderboards are prototyped before full scoring, use "Most Consistent" only and mark it as a weekly group rhythm.
- Keep global leaderboards out of scope.

Hard blockers:

- No group membership enforcement
- No score snapshots
- No private/shared activity rules
- No empty-state UX

Risks:

- Leaderboards can make casual readers feel behind.
- Group-visible scoring may pressure users to share private reading activity.
- Most Improved requires historical baselines and should not appear until at least 4 prior weeks of data exist.

## Cross-Cutting Risks

### Data Quality Risk

Reading logs will be manual and may contain mistakes.

Mitigation:

- Validate impossible progress.
- Allow correction flows later.
- Use caps and diminishing returns.
- Avoid over-precise score explanations when inputs are approximate.

### Privacy Risk

Scoring can accidentally reveal private reading behavior through group rankings.

Mitigation:

- Keep private logs out of group leaderboards.
- Make visibility clear at check-in time.
- Scope all leaderboard reads to active group members.
- Use RLS and trusted score jobs.

### Fairness Risk

Early scoring can favor users whose formats are easiest to measure.

Mitigation:

- Support pages, chapters, minutes, audiobook minutes, and sessions.
- Treat audiobook time as equal effort.
- Avoid page-only ranking.
- Delay full scoring until enough format signals exist.

### Motivation Risk

Gamification can create pressure instead of support.

Mitigation:

- Keep consistency more important than volume.
- Use grace days.
- Use encouraging labels.
- Offer multiple recognition categories.
- Consider opt-out or collapsed leaderboard modules.

### Scope Risk

XP and leaderboards are tempting to build as soon as check-ins exist.

Mitigation:

- Keep Sprint 2 focused on reliable reading logs and UX.
- Treat scoring docs as requirements, not implementation approval.
- Require PM approval before enabling any reward system.

### Analytics Risk

The team may ship scoring without knowing whether it helps reading behavior.

Mitigation:

- Instrument check-in behavior before scoring.
- Track retention through check-ins, not logins alone.
- Track return after missed week.
- Track shared versus private behavior before group ranking.

## Readiness Checklist

Reading Momentum is ready to implement when:

- [ ] Sprint 1 auth, profiles, groups, RLS, app shell, testing, and deployment are complete.
- [ ] Sprint 2 current books and reading logs are complete.
- [ ] Check-ins support all MVP input types.
- [ ] User timezone handling is reliable.
- [ ] Visibility rules are implemented and tested.
- [ ] Score source data can be aggregated by user, group, and week.
- [ ] Analytics can measure check-in consistency and return behavior.
- [ ] PM approves which pillars are included in the first score release.

XP is ready to implement when:

- [ ] `xp_events` migration is approved.
- [ ] Trusted server write path exists.
- [ ] Source action IDs are available.
- [ ] Duplicate prevention is defined.
- [ ] XP display location is approved.
- [ ] Daily or weekly caps are approved.

Achievements are ready to implement when:

- [ ] Achievement definitions are approved.
- [ ] `achievements` and `user_achievements` storage is approved.
- [ ] Award triggers use durable source events.
- [ ] Profile milestone UI is designed.
- [ ] Retroactive awarding policy is decided.

Leaderboards are ready to implement when:

- [ ] `momentum_scores` exists and is populated by trusted code.
- [ ] Group-scoped score reads respect RLS.
- [ ] Private logs are excluded unless shared.
- [ ] Empty, tie, and no-activity states are designed.
- [ ] Leaderboard categories are approved.
- [ ] PM decides whether opt-out is required.

## PM Approval Questions

- Should Sprint 2 create `activities` for check-ins, or keep group feed work as a separate Sprint 3 dependency?
- Should Sprint 2 include `xp_events` as a migration stub, or wait until XP implementation is approved?
- Should `momentum_scores`, `achievements`, and `user_achievements` be created early as empty tables, or deferred to avoid implying feature readiness?
- Should early scoring use only consistency and volume, or wait for reflection/community/completion inputs?
- Should leaderboard opt-out be required before any group ranking ships?
- Should Most Improved be delayed until users have at least 4 weeks of prior data?
- Should private check-ins count toward personal score but never group score?
- Should comeback behavior be tracked in Sprint 2 analytics before it is rewarded?
- Should PM require a scoring calibration review after the first two weeks of real check-in data?
