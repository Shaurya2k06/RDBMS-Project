const express = require("express");
const router = express.Router();
const sql = require("../db");

// ─── GET all customers ───
router.get("/", async (req, res) => {
  try {
    const customers = await sql`
      SELECT * FROM customers ORDER BY cust_id
    `;
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET customer by ID ───
router.get("/:id", async (req, res) => {
  try {
    const [customer] = await sql`
      SELECT * FROM customers WHERE cust_id = ${req.params.id}
    `;
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST create a customer ───
router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, phone_no, dob } = req.body;
    const [customer] = await sql`
      INSERT INTO customers (first_name, last_name, phone_no, dob)
      VALUES (${first_name}, ${last_name}, ${phone_no || null}, ${dob || null})
      RETURNING *
    `;
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT update a customer ───
router.put("/:id", async (req, res) => {
  try {
    const { first_name, last_name, phone_no, dob } = req.body;
    const [customer] = await sql`
      UPDATE customers
      SET first_name = ${first_name}, last_name = ${last_name},
          phone_no = ${phone_no}, dob = ${dob}
      WHERE cust_id = ${req.params.id}
      RETURNING *
    `;
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE a customer ───
router.delete("/:id", async (req, res) => {
  try {
    const [customer] = await sql`
      DELETE FROM customers WHERE cust_id = ${req.params.id} RETURNING *
    `;
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer deleted", customer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET bookings for a customer ───
router.get("/:id/bookings", async (req, res) => {
  try {
    const bookings = await sql`
      SELECT b.*, sh.show_name, sh.show_date
      FROM bookings b
      JOIN shows sh ON b.show_id = sh.show_id
      WHERE b.cust_id = ${req.params.id}
      ORDER BY b.booking_date DESC
    `;
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET reviews by a customer ───
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await sql`
      SELECT r.* FROM reviews r
      JOIN writes w ON r.review_id = w.review_id
      WHERE w.cust_id = ${req.params.id}
      ORDER BY r.review_id
    `;
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST customer watches show ───
router.post("/:custId/shows/:showId", async (req, res) => {
  try {
    const [row] = await sql`
      INSERT INTO watches (cust_id, show_id)
      VALUES (${req.params.custId}, ${req.params.showId})
      RETURNING *
    `;
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE customer unwatch show ───
router.delete("/:custId/shows/:showId", async (req, res) => {
  try {
    const [row] = await sql`
      DELETE FROM watches
      WHERE cust_id = ${req.params.custId} AND show_id = ${req.params.showId}
      RETURNING *
    `;
    if (!row) return res.status(404).json({ error: "Watch record not found" });
    res.json({ message: "Watch removed", row });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET shows watched by a customer ───
router.get("/:id/shows", async (req, res) => {
  try {
    const shows = await sql`
      SELECT sh.* FROM shows sh
      JOIN watches w ON sh.show_id = w.show_id
      WHERE w.cust_id = ${req.params.id}
      ORDER BY sh.show_date
    `;
    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST customer writes review (junction) ───
router.post("/:custId/reviews/:reviewId", async (req, res) => {
  try {
    const [row] = await sql`
      INSERT INTO writes (cust_id, review_id)
      VALUES (${req.params.custId}, ${req.params.reviewId})
      RETURNING *
    `;
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE customer-review link ───
router.delete("/:custId/reviews/:reviewId", async (req, res) => {
  try {
    const [row] = await sql`
      DELETE FROM writes
      WHERE cust_id = ${req.params.custId} AND review_id = ${req.params.reviewId}
      RETURNING *
    `;
    if (!row) return res.status(404).json({ error: "Write record not found" });
    res.json({ message: "Review link removed", row });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
