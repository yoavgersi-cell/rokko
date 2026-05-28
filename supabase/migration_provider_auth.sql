-- ============================================================
-- Provider Auth Migration
-- Run this in your Supabase SQL editor AFTER migration.sql
-- ============================================================

-- 1. providers — created after application approval
-- ──────────────────────────────────────────────────
create table if not exists providers (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete set null,
  application_id   uuid references provider_applications(id),
  full_name        text not null,
  business_name    text,
  email            text not null,
  phone            text,
  whatsapp         text,
  city             text,
  service_areas    text,
  services         text[] default '{}',
  description      text,
  media_urls       text[] default '{}',
  social_instagram text,
  social_facebook  text,
  social_website   text,
  public_profile_data jsonb default '{}',
  status           text not null default 'approved',
  is_published     boolean default false,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create trigger set_providers_updated_at
before update on providers
for each row execute function set_updated_at();

-- 2. provider_invites — secure one-time links
-- ────────────────────────────────────────────
create table if not exists provider_invites (
  id          uuid primary key default gen_random_uuid(),
  provider_id uuid not null references providers(id) on delete cascade,
  email       text not null,
  token       text not null unique,
  expires_at  timestamptz not null,
  used_at     timestamptz,
  created_at  timestamptz default now()
);

-- 3. provider_leads — incoming requests from users
-- ─────────────────────────────────────────────────
create table if not exists provider_leads (
  id              uuid primary key default gen_random_uuid(),
  provider_id     uuid not null references providers(id) on delete cascade,
  customer_name   text,
  customer_phone  text,
  customer_email  text,
  service_type    text,
  message         text,
  status          text default 'new',
  created_at      timestamptz default now()
);

-- ── RLS ─────────────────────────────────────────────────────

alter table providers      enable row level security;
alter table provider_invites enable row level security;
alter table provider_leads   enable row level security;

-- Service role has full access (used by all server-side routes)
create policy "service_role_providers" on providers
  for all using (auth.role() = 'service_role');

create policy "service_role_invites" on provider_invites
  for all using (auth.role() = 'service_role');

create policy "service_role_leads" on provider_leads
  for all using (auth.role() = 'service_role');

-- Authenticated providers can read/update their own record
create policy "provider_select_own" on providers
  for select using (auth.uid() = user_id);

create policy "provider_update_own" on providers
  for update using (auth.uid() = user_id);

-- Authenticated providers can read their own leads
create policy "provider_leads_own" on provider_leads
  for select using (
    exists (
      select 1 from providers
      where providers.id = provider_id
        and providers.user_id = auth.uid()
    )
  );
