const express = require("express");
const router = express.Router();
const sql = require("../db");

// ─── GET all screens (with specialization info) ───
router.get("/", async (req, res) => {
  try {
    const screens = await sql`
      SELECT sc.*,
             ix.imax_manufacturer, ix.imax_sound_system, ix.imax_projector_type,
             s4.s4d_manufacturer,  s4.s4d_sound_system,  s4.s4d_projector_type,
             s3.s3d_manufacturer,  s3.s3d_sound_system,  s3.s3d_projector_type,
             s2.s2d_manufacturer,  s2.s2d_projector_type
      FROM screens sc
      LEFT JOIN imax_screens ix ON sc.screen_no = ix.screen_id
      LEFT JOIN screen_4d    s4 ON sc.screen_no = s4.screen_id
      LEFT JOIN screen_3d    s3 ON sc.screen_no = s3.screen_id
      LEFT JOIN screen_2d    s2 ON sc.screen_no = s2.screen_id
      ORDER BY sc.screen_no
    `;
    res.json(screens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET screen by ID ───
router.get("/:id", async (req, res) => {
  try {
    const [screen] = await sql`
      SELECT sc.*,
             ix.imax_manufacturer, ix.imax_sound_system, ix.imax_projector_type,
             s4.s4d_manufacturer,  s4.s4d_sound_system,  s4.s4d_projector_type,
             s3.s3d_manufacturer,  s3.s3d_sound_system,  s3.s3d_projector_type,
             s2.s2d_manufacturer,  s2.s2d_projector_type
      FROM screens sc
      LEFT JOIN imax_screens ix ON sc.screen_no = ix.screen_id
      LEFT JOIN screen_4d    s4 ON sc.screen_no = s4.screen_id
      LEFT JOIN screen_3d    s3 ON sc.screen_no = s3.screen_id
      LEFT JOIN screen_2d    s2 ON sc.screen_no = s2.screen_id
      WHERE sc.screen_no = ${req.params.id}
    `;
    if (!screen) return res.status(404).json({ error: "Screen not found" });
    res.json(screen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST create a screen ───
router.post("/", async (req, res) => {
  try {
    const { screen_size, screen_status, seat_count, screen_type, ...specData } = req.body;
    const [screen] = await sql`
      INSERT INTO screens (screen_size, screen_status, seat_count)
      VALUES (${screen_size}, ${screen_status || 'Active'}, ${seat_count || 0})
      RETURNING *
    `;

    // Insert into specialization table
    const id = screen.screen_no;
    if (screen_type === "IMAX") {
      await sql`INSERT INTO imax_screens (screen_id, imax_manufacturer, imax_sound_system, imax_projector_type)
                VALUES (${id}, ${specData.imax_manufacturer || null}, ${specData.imax_sound_system || null}, ${specData.imax_projector_type || null})`;
    } else if (screen_type === "4D") {
      await sql`INSERT INTO screen_4d (screen_id, s4d_manufacturer, s4d_sound_system, s4d_projector_type)
                VALUES (${id}, ${specData.s4d_manufacturer || null}, ${specData.s4d_sound_system || null}, ${specData.s4d_projector_type || null})`;
    } else if (screen_type === "3D") {
      await sql`INSERT INTO screen_3d (screen_id, s3d_manufacturer, s3d_sound_system, s3d_projector_type)
                VALUES (${id}, ${specData.s3d_manufacturer || null}, ${specData.s3d_sound_system || null}, ${specData.s3d_projector_type || null})`;
    } else if (screen_type === "2D") {
      await sql`INSERT INTO screen_2d (screen_id, s2d_manufacturer, s2d_projector_type)
                VALUES (${id}, ${specData.s2d_manufacturer || null}, ${specData.s2d_projector_type || null})`;
    }

    res.status(201).json(screen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT update a screen ───
router.put("/:id", async (req, res) => {
  try {
    const { screen_size, screen_status, seat_count } = req.body;
    const [screen] = await sql`
      UPDATE screens
      SET screen_size = ${screen_size}, screen_status = ${screen_status}, seat_count = ${seat_count}
      WHERE screen_no = ${req.params.id}
      RETURNING *
    `;
    if (!screen) return res.status(404).json({ error: "Screen not found" });
    res.json(screen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE a screen ───
router.delete("/:id", async (req, res) => {
  try {
    const [screen] = await sql`
      DELETE FROM screens WHERE screen_no = ${req.params.id} RETURNING *
    `;
    if (!screen) return res.status(404).json({ error: "Screen not found" });
    res.json({ message: "Screen deleted", screen });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET seats assigned to a screen ───
router.get("/:id/seats", async (req, res) => {
  try {
    const seats = await sql`
      SELECT s.* FROM seats s
      JOIN screen_seats ss ON s.seat_id = ss.seat_id
      WHERE ss.screen_no = ${req.params.id}
      ORDER BY s.seat_id
    `;
    res.json(seats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST assign a seat to a screen ───
router.post("/:screenNo/seats/:seatId", async (req, res) => {
  try {
    const [row] = await sql`
      INSERT INTO screen_seats (screen_no, seat_id)
      VALUES (${req.params.screenNo}, ${req.params.seatId})
      RETURNING *
    `;
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE remove a seat from a screen ───
router.delete("/:screenNo/seats/:seatId", async (req, res) => {
  try {
    const [row] = await sql`
      DELETE FROM screen_seats
      WHERE screen_no = ${req.params.screenNo} AND seat_id = ${req.params.seatId}
      RETURNING *
    `;
    if (!row) return res.status(404).json({ error: "Assignment not found" });
    res.json({ message: "Seat removed from screen", row });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET shows playing on a screen ───
router.get("/:id/shows", async (req, res) => {
  try {
    const shows = await sql`
      SELECT sh.* FROM shows sh
      JOIN played_on po ON sh.show_id = po.show_id
      WHERE po.screen_no = ${req.params.id}
      ORDER BY sh.show_date
    `;
    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
