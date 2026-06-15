# Technical Architecture

Status: Draft
Version: 0.1
Owner: Product Manager

## Architecture Goal

Reading Momentum should start as a mobile-first web application that is simple to build, easy to deploy, secure by default, and flexible enough to support future social reading systems.

Sprint 1 should establish the technical foundation without implementing advanced product systems.

## Recommended Stack

- Frontend: Next.js
- Language: TypeScript
- Styling: Tailwind CSS
- Backend/data: Supabase
- Database: PostgreSQL through Supabase
- Authentication: Supabase Auth
- Storage: Supabase Storage for profile images later
- Deployment: Vercel
- Email: Resend, later
- Analytics: PostHog, later
- AI: OpenAI API, later

## Application Structure

Recommended high-level structure:

```text
app/
  (auth)/
  (app)/
  api/
components/
  ui/
  layout/
  forms/
  reading/
  groups/
lib/
  supabase/
  auth/
  validation/
  utils/
types/
supabase/
  migrations/
docs/
```

Sprint 1 should create the structure, but only fill what is needed for auth, profiles, group foundation, navigation, and placeholders.

## Frontend Architecture

Use server-rendered routes where practical and client components where interaction requires local state.

Sprint 1 route groups:

- Auth routes for login and signup
- App routes for authenticated shell
- Profile route
- Group route placeholder
- Books route placeholder
- Reading route placeholder
- Review route placeholder
- Settings route

UI requirements:

- Mobile-first layout
- Bottom navigation on mobile
- Clear loading states
- Clear error states
- Accessible labels and focus states

## Backend Architecture

Supabase should handle authentication, database access, and RLS-protected user data.

Use trusted server logic for operations that:

- Touch multiple tables
- Award XP
- Calculate scores
- Generate invite codes
- Use service-role privileges
- Call external APIs
- Trigger AI or email systems

Sprint 1 should scaffold backend boundaries but avoid advanced business logic.

## Supabase Architecture

Sprint 1 tables:

- `profiles`
- `groups`
- `group_members`

Sprint 2 likely adds:

- `books`
- `user_books`
- `reading_logs`
- `activities`

All application tables should have RLS enabled.

## Authentication Strategy

Supabase Auth is the source of authentication.

Sprint 1 requirements:

- Sign up
- Log in
- Log out
- Auth-protected app shell
- Profile creation after first login
- Predictable redirects

## Authorization Strategy

Authorization should be enforced in the database using RLS and supported by app-level checks.

Core rules:

- Users can manage their own profile.
- Active group members can read group content.
- Group owners/admins can manage membership.
- Non-members cannot view private group content.

## Environment Strategy

Required environment variables should be documented in an example file without secrets.

Likely variables:

- Supabase URL
- Supabase anon key
- Supabase service role key, server-only when needed
- App URL
- PostHog key, later
- Resend key, later
- OpenAI API key, later

## Deployment Strategy

Use Vercel for the first deployed web application.

Deployment requirements:

- Main branch deploys to production or preview as configured.
- Environment variables are set in Vercel.
- Production URL is recorded in docs.
- Build and lint checks run before release when CI exists.

## Deferred Systems

Do not implement in Sprint 1:

- Reading Momentum scoring
- XP
- Achievements
- Leaderboards
- AI prompts
- Reviews
- Notifications
- Book of the Month
- Recommendation engine
- Advanced analytics

## Sprint 1 Architecture Acceptance Criteria

Sprint 1 architecture is acceptable when:

- App runs locally.
- App deploys successfully.
- Auth works end to end.
- Supabase connection works.
- Initial RLS protects profiles and groups.
- App shell supports future pages.
- Testing and linting are configured.
- Documentation explains setup and workflow.

