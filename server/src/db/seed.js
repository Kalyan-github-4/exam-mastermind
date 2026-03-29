import "dotenv/config";
import { db } from "./index.js";
import {
  exams,
  questions,
  options,
  examSubmissions,
  studentAnswers,
} from "./schema.js";

const seedData = async () => {
  console.log("🌱 Seeding database...");

  // ── Clean existing data ────────────────────────────────────────────────
  await db.delete(studentAnswers);
  await db.delete(examSubmissions);
  await db.delete(options);
  await db.delete(questions);
  await db.delete(exams);

  // ── Seed Exams ─────────────────────────────────────────────────────────

  const [exam1] = await db
    .insert(exams)
    .values({
      title: "Introduction to Computer Science",
      subject: "Computer Science",
      description:
        "A comprehensive examination covering fundamental concepts of computer science including algorithms, data structures, and programming basics.",
      instructions: [
        "Read each question carefully before answering.",
        "All questions are mandatory.",
        "There is no negative marking.",
        "You can navigate between questions using the question panel.",
        "Flagged questions can be reviewed before final submission.",
        "Once submitted, answers cannot be changed.",
      ],
      duration: 60,
      totalMarks: 50,
      passingMarks: 25,
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      status: "published",
    })
    .returning();

  const [exam2] = await db
    .insert(exams)
    .values({
      title: "Database Management Systems",
      subject: "Database",
      description:
        "Test your knowledge of database concepts, SQL queries, normalization, and transaction management.",
      instructions: [
        "Read each question carefully.",
        "Multiple choice questions may have more than one correct answer.",
        "Time management is crucial.",
        "Review your answers before submission.",
      ],
      duration: 45,
      totalMarks: 40,
      passingMarks: 20,
      startDate: "2026-01-05",
      endDate: "2026-02-05",
      status: "published",
    })
    .returning();

  const [exam3] = await db
    .insert(exams)
    .values({
      title: "Web Development Fundamentals",
      subject: "Web Development",
      description:
        "Assess your understanding of HTML, CSS, JavaScript, and modern web development practices.",
      instructions: [
        "This exam covers front-end web development concepts.",
        "Pay attention to code snippets in questions.",
        "Flag difficult questions and return to them later.",
      ],
      duration: 30,
      totalMarks: 30,
      passingMarks: 15,
      startDate: "2026-01-10",
      endDate: "2026-01-20",
      status: "published",
    })
    .returning();

  console.log("  ✅ Exams seeded");

  // ── Seed Questions & Options for Exam 1 ────────────────────────────────

  const exam1Questions = [
    {
      text: "What is the time complexity of binary search algorithm?",
      type: "single-choice",
      marks: 5,
      explanation:
        "Binary search divides the search interval in half each time, resulting in O(log n) complexity.",
      sortOrder: 0,
      options: [
        { text: "O(n)", isCorrect: false },
        { text: "O(log n)", isCorrect: true },
        { text: "O(n²)", isCorrect: false },
        { text: "O(1)", isCorrect: false },
      ],
    },
    {
      text: "Which of the following are valid data types in JavaScript?",
      type: "multiple-choice",
      marks: 5,
      explanation:
        "JavaScript has String, Number, Boolean, undefined, null, Symbol, and BigInt as primitive types. Character is not a separate type.",
      sortOrder: 1,
      options: [
        { text: "String", isCorrect: true },
        { text: "Number", isCorrect: true },
        { text: "Character", isCorrect: false },
        { text: "Boolean", isCorrect: true },
      ],
    },
    {
      text: "A stack data structure follows the LIFO (Last In First Out) principle.",
      type: "true-false",
      marks: 5,
      explanation:
        "Stack is a LIFO data structure where the last element added is the first one to be removed.",
      sortOrder: 2,
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false },
      ],
    },
    {
      text: "Which sorting algorithm has the best average-case time complexity?",
      type: "single-choice",
      marks: 5,
      explanation:
        "Quick Sort has an average-case time complexity of O(n log n), which is optimal for comparison-based sorting.",
      sortOrder: 3,
      options: [
        { text: "Bubble Sort", isCorrect: false },
        { text: "Selection Sort", isCorrect: false },
        { text: "Quick Sort", isCorrect: true },
        { text: "Insertion Sort", isCorrect: false },
      ],
    },
    {
      text: "HTML stands for HyperText Markup Language.",
      type: "true-false",
      marks: 5,
      sortOrder: 4,
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false },
      ],
    },
    {
      text: "Which of the following are characteristics of Object-Oriented Programming?",
      type: "multiple-choice",
      marks: 10,
      explanation:
        "The four main pillars of OOP are Encapsulation, Polymorphism, Inheritance, and Abstraction.",
      sortOrder: 5,
      options: [
        { text: "Encapsulation", isCorrect: true },
        { text: "Polymorphism", isCorrect: true },
        { text: "Compilation", isCorrect: false },
        { text: "Inheritance", isCorrect: true },
      ],
    },
    {
      text: 'What is the output of 2 + "2" in JavaScript?',
      type: "single-choice",
      marks: 5,
      explanation:
        "In JavaScript, when adding a number to a string, the number is converted to a string and concatenated.",
      sortOrder: 6,
      options: [
        { text: "4", isCorrect: false },
        { text: '"22"', isCorrect: true },
        { text: "NaN", isCorrect: false },
        { text: "Error", isCorrect: false },
      ],
    },
    {
      text: "A queue data structure follows the FIFO (First In First Out) principle.",
      type: "true-false",
      marks: 5,
      sortOrder: 7,
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false },
      ],
    },
    {
      text: "Which of the following are valid ways to declare a variable in JavaScript?",
      type: "multiple-choice",
      marks: 5,
      sortOrder: 8,
      options: [
        { text: "var", isCorrect: true },
        { text: "let", isCorrect: true },
        { text: "const", isCorrect: true },
        { text: "define", isCorrect: false },
      ],
    },
  ];

  for (const q of exam1Questions) {
    const { options: opts, ...questionData } = q;
    const [question] = await db
      .insert(questions)
      .values({ ...questionData, examId: exam1.id })
      .returning();

    await db.insert(options).values(
      opts.map((opt, i) => ({
        ...opt,
        questionId: question.id,
        sortOrder: i,
      }))
    );
  }

  // ── Seed Questions & Options for Exam 2 ────────────────────────────────

  const exam2Questions = [
    {
      text: "What does SQL stand for?",
      type: "single-choice",
      marks: 5,
      sortOrder: 0,
      options: [
        { text: "Structured Query Language", isCorrect: true },
        { text: "Simple Query Language", isCorrect: false },
        { text: "Standard Query Language", isCorrect: false },
        { text: "Sequential Query Language", isCorrect: false },
      ],
    },
    {
      text: "Which of the following are types of SQL commands?",
      type: "multiple-choice",
      marks: 10,
      sortOrder: 1,
      options: [
        { text: "DDL (Data Definition Language)", isCorrect: true },
        { text: "DML (Data Manipulation Language)", isCorrect: true },
        { text: "DCL (Data Control Language)", isCorrect: true },
        { text: "DPL (Data Processing Language)", isCorrect: false },
      ],
    },
    {
      text: "PRIMARY KEY can contain NULL values.",
      type: "true-false",
      marks: 5,
      sortOrder: 2,
      options: [
        { text: "True", isCorrect: false },
        { text: "False", isCorrect: true },
      ],
    },
    {
      text: "Which normal form removes transitive dependencies?",
      type: "single-choice",
      marks: 5,
      sortOrder: 3,
      options: [
        { text: "1NF", isCorrect: false },
        { text: "2NF", isCorrect: false },
        { text: "3NF", isCorrect: true },
        { text: "BCNF", isCorrect: false },
      ],
    },
    {
      text: "ACID properties ensure reliable transaction processing in databases.",
      type: "true-false",
      marks: 5,
      sortOrder: 4,
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false },
      ],
    },
    {
      text: "Which JOIN returns all rows when there is a match in either table?",
      type: "single-choice",
      marks: 5,
      sortOrder: 5,
      options: [
        { text: "INNER JOIN", isCorrect: false },
        { text: "LEFT JOIN", isCorrect: false },
        { text: "RIGHT JOIN", isCorrect: false },
        { text: "FULL OUTER JOIN", isCorrect: true },
      ],
    },
    {
      text: "Which of the following are aggregate functions in SQL?",
      type: "multiple-choice",
      marks: 5,
      sortOrder: 6,
      options: [
        { text: "COUNT()", isCorrect: true },
        { text: "SUM()", isCorrect: true },
        { text: "SELECT()", isCorrect: false },
        { text: "AVG()", isCorrect: true },
      ],
    },
  ];

  for (const q of exam2Questions) {
    const { options: opts, ...questionData } = q;
    const [question] = await db
      .insert(questions)
      .values({ ...questionData, examId: exam2.id })
      .returning();

    await db.insert(options).values(
      opts.map((opt, i) => ({
        ...opt,
        questionId: question.id,
        sortOrder: i,
      }))
    );
  }

  // ── Seed Questions & Options for Exam 3 ────────────────────────────────

  const exam3Questions = [
    {
      text: "Which HTML tag is used to define an internal style sheet?",
      type: "single-choice",
      marks: 5,
      sortOrder: 0,
      options: [
        { text: "<css>", isCorrect: false },
        { text: "<style>", isCorrect: true },
        { text: "<script>", isCorrect: false },
        { text: "<link>", isCorrect: false },
      ],
    },
    {
      text: "CSS stands for Cascading Style Sheets.",
      type: "true-false",
      marks: 5,
      sortOrder: 1,
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false },
      ],
    },
    {
      text: "Which of the following are CSS layout techniques?",
      type: "multiple-choice",
      marks: 10,
      sortOrder: 2,
      options: [
        { text: "Flexbox", isCorrect: true },
        { text: "Grid", isCorrect: true },
        { text: "Block", isCorrect: false },
        { text: "Float", isCorrect: true },
      ],
    },
    {
      text: "What does DOM stand for?",
      type: "single-choice",
      marks: 5,
      sortOrder: 3,
      options: [
        { text: "Document Object Model", isCorrect: true },
        { text: "Data Object Model", isCorrect: false },
        { text: "Document Order Model", isCorrect: false },
        { text: "Display Object Management", isCorrect: false },
      ],
    },
    {
      text: "JavaScript is a compiled programming language.",
      type: "true-false",
      marks: 5,
      sortOrder: 4,
      options: [
        { text: "True", isCorrect: false },
        { text: "False", isCorrect: true },
      ],
    },
  ];

  for (const q of exam3Questions) {
    const { options: opts, ...questionData } = q;
    const [question] = await db
      .insert(questions)
      .values({ ...questionData, examId: exam3.id })
      .returning();

    await db.insert(options).values(
      opts.map((opt, i) => ({
        ...opt,
        questionId: question.id,
        sortOrder: i,
      }))
    );
  }

  console.log("  ✅ Questions & Options seeded");

  // ── Seed Submissions ───────────────────────────────────────────────────
  // Note: Submissions reference real question/option IDs, so we fetch them.

  const allExam1Questions = await db.query.questions.findMany({
    where: (q, { eq }) => eq(q.examId, exam1.id),
    orderBy: (q, { asc }) => asc(q.sortOrder),
    with: { options: true },
  });

  // Not seeding specific submissions since IDs are dynamic.
  // The seed endpoint provides the test data structure.

  console.log("  ✅ Seed completed successfully!");
  process.exit(0);
};

seedData().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
