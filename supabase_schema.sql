-- ==============================================================================
-- PropertyNest Supabase Schema & Row-Level Security (RLS) Setup
-- Run this in your Supabase Project's SQL Editor (Dashboard > SQL Editor > New Query)
-- ==============================================================================

-- 1. Profiles table (mirrors auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text,
  phone text default '',
  show_phone boolean default false,
  avatar_url text,
  role text default 'renter' check (role in ('renter', 'owner', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to automatically create a profile record when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, phone, show_phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce((new.raw_user_meta_data->>'show_phone')::boolean, false),
    coalesce(new.raw_user_meta_data->>'role', 'renter')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Properties table
create table if not exists public.properties (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id) on delete set null,
  title text not null,
  type text not null,
  status text not null default 'For Rent',
  price numeric not null,
  location text not null,
  area numeric not null,
  beds int default 1,
  baths int default 1,
  floor int default 1,
  furnishing text default 'Semi-Furnished',
  amenities text[] default '{}',
  images text[] default '{}',
  description text not null,
  rating numeric default 0,
  reviews int default 0,
  available boolean default true,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Favorites table
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, property_id)
);

-- 4. Conversations table
create table if not exists public.conversations (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Conversation Participants
create table if not exists public.conversation_participants (
  conversation_id uuid references public.conversations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  primary key (conversation_id, user_id)
);

-- 6. Messages table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  text text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- Row-Level Security (RLS) Policies
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.favorites enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;

-- Profiles: Anyone can view, owner can update their own
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Properties: Anyone can view, authenticated users can insert/update/delete
create policy "Properties are viewable by everyone" on public.properties
  for select using (true);

create policy "Authenticated users can create properties" on public.properties
  for insert with check (auth.uid() is not null);

create policy "Owners can update own properties" on public.properties
  for update using (auth.uid() = owner_id or owner_id is null);

create policy "Owners can delete own properties" on public.properties
  for delete using (auth.uid() = owner_id);

-- Favorites: Users can view, insert, delete own favorites
create policy "Users can view own favorites" on public.favorites
  for select using (auth.uid() = user_id);

create policy "Users can add favorites" on public.favorites
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own favorites" on public.favorites
  for delete using (auth.uid() = user_id);

-- Conversations & Messages
create policy "Participants can view conversations" on public.conversations
  for select using (
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = conversations.id and cp.user_id = auth.uid()
    )
  );

create policy "Participants can view conversation participants" on public.conversation_participants
  for select using (
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = conversation_participants.conversation_id and cp.user_id = auth.uid()
    )
  );

create policy "Authenticated users can join conversation" on public.conversation_participants
  for insert with check (auth.uid() = user_id);

create policy "Participants can view messages" on public.messages
  for select using (
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = messages.conversation_id and cp.user_id = auth.uid()
    )
  );

create policy "Participants can send messages" on public.messages
  for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = messages.conversation_id and cp.user_id = auth.uid()
    )
  );

-- ==============================================================================
-- Realtime Activation
-- ==============================================================================
alter publication supabase_realtime add table public.messages;

-- ==============================================================================
-- Seed Initial Sample Properties
-- ==============================================================================
insert into public.properties (title, type, status, price, location, area, beds, baths, floor, furnishing, amenities, images, description, rating, reviews, available, featured)
values
(
  'Modern 2BR Apartment in Gulshan',
  'Apartment',
  'For Rent',
  35000,
  'Gulshan, Dhaka',
  1200,
  2,
  2,
  5,
  'Semi-Furnished',
  array['Parking', 'AC', 'WiFi', 'Gym', 'Elevator', 'Security'],
  array[
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=500&fit=crop'
  ],
  'A beautifully designed 2-bedroom apartment in the heart of Gulshan. Enjoy modern interiors, high-speed WiFi, and a fully equipped gym.',
  4.7,
  18,
  true,
  true
),
(
  'Spacious Family House in Dhanmondi',
  'House',
  'For Rent',
  75000,
  'Dhanmondi, Dhaka',
  3200,
  4,
  3,
  1,
  'Furnished',
  array['Parking', 'Garden', 'AC', 'WiFi', 'Security', 'Generator'],
  array[
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=500&fit=crop'
  ],
  'Elegant 4-bedroom family home with a lush garden in Dhanmondi. Features generator backup and secure underground parking.',
  4.5,
  12,
  true,
  true
),
(
  'Luxury Flat for Sale – Uttara',
  'Apartment',
  'For Sale',
  8500000,
  'Uttara, Dhaka',
  1850,
  3,
  2,
  8,
  'Furnished',
  array['Parking', 'Pool', 'Gym', 'AC', 'Rooftop', 'Security', 'Elevator'],
  array[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop'
  ],
  'Premium 3-bedroom luxury flat on the 8th floor with panoramic city views and rooftop swimming pool.',
  4.9,
  7,
  true,
  true
),
(
  'Cozy Studio near Banani',
  'Studio',
  'For Rent',
  18000,
  'Banani, Dhaka',
  550,
  1,
  1,
  3,
  'Fully Furnished',
  array['AC', 'WiFi', 'Parking', 'Security'],
  array[
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop'
  ],
  'Fully furnished studio ideal for single professionals. Walking distance to Banani corporate hub.',
  4.3,
  22,
  true,
  false
),
(
  'Commercial Office Space – Motijheel',
  'Commercial',
  'For Rent',
  120000,
  'Motijheel, Dhaka',
  4500,
  0,
  4,
  6,
  'Unfurnished',
  array['Parking', 'Elevator', 'Generator', 'Security', 'WiFi'],
  array[
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop'
  ],
  'Prime commercial office space on the 6th floor of a modern building in Motijheel business district.',
  4.4,
  9,
  true,
  true
);
