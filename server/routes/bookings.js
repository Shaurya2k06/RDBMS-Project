const express = require("express");
const router = express.Router();
const sql = require("../db");

// ─── GET all bookings ───
router.get("/", async (req, res) => {
  try {
    const bookings = await sql`
      SELECT b.*,
             c.first_name, c.last_name,
             sh.show_name, sh.show_date
      FROM bookings b
      JOIN customers c  ON b.cust_id = c.cust_id
      JOIN shows     sh ON b.show_id = sh.show_id
      ORDER BY b.booking_id
    `;
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET booking by ID ───
router.get("/:id", async (req, res) => {
  try {
    const [booking] = await sql`
      SELECT b.*,
             c.first_name, c.last_name,
             sh.show_name, sh.show_date
      FROM bookings b
      JOIN customers c  ON b.cust_id = c.cust_id
      JOIN shows     sh ON b.show_id = sh.show_id
      WHERE b.booking_id = ${req.params.id}
    `;
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST create a booking ───
router.post("/", async (req, res) => {
  try {
    const { cust_id, show_id, booking_date, booking_status } = req.body;
    const [booking] = await sql`
      INSERT INTO bookings (cust_id, show_id, booking_date, booking_status)
      VALUES (${cust_id}, ${show_id}, ${booking_date || sql`CURRENT_DATE`}, ${booking_status || 'Confirmed'})
      RETURNING *
    `;
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT update a booking ───
router.put("/:id", async (req, res) => {
  try {
    const { cust_id, show_id, booking_date, booking_status } = req.body;
    const [booking] = await sql`
      UPDATE bookings
      SET cust_id = ${cust_id}, show_id = ${show_id},
          booking_date = ${booking_date}, booking_status = ${booking_status}
      WHERE booking_id = ${req.params.id}
      RETURNING *
    `;
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE a booking ───
router.delete("/:id", async (req, res) => {
  try {
    const [booking] = await sql`
      DELETE FROM bookings WHERE booking_id = ${req.params.id} RETURNING *
    `;
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ message: "Booking deleted", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET bookings by status ───
router.get("/status/:status", async (req, res) => {
  try {
    const bookings = await sql`
      SELECT b.*, c.first_name, c.last_name, sh.show_name
      FROM bookings b
      JOIN customers c  ON b.cust_id = c.cust_id
      JOIN shows     sh ON b.show_id = sh.show_id
      WHERE b.booking_status = ${req.params.status}
      ORDER BY b.booking_date DESC
    `;
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
