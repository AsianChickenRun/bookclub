# Sprint 1 Database Readiness Review

Status: Draft pending PM approval

Owner: Database Architecture specialist

Do not sync this document to GitHub until the Product Manager reviews and approves it.

## Review Scope

This review compares the current scaffolded database files against:

- `12_Database_Architecture.md`
- `32_Sprint_1_Database_Checklist.md`

Files inspected:

- `supabase/migrations/202606150001_sprint1_foundation.sql`
- `supabase/migrations/202606150002_sprint2_reading_foundation.sql`
- `src/types/database.ts`
- `src/lib/supabase/browser.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/env.ts`
- `src/lib/mock-app-state.ts`

No production code was modified for this review.

## Readiness Summary

Sprint 1 database implementation is partially ready, but not ready to treat as approved without RLS and workflow hardening.

The migration creates the expected core Sprint 1 tables:

- `profiles`
- `groups`
- `group_members`

It also enables RLS, creates core helper functions, adds group workflow RPCs, and includes basic indexes. That is the right foundation.

However, several checklist items are missing or risky:

- Profile visibility does not allow group members to read each other's profiles.
- A user can likely update their own `group_members` row into a higher role because the update policy is too broad.
- Invite codes are generated as lowercase hex while checklist guidance expects normalized uppercase codes and format validation.
- Removed users can rejoin through `join_group_by_invite`.
- `updated_at` triggers are missing.
- Some integrity constraints and indexes from the checklist are missing.
- Function execution permissions are not explicitly constrained.

Recommendation: do not mark Sprint 1 database complete until the high-priority RLS and workflow risks below are fixed or explicitly accepted by the PM.

## Migration Readiness

### Present And Aligned

The Sprint 1 migration includes:

- `pgcrypto` extension.
- `profiles` table.
- `groups` table.
- `group_members` table.
- RLS enabled on all three Sprint 1 tables.
- `is_group_member(target_group_id uuid)`.
- `is_group_admin(target_group_id uuid)`.
- `create_group(group_name text, group_description text default null)`.
- `join_group_by_invite(invite text)`.
- Indexes on:
  - `groups(owner_id)`
  - `group_members(user_id, status)`
  - `group_members(group_id, status)`
- Basic profile self-read/self-insert/self-update policies.
- Group member read policy.
- Admin group update policy.

### Missing Or Incomplete

Compared with `32_Sprint_1_Database_Checklist.md`:

- `profiles_display_name_length` uses `char_length(display_name)` instead of trimmed display name.
- `profiles_bio_length` constraint is missing.
- `groups_description_length` constraint is missing.
- `groups_invite_code_format` constraint is missing.
- `groups.owner_id` uses `on delete cascade`; checklist recommends `on delete restrict`.
- `group_members_last_seen_after_join` constraint is missing.
- `set_updated_at()` trigger function is missing.
- `updated_at` triggers are not attached to `profiles` or `groups`.
- `owns_profile(user_id uuid)` helper is missing.
- `is_group_owner(group_id uuid)` helper is missing.
- `profiles_display_name_idx` is missing.
- Partial unique invite-code index is missing, though the table-level `unique` constraint creates uniqueness.
- `group_members_one_active_owner_per_group` index is missing.
- `force row level security` is not enabled. This is optional, but should be decided intentionally.

### Scope Note

The repository already contains `202606150002_sprint2_reading_foundation.sql`, which creates `books`, `user_books`, and `reading_logs`. That is beyond Sprint 1, but it aligns with the accepted Sprint 2 direction in `43_Sprint_2_Review.md`.

For Sprint 1 readiness, the extra Sprint 2 migration should be treated as separate work and should not be used to claim Sprint 1 database approval.

## RLS Risks

### High: Users Can Potentially Promote Their Own Membership

Current policy:

```sql
create policy "Admins can update memberships"
on public.group_members
for update
using (public.is_group_admin(group_id) or auth.uid() = user_id)
with check (public.is_group_admin(group_id) or auth.uid() = user_id);
```

Risk:

- Any user updating their own membership may be able to change `role` to `admin` or `owner`.
- Any user may be able to reactivate their own membership or change status in ways that should be controlled.

Recommended fix:

- Remove broad self-update.
- Add a dedicated leave-group RPC or a constrained policy that only allows `status = 'left'` while preserving the existing role.
- Keep role changes admin-only or defer them entirely.

### High: Group Member Profiles Are Not Readable

Current `profiles` select policy allows only:

- user reads own profile.

Checklist expects:

- user reads own profile.
- active group members can read profiles for other active members in the same group.

Risk:

- Group member lists cannot safely show display names/avatar data through RLS.
- Frontend may be tempted to use service-role access for ordinary group UI, which would be the wrong boundary.

Recommended fix:

- Add the group-member profile read policy from `32_Sprint_1_Database_Checklist.md`.

### High: Removed Members Can Rejoin

Current `join_group_by_invite`:

```sql
on conflict (group_id, user_id)
do update set status = 'active'
```

Risk:

- Users with `removed` status can rejoin with the invite code.
- This weakens private group control.

Recommended fix:

- If existing status is `removed`, return a generic forbidden error.
- If existing status is `left`, decide whether rejoin is allowed. This needs PM approval.

### Medium: Invite Code Normalization Is Incomplete

Current `create_group` generates:

```sql
encode(gen_random_bytes(6), 'hex')
```

Risk:

- Produces lowercase hex.
- No format constraint.
- `join_group_by_invite` does not normalize input.
- UX likely expects human-entered invite codes that tolerate case and whitespace.

Recommended fix:

- Normalize generated invite code to uppercase.
- Normalize input in `join_group_by_invite`.
- Add a format constraint such as `^[A-Z0-9]{6,12}$`.

### Medium: Workflow Functions Need Explicit Grants

Risk:

- Supabase/Postgres function execute permissions can be broader than intended if not explicitly revoked/granted.

Recommended fix:

- Revoke execute from `public` where appropriate.
- Grant execute to `authenticated` for `create_group` and `join_group_by_invite`.
- Confirm anonymous users cannot execute these workflows successfully.

### Medium: Group Creation Does Not Trim Or Validate Inputs Before Insert

Risk:

- Whitespace-only names may pass or fail inconsistently because constraints do not trim.
- Descriptions are unconstrained.

Recommended fix:

- Trim `group_name`.
- Reject blank names.
- Add description length constraint.

### Medium: Sprint 2 Reading Logs Permit Group-Visible Insert Without Membership Check

Current Sprint 2 insert policy:

```sql
create policy "Users can create own reading logs"
on public.reading_logs
for insert
with check (auth.uid() = user_id);
```

Risk:

- A user may insert a `visibility = 'groups'` log with any `group_id`.

Recommended future fix:

- For group-visible logs, require `group_id is not null and public.is_group_member(group_id)`.
- For private logs, allow `group_id` to be null or ignored.

This is outside strict Sprint 1 scope, but it matters before Sprint 2/Sprint 3 Supabase-backed usage.

## Backend Boundary Readiness

Supabase client scaffolding exists:

- `createSupabaseBrowserClient()`
- `createSupabaseServerClient()`
- environment helper for anon-key URL configuration

Current boundary is acceptable for scaffold readiness:

- Browser client uses anon key only.
- Server client uses anon key plus cookies, which preserves user-session RLS.
- No service-role helper was found, which is good for Sprint 1 unless an approved server-only operation needs it.

Readiness gap:

- Database workflow functions exist, but there are no inspected server actions binding the UI flows to `create_group` or `join_group_by_invite`.
- The current app still uses local mock state for profile/group flows.

Recommendation:

- Keep local mock flows for prototype work, but do not call Sprint 1 database complete until real auth plus database-backed profile/group smoke tests pass.

## Next Implementation Tasks

### P0 Before Sprint 1 Database Approval

- Tighten `group_members` update policy so users cannot promote themselves.
- Add group-member profile visibility policy.
- Normalize invite-code generation and lookup.
- Block removed users from invite-code rejoin unless PM approves otherwise.
- Add `updated_at` trigger function and attach it to `profiles` and `groups`.
- Add missing constraints for trimmed profile names, bio length, group description length, invite-code format, and `last_seen_at`.
- Add or explicitly defer `group_members_one_active_owner_per_group`.
- Add explicit function grants for group workflow functions.
- Run RLS verification cases from `32_Sprint_1_Database_Checklist.md`.

### P1 Before Supabase-Backed Sprint 2/3 Usage

- Tighten `reading_logs` insert policy for group-visible logs.
- Add `updated_at` trigger to `user_books`.
- Decide whether `reading_logs.visibility` should default to `private` or `groups`. Sprint 2 migration defaults to `private`; `12_Database_Architecture.md` originally suggested `groups`.
- Decide whether page/chapter check-ins represent amount read or absolute progress point, then align migration, local state, and UI copy.
- Add local or automated tests for invalid invite code, non-member group read, and member profile read.

### P2 Cleanup

- Add `profiles_display_name_idx` only if profile search or member-list sorting needs it.
- Consider `force row level security` after workflow functions are confirmed safe.
- Consider splitting admin membership-management functions later instead of allowing broad table updates.

## Suggested PM Decision Points

- Should `groups.owner_id` use `on delete restrict` as the checklist says, or keep `on delete cascade` for account cleanup?
- Should users who voluntarily leave a group be allowed to rejoin with an invite code?
- Should removed users be permanently blocked from invite-code rejoin?
- Should group owner transfer remain out of scope through Sprint 3?
- Should Sprint 2/3 Supabase work proceed only after Sprint 1 RLS hardening is complete?

## Readiness Call

Draft recommendation:

- Sprint 1 database is structurally started.
- Sprint 1 database is not yet approval-ready.
- The highest-risk blocker is the `group_members` update policy.
- The second blocker is missing group-member profile visibility.
- The implementation should complete the P0 tasks before PM accepts database readiness.

