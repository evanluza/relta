-- Run this in your Supabase SQL Editor

-- Creators table
create table public.creators (
  id uuid default gen_random_uuid() primary key,
  wallet_address text unique not null,
  username text unique not null,
  created_at timestamptz default now()
);

-- Links table
create table public.links (
  id uuid default gen_random_uuid() primary key,
  creator_id uuid references public.creators(id) on delete cascade not null,
  type text check (type in ('tip', 'pay', 'download')) not null,
  title text not null,
  description text,
  price numeric,
  file_url text,
  slug text not null,
  created_at timestamptz default now(),
  unique(creator_id, slug)
);

-- Transactions table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  link_id uuid references public.links(id) on delete set null,
  buyer_wallet text not null,
  amount numeric not null,
  platform_fee numeric not null,
  tx_hash text unique not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.creators enable row level security;
alter table public.links enable row level security;
alter table public.transactions enable row level security;

-- Public read policies
create policy "Public read creators" on public.creators for select using (true);
create policy "Public read links" on public.links for select using (true);
create policy "Public read transactions" on public.transactions for select using (true);

-- Indexes
create index idx_links_creator_id on public.links(creator_id);
create index idx_links_slug on public.links(slug);
create index idx_transactions_link_id on public.transactions(link_id);
create index idx_creators_username on public.creators(username);
create index idx_creators_wallet on public.creators(wallet_address);

-- Storage bucket for downloads (create via Supabase Dashboard > Storage > New Bucket)
-- Name: downloads
-- Public: false
