# Analytics Strategy

Status: Draft
Version: 0.1
Owner: Product Manager

## Analytics Goal

Reading Momentum should measure whether the product increases real reading behavior and supportive group accountability.

The product should not optimize for addictive app usage or time spent in app.

## Measurement Principles

- Measure reading behavior over app consumption.
- Measure retention through check-ins, not just logins.
- Measure supportive group activity, not popularity.
- Track recovery after missed reading.
- Respect privacy and avoid unnecessary content capture.
- Instrument only what supports product decisions.

## North Star Question

Did this app help someone keep reading when they otherwise would have stopped?

## Primary Metrics

Activation:

- Account created
- Profile created
- First book added
- First group joined or created
- First check-in completed

Engagement:

- Weekly active users
- Weekly reading check-ins per user
- Reading days per week
- Prompt answer rate
- Discussion participation rate

Retention:

- Week 1 retention
- Week 4 retention
- Group retention
- Return after missed week

Reading outcomes:

- Book completion rate
- Final review completion rate
- Average active current books
- Check-in streak length

Group outcomes:

- Groups with 2+ active members
- Groups with 3+ active members
- Replies per discussion post
- Supportive reactions given
- Shared versus private check-ins

## Metrics To Avoid As Primary Goals

Do not optimize primarily for:

- Time spent in app
- Number of screens viewed
- Notification opens alone
- Raw page totals alone
- Reaction popularity
- AI prompt generation volume

## Event Taxonomy Draft

Sprint 1 events:

- `account_created`
- `login_completed`
- `profile_created`
- `profile_updated`
- `group_created`
- `group_joined`
- `navigation_used`
- `deployment_smoke_test_passed`, internal

Sprint 2 candidate events:

- `book_added`
- `checkin_started`
- `checkin_completed`
- `checkin_marked_skipped`
- `checkin_shared_to_group`
- `checkin_kept_private`
- `progress_validation_warning_seen`

Later events:

- `prompt_answered`
- `discussion_post_created`
- `reply_created`
- `reaction_given`
- `book_completed`
- `final_review_created`
- `spoiler_revealed`
- `notification_preference_updated`
- `comeback_completed`

## Privacy Guidelines

Do not send raw private reading notes, review text, or discussion bodies to analytics by default.

Allowed analytics properties:

- Event type
- User or anonymous ID
- Group ID when needed for group metrics
- Book format
- Goal type
- Visibility setting
- Counts and booleans
- Timestamp

Avoid analytics properties:

- Full review text
- Full reflection text
- Private notes
- Sensitive book titles when not required
- Invite codes
- Email addresses

## Sprint 1 Analytics Scope

Sprint 1 should prepare analytics but does not need advanced instrumentation.

Sprint 1 acceptance:

- Analytics tool decision is documented.
- Event naming conventions are documented.
- Privacy constraints are documented.
- App architecture leaves room for analytics hooks.

If PostHog is configured in Sprint 1:

- Track only basic activation events.
- Avoid capturing private user content.
- Document opt-out or privacy approach before broader tracking.

## Dashboard Questions

Early dashboards should answer:

- How many users create profiles after signup?
- How many users create or join groups?
- How many users return after first login?
- How many groups become active?
- Where do users drop during onboarding?

Later dashboards should answer:

- Are users reading more consistently?
- Do groups improve retention?
- Are check-ins fast enough?
- Are users returning after missed weeks?
- Are spoilers or notifications causing trust issues?

