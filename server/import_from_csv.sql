-- Import data CSV files from ../data into existing schema
-- Usage: psql -d cinedb -f schema.sql && psql -d cinedb -f import_from_csv.sql

BEGIN;

CREATE TEMP TABLE stg_bookings (
  booking_id INT,
  booking_date DATE,
  booking_status TEXT,
  bshow_id INT,
  bcust_id INT
);

CREATE TEMP TABLE stg_customers (
  cust_id INT,
  f_name TEXT,
  l_name TEXT,
  ph_no TEXT,
  cust_dob DATE
);

CREATE TEMP TABLE stg_screens (
  screen_no INT,
  screen_status TEXT,
  seat_count INT,
  screen_size TEXT,
  screen_type TEXT
);

CREATE TEMP TABLE stg_reviews (
  review_id INT,
  rating INT,
  rcust_id INT,
  rshow_id INT
);

CREATE TEMP TABLE stg_seats (
  seat_id INT,
  seat_no TEXT,
  seat_type TEXT,
  seat_price NUMERIC(8,2),
  sscreen_no INT
);

CREATE TEMP TABLE stg_shows (
  show_id INT,
  show_name TEXT,
  show_duration INT,
  age_rating TEXT,
  show_lang TEXT,
  show_type TEXT
);

\copy stg_bookings FROM '../data/Booking Data.csv' CSV HEADER;
\copy stg_customers FROM '../data/Customer Data from Shaurya.csv' CSV HEADER;
\copy stg_screens FROM '../data/Forwarded Screen Data.csv' CSV HEADER;
\copy stg_reviews FROM '../data/Reviews from shaurya2k06.csv' CSV HEADER;
\copy stg_seats FROM '../data/Seat Data.csv' CSV HEADER;
\copy stg_shows FROM '../data/Shows (1).csv' CSV HEADER;

INSERT INTO customers (cust_id, first_name, last_name, phone_no, dob)
SELECT cust_id, f_name, l_name, ph_no, cust_dob
FROM stg_customers
ORDER BY cust_id;

INSERT INTO screens (screen_no, screen_size, screen_status, seat_count)
SELECT screen_no, screen_size, screen_status, seat_count
FROM stg_screens
ORDER BY screen_no;

INSERT INTO imax_screens (screen_id, imax_manufacturer, imax_sound_system, imax_projector_type)
SELECT screen_no, 'Unknown', 'Unknown', 'Unknown'
FROM stg_screens
WHERE screen_type = 'IMAX';

INSERT INTO screen_4d (screen_id, s4d_manufacturer, s4d_sound_system, s4d_projector_type)
SELECT screen_no, 'Unknown', 'Unknown', 'Unknown'
FROM stg_screens
WHERE screen_type = '4-D';

INSERT INTO screen_3d (screen_id, s3d_manufacturer, s3d_sound_system, s3d_projector_type)
SELECT screen_no, 'Unknown', 'Unknown', 'Unknown'
FROM stg_screens
WHERE screen_type = '3-D';

INSERT INTO screen_2d (screen_id, s2d_manufacturer, s2d_projector_type)
SELECT screen_no, 'Unknown', 'Unknown'
FROM stg_screens
WHERE screen_type = '2-D';

INSERT INTO shows (show_id, show_name, show_date, show_duration, show_language, rating_type)
SELECT show_id, show_name, CURRENT_DATE, show_duration, show_lang, age_rating
FROM stg_shows
ORDER BY show_id;

INSERT INTO movies (show_id, genre, mreviews, age_rating, accessibility)
SELECT show_id, NULL, NULL, age_rating, NULL
FROM stg_shows
WHERE show_type = 'Movie';

INSERT INTO documentaries (show_id, dreviews, age_rating, accessibility)
SELECT show_id, NULL, age_rating, NULL
FROM stg_shows
WHERE show_type = 'Documentary';

INSERT INTO live_screenings (show_id, lreviews, age_rating, accessibility)
SELECT show_id, NULL, age_rating, NULL
FROM stg_shows
WHERE show_type = 'Live Screening';

INSERT INTO seats (seat_id, seat_no, seat_type, seat_price)
SELECT seat_id, seat_no, seat_type, seat_price
FROM stg_seats
ORDER BY seat_id;

INSERT INTO regular_seats (seat_id, reg_seat_price)
SELECT seat_id, seat_price
FROM stg_seats
WHERE seat_type = 'Regular';

INSERT INTO premium_seats (seat_id, pre_seat_price)
SELECT seat_id, seat_price
FROM stg_seats
WHERE seat_type = 'Premium';

INSERT INTO recliner_seats (seat_id, rec_seat_price)
SELECT seat_id, seat_price
FROM stg_seats
WHERE seat_type = 'Recliner';

INSERT INTO vip_seats (seat_id, vip_seat_price)
SELECT seat_id, seat_price
FROM stg_seats
WHERE seat_type = 'VIP';

INSERT INTO screen_seats (screen_no, seat_id)
SELECT DISTINCT sscreen_no, seat_id
FROM stg_seats
WHERE sscreen_no IS NOT NULL;

INSERT INTO bookings (booking_id, cust_id, show_id, booking_date, booking_status)
SELECT
  booking_id,
  bcust_id,
  bshow_id,
  booking_date,
  CASE
    WHEN lower(trim(booking_status)) IN ('yes', 'confirmed', 'true', '1') THEN 'Confirmed'
    WHEN lower(trim(booking_status)) IN ('no', 'cancelled', 'canceled', 'false', '0') THEN 'Cancelled'
    ELSE 'Pending'
  END
FROM stg_bookings
ORDER BY booking_id;

INSERT INTO reviews (review_id, cust_id, show_id, rating)
SELECT review_id, rcust_id, rshow_id, rating
FROM stg_reviews
ORDER BY review_id;

INSERT INTO watches (cust_id, show_id)
SELECT DISTINCT cust_id, show_id
FROM bookings;

INSERT INTO writes (cust_id, review_id)
SELECT DISTINCT cust_id, review_id
FROM reviews;

SELECT setval('customers_cust_id_seq', COALESCE((SELECT MAX(cust_id) FROM customers), 1), true);
SELECT setval('screens_screen_no_seq', COALESCE((SELECT MAX(screen_no) FROM screens), 1), true);
SELECT setval('shows_show_id_seq', COALESCE((SELECT MAX(show_id) FROM shows), 1), true);
SELECT setval('seats_seat_id_seq', COALESCE((SELECT MAX(seat_id) FROM seats), 1), true);
SELECT setval('bookings_booking_id_seq', COALESCE((SELECT MAX(booking_id) FROM bookings), 1), true);
SELECT setval('reviews_review_id_seq', COALESCE((SELECT MAX(review_id) FROM reviews), 1), true);

COMMIT;
