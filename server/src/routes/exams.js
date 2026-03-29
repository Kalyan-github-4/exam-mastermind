import { Router } from "express";
import { db } from "../db/index.js";
import {
  exams,
  questions,
  options,
} from "../db/schema.js";
import { eq, desc, asc, count } from "drizzle-orm";


const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/exams — List all exams (without questions for performance)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const allExams = await db
      .select()
      .from(exams)
      .orderBy(desc(exams.createdAt));

    // Attach question count for each exam
    const examsWithCounts = await Promise.all(
      allExams.map(async (exam) => {
        const [result] = await db
          .select({ count: count() })
          .from(questions)
          .where(eq(questions.examId, exam.id));

        return {
          ...exam,
          questionCount: result.count,
        };
      })
    );

    res.json(examsWithCounts);
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ error: "Failed to fetch exams" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/exams/:id — Get a single exam with all questions & options
// ─────────────────────────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await db.query.exams.findFirst({
      where: eq(exams.id, id),
    });

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    // Fetch questions with options
    const examQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.examId, id))
      .orderBy(asc(questions.sortOrder));

    const questionsWithOptions = await Promise.all(
      examQuestions.map(async (question) => {
        const questionOptions = await db
          .select()
          .from(options)
          .where(eq(options.questionId, question.id))
          .orderBy(asc(options.sortOrder));

        return {
          ...question,
          options: questionOptions,
        };
      })
    );

    res.json({
      ...exam,
      questions: questionsWithOptions,
    });
  } catch (error) {
    console.error("Error fetching exam:", error);
    res.status(500).json({ error: "Failed to fetch exam" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/exams — Create a new exam with questions & options
// ─────────────────────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const {
      title,
      subject,
      description,
      instructions,
      duration,
      totalMarks,
      passingMarks,
      startDate,
      endDate,
      status,
      questions: questionsList,
    } = req.body;

    // Insert exam
    const [newExam] = await db
      .insert(exams)
      .values({
        title,
        subject,
        description: description || "",
        instructions: instructions || [],
        duration,
        totalMarks,
        passingMarks,
        startDate,
        endDate,
        status: status || "draft",
      })
      .returning();

    // Insert questions and options
    if (questionsList && questionsList.length > 0) {
      for (let i = 0; i < questionsList.length; i++) {
        const q = questionsList[i];
        const [newQuestion] = await db
          .insert(questions)
          .values({
            examId: newExam.id,
            text: q.text,
            type: q.type,
            marks: q.marks,
            explanation: q.explanation || null,
            sortOrder: i,
          })
          .returning();

        if (q.options && q.options.length > 0) {
          await db.insert(options).values(
            q.options.map((opt, j) => ({
              questionId: newQuestion.id,
              text: opt.text,
              isCorrect: opt.isCorrect || false,
              sortOrder: j,
            }))
          );
        }
      }
    }

    // Return the full exam
    const fullExam = await getFullExam(newExam.id);
    res.status(201).json(fullExam);
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ error: "Failed to create exam" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/exams/:id — Update an exam (including questions & options)
// ─────────────────────────────────────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subject,
      description,
      instructions,
      duration,
      totalMarks,
      passingMarks,
      startDate,
      endDate,
      status,
      questions: questionsList,
    } = req.body;

    // Check existence
    const existing = await db.query.exams.findFirst({
      where: eq(exams.id, id),
    });

    if (!existing) {
      return res.status(404).json({ error: "Exam not found" });
    }

    // Update exam fields
    await db
      .update(exams)
      .set({
        title,
        subject,
        description,
        instructions,
        duration,
        totalMarks,
        passingMarks,
        startDate,
        endDate,
        status,
        updatedAt: new Date(),
      })
      .where(eq(exams.id, id));

    // Replace questions: delete old, insert new
    if (questionsList) {
      // Cascade will remove options and student answers
      await db.delete(questions).where(eq(questions.examId, id));

      for (let i = 0; i < questionsList.length; i++) {
        const q = questionsList[i];
        const [newQuestion] = await db
          .insert(questions)
          .values({
            examId: id,
            text: q.text,
            type: q.type,
            marks: q.marks,
            explanation: q.explanation || null,
            sortOrder: i,
          })
          .returning();

        if (q.options && q.options.length > 0) {
          await db.insert(options).values(
            q.options.map((opt, j) => ({
              questionId: newQuestion.id,
              text: opt.text,
              isCorrect: opt.isCorrect || false,
              sortOrder: j,
            }))
          );
        }
      }
    }

    const fullExam = await getFullExam(id);
    res.json(fullExam);
  } catch (error) {
    console.error("Error updating exam:", error);
    res.status(500).json({ error: "Failed to update exam" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/exams/:id — Delete an exam (cascade deletes questions, options)
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db.query.exams.findFirst({
      where: eq(exams.id, id),
    });

    if (!existing) {
      return res.status(404).json({ error: "Exam not found" });
    }

    await db.delete(exams).where(eq(exams.id, id));
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.error("Error deleting exam:", error);
    res.status(500).json({ error: "Failed to delete exam" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Helper: fetch a full exam with nested questions + options
// ─────────────────────────────────────────────────────────────────────────────
async function getFullExam(examId) {
  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, examId),
  });

  if (!exam) return null;

  const examQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.examId, examId))
    .orderBy(asc(questions.sortOrder));

  const questionsWithOptions = await Promise.all(
    examQuestions.map(async (question) => {
      const questionOptions = await db
        .select()
        .from(options)
        .where(eq(options.questionId, question.id))
        .orderBy(asc(options.sortOrder));

      return {
        ...question,
        options: questionOptions,
      };
    })
  );

  return {
    ...exam,
    questions: questionsWithOptions,
  };
}

export default router;
