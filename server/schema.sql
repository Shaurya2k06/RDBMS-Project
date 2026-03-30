-- ============================================================
-- Cinema Booking System — Full Schema
-- ============================================================

-- Drop tables in reverse-dependency order (idempotent)
DROP TABLE IF EXISTS writes CASCADE;
DROP TABLE IF EXISTS watches CASCADE;
DROP TABLE IF EXISTS screen_seats CASCADE;
DROP TABLE IF EXISTS played_on CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS live_screenings CASCADE;
DROP TABLE IF EXISTS documentaries CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS screen_2d CASCADE;
DROP TABLE IF EXISTS screen_3d CASCADE;
DROP TABLE IF EXISTS screen_4d CASCADE;
DROP TABLE IF EXISTS imax_screens CASCADE;
DROP TABLE IF EXISTS vip_seats CASCADE;
DROP TABLE IF EXISTS recliner_seats CASCADE;
DROP TABLE IF EXISTS premium_seats CASCADE;
DROP TABLE IF EXISTS regular_seats CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS shows CASCADE;
DROP TABLE IF EXISTS screens CASCADE;
DROP TABLE IF EXISTS seats CASCADE;

-- ============================================================
-- 1. SEATS (parent + specializations)
-- ============================================================
CREATE TABLE seats (
  seat_id    SERIAL PRIMARY KEY,
  seat_no    VARCHAR(10)  NOT NULL,
  seat_type  VARCHAR(20)  NOT NULL CHECK (seat_type IN ('Regular','Premium','Recliner','VIP')),
  seat_price NUMERIC(8,2) NOT NULL
);

CREATE TABLE regular_seats (
  seat_id        INT PRIMARY KEY REFERENCES seats(seat_id) ON DELETE CASCADE,
  reg_seat_price NUMERIC(8,2) NOT NULL
);

CREATE TABLE premium_seats (
  seat_id        INT PRIMARY KEY REFERENCES seats(seat_id) ON DELETE CASCADE,
  pre_seat_price NUMERIC(8,2) NOT NULL
);

CREATE TABLE recliner_seats (
  seat_id        INT PRIMARY KEY REFERENCES seats(seat_id) ON DELETE CASCADE,
  rec_seat_price NUMERIC(8,2) NOT NULL
);

CREATE TABLE vip_seats (
  seat_id        INT PRIMARY KEY REFERENCES seats(seat_id) ON DELETE CASCADE,
  vip_seat_price NUMERIC(8,2) NOT NULL
);

-- ============================================================
-- 2. SCREENS (parent + specializations)
-- ============================================================
CREATE TABLE screens (
  screen_no     SERIAL PRIMARY KEY,
  screen_size   VARCHAR(20)  NOT NULL,
  screen_status VARCHAR(20)  NOT NULL DEFAULT 'Active',
  seat_count    INT          NOT NULL DEFAULT 0
);

CREATE TABLE imax_screens (
  screen_id           INT PRIMARY KEY REFERENCES screens(screen_no) ON DELETE CASCADE,
  imax_manufacturer   VARCHAR(100),
  imax_sound_system   VARCHAR(100),
  imax_projector_type VARCHAR(100)
);

CREATE TABLE screen_4d (
  screen_id           INT PRIMARY KEY REFERENCES screens(screen_no) ON DELETE CASCADE,
  s4d_manufacturer    VARCHAR(100),
  s4d_sound_system    VARCHAR(100),
  s4d_projector_type  VARCHAR(100)
);

CREATE TABLE screen_3d (
  screen_id           INT PRIMARY KEY REFERENCES screens(screen_no) ON DELETE CASCADE,
  s3d_manufacturer    VARCHAR(100),
  s3d_sound_system    VARCHAR(100),
  s3d_projector_type  VARCHAR(100)
);

CREATE TABLE screen_2d (
  screen_id           INT PRIMARY KEY REFERENCES screens(screen_no) ON DELETE CASCADE,
  s2d_manufacturer    VARCHAR(100),
  s2d_projector_type  VARCHAR(100)
);

-- ============================================================
-- 3. SHOWS (parent + specializations)
-- ============================================================
CREATE TABLE shows (
  show_id       SERIAL PRIMARY KEY,
  show_name     VARCHAR(200) NOT NULL,
  show_date     DATE         DEFAULT CURRENT_DATE,
  show_duration INT          NOT NULL,  -- minutes
  show_language VARCHAR(50)  NOT NULL,
  rating_type   VARCHAR(20)
);

CREATE TABLE movies (
  show_id       INT PRIMARY KEY REFERENCES shows(show_id) ON DELETE CASCADE,
  genre         VARCHAR(50),
  mreviews      TEXT,
  age_rating    VARCHAR(10),
  accessibility VARCHAR(100)
);

CREATE TABLE documentaries (
  show_id       INT PRIMARY KEY REFERENCES shows(show_id) ON DELETE CASCADE,
  dreviews      TEXT,
  age_rating    VARCHAR(10),
  accessibility VARCHAR(100)
);

CREATE TABLE live_screenings (
  show_id       INT PRIMARY KEY REFERENCES shows(show_id) ON DELETE CASCADE,
  lreviews      TEXT,
  age_rating    VARCHAR(10),
  accessibility VARCHAR(100)
);

-- ============================================================
-- 4. CUSTOMERS
-- ============================================================
CREATE TABLE customers (
  cust_id    SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name  VARCHAR(100) NOT NULL,
  phone_no   VARCHAR(50),
  dob        DATE
);

-- ============================================================
-- 5. BOOKINGS
-- ============================================================
CREATE TABLE bookings (
  booking_id     SERIAL PRIMARY KEY,
  cust_id        INT NOT NULL REFERENCES customers(cust_id) ON DELETE CASCADE,
  show_id        INT NOT NULL REFERENCES shows(show_id) ON DELETE CASCADE,
  booking_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  booking_status VARCHAR(20) NOT NULL DEFAULT 'Confirmed'
);

-- ============================================================
-- 6. REVIEWS
-- ============================================================
CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  cust_id   INT NOT NULL REFERENCES customers(cust_id) ON DELETE CASCADE,
  show_id   INT NOT NULL REFERENCES shows(show_id) ON DELETE CASCADE,
  rating    INT NOT NULL CHECK (rating >= 1 AND rating <= 10)
);

-- ============================================================
-- 7. JUNCTION / RELATIONSHIP TABLES
-- ============================================================

-- Show played on Screen (M:N)
CREATE TABLE played_on (
  show_id   INT NOT NULL REFERENCES shows(show_id) ON DELETE CASCADE,
  screen_no INT NOT NULL REFERENCES screens(screen_no) ON DELETE CASCADE,
  PRIMARY KEY (show_id, screen_no)
);

-- Seat assigned to Screen (M:N)
CREATE TABLE screen_seats (
  screen_no INT NOT NULL REFERENCES screens(screen_no) ON DELETE CASCADE,
  seat_id   INT NOT NULL REFERENCES seats(seat_id) ON DELETE CASCADE,
  PRIMARY KEY (screen_no, seat_id)
);

-- Customer watches Show (M:N)
CREATE TABLE watches (
  cust_id INT NOT NULL REFERENCES customers(cust_id) ON DELETE CASCADE,
  show_id INT NOT NULL REFERENCES shows(show_id) ON DELETE CASCADE,
  PRIMARY KEY (cust_id, show_id)
);

-- Customer writes Review (M:N)
CREATE TABLE writes (
  cust_id   INT NOT NULL REFERENCES customers(cust_id) ON DELETE CASCADE,
  review_id INT NOT NULL REFERENCES reviews(review_id) ON DELETE CASCADE,
  PRIMARY KEY (cust_id, review_id)
);
