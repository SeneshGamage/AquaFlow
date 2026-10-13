-- Demo catalog. Loaded only with SPRING_PROFILES_ACTIVE=demo (see application-demo.yml).
INSERT INTO public.fish
  (common_name, scientific_name, origin_country, description, quantity_in_stock, price_per_unit, image_url, active, created_at, updated_at)
SELECT v.common_name, v.scientific_name, v.origin_country, v.description, v.quantity_in_stock, v.price_per_unit, v.image_url,
       true, localtimestamp, localtimestamp
FROM (VALUES
  ('Halfmoon Betta - Red & White',     'Betta splendens', 'Thailand',  'Flared halfmoon tail with vivid red and white colouring.', 320, 24.00, '/img/betta1.jpg'),
  ('Crowntail Betta - Black',          'Betta splendens', 'Indonesia', 'Spiked crown rays and a deep black body.',                  85, 18.00, '/img/betta2.jpg'),
  ('Koi Plakat Betta',                 'Betta splendens', 'Malaysia',  'Marbled koi pattern on a short-finned plakat.',              8, 32.00, '/img/betta3.jpg'),
  ('Electric Blue Plakat',             'Betta splendens', 'Thailand',  'Metallic blue, strong and active.',                        150, 15.00, '/img/betta4.jpg'),
  ('Halfmoon Betta - Cream White',     'Betta splendens', 'Vietnam',   'Opaque cream-white with a wide halfmoon tail.',            210, 28.00, '/img/betta5.jpg'),
  ('Opaline Halfmoon - Blue & Yellow', 'Betta splendens', 'Sri Lanka', 'Rare opaline colouring, premium grade.',                     0, 36.00, '/img/betta6.jpg')
) AS v(common_name, scientific_name, origin_country, description, quantity_in_stock, price_per_unit, image_url)
WHERE NOT EXISTS (SELECT 1 FROM public.fish f WHERE f.common_name = v.common_name);