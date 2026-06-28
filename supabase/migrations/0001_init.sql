-- Cocoberry Phase 1 schema, RLS policies, and supporting functions/triggers.
-- Run this in the Supabase SQL editor (or `supabase db push`) on a fresh project.

create extension if not exists "pgcrypto";

-- ============================================================
-- Tables
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  compare_price numeric(10, 2) check (compare_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  category_id uuid references public.categories (id) on delete set null,
  image_urls text[] not null default '{}',
  ingredients text,
  benefits text,
  usage text,
  is_featured boolean not null default false,
  is_best_seller boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal numeric(10, 2) not null,
  shipping_fee numeric(10, 2) not null default 0,
  discount numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'paid', 'refunded')),
  payment_method text not null,
  shipping_address jsonb not null,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  price numeric(10, 2) not null
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  province text not null,
  postal_code text not null,
  country text not null default 'Philippines',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10, 2) not null check (discount_value > 0),
  min_order_amount numeric(10, 2) not null default 0,
  max_uses integer,
  used_count integer not null default 0,
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================

create index products_category_id_idx on public.products (category_id);
create index products_is_featured_idx on public.products (is_featured) where is_featured;
create index products_is_best_seller_idx on public.products (is_best_seller) where is_best_seller;
create index orders_user_id_idx on public.orders (user_id);
create index order_items_order_id_idx on public.order_items (order_id);
create index addresses_user_id_idx on public.addresses (user_id);
create index reviews_product_id_idx on public.reviews (product_id);
create index wishlists_user_id_idx on public.wishlists (user_id);

-- ============================================================
-- New user -> profile trigger
-- ============================================================

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- updated_at trigger for products
-- ============================================================

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ============================================================
-- Coupon validation RPC (avoids exposing the coupons table to anon SELECT)
-- ============================================================

create function public.validate_coupon(coupon_code text, order_amount numeric)
returns table (valid boolean, message text, discount_amount numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  c public.coupons;
begin
  select * into c from public.coupons where lower(code) = lower(coupon_code);

  if c.id is null then
    return query select false, 'Invalid coupon code.', 0::numeric;
    return;
  end if;

  if not c.active then
    return query select false, 'This coupon is no longer active.', 0::numeric;
    return;
  end if;

  if c.expires_at is not null and c.expires_at < now() then
    return query select false, 'This coupon has expired.', 0::numeric;
    return;
  end if;

  if c.max_uses is not null and c.used_count >= c.max_uses then
    return query select false, 'This coupon has reached its usage limit.', 0::numeric;
    return;
  end if;

  if order_amount < c.min_order_amount then
    return query select false,
      format('Minimum order of %s required for this coupon.', c.min_order_amount::text),
      0::numeric;
    return;
  end if;

  if c.discount_type = 'percent' then
    return query select true, 'Coupon applied.', round(order_amount * c.discount_value / 100, 2);
  else
    return query select true, 'Coupon applied.', least(c.discount_value, order_amount);
  end if;
end;
$$;

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.addresses enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.coupons enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- profiles
create policy "Profiles are viewable by owner" on public.profiles
  for select using (auth.uid() = id);
create policy "Profiles are editable by owner" on public.profiles
  for update using (auth.uid() = id);

-- categories (public read-only)
create policy "Categories are viewable by everyone" on public.categories
  for select using (true);

-- products (public read-only)
create policy "Products are viewable by everyone" on public.products
  for select using (true);

-- orders
create policy "Users can view their own orders" on public.orders
  for select using (auth.uid() = user_id);
create policy "Users can create their own orders" on public.orders
  for insert with check (auth.uid() = user_id);

-- order_items (scoped through parent order)
create policy "Users can view items of their own orders" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "Users can add items to their own orders" on public.order_items
  for insert with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- addresses
create policy "Users can manage their own addresses" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- reviews (public read, owner write)
create policy "Reviews are viewable by everyone" on public.reviews
  for select using (true);
create policy "Users can create their own reviews" on public.reviews
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own reviews" on public.reviews
  for update using (auth.uid() = user_id);
create policy "Users can delete their own reviews" on public.reviews
  for delete using (auth.uid() = user_id);

-- wishlists
create policy "Users can manage their own wishlist" on public.wishlists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- coupons: no direct client access; validated only via validate_coupon() RPC
-- (no select/insert/update/delete policies -> all denied by default with RLS enabled)

-- newsletter_subscribers: anyone can subscribe, nobody can read back the list
create policy "Anyone can subscribe to the newsletter" on public.newsletter_subscribers
  for insert with check (true);
