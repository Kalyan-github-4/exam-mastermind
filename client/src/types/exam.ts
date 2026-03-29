// TypeScript types for the Online Examination System

export type QuestionType = 'single-choice' | 'multiple-choice' | 'true-false';

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: Option[];
  marks: number;
  explanation?: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  description: string;
  instructions: string[];
  duration: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  questions: Question[];
  questionCount?: number; // available from list API (without full questions)
  startDate: string;
  endDate: string;
  status: 'draft' | 'published' | 'completed';
  createdAt: string;
}

export interface StudentAnswer {
  questionId: string;
  selectedOptionIds: string[];
  isFlagged: boolean;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  answers: StudentAnswer[];
  startedAt: string;
  submittedAt: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  timeTaken: number; // in seconds
}

export interface ExamState {
  currentQuestionIndex: number;
  answers: StudentAnswer[];
  timeRemaining: number; // in seconds
  isSubmitted: boolean;
  startedAt: string | null;
}

export interface ExamStatistics {
  totalExams: number;
  totalSubmissions: number;
  averageScore: number;
  activeExams: number;
  passRate: number;
}

export interface QuestionResult {
  question: Question;
  selectedOptionIds: string[];
  correctOptionIds: string[];
  isCorrect: boolean;
  marksObtained: number;
}
