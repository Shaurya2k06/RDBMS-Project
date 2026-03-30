const express = require("express");
const router = express.Router();
const sql = require("../db");

// ─── GET all seats (with specialization info) ───
router.get("/", async (req, res) => {
  try {
    const seats = await sql`
      SELECT s.*,
             r.reg_seat_price,
             p.pre_seat_price,
             rc.rec_seat_price
      FROM seats s
      LEFT JOIN regular_seats  r  ON s.seat_id = r.seat_id
      LEFT JOIN premium_seats  p  ON s.seat_id = p.seat_id
      LEFT JOIN recliner_seats rc ON s.seat_id = rc.seat_id
      ORDER BY s.seat_id
    `;
    res.json(seats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET seat by ID ───
router.get("/:id", async (req, res) => {
  try {
    const [seat] = await sql`
      SELECT s.*,
             r.reg_seat_price,
             p.pre_seat_price,
             rc.rec_seat_price
      FROM seats s
      LEFT JOIN regular_seats  r  ON s.seat_id = r.seat_id
      LEFT JOIN premium_seats  p  ON s.seat_id = p.seat_id
      LEFT JOIN recliner_seats rc ON s.seat_id = rc.seat_id
      WHERE s.seat_id = ${req.params.id}
    `;
    if (!seat) return res.status(404).json({ error: "Seat not found" });
    res.json(seat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST create a new seat ───
router.post("/", async (req, res) => {
  try {
    const { seat_no, seat_type, seat_price } = req.body;
    const [seat] = await sql`
      INSERT INTO seats (seat_no, seat_type, seat_price)
      VALUES (${seat_no}, ${seat_type}, ${seat_price})
      RETURNING *
    `;

    // Insert into specialization table
    if (seat_type === "Regular") {
      await sql`INSERT INTO regular_seats (seat_id, reg_seat_price) VALUES (${seat.seat_id}, ${seat_price})`;
    } else if (seat_type === "Premium") {
      await sql`INSERT INTO premium_seats (seat_id, pre_seat_price) VALUES (${seat.seat_id}, ${seat_price})`;
    } else if (seat_type === "Recliner") {
      await sql`INSERT INTO recliner_seats (seat_id, rec_seat_price) VALUES (${seat.seat_id}, ${seat_price})`;
    }

    res.status(201).json(seat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT update a seat ───
router.put("/:id", async (req, res) => {
  try {
    const { seat_no, seat_type, seat_price } = req.body;
    const [seat] = await sql`
      UPDATE seats
      SET seat_no = ${seat_no}, seat_type = ${seat_type}, seat_price = ${seat_price}
      WHERE seat_id = ${req.params.id}
      RETURNING *
    `;
    if (!seat) return res.status(404).json({ error: "Seat not found" });
    res.json(seat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE a seat ───
router.delete("/:id", async (req, res) => {
  try {
    const [seat] = await sql`
      DELETE FROM seats WHERE seat_id = ${req.params.id} RETURNING *
    `;
    if (!seat) return res.status(404).json({ error: "Seat not found" });
    res.json({ message: "Seat deleted", seat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET seats by type ───
router.get("/type/:type", async (req, res) => {
  try {
    const seats = await sql`
      SELECT * FROM seats WHERE seat_type = ${req.params.type} ORDER BY seat_id
    `;
    res.json(seats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
