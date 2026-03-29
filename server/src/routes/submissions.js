import { Router } from "express";
import { db } from "../db/index.js";
import {
  exams,
  questions,
  options,
  examSubmissions,
  studentAnswers,
} from "../db/schema.js";
import { eq, desc, asc } from "drizzle-orm";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/submissions — List all submissions (optionally filter by examId)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { examId } = req.query;

    const allSubmissions = examId
      ? await db
          .select()
          .from(examSubmissions)
          .where(eq(examSubmissions.examId, examId))
          .orderBy(desc(examSubmissions.submittedAt))
      : await db
          .select()
          .from(examSubmissions)
          .orderBy(desc(examSubmissions.submittedAt));

    // Attach answers to each submission
    const submissionsWithAnswers = await Promise.all(
      allSubmissions.map(async (submission) => {
        const answers = await db
          .select()
          .from(studentAnswers)
          .where(eq(studentAnswers.submissionId, submission.id));

        return {
          ...submission,
          answers: answers.map((a) => ({
            questionId: a.questionId,
            selectedOptionIds: a.selectedOptionIds,
            isFlagged: a.isFlagged,
          })),
        };
      })
    );

    res.json(submissionsWithAnswers);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/submissions/:id — Get a single submission with answers
// ─────────────────────────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await db.query.examSubmissions.findFirst({
      where: eq(examSubmissions.id, id),
    });

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    const answers = await db
      .select()
      .from(studentAnswers)
      .where(eq(studentAnswers.submissionId, id));

    res.json({
      ...submission,
      answers: answers.map((a) => ({
        questionId: a.questionId,
        selectedOptionIds: a.selectedOptionIds,
        isFlagged: a.isFlagged,
      })),
    });
  } catch (error) {
    console.error("Error fetching submission:", error);
    res.status(500).json({ error: "Failed to fetch submission" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/submissions — Submit an exam (auto-grades)
// ─────────────────────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const {
      examId,
      studentId,
      studentName,
      studentEmail,
      answers: studentAnswersList,
      startedAt,
      submittedAt,
      timeTaken,
    } = req.body;

    // Fetch the exam with questions and options for grading
    const exam = await db.query.exams.findFirst({
      where: eq(exams.id, examId),
    });

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    // Fetch questions with correct options
    const examQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.examId, examId));

    const questionsWithOptions = await Promise.all(
      examQuestions.map(async (question) => {
        const questionOptions = await db
          .select()
          .from(options)
          .where(eq(options.questionId, question.id));
        return { ...question, options: questionOptions };
      })
    );

    // Auto-grade
    let score = 0;
    for (const question of questionsWithOptions) {
      const answer = studentAnswersList?.find(
        (a) => a.questionId === question.id
      );
      if (!answer) continue;

      const correctOptionIds = question.options
        .filter((o) => o.isCorrect)
        .map((o) => o.id);

      const selectedSet = new Set(answer.selectedOptionIds || []);
      const correctSet = new Set(correctOptionIds);

      const isCorrect =
        selectedSet.size === correctSet.size &&
        [...selectedSet].every((id) => correctSet.has(id));

      if (isCorrect) {
        score += question.marks;
      }
    }

    const totalMarks = exam.totalMarks;
    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    const passed = score >= exam.passingMarks;

    // Insert submission
    const [submission] = await db
      .insert(examSubmissions)
      .values({
        examId,
        studentId,
        studentName,
        studentEmail,
        startedAt: new Date(startedAt),
        submittedAt: new Date(submittedAt || new Date()),
        score,
        totalMarks,
        percentage,
        passed,
        timeTaken: timeTaken || 0,
      })
      .returning();

    // Insert student answers
    if (studentAnswersList && studentAnswersList.length > 0) {
      await db.insert(studentAnswers).values(
        studentAnswersList.map((a) => ({
          submissionId: submission.id,
          questionId: a.questionId,
          selectedOptionIds: a.selectedOptionIds || [],
          isFlagged: a.isFlagged || false,
        }))
      );
    }

    // Return full submission
    const fullAnswers = await db
      .select()
      .from(studentAnswers)
      .where(eq(studentAnswers.submissionId, submission.id));

    res.status(201).json({
      ...submission,
      answers: fullAnswers.map((a) => ({
        questionId: a.questionId,
        selectedOptionIds: a.selectedOptionIds,
        isFlagged: a.isFlagged,
      })),
    });
  } catch (error) {
    console.error("Error creating submission:", error);
    res.status(500).json({ error: "Failed to create submission" });
  }
});

export default router;
