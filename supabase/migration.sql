-- Run this in your Supabase SQL editor

create table if not exists provider_applications (
  id uuid default gen_random_uuid() primary key,
  provider_type text not null,
  full_name text not null,
  business_name text,
  phone text not null,
  whatsapp text,
  email text not null,
  city text not null,
  service_areas text,
  description text,
  experience_years integer,
  social_instagram text,
  social_facebook text,
  social_website text,
  category_data jsonb default '{}'::jsonb,
  notes text,
  status text not null default 'pending',
  -- UTM / attribution
  utm_type text,
  utm_source text,
  utm_campaign text,
  utm_owner text,
  -- timestamps
  submitted_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists admin_notes (
  id uuid default gen_random_uuid() primary key,
  application_id uuid references provider_applications(id) on delete cascade,
  note text not null,
  created_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_trigger
before update on provider_applications
for each row execute function set_updated_at();

-- Row level security
alter table provider_applications enable row level security;
alter table admin_notes enable row level security;

-- Public can insert (submit forms)
create policy "Allow public insert" on provider_applications
  for insert with check (true);

-- Only service role can read/update (admin dashboard uses service role)
create policy "Service role full access" on provider_applications
  for all using (auth.role() = 'service_role');

create policy "Service role full access notes" on admin_notes
  for all using (auth.role() = 'service_role');
