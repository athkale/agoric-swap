-- Reset Database Schema
drop schema public cascade;
create schema public;

-- Grant Privileges
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all functions in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;

-- Enable Required Extensions
create extension if not exists "uuid-ossp";      -- For UUID generation
create extension if not exists "pgcrypto";       -- For encryption functions
create extension if not exists "pgjwt";          -- For JWT handling

-- Create Custom Types
create type credential_status as enum ('pending', 'verified', 'rejected');
create type notification_type as enum ('credential_issued', 'credential_verified', 'time_capsule_unlocked', 'profile_updated');
create type transaction_type as enum ('send', 'receive', 'stake', 'unstake', 'claim');
create type transaction_status as enum ('pending', 'completed', 'failed');

-- Create Tables
create table profiles (
    id uuid primary key default uuid_generate_v4(),
    wallet_address text unique not null,
    username text unique,
    email text,
    full_name text,
    bio text,
    avatar_url text,
    reputation_score integer default 0,
    is_verified boolean default false,
    verification_date timestamptz,
    last_login timestamptz,
    social_links jsonb default '{}',
    preferences jsonb default '{}',
    metadata jsonb default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table credentials (
    id uuid primary key default uuid_generate_v4(),
    profile_id uuid references profiles(id) on delete cascade,
    issuer text not null,
    holder text not null,
    type text not null,
    title text not null,
    description text,
    data jsonb,
    category text,
    tags text[],
    image_url text,
    chain_id integer,
    signature text not null,
    message text not null,
    expiry_date timestamptz,
    issuance_date timestamptz default now(),
    verification_status credential_status default 'pending',
    verification_count integer default 0,
    last_verified timestamptz,
    is_revoked boolean default false,
    revocation_reason text,
    parent_credential_id uuid references credentials(id),
    blockchain_tx_hash text,
    metadata jsonb default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table verifications (
    id uuid primary key default uuid_generate_v4(),
    credential_id uuid references credentials(id) on delete cascade,
    verifier_id uuid references profiles(id) on delete cascade,
    status credential_status not null,
    signature text,
    chain_id integer,
    blockchain_tx_hash text,
    metadata jsonb default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table time_capsules (
    id uuid primary key default uuid_generate_v4(),
    creator_id uuid references profiles(id) on delete cascade,
    title text not null,
    description text,
    content text,
    unlock_date timestamptz not null,
    is_unlocked boolean default false,
    unlock_conditions jsonb default '{}',
    recipients text[] not null,
    attachments jsonb[],
    encryption_key text,
    chain_id integer,
    blockchain_tx_hash text,
    metadata jsonb default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table wallet_history (
    id uuid primary key default uuid_generate_v4(),
    profile_id uuid references profiles(id) on delete cascade,
    wallet_address text not null,
    transaction_type transaction_type not null,
    amount numeric not null,
    token_address text,
    token_symbol text,
    chain_id integer not null,
    transaction_hash text unique not null,
    status transaction_status default 'pending',
    gas_fee numeric,
    block_number bigint,
    metadata jsonb default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table notifications (
    id uuid primary key default uuid_generate_v4(),
    profile_id uuid references profiles(id) on delete cascade,
    type notification_type not null,
    title text not null,
    message text not null,
    read boolean default false,
    action_url text,
    metadata jsonb default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table activity_logs (
    id uuid primary key default uuid_generate_v4(),
    profile_id uuid references profiles(id) on delete cascade,
    action text not null,
    entity_type text not null,
    entity_id uuid not null,
    ip_address text,
    user_agent text,
    metadata jsonb default '{}',
    created_at timestamptz default now()
);

-- Create Indexes
create index idx_profiles_wallet on profiles(wallet_address);
create index idx_profiles_username on profiles(username);
create index idx_credentials_profile on credentials(profile_id);
create index idx_credentials_issuer on credentials(issuer);
create index idx_credentials_holder on credentials(holder);
create index idx_credentials_type on credentials(type);
create index idx_credentials_status on credentials(verification_status);
create index idx_verifications_credential on verifications(credential_id);
create index idx_verifications_verifier on verifications(verifier_id);
create index idx_capsules_creator on time_capsules(creator_id);
create index idx_capsules_unlock_date on time_capsules(unlock_date);
create index idx_wallet_profile on wallet_history(profile_id);
create index idx_wallet_address on wallet_history(wallet_address);
create index idx_wallet_tx_hash on wallet_history(transaction_hash);
create index idx_notifications_profile on notifications(profile_id);
create index idx_activity_profile on activity_logs(profile_id);
create index idx_activity_entity on activity_logs(entity_type, entity_id);

-- Create Functions
create or replace function handle_auth_user_created()
returns trigger as $$
begin
    insert into profiles (wallet_address, username)
    values (
        new.raw_user_meta_data->>'wallet_address',
        'user_' || substr(new.raw_user_meta_data->>'wallet_address', 3, 8)
    );
    return new;
end;
$$ language plpgsql security definer;

create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create or replace function create_notification(
    p_profile_id uuid,
    p_type notification_type,
    p_title text,
    p_message text,
    p_action_url text default null,
    p_metadata jsonb default '{}'
)
returns void as $$
begin
    insert into notifications (profile_id, type, title, message, action_url, metadata)
    values (p_profile_id, p_type, p_title, p_message, p_action_url, p_metadata);
end;
$$ language plpgsql security definer;

create or replace function verify_credential(
    p_credential_id uuid,
    p_verifier_id uuid,
    p_status credential_status,
    p_signature text,
    p_metadata jsonb default '{}'
)
returns uuid as $$
declare
    v_verification_id uuid;
begin
    insert into verifications (credential_id, verifier_id, status, signature, metadata)
    values (p_credential_id, p_verifier_id, p_status, p_signature, p_metadata)
    returning id into v_verification_id;

    update credentials
    set verification_status = p_status,
        verification_count = verification_count + 1,
        last_verified = now()
    where id = p_credential_id;

    return v_verification_id;
end;
$$ language plpgsql security definer;

-- Create Triggers
create trigger handle_new_user
    after insert on auth.users
    for each row execute function handle_auth_user_created();

create trigger update_profiles_updated_at
    before update on profiles
    for each row execute function update_updated_at_column();

create trigger update_credentials_updated_at
    before update on credentials
    for each row execute function update_updated_at_column();

create trigger update_verifications_updated_at
    before update on verifications
    for each row execute function update_updated_at_column();

create trigger update_time_capsules_updated_at
    before update on time_capsules
    for each row execute function update_updated_at_column();

create trigger update_wallet_history_updated_at
    before update on wallet_history
    for each row execute function update_updated_at_column();

create trigger update_notifications_updated_at
    before update on notifications
    for each row execute function update_updated_at_column();

-- Enable Row Level Security
alter table profiles enable row level security;
alter table credentials enable row level security;
alter table verifications enable row level security;
alter table time_capsules enable row level security;
alter table wallet_history enable row level security;
alter table notifications enable row level security;
alter table activity_logs enable row level security;

-- Create Policies
-- Profiles
create policy "Public profiles are viewable by everyone"
    on profiles for select using (true);

create policy "Users can insert their own profile"
    on profiles for insert with check (wallet_address = auth.jwt()->>'sub');

create policy "Users can update own profile"
    on profiles for update using (wallet_address = auth.jwt()->>'sub');

-- Credentials
create policy "Credentials are viewable by everyone"
    on credentials for select using (true);

create policy "Users can create credentials"
    on credentials for insert with check (issuer = auth.jwt()->>'sub');

create policy "Credential owners can update"
    on credentials for update using (issuer = auth.jwt()->>'sub');

create policy "Credential owners can delete"
    on credentials for delete using (issuer = auth.jwt()->>'sub');

-- Verifications
create policy "Verifications are viewable by everyone"
    on verifications for select using (true);

create policy "Verified users can create verifications"
    on verifications for insert
    with check (exists (
        select 1 from profiles
        where id = verifier_id 
        and wallet_address = auth.jwt()->>'sub'
        and is_verified = true
    ));

-- Time Capsules
create policy "Time capsules viewable by creator and recipients"
    on time_capsules for select
    using (
        auth.jwt()->>'sub' = any(recipients)
        or exists (
            select 1 from profiles
            where id = creator_id
            and wallet_address = auth.jwt()->>'sub'
        )
    );

create policy "Users can create time capsules"
    on time_capsules for insert
    with check (exists (
        select 1 from profiles
        where id = creator_id
        and wallet_address = auth.jwt()->>'sub'
    ));

-- Wallet History
create policy "Users can view own wallet history"
    on wallet_history for select
    using (wallet_address = auth.jwt()->>'sub');

create policy "Users can create wallet history"
    on wallet_history for insert
    with check (wallet_address = auth.jwt()->>'sub');

-- Notifications
create policy "Users can view own notifications"
    on notifications for select
    using (exists (
        select 1 from profiles
        where id = profile_id
        and wallet_address = auth.jwt()->>'sub'
    ));

create policy "Users can update own notifications"
    on notifications for update
    using (exists (
        select 1 from profiles
        where id = profile_id
        and wallet_address = auth.jwt()->>'sub'
    ));

-- Activity Logs
create policy "Users can view own activity logs"
    on activity_logs for select
    using (exists (
        select 1 from profiles
        where id = profile_id
        and wallet_address = auth.jwt()->>'sub'
    ));

-- Storage Setup
insert into storage.buckets (id, name, public)
values 
    ('avatars', 'avatars', true),
    ('credentials', 'credentials', true),
    ('time_capsules', 'time_capsules', false)
on conflict (id) do nothing;

-- Storage Policies
create policy "Avatar images are publicly accessible"
    on storage.objects for select
    using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar"
    on storage.objects for insert
    with check (bucket_id = 'avatars');

create policy "Credential images are publicly accessible"
    on storage.objects for select
    using (bucket_id = 'credentials');

create policy "Anyone can upload credential images"
    on storage.objects for insert
    with check (bucket_id = 'credentials');

create policy "Time capsule files accessible to creator and recipients"
    on storage.objects for select
    using (
        bucket_id = 'time_capsules'
        and exists (
            select 1 from time_capsules tc
            where 
                split_part(storage.foldername(name)::text, '/', 1) = tc.id::text
                and (
                    auth.jwt()->>'sub' = any(tc.recipients)
                    or exists (
                        select 1 from profiles
                        where id = tc.creator_id
                        and wallet_address = auth.jwt()->>'sub'
                    )
                )
        )
    );
