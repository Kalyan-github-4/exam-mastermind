import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Exam, ExamSubmission } from '@/types/exam';
import { examApi, submissionApi, statisticsApi, ApiExam, ApiSubmission, ApiStatistics } from '@/lib/api';

// ── Helpers: convert API shapes to frontend types ──────────────────────────

function apiExamToExam(apiExam: ApiExam): Exam {
  return {
    id: apiExam.id,
    title: apiExam.title,
    subject: apiExam.subject,
    description: apiExam.description,
    instructions: apiExam.instructions || [],
    duration: apiExam.duration,
    totalMarks: apiExam.totalMarks,
    passingMarks: apiExam.passingMarks,
    startDate: apiExam.startDate,
    endDate: apiExam.endDate,
    status: apiExam.status,
    createdAt: apiExam.createdAt,
    questionCount: apiExam.questionCount,
    questions: (apiExam.questions || []).map(q => ({
      id: q.id,
      text: q.text,
      type: q.type,
      marks: q.marks,
      explanation: q.explanation || undefined,
      options: (q.options || []).map(o => ({
        id: o.id,
        text: o.text,
        isCorrect: o.isCorrect,
      })),
    })),
  };
}

function apiSubmissionToSubmission(s: ApiSubmission): ExamSubmission {
  return {
    id: s.id,
    examId: s.examId,
    studentId: s.studentId,
    studentName: s.studentName,
    studentEmail: s.studentEmail,
    answers: s.answers.map(a => ({
      questionId: a.questionId,
      selectedOptionIds: a.selectedOptionIds,
      isFlagged: a.isFlagged,
    })),
    startedAt: s.startedAt,
    submittedAt: s.submittedAt,
    score: s.score,
    totalMarks: s.totalMarks,
    percentage: s.percentage,
    passed: s.passed,
    timeTaken: s.timeTaken,
  };
}

// ── Context interface ──────────────────────────────────────────────────────

interface ExamContextType {
  exams: Exam[];
  submissions: ExamSubmission[];
  statistics: ApiStatistics | null;
  loading: boolean;
  error: string | null;
  refreshExams: () => Promise<void>;
  refreshSubmissions: (examId?: string) => Promise<void>;
  refreshStatistics: () => Promise<void>;
  addExam: (examData: Omit<Exam, 'id'>) => Promise<Exam>;
  updateExam: (id: string, examData: Partial<Exam>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  getExamById: (id: string) => Exam | undefined;
  getFullExam: (id: string) => Promise<Exam | undefined>;
  getSubmissionsByExamId: (examId: string) => ExamSubmission[];
  addSubmission: (submission: {
    examId: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    answers: { questionId: string; selectedOptionIds: string[]; isFlagged: boolean }[];
    startedAt: string;
    submittedAt: string;
    timeTaken: number;
  }) => Promise<ExamSubmission>;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────────────────────

export const ExamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [statistics, setStatistics] = useState<ApiStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all exams (list view — no questions, has questionCount)
  const refreshExams = useCallback(async () => {
    try {
      setError(null);
      const data = await examApi.list();
      setExams(data.map(apiExamToExam));
    } catch (err: any) {
      console.error('Failed to fetch exams:', err);
      setError(err.message);
    }
  }, []);

  // Fetch submissions
  const refreshSubmissions = useCallback(async (examId?: string) => {
    try {
      const data = await submissionApi.list(examId);
      setSubmissions(data.map(apiSubmissionToSubmission));
    } catch (err: any) {
      console.error('Failed to fetch submissions:', err);
    }
  }, []);

  // Fetch statistics
  const refreshStatistics = useCallback(async () => {
    try {
      const data = await statisticsApi.get();
      setStatistics(data);
    } catch (err: any) {
      console.error('Failed to fetch statistics:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([refreshExams(), refreshSubmissions(), refreshStatistics()]);
      setLoading(false);
    };
    init();
  }, [refreshExams, refreshSubmissions, refreshStatistics]);

  // Create exam
  const addExam = useCallback(async (examData: Omit<Exam, 'id'>) => {
    const apiExam = await examApi.create({
      title: examData.title,
      subject: examData.subject,
      description: examData.description,
      instructions: examData.instructions,
      duration: examData.duration,
      totalMarks: examData.totalMarks,
      passingMarks: examData.passingMarks,
      startDate: examData.startDate,
      endDate: examData.endDate,
      status: examData.status,
      questions: examData.questions?.map(q => ({
        text: q.text,
        type: q.type,
        marks: q.marks,
        explanation: q.explanation,
        options: q.options.map(o => ({
          text: o.text,
          isCorrect: o.isCorrect,
        })),
      })),
    });
    const newExam = apiExamToExam(apiExam);
    setExams(prev => [newExam, ...prev]);
    refreshStatistics();
    return newExam;
  }, [refreshStatistics]);

  // Update exam
  const updateExam = useCallback(async (id: string, examData: Partial<Exam>) => {
    // Need full exam data for PUT
    const existing = exams.find(e => e.id === id);
    if (!existing) throw new Error('Exam not found');

    const merged = { ...existing, ...examData };
    await examApi.update(id, {
      title: merged.title,
      subject: merged.subject,
      description: merged.description,
      instructions: merged.instructions,
      duration: merged.duration,
      totalMarks: merged.totalMarks,
      passingMarks: merged.passingMarks,
      startDate: merged.startDate,
      endDate: merged.endDate,
      status: merged.status,
      questions: merged.questions?.map(q => ({
        text: q.text,
        type: q.type,
        marks: q.marks,
        explanation: q.explanation,
        options: q.options.map(o => ({
          text: o.text,
          isCorrect: o.isCorrect,
        })),
      })),
    });
    await refreshExams();
  }, [exams, refreshExams]);

  // Delete exam
  const deleteExam = useCallback(async (id: string) => {
    await examApi.delete(id);
    setExams(prev => prev.filter(e => e.id !== id));
    refreshStatistics();
  }, [refreshStatistics]);

  // Get exam from local cache (list data — no questions)
  const getExamById = useCallback((id: string) => {
    return exams.find(exam => exam.id === id);
  }, [exams]);

  // Fetch full exam with questions from API
  const getFullExam = useCallback(async (id: string): Promise<Exam | undefined> => {
    try {
      const apiExam = await examApi.get(id);
      return apiExamToExam(apiExam);
    } catch {
      return undefined;
    }
  }, []);

  // Get submissions from local cache
  const getSubmissionsByExamId = useCallback((examId: string) => {
    return submissions.filter(sub => sub.examId === examId);
  }, [submissions]);

  // Submit exam (sends to backend for auto-grading)
  const addSubmission = useCallback(async (data: {
    examId: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    answers: { questionId: string; selectedOptionIds: string[]; isFlagged: boolean }[];
    startedAt: string;
    submittedAt: string;
    timeTaken: number;
  }) => {
    const apiSubmission = await submissionApi.submit(data);
    const newSubmission = apiSubmissionToSubmission(apiSubmission);
    setSubmissions(prev => [newSubmission, ...prev]);
    refreshStatistics();
    return newSubmission;
  }, [refreshStatistics]);

  return (
    <ExamContext.Provider value={{
      exams,
      submissions,
      statistics,
      loading,
      error,
      refreshExams,
      refreshSubmissions,
      refreshStatistics,
      addExam,
      updateExam,
      deleteExam,
      getExamById,
      getFullExam,
      getSubmissionsByExamId,
      addSubmission,
    }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExamContext = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExamContext must be used within an ExamProvider');
  }
  return context;
};
