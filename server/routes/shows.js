const express = require("express");
const router = express.Router();
const sql = require("../db");

// ─── GET all shows (with specialization info) ───
router.get("/", async (req, res) => {
  try {
    const shows = await sql`
      SELECT sh.*,
             m.genre, m.mreviews, m.age_rating AS m_age_rating, m.accessibility AS m_accessibility,
             d.dreviews, d.age_rating AS d_age_rating, d.accessibility AS d_accessibility,
             l.lreviews, l.age_rating AS l_age_rating, l.accessibility AS l_accessibility
      FROM shows sh
      LEFT JOIN movies          m ON sh.show_id = m.show_id
      LEFT JOIN documentaries   d ON sh.show_id = d.show_id
      LEFT JOIN live_screenings l ON sh.show_id = l.show_id
      ORDER BY sh.show_id
    `;
    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET show by ID ───
router.get("/:id", async (req, res) => {
  try {
    const [show] = await sql`
      SELECT sh.*,
             m.genre, m.mreviews, m.age_rating AS m_age_rating, m.accessibility AS m_accessibility,
             d.dreviews, d.age_rating AS d_age_rating, d.accessibility AS d_accessibility,
             l.lreviews, l.age_rating AS l_age_rating, l.accessibility AS l_accessibility
      FROM shows sh
      LEFT JOIN movies          m ON sh.show_id = m.show_id
      LEFT JOIN documentaries   d ON sh.show_id = d.show_id
      LEFT JOIN live_screenings l ON sh.show_id = l.show_id
      WHERE sh.show_id = ${req.params.id}
    `;
    if (!show) return res.status(404).json({ error: "Show not found" });
    res.json(show);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST create a show ───
router.post("/", async (req, res) => {
  try {
    const { show_name, show_date, show_duration, show_language, rating_type, show_type, ...specData } = req.body;
    const [show] = await sql`
      INSERT INTO shows (show_name, show_date, show_duration, show_language, rating_type)
      VALUES (${show_name}, ${show_date}, ${show_duration}, ${show_language}, ${rating_type || null})
      RETURNING *
    `;

    const id = show.show_id;
    if (show_type === "Movie") {
      await sql`INSERT INTO movies (show_id, genre, mreviews, age_rating, accessibility)
                VALUES (${id}, ${specData.genre || null}, ${specData.mreviews || null}, ${specData.age_rating || null}, ${specData.accessibility || null})`;
    } else if (show_type === "Documentary") {
      await sql`INSERT INTO documentaries (show_id, dreviews, age_rating, accessibility)
                VALUES (${id}, ${specData.dreviews || null}, ${specData.age_rating || null}, ${specData.accessibility || null})`;
    } else if (show_type === "LiveScreening") {
      await sql`INSERT INTO live_screenings (show_id, lreviews, age_rating, accessibility)
                VALUES (${id}, ${specData.lreviews || null}, ${specData.age_rating || null}, ${specData.accessibility || null})`;
    }

    res.status(201).json(show);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT update a show ───
router.put("/:id", async (req, res) => {
  try {
    const { show_name, show_date, show_duration, show_language, rating_type } = req.body;
    const [show] = await sql`
      UPDATE shows
      SET show_name = ${show_name}, show_date = ${show_date}, show_duration = ${show_duration},
          show_language = ${show_language}, rating_type = ${rating_type}
      WHERE show_id = ${req.params.id}
      RETURNING *
    `;
    if (!show) return res.status(404).json({ error: "Show not found" });
    res.json(show);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE a show ───
router.delete("/:id", async (req, res) => {
  try {
    const [show] = await sql`
      DELETE FROM shows WHERE show_id = ${req.params.id} RETURNING *
    `;
    if (!show) return res.status(404).json({ error: "Show not found" });
    res.json({ message: "Show deleted", show });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET only movies ───
router.get("/type/movies", async (req, res) => {
  try {
    const movies = await sql`
      SELECT sh.*, m.* FROM shows sh
      JOIN movies m ON sh.show_id = m.show_id
      ORDER BY sh.show_date
    `;
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET only documentaries ───
router.get("/type/documentaries", async (req, res) => {
  try {
    const docs = await sql`
      SELECT sh.*, d.* FROM shows sh
      JOIN documentaries d ON sh.show_id = d.show_id
      ORDER BY sh.show_date
    `;
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET only live screenings ───
router.get("/type/live", async (req, res) => {
  try {
    const live = await sql`
      SELECT sh.*, l.* FROM shows sh
      JOIN live_screenings l ON sh.show_id = l.show_id
      ORDER BY sh.show_date
    `;
    res.json(live);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST assign show to screen (played_on) ───
router.post("/:showId/screens/:screenNo", async (req, res) => {
  try {
    const [row] = await sql`
      INSERT INTO played_on (show_id, screen_no)
      VALUES (${req.params.showId}, ${req.params.screenNo})
      RETURNING *
    `;
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE remove show from screen ───
router.delete("/:showId/screens/:screenNo", async (req, res) => {
  try {
    const [row] = await sql`
      DELETE FROM played_on
      WHERE show_id = ${req.params.showId} AND screen_no = ${req.params.screenNo}
      RETURNING *
    `;
    if (!row) return res.status(404).json({ error: "Assignment not found" });
    res.json({ message: "Show removed from screen", row });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET screens for a show ───
router.get("/:id/screens", async (req, res) => {
  try {
    const screens = await sql`
      SELECT sc.* FROM screens sc
      JOIN played_on po ON sc.screen_no = po.screen_no
      WHERE po.show_id = ${req.params.id}
      ORDER BY sc.screen_no
    `;
    res.json(screens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
