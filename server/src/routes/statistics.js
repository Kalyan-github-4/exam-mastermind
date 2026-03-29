import { Router } from "express";
import { db } from "../db/index.js";
import { exams, examSubmissions } from "../db/schema.js";
import { count, avg, eq, sql } from "drizzle-orm";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/statistics — Dashboard statistics
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    // Total exams
    const [examCount] = await db.select({ count: count() }).from(exams);

    // Active exams (status = 'published')
    const [activeCount] = await db
      .select({ count: count() })
      .from(exams)
      .where(eq(exams.status, "published"));

    // Total submissions
    const [submissionCount] = await db
      .select({ count: count() })
      .from(examSubmissions);

    // Average score percentage
    const [avgScore] = await db
      .select({ avg: avg(examSubmissions.percentage) })
      .from(examSubmissions);

    // Pass rate
    const [passCount] = await db
      .select({ count: count() })
      .from(examSubmissions)
      .where(eq(examSubmissions.passed, true));

    const totalSubs = submissionCount.count || 0;
    const passRate =
      totalSubs > 0 ? (passCount.count / totalSubs) * 100 : 0;

    res.json({
      totalExams: examCount.count,
      activeExams: activeCount.count,
      totalSubmissions: submissionCount.count,
      averageScore: parseFloat(avgScore.avg || 0).toFixed(1),
      passRate: parseFloat(passRate).toFixed(1),
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

export default router;
