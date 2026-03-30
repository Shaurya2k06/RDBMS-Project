const express = require("express");
const router = express.Router();
const sql = require("../db");

// ─── GET all reviews ───
router.get("/", async (req, res) => {
  try {
    const reviews = await sql`
      SELECT r.*,
             c.first_name, c.last_name
      FROM reviews r
      JOIN customers c ON r.cust_id = c.cust_id
      ORDER BY r.review_id
    `;
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET review by ID ───
router.get("/:id", async (req, res) => {
  try {
    const [review] = await sql`
      SELECT r.*,
             c.first_name, c.last_name
      FROM reviews r
      JOIN customers c ON r.cust_id = c.cust_id
      WHERE r.review_id = ${req.params.id}
    `;
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST create a review ───
router.post("/", async (req, res) => {
  try {
    const { cust_id, rating } = req.body;
    const [review] = await sql`
      INSERT INTO reviews (cust_id, rating)
      VALUES (${cust_id}, ${rating})
      RETURNING *
    `;

    // Also insert into writes junction
    await sql`
      INSERT INTO writes (cust_id, review_id)
      VALUES (${cust_id}, ${review.review_id})
    `;

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT update a review ───
router.put("/:id", async (req, res) => {
  try {
    const { rating } = req.body;
    const [review] = await sql`
      UPDATE reviews SET rating = ${rating}
      WHERE review_id = ${req.params.id}
      RETURNING *
    `;
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE a review ───
router.delete("/:id", async (req, res) => {
  try {
    const [review] = await sql`
      DELETE FROM reviews WHERE review_id = ${req.params.id} RETURNING *
    `;
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json({ message: "Review deleted", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET average rating ───
router.get("/stats/average", async (req, res) => {
  try {
    const [stats] = await sql`
      SELECT COUNT(*) AS total_reviews, ROUND(AVG(rating), 2) AS avg_rating
      FROM reviews
    `;
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
