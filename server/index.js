const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Route modules
const seatsRouter = require("./routes/seats");
const screensRouter = require("./routes/screens");
const showsRouter = require("./routes/shows");
const customersRouter = require("./routes/customers");
const bookingsRouter = require("./routes/bookings");
const reviewsRouter = require("./routes/reviews");

// Mount routes
app.use("/api/seats", seatsRouter);
app.use("/api/screens", screensRouter);
app.use("/api/shows", showsRouter);
app.use("/api/customers", customersRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/reviews", reviewsRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`🎬 Cinema API server running on http://localhost:${PORT}`);
});
