-- Demo catalog for development and the portfolio demo.
-- Images are served by the Next.js app from frontend/public/img.
INSERT INTO public.fish
  (common_name, scientific_name, origin_country, description, quantity_in_stock, price_per_unit, image_url, active, created_at, updated_at)
VALUES
  ('Halfmoon Betta - Red & White', 'Betta splendens', 'Thailand',  'Flared halfmoon tail with vivid red and white colouring.', 320, 24.00, '/img/betta1.jpg', true, now(), now()),
  ('Crowntail Betta - Black',      'Betta splendens', 'Indonesia', 'Spiked crown rays and a deep black body.',                      85, 18.00, '/img/betta2.jpg', true, now(), now()),
  ('Koi Plakat Betta',             'Betta splendens', 'Malaysia',  'Marbled koi pattern on a short-finned plakat.',                  8, 32.00, '/img/betta3.jpg', true, now(), now()),
  ('Electric Blue Plakat',         'Betta splendens', 'Thailand',  'Metallic blue, strong and active.',                            150, 15.00, '/img/betta4.jpg', true, now(), now()),
  ('Halfmoon Betta - Cream White', 'Betta splendens', 'Vietnam',   'Opaque cream-white with a wide halfmoon tail.',                210, 28.00, '/img/betta5.jpg', true, now(), now()),
  ('Opaline Halfmoon - Blue & Yellow', 'Betta splendens', 'Sri Lanka', 'Rare opaline colouring, premium grade.',                     0, 36.00, '/img/betta6.jpg', true, now(), now());