# Cocoberry

_Naturally Radiant, Beautifully You_ — a premium beauty e-commerce storefront built with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase.

**Phase 1 scope:** storefront, auth, cart, checkout (UI-only payment selection), wishlist, reviews, and a minimal account page. **Phase 2** adds an admin dashboard (Products/Categories/Orders/Coupons management with image upload). Customer order-history dashboard, blog/CMS, and a real payment gateway are deferred to later phases.

## 1. Install dependencies

```bash
npm install
```

## 2. Create your Supabase project

1. Create a new project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, open **SQL Editor** and run the files in this repo **in order**:
   - `supabase/migrations/0001_init.sql` — creates all tables, RLS policies, the `handle_new_user` trigger, and the `validate_coupon` function.
   - `supabase/migrations/0002_admin.sql` — adds the `is_admin()` helper, admin RLS policies for Products/Categories/Orders/Coupons, and the `product-images` storage bucket used by the admin dashboard.
   - `supabase/seed.sql` — seeds 5 categories, the 2 real Cocoberry products, ~10 placeholder products, sample coupon codes, and sample reviews.
3. Go to **Project Settings → API** and copy the **Project URL** and **anon public key**.

## 3. Configure environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 4. (Optional) Enable Google / Facebook sign-in

In the Supabase dashboard under **Authentication → Providers**, enable Google and/or Facebook and supply their OAuth client ID/secret. Set each provider's redirect URI to:

```
https://your-project.supabase.co/auth/v1/callback
```

The app's own OAuth callback route (`app/auth/callback/route.ts`) handles the rest — no extra config needed there. If you skip this step, email/password sign-in still works fully; the social buttons will just error if clicked.

## 5. Add the real product photos

Save the two product photos into `public/images/products/` using these exact filenames (referenced by `supabase/seed.sql`):

- `cocoberry-body-soap.jpg`
- `cocoberry-face-body-lotion.jpg`

Placeholder products use the existing category illustrations in `public/images/categories/` and need no extra files.

## 6. Make your account an admin

There is no self-serve "become admin" button by design. After signing up normally, go to the Supabase dashboard's **SQL Editor** and run (once):

```sql
update public.profiles set role = 'admin' where email = 'your-account-email@example.com';
```

Log out and back in (or refresh), then visit `/admin` — an admin icon also appears in the header.

## 7. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Manual test checklist

- Home → Shop (search, category/price filters, sort, pagination) → Category page → Product page (add to cart, toggle wishlist, submit a review) → Cart (change qty, apply a seeded coupon code) → Checkout as a signed-in user → Confirmation page → confirm the order row landed in Supabase's `orders`/`order_items` tables.
- Sign up, log in, log out, forgot/reset password.
- Confirm `/checkout`, `/wishlist`, and `/account` redirect to `/login` when signed out.
- Resize to mobile width and check the mobile nav, cart drawer, and checkout flow.
- As an admin: visit `/admin`, create/edit/delete a product (with an uploaded image), a category, and a coupon; open an order and update its status/payment status.
- As a non-admin signed-in user, confirm `/admin` redirects to `/`; signed out, confirm it redirects to `/login`.

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (DB/Auth) · Zustand · TanStack Query · React Hook Form + Zod · Framer Motion · Lucide React
