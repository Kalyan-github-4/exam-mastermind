import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Exam, ExamSubmission } from '@/types/exam';
import { mockExams, mockSubmissions } from '@/data/mockData';

interface ExamContextType {
  exams: Exam[];
  submissions: ExamSubmission[];
  addExam: (exam: Exam) => void;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  getExamById: (id: string) => Exam | undefined;
  getSubmissionsByExamId: (examId: string) => ExamSubmission[];
  addSubmission: (submission: ExamSubmission) => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>(mockSubmissions);

  const addExam = useCallback((exam: Exam) => {
    setExams(prev => [...prev, exam]);
  }, []);

  const updateExam = useCallback((id: string, updates: Partial<Exam>) => {
    setExams(prev => prev.map(exam => 
      exam.id === id ? { ...exam, ...updates } : exam
    ));
  }, []);

  const deleteExam = useCallback((id: string) => {
    setExams(prev => prev.filter(exam => exam.id !== id));
  }, []);

  const getExamById = useCallback((id: string) => {
    return exams.find(exam => exam.id === id);
  }, [exams]);

  const getSubmissionsByExamId = useCallback((examId: string) => {
    return submissions.filter(sub => sub.examId === examId);
  }, [submissions]);

  const addSubmission = useCallback((submission: ExamSubmission) => {
    setSubmissions(prev => [...prev, submission]);
  }, []);

  return (
    <ExamContext.Provider value={{
      exams,
      submissions,
      addExam,
      updateExam,
      deleteExam,
      getExamById,
      getSubmissionsByExamId,
      addSubmission
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
