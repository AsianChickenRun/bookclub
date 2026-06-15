# Sprint 1 Plan: Project Foundation And Infrastructure

## Objective

Sprint 1 begins only after Sprint 0 has been completed and approved.

Sprint 1 builds the technical foundation of Reading Momentum. It should produce a functional application skeleton with authentication, navigation, Supabase connectivity, deployment, and development workflows.

Sprint 1 should not implement major product systems.

## Entry Criteria

Sprint 1 can begin only when:

- Sprint 0 exit criteria are met.
- Product Manager confirms engineering readiness.
- Sprint 1 tickets are approved.
- Technical architecture is documented.
- Database architecture is approved.
- Security and testing expectations are documented.
- GitHub contains the current project docs.

## Sprint 1 Goals

- Initialize the application repository.
- Configure the development environment.
- Establish the application architecture.
- Connect frontend to Supabase.
- Implement authentication.
- Create basic user profiles.
- Create private group create/join foundation.
- Deploy the application.
- Prepare the project for future feature development.

## Functional Requirements

By the end of Sprint 1, users should be able to:

- Create an account.
- Log in.
- Create a profile.
- Edit profile information.
- Create or join a group.
- Navigate through the application.
- Store user data in Supabase.
- Access a deployed production version.

## Out Of Scope

Sprint 1 must not implement:

- Reading Momentum weekly scoring
- XP
- Achievements
- Leaderboards
- Book reviews
- Live review timeline
- AI discussion questions
- Book recommendations
- Book of the Month
- Notifications
- Advanced analytics
- Recommendation algorithms
- Gamification

## Sprint 1 Deliverables

### Repository

- Next.js project initialized
- TypeScript configured
- Tailwind CSS configured
- Project folder structure established
- Shared component architecture started
- ESLint and Prettier configured
- Development workflow documented

### Backend And Data

- Supabase project configured
- Initial database migrations created
- Authentication configured
- Row Level Security enabled for initial tables
- Environment variable management established
- API/server boundary established

### Frontend

- Responsive application layout
- Navigation system
- Authentication pages
- Onboarding flow
- Dashboard shell
- Profile page
- Group page placeholder
- Books page placeholder
- Reading page placeholder
- Review page placeholder
- Settings page
- Error pages
- Loading states

### Infrastructure

- GitHub repository organized
- Continuous deployment configured
- Environment management documented
- Testing framework configured
- Logging strategy stubbed
- Monitoring preparation documented
- Analytics preparation documented

## Sprint 1 Ticket Plan

### S1-001: Initialize Next.js Application

Priority: P0

As the engineering team, we need a clean Next.js foundation so future product work has a stable home.

Acceptance criteria:

- Next.js app is initialized with TypeScript.
- App uses the App Router unless Sprint 0 technical architecture says otherwise.
- Tailwind CSS is installed and configured.
- Basic project folders are created.
- App runs locally.

Docs: 17_Sprint_0_Plan.md, future technical architecture doc

### S1-002: Configure Code Quality Tooling

Priority: P0

As the engineering team, we need consistent formatting and linting before feature work begins.

Acceptance criteria:

- ESLint is configured.
- Prettier is configured.
- Formatting and lint commands are documented.
- Project passes lint on the initial skeleton.

Docs: future coding standards doc

### S1-003: Configure Supabase Client And Environment Variables

Priority: P0

As the application, we need a secure Supabase connection so auth and database features can work.

Acceptance criteria:

- Supabase browser client is configured.
- Supabase server client or middleware strategy is defined.
- Required environment variables are documented.
- Example environment file is created without real secrets.
- App fails safely when required environment variables are missing.

Docs: 12_Database_Architecture.md, future technical architecture doc

### S1-004: Create Initial Database Migrations

Priority: P0

As the system, we need initial schema tables for profiles, groups, and membership.

Acceptance criteria:

- Migration creates `profiles`.
- Migration creates `groups`.
- Migration creates `group_members`.
- Required constraints and indexes are included.
- RLS is enabled.
- Policies cover basic owner/member access.

Docs: 12_Database_Architecture.md

### S1-005: Implement Authentication Pages

Priority: P0

As a user, I want to sign up, log in, and log out so I can access my private reading space.

Acceptance criteria:

- User can sign up.
- User can log in.
- User can log out.
- Auth pages include loading and error states.
- Auth redirects are predictable.

Docs: 13_UX_Flows.md, future security doc

### S1-006: Implement Profile Creation And Editing

Priority: P0

As a user, I want to create and edit my profile so the app has my basic reading identity.

Acceptance criteria:

- New authenticated user is prompted to create a profile.
- User can set display name.
- Optional fields do not block completion.
- User can edit profile information.
- Profile writes are protected by RLS.

Docs: 04_Features.md, 13_UX_Flows.md, 12_Database_Architecture.md

### S1-007: Build Application Shell And Navigation

Priority: P0

As a user, I want clear navigation so I can move through the app even before all features are built.

Acceptance criteria:

- Mobile-first app shell exists.
- Primary navigation includes Today, Group, Books, and Profile or Settings as defined by UX docs.
- Placeholder pages exist for future feature areas.
- Navigation respects auth state.

Docs: 13_UX_Flows.md

### S1-008: Build Dashboard Shell

Priority: P1

As a user, I want a Today screen shell so the app has a clear home for future check-ins.

Acceptance criteria:

- Dashboard shell renders for authenticated users.
- Empty current-book state is shown.
- Primary action leads to a planned future add-book flow or placeholder.
- No scoring, AI, or check-in logic is implemented yet.

Docs: 13_UX_Flows.md

### S1-009: Build Group Create And Join Foundation

Priority: P0

As a user, I want to create or join a private group so Sprint 2 can build social reading on top of it.

Acceptance criteria:

- User can create a group.
- Creator becomes owner/member.
- User can join a group through a basic invite code or controlled MVP flow.
- Non-members cannot view group pages.
- Group page can show placeholder sections.

Docs: 04_Features.md, 12_Database_Architecture.md, 16_QA_Risk_Register.md

### S1-010: Configure Testing Framework

Priority: P0

As the engineering team, we need a testing baseline so future work can be verified safely.

Acceptance criteria:

- Unit test framework is configured.
- Basic smoke test exists.
- Testing commands are documented.
- CI can run tests.

Docs: future testing strategy doc

### S1-011: Configure Deployment

Priority: P0

As the project team, we need a deployed app so future sprints can test real flows.

Acceptance criteria:

- App is deployed to Vercel or approved host.
- Production environment variables are configured securely.
- Main branch deployment is documented.
- A production URL is recorded in project docs.

Docs: future deployment strategy doc

### S1-012: Document Development Workflow

Priority: P1

As future Codex agents and engineers, we need clear repo instructions so work stays consistent.

Acceptance criteria:

- README or docs include setup instructions.
- Commands for dev, build, lint, test, and deploy are documented.
- Branch and PR expectations are documented.
- Documentation update expectations are documented.

Docs: 17_Sprint_0_Plan.md

## Sprint 1 Success Criteria

Sprint 1 is successful when:

- Authentication is operational.
- Application is deployed.
- Database is connected.
- Initial RLS is active.
- Users can create and edit profiles.
- Users can create or join private groups.
- Navigation and app shell exist.
- Testing and deployment workflows exist.
- Documentation reflects implementation.
- No out-of-scope product systems were implemented.

## Sprint 1 Review Requirements

At the end of Sprint 1, the Product Manager should:

- Review implementation against tickets.
- Update documentation.
- Record architectural decisions.
- Identify technical debt.
- Generate Sprint 2 implementation tickets.
- Recommend priorities for Sprint 2.
