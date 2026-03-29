import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  real,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Enums ────────────────────────────────────────────────────────────────

export const questionTypeEnum = pgEnum("question_type", [
  "single-choice",
  "multiple-choice",
  "true-false",
]);

export const examStatusEnum = pgEnum("exam_status", [
  "draft",
  "published",
  "completed",
]);

// ── Exams ────────────────────────────────────────────────────────────────

export const exams = pgTable("exams", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull().default(""),
  instructions: jsonb("instructions").notNull().default([]),
  duration: integer("duration").notNull(), // minutes
  totalMarks: integer("total_marks").notNull(),
  passingMarks: integer("passing_marks").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  status: examStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ── Questions ────────────────────────────────────────────────────────────

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  examId: uuid("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  type: questionTypeEnum("type").notNull(),
  marks: integer("marks").notNull(),
  explanation: text("explanation"),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Options ──────────────────────────────────────────────────────────────

export const options = pgTable("options", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  isCorrect: boolean("is_correct").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Exam Submissions ────────────────────────────────────────────────────

export const examSubmissions = pgTable("exam_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  examId: uuid("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  studentId: text("student_id").notNull(),
  studentName: text("student_name").notNull(),
  studentEmail: text("student_email").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull(),
  score: integer("score").notNull(),
  totalMarks: integer("total_marks").notNull(),
  percentage: real("percentage").notNull(),
  passed: boolean("passed").notNull(),
  timeTaken: integer("time_taken").notNull(), // seconds
});

// ── Student Answers ─────────────────────────────────────────────────────

export const studentAnswers = pgTable("student_answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => examSubmissions.id, { onDelete: "cascade" }),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  selectedOptionIds: jsonb("selected_option_ids").notNull().default([]),
  isFlagged: boolean("is_flagged").notNull().default(false),
});

// ── Relations ───────────────────────────────────────────────────────────

export const examsRelations = relations(exams, ({ many }) => ({
  questions: many(questions),
  submissions: many(examSubmissions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  exam: one(exams, {
    fields: [questions.examId],
    references: [exams.id],
  }),
  options: many(options),
  studentAnswers: many(studentAnswers),
}));

export const optionsRelations = relations(options, ({ one }) => ({
  question: one(questions, {
    fields: [options.questionId],
    references: [questions.id],
  }),
}));

export const examSubmissionsRelations = relations(
  examSubmissions,
  ({ one, many }) => ({
    exam: one(exams, {
      fields: [examSubmissions.examId],
      references: [exams.id],
    }),
    answers: many(studentAnswers),
  })
);

export const studentAnswersRelations = relations(
  studentAnswers,
  ({ one }) => ({
    submission: one(examSubmissions, {
      fields: [studentAnswers.submissionId],
      references: [examSubmissions.id],
    }),
    question: one(questions, {
      fields: [studentAnswers.questionId],
      references: [questions.id],
    }),
  })
);

