import "dotenv/config";
import express from "express";
import cors from "cors";
import examRoutes from "./routes/exams.js";
import submissionRoutes from "./routes/submissions.js";
import statisticsRoutes from "./routes/statistics.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests from any localhost port (dev) or the configured client URL
      if (!origin || origin.match(/^https?:\/\/localhost(:\d+)?$/)) {
        callback(null, true);
      } else if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

// ── Health check ─────────────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Routes ───────────────────────────────────────────────────────────────────

app.use("/api/exams", examRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/statistics", statisticsRoutes);

// ── Error handler ────────────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API docs:`);
  console.log(`   GET    /api/health`);
  console.log(`   GET    /api/exams`);
  console.log(`   GET    /api/exams/:id`);
  console.log(`   POST   /api/exams`);
  console.log(`   PUT    /api/exams/:id`);
  console.log(`   DELETE /api/exams/:id`);
  console.log(`   GET    /api/submissions`);
  console.log(`   GET    /api/submissions/:id`);
  console.log(`   POST   /api/submissions`);
  console.log(`   GET    /api/statistics`);
});
