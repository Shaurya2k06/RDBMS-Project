-- ============================================================
-- Cinema Booking System — Seed Data
-- ============================================================

-- SEATS
INSERT INTO seats (seat_no, seat_type, seat_price) VALUES
  ('A1', 'Regular',  150.00),
  ('A2', 'Regular',  150.00),
  ('A3', 'Regular',  150.00),
  ('B1', 'Premium',  300.00),
  ('B2', 'Premium',  300.00),
  ('B3', 'Premium',  300.00),
  ('C1', 'Recliner', 500.00),
  ('C2', 'Recliner', 500.00);

INSERT INTO regular_seats (seat_id, reg_seat_price) VALUES
  (1, 150.00), (2, 150.00), (3, 150.00);

INSERT INTO premium_seats (seat_id, pre_seat_price) VALUES
  (4, 300.00), (5, 300.00), (6, 300.00);

INSERT INTO recliner_seats (seat_id, rec_seat_price) VALUES
  (7, 500.00), (8, 500.00);

-- SCREENS
INSERT INTO screens (screen_size, screen_status, seat_count) VALUES
  ('Large',  'Active',   120),
  ('Medium', 'Active',   80),
  ('Large',  'Active',   150),
  ('Small',  'Inactive', 60),
  ('Medium', 'Active',   100);

INSERT INTO imax_screens (screen_id, imax_manufacturer, imax_sound_system, imax_projector_type) VALUES
  (1, 'IMAX Corporation', 'IMAX 12.1', 'Dual Laser');

INSERT INTO screen_4d (screen_id, s4d_manufacturer, s4d_sound_system, s4d_projector_type) VALUES
  (2, 'MediaMation', 'Dolby Atmos', '4DX Projector');

INSERT INTO screen_3d (screen_id, s3d_manufacturer, s3d_sound_system, s3d_projector_type) VALUES
  (3, 'RealD', 'DTS:X', 'RealD Cinema');

INSERT INTO screen_2d (screen_id, s2d_manufacturer, s2d_projector_type) VALUES
  (4, 'Barco', 'Standard Digital'),
  (5, 'Christie', 'Standard Digital');

-- SHOWS
INSERT INTO shows (show_name, show_date, show_duration, show_language, rating_type) VALUES
  ('Inception',           '2026-04-01', 148, 'English', 'PG-13'),
  ('Planet Earth III',    '2026-04-02', 90,  'English', 'G'),
  ('UEFA Champions League Final', '2026-04-05', 120, 'English', 'G'),
  ('Interstellar',        '2026-04-03', 169, 'English', 'PG-13'),
  ('The Dark Knight',     '2026-04-04', 152, 'English', 'PG-13'),
  ('March of the Penguins', '2026-04-06', 80, 'French', 'G');

INSERT INTO movies (show_id, genre, mreviews, age_rating, accessibility) VALUES
  (1, 'Sci-Fi',   'Mind-bending masterpiece',      'PG-13', 'Subtitles available'),
  (4, 'Sci-Fi',   'Spectacular space epic',         'PG-13', 'Audio description'),
  (5, 'Action',   'Greatest superhero film ever',   'PG-13', 'Subtitles available');

INSERT INTO documentaries (show_id, dreviews, age_rating, accessibility) VALUES
  (2, 'Stunning visuals of nature', 'G', 'Subtitles available'),
  (6, 'Heartwarming penguin journey', 'G', 'Audio description');

INSERT INTO live_screenings (show_id, lreviews, age_rating, accessibility) VALUES
  (3, 'Incredible atmosphere', 'G', 'Live commentary');

-- CUSTOMERS
INSERT INTO customers (first_name, last_name, phone_no, dob) VALUES
  ('Shaurya',  'Kumar',    '9876543210', '2004-06-15'),
  ('Aarav',    'Sharma',   '9876543211', '2000-03-22'),
  ('Priya',    'Singh',    '9876543212', '1998-11-10'),
  ('Rahul',    'Verma',    '9876543213', '2001-07-04'),
  ('Ananya',   'Gupta',    '9876543214', '2003-01-30');

-- BOOKINGS
INSERT INTO bookings (cust_id, show_id, booking_date, booking_status) VALUES
  (1, 1, '2026-03-28', 'Confirmed'),
  (2, 1, '2026-03-28', 'Confirmed'),
  (3, 2, '2026-03-29', 'Confirmed'),
  (4, 3, '2026-03-30', 'Pending'),
  (5, 4, '2026-03-30', 'Confirmed'),
  (1, 5, '2026-03-30', 'Cancelled');

-- REVIEWS
INSERT INTO reviews (cust_id, show_id, rating) VALUES
  (1, 1, 5),
  (2, 1, 4),
  (3, 2, 5),
  (4, 3, 3),
  (5, 4, 4);

-- JUNCTION TABLES

-- played_on: which show plays on which screen
INSERT INTO played_on (show_id, screen_no) VALUES
  (1, 1), (1, 3),
  (2, 2),
  (3, 1),
  (4, 3),
  (5, 5),
  (6, 4);

-- screen_seats: which seats are in which screen
INSERT INTO screen_seats (screen_no, seat_id) VALUES
  (1, 1), (1, 2), (1, 7),
  (2, 3), (2, 4),
  (3, 5), (3, 6), (3, 8),
  (4, 1), (4, 3),
  (5, 2), (5, 4), (5, 6);

-- watches: which customer watches which show
INSERT INTO watches (cust_id, show_id) VALUES
  (1, 1), (1, 5),
  (2, 1),
  (3, 2),
  (4, 3),
  (5, 4);

-- writes: which customer wrote which review
INSERT INTO writes (cust_id, review_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);
