-- Cocoberry Admin Dashboard: admin role helper, admin RLS policies, product image storage.
-- Run this in the Supabase SQL editor (or `psql -f`) after 0001_init.sql.

-- ============================================================
-- Admin helper function
-- ============================================================

create function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- Admin write access on products & categories
-- ============================================================

create policy "Admins can insert products" on public.products
  for insert with check (public.is_admin());
create policy "Admins can update products" on public.products
  for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete products" on public.products
  for delete using (public.is_admin());

create policy "Admins can insert categories" on public.categories
  for insert with check (public.is_admin());
create policy "Admins can update categories" on public.categories
  for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete categories" on public.categories
  for delete using (public.is_admin());

-- ============================================================
-- Admin visibility/management of orders & order_items
-- ============================================================

create policy "Admins can view all orders" on public.orders
  for select using (public.is_admin());
create policy "Admins can update orders" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

create policy "Admins can view all order items" on public.order_items
  for select using (public.is_admin());

-- ============================================================
-- Admin management of coupons (still no customer-facing access;
-- checkout continues to go through the security-definer validate_coupon RPC)
-- ============================================================

create policy "Admins can view coupons" on public.coupons
  for select using (public.is_admin());
create policy "Admins can insert coupons" on public.coupons
  for insert with check (public.is_admin());
create policy "Admins can update coupons" on public.coupons
  for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete coupons" on public.coupons
  for delete using (public.is_admin());

-- ============================================================
-- Product image storage bucket
-- ============================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Product images are publicly accessible" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "Admins can upload product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_admin());
create policy "Admins can update product images" on storage.objects
  for update using (bucket_id = 'product-images' and public.is_admin());
create policy "Admins can delete product images" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_admin());
