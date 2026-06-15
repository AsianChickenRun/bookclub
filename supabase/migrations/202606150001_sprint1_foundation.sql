create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  bio text,
  favorite_genres text[] not null default '{}',
  timezone text not null default 'America/New_York',
  total_xp integer not null default 0,
  current_streak_days integer not null default 0,
  longest_streak_days integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (char_length(display_name) between 1 and 80),
  constraint profiles_total_xp_non_negative check (total_xp >= 0),
  constraint profiles_current_streak_non_negative check (current_streak_days >= 0),
  constraint profiles_longest_streak_non_negative check (longest_streak_days >= 0)
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  invite_code text unique,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint groups_name_length check (char_length(name) between 1 and 100)
);

create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member',
  status text not null default 'active',
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz,
  constraint group_members_group_user_unique unique (group_id, user_id),
  constraint group_members_role_check check (role in ('owner', 'admin', 'member')),
  constraint group_members_status_check check (status in ('invited', 'active', 'left', 'removed'))
);

create index if not exists groups_owner_id_idx on public.groups(owner_id);
create index if not exists group_members_user_status_idx on public.group_members(user_id, status);
create index if not exists group_members_group_status_idx on public.group_members(group_id, status);

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;

create or replace function public.is_group_member(target_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.group_members gm
    where gm.group_id = target_group_id
      and gm.user_id = auth.uid()
      and gm.status = 'active'
  );
$$;

create or replace function public.is_group_admin(target_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.group_members gm
    where gm.group_id = target_group_id
      and gm.user_id = auth.uid()
      and gm.status = 'active'
      and gm.role in ('owner', 'admin')
  );
$$;

create or replace function public.create_group(group_name text, group_description text default null)
returns public.groups
language plpgsql
security definer
set search_path = public
as $$
declare
  created_group public.groups;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  insert into public.groups (name, description, owner_id, invite_code)
  values (
    group_name,
    group_description,
    auth.uid(),
    encode(gen_random_bytes(6), 'hex')
  )
  returning * into created_group;

  insert into public.group_members (group_id, user_id, role, status)
  values (created_group.id, auth.uid(), 'owner', 'active');

  return created_group;
end;
$$;

create or replace function public.join_group_by_invite(invite text)
returns public.group_members
language plpgsql
security definer
set search_path = public
as $$
declare
  target_group public.groups;
  created_membership public.group_members;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select *
  into target_group
  from public.groups
  where invite_code = invite
    and is_archived = false;

  if target_group.id is null then
    raise exception 'Invalid invite code';
  end if;

  insert into public.group_members (group_id, user_id, role, status)
  values (target_group.id, auth.uid(), 'member', 'active')
  on conflict (group_id, user_id)
  do update set status = 'active'
  returning * into created_membership;

  return created_membership;
end;
$$;

create policy "Users can read their own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Members can read active groups"
on public.groups
for select
using (public.is_group_member(id));

create policy "Admins can update groups"
on public.groups
for update
using (public.is_group_admin(id))
with check (public.is_group_admin(id));

create policy "Members can read group memberships"
on public.group_members
for select
using (public.is_group_member(group_id) or auth.uid() = user_id);

create policy "Admins can create membership rows"
on public.group_members
for insert
with check (public.is_group_admin(group_id));

create policy "Admins can update memberships"
on public.group_members
for update
using (public.is_group_admin(group_id) or auth.uid() = user_id)
with check (public.is_group_admin(group_id) or auth.uid() = user_id);
