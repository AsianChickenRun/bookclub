# Security Model

Status: Draft
Version: 0.1
Owner: Product Manager

## Security Goal

Reading Momentum should protect private reading groups, personal profile data, and user-generated content while keeping the MVP simple enough to build and audit.

Security should be enforced through Supabase Auth, PostgreSQL Row Level Security, server-side trusted operations, and careful environment management.

## Core Security Principles

- Private group access must be enforced by the database, not only by UI.
- Users should only update their own profile and content unless granted a group role.
- Service-role operations must stay server-side.
- Spoiler protection is an experience control, not a security boundary.
- Secrets must never be committed to GitHub.
- MVP security should prefer simple, auditable rules over clever abstractions.

## Authentication

Supabase Auth should handle:

- Account creation
- Login
- Logout
- Session management
- Password or magic-link strategy, depending on Sprint 1 implementation choice

Sprint 1 auth acceptance:

- Unauthenticated users cannot access app routes.
- Authenticated users without profiles are routed to profile setup.
- Logout clears access to private app views.

## Authorization

Authorization should be based on:

- User identity
- Group membership
- Group role
- Content ownership
- Content visibility

Initial roles:

- Owner
- Admin
- Member

MVP membership statuses:

- Invited
- Active
- Left
- Removed

## Row Level Security

RLS should be enabled on every application table.

Sprint 1 RLS priorities:

- `profiles`: users can read/update their own profile; group profile visibility can be expanded carefully.
- `groups`: active members can read group records.
- `group_members`: active members can read their group membership list; owners/admins can manage membership.

Future RLS priorities:

- User books are private unless shared.
- Reading logs respect visibility.
- Group content is visible only to active members.
- Private reviews and reflections remain private.

## Trusted Server Operations

Use trusted server logic for workflows that should not be assembled directly from the client.

Examples:

- Create group and owner membership together.
- Join group by invite code.
- Generate or rotate invite codes.
- Award XP.
- Calculate Momentum scores.
- Send notifications.
- Call AI services.

## Privacy Model

Reading Momentum should distinguish between:

- Personal/private data
- Group-visible data
- Public data, not planned for MVP

MVP defaults should be conservative:

- Profiles are visible enough for group participation.
- Private check-ins should not enter group feeds.
- Group content should remain group-scoped.
- Users should see visibility before posting sensitive content.

## Spoiler Safety Versus Security

Spoiler locks help users avoid unwanted content, but they are not a hard privacy control.

Security:

- Prevents non-members from accessing private group content.

Spoiler UX:

- Hides or locks content from members who are behind progress.
- Allows intentional reveal.
- Depends on progress metadata and app rendering.

Product implication:

- Never rely on spoiler fields to protect private data.
- Do rely on membership and visibility for actual access control.

## Invite And Membership Safety

Sprint 1 should support a simple private group foundation.

Recommended rules:

- Show group identity before joining.
- Generate invite codes server-side.
- Allow owners/admins to revoke or rotate invite codes later.
- Removed members cannot view private group content.
- Historical content behavior after leaving/removal must be documented before social features launch.

## Secrets And Environment Variables

Rules:

- No real secrets in GitHub.
- Use `.env.example` for required variables.
- Service-role keys are server-only.
- OpenAI, Resend, and analytics keys are deferred until their systems are implemented.
- Production secrets live in the deployment platform.

## Abuse And Trust Risks

Risks:

- Invite codes forwarded outside a friend group.
- Users posting spoilers in comments.
- Users creating fake reading logs.
- Users farming reactions or XP later.
- Users feeling exposed by default sharing.

Mitigations:

- Private group membership rules.
- Spoiler marking and reporting later.
- Scoring caps and source records.
- Visibility controls.
- Clear group ownership and member management.

## Sprint 1 Security Acceptance Criteria

- Auth gates app routes.
- RLS is enabled on initial tables.
- Users can only update their own profile.
- Non-members cannot view private group records.
- Group create/join uses controlled logic.
- Environment variables are documented without secrets.
- Service-role keys are not exposed to client code.

