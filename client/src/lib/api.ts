/**
 * API client for the Exam Mastermind backend
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ── Exam Types (matching backend response) ─────────────────────────────────

export interface ApiOption {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
  sortOrder: number;
}

export interface ApiQuestion {
  id: string;
  examId: string;
  text: string;
  type: 'single-choice' | 'multiple-choice' | 'true-false';
  marks: number;
  explanation: string | null;
  sortOrder: number;
  options: ApiOption[];
}

export interface ApiExam {
  id: string;
  title: string;
  subject: string;
  description: string;
  instructions: string[];
  duration: number;
  totalMarks: number;
  passingMarks: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'published' | 'completed';
  createdAt: string;
  updatedAt: string;
  questions?: ApiQuestion[];
  questionCount?: number;
}

export interface ApiSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  startedAt: string;
  submittedAt: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  timeTaken: number;
  answers: {
    questionId: string;
    selectedOptionIds: string[];
    isFlagged: boolean;
  }[];
}

export interface ApiStatistics {
  totalExams: number;
  activeExams: number;
  totalSubmissions: number;
  averageScore: string;
  passRate: string;
}

// ── Exam API ───────────────────────────────────────────────────────────────

export const examApi = {
  /** List all exams (without questions, includes questionCount) */
  list: () => request<ApiExam[]>('/exams'),

  /** Get single exam with full questions & options */
  get: (id: string) => request<ApiExam>(`/exams/${id}`),

  /** Create a new exam with questions & options */
  create: (data: {
    title: string;
    subject: string;
    description?: string;
    instructions?: string[];
    duration: number;
    totalMarks: number;
    passingMarks: number;
    startDate: string;
    endDate: string;
    status?: string;
    questions?: {
      text: string;
      type: string;
      marks: number;
      explanation?: string;
      options?: { text: string; isCorrect: boolean }[];
    }[];
  }) =>
    request<ApiExam>('/exams', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** Update an existing exam */
  update: (
    id: string,
    data: {
      title: string;
      subject: string;
      description?: string;
      instructions?: string[];
      duration: number;
      totalMarks: number;
      passingMarks: number;
      startDate: string;
      endDate: string;
      status?: string;
      questions?: {
        text: string;
        type: string;
        marks: number;
        explanation?: string;
        options?: { text: string; isCorrect: boolean }[];
      }[];
    }
  ) =>
    request<ApiExam>(`/exams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** Delete an exam */
  delete: (id: string) =>
    request<{ message: string }>(`/exams/${id}`, { method: 'DELETE' }),
};

// ── Submission API ─────────────────────────────────────────────────────────

export const submissionApi = {
  /** List submissions, optionally filtered by examId */
  list: (examId?: string) =>
    request<ApiSubmission[]>(
      examId ? `/submissions?examId=${examId}` : '/submissions'
    ),

  /** Get a single submission */
  get: (id: string) => request<ApiSubmission>(`/submissions/${id}`),

  /** Submit an exam (auto-grades on server) */
  submit: (data: {
    examId: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    answers: {
      questionId: string;
      selectedOptionIds: string[];
      isFlagged: boolean;
    }[];
    startedAt: string;
    submittedAt: string;
    timeTaken: number;
  }) =>
    request<ApiSubmission>('/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ── Statistics API ─────────────────────────────────────────────────────────

export const statisticsApi = {
  /** Get dashboard statistics */
  get: () => request<ApiStatistics>('/statistics'),
};
