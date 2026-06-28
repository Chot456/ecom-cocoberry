-- Cocoberry Phase 1 seed data.
-- Run after 0001_init.sql. Safe to re-run on an empty/fresh database only
-- (categories.slug / products.slug / coupons.code are unique).

-- ============================================================
-- Categories
-- ============================================================

insert into public.categories (name, slug, description, image_url) values
  ('Skincare', 'skincare', 'Nourishing serums, lotions, and treatments for radiant, healthy skin.', '/images/categories/skincare.svg'),
  ('Makeup', 'makeup', 'Berry-tinted color cosmetics for a soft, natural glow.', '/images/categories/makeup.svg'),
  ('Hair Care', 'hair-care', 'Coconut-infused shampoos, conditioners, and treatments.', '/images/categories/hair-care.svg'),
  ('Body Care', 'body-care', 'Gentle cleansers, butters, and mists for soft, glowing skin.', '/images/categories/body-care.svg'),
  ('Beauty Bundles', 'beauty-bundles', 'Curated sets that bundle Cocoberry favorites at a better price.', '/images/categories/beauty-bundles.svg');

-- ============================================================
-- Real Cocoberry products
-- ============================================================

insert into public.products
  (name, slug, description, price, compare_price, stock, category_id, image_urls, ingredients, benefits, usage, is_featured, is_best_seller, created_at)
values
  (
    'Cocoberry Body Soap',
    'cocoberry-body-soap',
    'Lather, rinse, glow. Cocoberry Body Soap blends nourishing coconut extract with antioxidant-rich berries to gently cleanse while restoring your skin''s natural radiance.',
    149.00, 179.00, 200,
    (select id from public.categories where slug = 'body-care'),
    array['/images/products/cocoberry-body-soap.jpg'],
    'Coconut Extract, Strawberry Extract, Glycerin, Sodium Cocoate, Vitamin E, Natural Fragrance',
    E'Deeply cleanses without stripping moisture\nBrightens and evens out skin tone\nLeaves skin soft, smooth, and lightly scented\nSuitable for daily use on face and body',
    'Wet skin with warm water. Lather the soap between hands or directly on skin, massage gently in circular motions, then rinse thoroughly. Use morning and night for best results.',
    true, true, now() - interval '40 days'
  ),
  (
    'Cocoberry Instant Whitening Face & Body Lotion',
    'cocoberry-face-body-lotion',
    'True essence of beauty in two weeks. Cocoberry Instant Whitening Face & Body Lotion is infused with Snailwhite Extract and SPF 50+ to brighten, smooth, and protect your skin every day.',
    299.00, 349.00, 160,
    (select id from public.categories where slug = 'skincare'),
    array['/images/products/cocoberry-face-body-lotion.jpg'],
    'Snailwhite Extract, SPF 50+ UVA/UVB Filters, Coconut Oil, Berry Extract, Niacinamide, Vitamin E',
    E'Brightens and regenerates skin\nReduces the look of fine lines and wrinkles\nMinimizes the appearance of pores\nHelps diminish acne marks\nSPF 50+ UVA/UVB protection',
    'Apply evenly to clean face and body every morning and night. For best results, use consistently for at least two weeks. Follow with sunscreen during the day if exposed to direct sunlight.',
    true, true, now() - interval '35 days'
  );

-- ============================================================
-- Placeholder catalog (filler so grids/filters/pagination aren't empty)
-- ============================================================

insert into public.products
  (name, slug, description, price, compare_price, stock, category_id, image_urls, ingredients, benefits, usage, is_featured, is_best_seller, created_at)
values
  (
    'Cocoberry Brightening Facial Serum', 'cocoberry-brightening-facial-serum',
    'A lightweight daily serum that brightens and smooths with berry antioxidants and coconut-derived emollients.',
    399.00, 459.00, 80,
    (select id from public.categories where slug = 'skincare'),
    array['/images/categories/skincare.svg'],
    'Niacinamide, Berry Extract Complex, Coconut-Derived Emollients, Hyaluronic Acid',
    E'Brightens uneven skin tone\nLightweight, fast-absorbing formula\nHydrates without feeling greasy',
    'Apply 2-3 drops to clean skin morning and night before moisturizer.',
    true, false, now() - interval '6 days'
  ),
  (
    'Cocoberry Hydrating Toner', 'cocoberry-hydrating-toner',
    'An alcohol-free toner that preps skin with a refreshing coconut-water base.',
    249.00, null, 90,
    (select id from public.categories where slug = 'skincare'),
    array['/images/categories/skincare.svg'],
    'Coconut Water, Aloe Vera, Glycerin, Panthenol',
    E'Refreshes and hydrates instantly\nBalances skin pH\nPreps skin for serums and moisturizers',
    'Sweep over clean skin using a cotton pad, or pat in with hands, morning and night.',
    false, false, now() - interval '28 days'
  ),
  (
    'Cocoberry Tinted Lip Balm', 'cocoberry-tinted-lip-balm',
    'A sheer berry-tinted balm that conditions lips while adding a natural flush of color.',
    199.00, null, 140,
    (select id from public.categories where slug = 'makeup'),
    array['/images/categories/makeup.svg'],
    'Shea Butter, Berry Extract, Coconut Oil, Vitamin E',
    E'Sheer, buildable berry tint\nConditions and softens lips\nComfortable, non-sticky finish',
    'Swipe directly onto lips as needed throughout the day.',
    false, false, now() - interval '20 days'
  ),
  (
    'Cocoberry Berry Blush Tint', 'cocoberry-berry-blush-tint',
    'A multi-use cream tint for cheeks and lips with a soft-focus, dewy finish.',
    279.00, 319.00, 75,
    (select id from public.categories where slug = 'makeup'),
    array['/images/categories/makeup.svg'],
    'Berry Pigment Complex, Jojoba Oil, Vitamin E',
    E'Blendable, buildable color\nDewy, natural-looking finish\nMulti-use for cheeks and lips',
    'Dot onto cheeks and blend with fingertips. Build up for more intensity.',
    false, false, now() - interval '4 days'
  ),
  (
    'Cocoberry Silk Setting Powder', 'cocoberry-silk-setting-powder',
    'A featherweight, translucent powder that sets makeup for an all-day soft-focus finish.',
    329.00, null, 60,
    (select id from public.categories where slug = 'makeup'),
    array['/images/categories/makeup.svg'],
    'Rice Powder, Silica, Berry Extract',
    E'Blurs the look of pores and fine lines\nControls shine all day\nLightweight, translucent finish',
    'Dust lightly over makeup with a powder puff or brush to set.',
    false, false, now() - interval '15 days'
  ),
  (
    'Cocoberry Coconut Repair Shampoo', 'cocoberry-coconut-repair-shampoo',
    'A nourishing shampoo that cleanses while repairing dry, damaged strands with coconut oil.',
    259.00, null, 110,
    (select id from public.categories where slug = 'hair-care'),
    array['/images/categories/hair-care.svg'],
    'Coconut Oil, Keratin Amino Acids, Berry Extract, Panthenol',
    E'Repairs dry and damaged hair\nGently cleanses without stripping\nLeaves hair soft and manageable',
    'Apply to wet hair, massage into a lather, and rinse thoroughly. Follow with conditioner.',
    false, true, now() - interval '33 days'
  ),
  (
    'Cocoberry Berry Shine Conditioner', 'cocoberry-berry-shine-conditioner',
    'A lightweight conditioner that detangles and adds a glossy, healthy shine.',
    259.00, null, 110,
    (select id from public.categories where slug = 'hair-care'),
    array['/images/categories/hair-care.svg'],
    'Coconut Oil, Berry Extract, Argan Oil, Panthenol',
    E'Detangles and smooths hair\nAdds glossy shine\nLightweight, non-greasy formula',
    'Apply to washed hair from mid-length to ends. Leave for 2-3 minutes, then rinse.',
    false, false, now() - interval '32 days'
  ),
  (
    'Cocoberry Scalp Renewal Hair Oil', 'cocoberry-scalp-renewal-hair-oil',
    'A nutrient-rich hair oil that nourishes the scalp and strengthens strands from root to tip.',
    319.00, 369.00, 55,
    (select id from public.categories where slug = 'hair-care'),
    array['/images/categories/hair-care.svg'],
    'Virgin Coconut Oil, Berry Seed Oil, Rosemary Extract',
    E'Nourishes and soothes the scalp\nStrengthens strands\nAdds natural shine without weighing hair down',
    'Massage a small amount into the scalp and through strands. Use as an overnight treatment or leave-in.',
    false, false, now() - interval '2 days'
  ),
  (
    'Cocoberry Whipped Body Butter', 'cocoberry-whipped-body-butter',
    'A rich, fast-absorbing whipped butter that deeply moisturizes dry skin.',
    349.00, null, 95,
    (select id from public.categories where slug = 'body-care'),
    array['/images/categories/body-care.svg'],
    'Shea Butter, Coconut Oil, Berry Extract, Vitamin E',
    E'Deeply moisturizes dry skin\nFast-absorbing, non-greasy whip\nLeaves skin soft with a light berry scent',
    'Scoop a small amount and massage into skin after showering for best absorption.',
    false, true, now() - interval '18 days'
  ),
  (
    'Cocoberry Berry Mist Body Spray', 'cocoberry-berry-mist-body-spray',
    'A light, refreshing body mist with a juicy berry-coconut scent.',
    229.00, null, 130,
    (select id from public.categories where slug = 'body-care'),
    array['/images/categories/body-care.svg'],
    'Aqua, Fragrance, Glycerin, Aloe Vera Extract',
    E'Light, long-lasting berry-coconut scent\nRefreshes skin throughout the day\nNon-sticky, alcohol-light formula',
    'Mist onto skin from a short distance after showering or whenever you need a refresh.',
    false, false, now() - interval '9 days'
  ),
  (
    'Cocoberry Glow Starter Bundle', 'cocoberry-glow-starter-bundle',
    'Everything you need to start your Cocoberry routine: body soap, face & body lotion, and a travel-size body mist.',
    599.00, 750.00, 40,
    (select id from public.categories where slug = 'beauty-bundles'),
    array['/images/categories/beauty-bundles.svg'],
    'Includes: Cocoberry Body Soap, Cocoberry Face & Body Lotion, Cocoberry Berry Mist Body Spray (travel size)',
    E'Best-selling essentials in one set\nGreat value compared to buying separately\nPerfect for first-time Cocoberry customers',
    'Follow the usage instructions on each individual product included in the set.',
    true, false, now() - interval '12 days'
  ),
  (
    'Cocoberry Self-Care Gift Set', 'cocoberry-self-care-gift-set',
    'A gift-ready set featuring our whipped body butter, hydrating toner, and tinted lip balm.',
    899.00, 1100.00, 30,
    (select id from public.categories where slug = 'beauty-bundles'),
    array['/images/categories/beauty-bundles.svg'],
    'Includes: Cocoberry Whipped Body Butter, Cocoberry Hydrating Toner, Cocoberry Tinted Lip Balm',
    E'Beautifully packaged, ready to gift\nFeatures fan-favorite products\nGreat value bundle pricing',
    'Follow the usage instructions on each individual product included in the set.',
    false, false, now() - interval '1 days'
  );

-- ============================================================
-- Coupons
-- ============================================================

insert into public.coupons (code, discount_type, discount_value, min_order_amount, max_uses, active) values
  ('WELCOME10', 'percent', 10, 0, null, true),
  ('COCOBERRY50', 'fixed', 50, 500, null, true);
