// Mock data for the Online Examination System
import { Exam, ExamSubmission, ExamStatistics } from '@/types/exam';

export const mockExams: Exam[] = [
  {
    id: 'exam-1',
    title: 'Introduction to Computer Science',
    subject: 'Computer Science',
    description: 'A comprehensive examination covering fundamental concepts of computer science including algorithms, data structures, and programming basics.',
    instructions: [
      'Read each question carefully before answering.',
      'All questions are mandatory.',
      'There is no negative marking.',
      'You can navigate between questions using the question panel.',
      'Flagged questions can be reviewed before final submission.',
      'Once submitted, answers cannot be changed.'
    ],
    duration: 60,
    totalMarks: 50,
    passingMarks: 25,
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    status: 'published',
    createdAt: '2025-12-15',
    questions: [
      {
        id: 'q1',
        text: 'What is the time complexity of binary search algorithm?',
        type: 'single-choice',
        marks: 5,
        options: [
          { id: 'q1-a', text: 'O(n)', isCorrect: false },
          { id: 'q1-b', text: 'O(log n)', isCorrect: true },
          { id: 'q1-c', text: 'O(n²)', isCorrect: false },
          { id: 'q1-d', text: 'O(1)', isCorrect: false }
        ],
        explanation: 'Binary search divides the search interval in half each time, resulting in O(log n) complexity.'
      },
      {
        id: 'q2',
        text: 'Which of the following are valid data types in JavaScript?',
        type: 'multiple-choice',
        marks: 5,
        options: [
          { id: 'q2-a', text: 'String', isCorrect: true },
          { id: 'q2-b', text: 'Number', isCorrect: true },
          { id: 'q2-c', text: 'Character', isCorrect: false },
          { id: 'q2-d', text: 'Boolean', isCorrect: true }
        ],
        explanation: 'JavaScript has String, Number, Boolean, undefined, null, Symbol, and BigInt as primitive types. Character is not a separate type.'
      },
      {
        id: 'q3',
        text: 'A stack data structure follows the LIFO (Last In First Out) principle.',
        type: 'true-false',
        marks: 5,
        options: [
          { id: 'q3-a', text: 'True', isCorrect: true },
          { id: 'q3-b', text: 'False', isCorrect: false }
        ],
        explanation: 'Stack is a LIFO data structure where the last element added is the first one to be removed.'
      },
      {
        id: 'q4',
        text: 'Which sorting algorithm has the best average-case time complexity?',
        type: 'single-choice',
        marks: 5,
        options: [
          { id: 'q4-a', text: 'Bubble Sort', isCorrect: false },
          { id: 'q4-b', text: 'Selection Sort', isCorrect: false },
          { id: 'q4-c', text: 'Quick Sort', isCorrect: true },
          { id: 'q4-d', text: 'Insertion Sort', isCorrect: false }
        ],
        explanation: 'Quick Sort has an average-case time complexity of O(n log n), which is optimal for comparison-based sorting.'
      },
      {
        id: 'q5',
        text: 'HTML stands for HyperText Markup Language.',
        type: 'true-false',
        marks: 5,
        options: [
          { id: 'q5-a', text: 'True', isCorrect: true },
          { id: 'q5-b', text: 'False', isCorrect: false }
        ]
      },
      {
        id: 'q6',
        text: 'Which of the following are characteristics of Object-Oriented Programming?',
        type: 'multiple-choice',
        marks: 10,
        options: [
          { id: 'q6-a', text: 'Encapsulation', isCorrect: true },
          { id: 'q6-b', text: 'Polymorphism', isCorrect: true },
          { id: 'q6-c', text: 'Compilation', isCorrect: false },
          { id: 'q6-d', text: 'Inheritance', isCorrect: true }
        ],
        explanation: 'The four main pillars of OOP are Encapsulation, Polymorphism, Inheritance, and Abstraction.'
      },
      {
        id: 'q7',
        text: 'What is the output of 2 + "2" in JavaScript?',
        type: 'single-choice',
        marks: 5,
        options: [
          { id: 'q7-a', text: '4', isCorrect: false },
          { id: 'q7-b', text: '"22"', isCorrect: true },
          { id: 'q7-c', text: 'NaN', isCorrect: false },
          { id: 'q7-d', text: 'Error', isCorrect: false }
        ],
        explanation: 'In JavaScript, when adding a number to a string, the number is converted to a string and concatenated.'
      },
      {
        id: 'q8',
        text: 'A queue data structure follows the FIFO (First In First Out) principle.',
        type: 'true-false',
        marks: 5,
        options: [
          { id: 'q8-a', text: 'True', isCorrect: true },
          { id: 'q8-b', text: 'False', isCorrect: false }
        ]
      },
      {
        id: 'q9',
        text: 'Which of the following are valid ways to declare a variable in JavaScript?',
        type: 'multiple-choice',
        marks: 5,
        options: [
          { id: 'q9-a', text: 'var', isCorrect: true },
          { id: 'q9-b', text: 'let', isCorrect: true },
          { id: 'q9-c', text: 'const', isCorrect: true },
          { id: 'q9-d', text: 'define', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-2',
    title: 'Database Management Systems',
    subject: 'Database',
    description: 'Test your knowledge of database concepts, SQL queries, normalization, and transaction management.',
    instructions: [
      'Read each question carefully.',
      'Multiple choice questions may have more than one correct answer.',
      'Time management is crucial.',
      'Review your answers before submission.'
    ],
    duration: 45,
    totalMarks: 40,
    passingMarks: 20,
    startDate: '2026-01-05',
    endDate: '2026-02-05',
    status: 'published',
    createdAt: '2025-12-20',
    questions: [
      {
        id: 'db-q1',
        text: 'What does SQL stand for?',
        type: 'single-choice',
        marks: 5,
        options: [
          { id: 'db-q1-a', text: 'Structured Query Language', isCorrect: true },
          { id: 'db-q1-b', text: 'Simple Query Language', isCorrect: false },
          { id: 'db-q1-c', text: 'Standard Query Language', isCorrect: false },
          { id: 'db-q1-d', text: 'Sequential Query Language', isCorrect: false }
        ]
      },
      {
        id: 'db-q2',
        text: 'Which of the following are types of SQL commands?',
        type: 'multiple-choice',
        marks: 10,
        options: [
          { id: 'db-q2-a', text: 'DDL (Data Definition Language)', isCorrect: true },
          { id: 'db-q2-b', text: 'DML (Data Manipulation Language)', isCorrect: true },
          { id: 'db-q2-c', text: 'DCL (Data Control Language)', isCorrect: true },
          { id: 'db-q2-d', text: 'DPL (Data Processing Language)', isCorrect: false }
        ]
      },
      {
        id: 'db-q3',
        text: 'PRIMARY KEY can contain NULL values.',
        type: 'true-false',
        marks: 5,
        options: [
          { id: 'db-q3-a', text: 'True', isCorrect: false },
          { id: 'db-q3-b', text: 'False', isCorrect: true }
        ]
      },
      {
        id: 'db-q4',
        text: 'Which normal form removes transitive dependencies?',
        type: 'single-choice',
        marks: 5,
        options: [
          { id: 'db-q4-a', text: '1NF', isCorrect: false },
          { id: 'db-q4-b', text: '2NF', isCorrect: false },
          { id: 'db-q4-c', text: '3NF', isCorrect: true },
          { id: 'db-q4-d', text: 'BCNF', isCorrect: false }
        ]
      },
      {
        id: 'db-q5',
        text: 'ACID properties ensure reliable transaction processing in databases.',
        type: 'true-false',
        marks: 5,
        options: [
          { id: 'db-q5-a', text: 'True', isCorrect: true },
          { id: 'db-q5-b', text: 'False', isCorrect: false }
        ]
      },
      {
        id: 'db-q6',
        text: 'Which JOIN returns all rows when there is a match in either table?',
        type: 'single-choice',
        marks: 5,
        options: [
          { id: 'db-q6-a', text: 'INNER JOIN', isCorrect: false },
          { id: 'db-q6-b', text: 'LEFT JOIN', isCorrect: false },
          { id: 'db-q6-c', text: 'RIGHT JOIN', isCorrect: false },
          { id: 'db-q6-d', text: 'FULL OUTER JOIN', isCorrect: true }
        ]
      },
      {
        id: 'db-q7',
        text: 'Which of the following are aggregate functions in SQL?',
        type: 'multiple-choice',
        marks: 5,
        options: [
          { id: 'db-q7-a', text: 'COUNT()', isCorrect: true },
          { id: 'db-q7-b', text: 'SUM()', isCorrect: true },
          { id: 'db-q7-c', text: 'SELECT()', isCorrect: false },
          { id: 'db-q7-d', text: 'AVG()', isCorrect: true }
        ]
      }
    ]
  },
  {
    id: 'exam-3',
    title: 'Web Development Fundamentals',
    subject: 'Web Development',
    description: 'Assess your understanding of HTML, CSS, JavaScript, and modern web development practices.',
    instructions: [
      'This exam covers front-end web development concepts.',
      'Pay attention to code snippets in questions.',
      'Flag difficult questions and return to them later.'
    ],
    duration: 30,
    totalMarks: 30,
    passingMarks: 15,
    startDate: '2026-01-10',
    endDate: '2026-01-20',
    status: 'published',
    createdAt: '2025-12-25',
    questions: [
      {
        id: 'web-q1',
        text: 'Which HTML tag is used to define an internal style sheet?',
        type: 'single-choice',
        marks: 5,
        options: [
          { id: 'web-q1-a', text: '<css>', isCorrect: false },
          { id: 'web-q1-b', text: '<style>', isCorrect: true },
          { id: 'web-q1-c', text: '<script>', isCorrect: false },
          { id: 'web-q1-d', text: '<link>', isCorrect: false }
        ]
      },
      {
        id: 'web-q2',
        text: 'CSS stands for Cascading Style Sheets.',
        type: 'true-false',
        marks: 5,
        options: [
          { id: 'web-q2-a', text: 'True', isCorrect: true },
          { id: 'web-q2-b', text: 'False', isCorrect: false }
        ]
      },
      {
        id: 'web-q3',
        text: 'Which of the following are CSS layout techniques?',
        type: 'multiple-choice',
        marks: 10,
        options: [
          { id: 'web-q3-a', text: 'Flexbox', isCorrect: true },
          { id: 'web-q3-b', text: 'Grid', isCorrect: true },
          { id: 'web-q3-c', text: 'Block', isCorrect: false },
          { id: 'web-q3-d', text: 'Float', isCorrect: true }
        ]
      },
      {
        id: 'web-q4',
        text: 'What does DOM stand for?',
        type: 'single-choice',
        marks: 5,
        options: [
          { id: 'web-q4-a', text: 'Document Object Model', isCorrect: true },
          { id: 'web-q4-b', text: 'Data Object Model', isCorrect: false },
          { id: 'web-q4-c', text: 'Document Order Model', isCorrect: false },
          { id: 'web-q4-d', text: 'Display Object Management', isCorrect: false }
        ]
      },
      {
        id: 'web-q5',
        text: 'JavaScript is a compiled programming language.',
        type: 'true-false',
        marks: 5,
        options: [
          { id: 'web-q5-a', text: 'True', isCorrect: false },
          { id: 'web-q5-b', text: 'False', isCorrect: true }
        ]
      }
    ]
  }
];

export const mockSubmissions: ExamSubmission[] = [
  {
    id: 'sub-1',
    examId: 'exam-1',
    studentId: 'std-1',
    studentName: 'John Smith',
    studentEmail: 'john.smith@university.edu',
    answers: [
      { questionId: 'q1', selectedOptionIds: ['q1-b'], isFlagged: false },
      { questionId: 'q2', selectedOptionIds: ['q2-a', 'q2-b', 'q2-d'], isFlagged: false },
      { questionId: 'q3', selectedOptionIds: ['q3-a'], isFlagged: false },
      { questionId: 'q4', selectedOptionIds: ['q4-c'], isFlagged: false },
      { questionId: 'q5', selectedOptionIds: ['q5-a'], isFlagged: false },
      { questionId: 'q6', selectedOptionIds: ['q6-a', 'q6-b', 'q6-d'], isFlagged: false },
      { questionId: 'q7', selectedOptionIds: ['q7-b'], isFlagged: false },
      { questionId: 'q8', selectedOptionIds: ['q8-a'], isFlagged: false },
      { questionId: 'q9', selectedOptionIds: ['q9-a', 'q9-b', 'q9-c'], isFlagged: false }
    ],
    startedAt: '2026-01-05T09:00:00Z',
    submittedAt: '2026-01-05T09:45:00Z',
    score: 50,
    totalMarks: 50,
    percentage: 100,
    passed: true,
    timeTaken: 2700
  },
  {
    id: 'sub-2',
    examId: 'exam-1',
    studentId: 'std-2',
    studentName: 'Emily Johnson',
    studentEmail: 'emily.j@university.edu',
    answers: [
      { questionId: 'q1', selectedOptionIds: ['q1-b'], isFlagged: false },
      { questionId: 'q2', selectedOptionIds: ['q2-a', 'q2-b'], isFlagged: false },
      { questionId: 'q3', selectedOptionIds: ['q3-b'], isFlagged: true },
      { questionId: 'q4', selectedOptionIds: ['q4-a'], isFlagged: false },
      { questionId: 'q5', selectedOptionIds: ['q5-a'], isFlagged: false },
      { questionId: 'q6', selectedOptionIds: ['q6-a', 'q6-b'], isFlagged: false },
      { questionId: 'q7', selectedOptionIds: ['q7-b'], isFlagged: false },
      { questionId: 'q8', selectedOptionIds: ['q8-a'], isFlagged: false },
      { questionId: 'q9', selectedOptionIds: ['q9-a', 'q9-b'], isFlagged: false }
    ],
    startedAt: '2026-01-05T10:00:00Z',
    submittedAt: '2026-01-05T10:55:00Z',
    score: 30,
    totalMarks: 50,
    percentage: 60,
    passed: true,
    timeTaken: 3300
  },
  {
    id: 'sub-3',
    examId: 'exam-1',
    studentId: 'std-3',
    studentName: 'Michael Brown',
    studentEmail: 'm.brown@university.edu',
    answers: [
      { questionId: 'q1', selectedOptionIds: ['q1-a'], isFlagged: false },
      { questionId: 'q2', selectedOptionIds: ['q2-a'], isFlagged: false },
      { questionId: 'q3', selectedOptionIds: ['q3-b'], isFlagged: false },
      { questionId: 'q4', selectedOptionIds: ['q4-b'], isFlagged: false },
      { questionId: 'q5', selectedOptionIds: ['q5-b'], isFlagged: false },
      { questionId: 'q6', selectedOptionIds: ['q6-c'], isFlagged: false },
      { questionId: 'q7', selectedOptionIds: ['q7-a'], isFlagged: false },
      { questionId: 'q8', selectedOptionIds: ['q8-b'], isFlagged: false },
      { questionId: 'q9', selectedOptionIds: ['q9-d'], isFlagged: false }
    ],
    startedAt: '2026-01-06T14:00:00Z',
    submittedAt: '2026-01-06T14:30:00Z',
    score: 5,
    totalMarks: 50,
    percentage: 10,
    passed: false,
    timeTaken: 1800
  },
  {
    id: 'sub-4',
    examId: 'exam-2',
    studentId: 'std-1',
    studentName: 'John Smith',
    studentEmail: 'john.smith@university.edu',
    answers: [
      { questionId: 'db-q1', selectedOptionIds: ['db-q1-a'], isFlagged: false },
      { questionId: 'db-q2', selectedOptionIds: ['db-q2-a', 'db-q2-b', 'db-q2-c'], isFlagged: false },
      { questionId: 'db-q3', selectedOptionIds: ['db-q3-b'], isFlagged: false },
      { questionId: 'db-q4', selectedOptionIds: ['db-q4-c'], isFlagged: false },
      { questionId: 'db-q5', selectedOptionIds: ['db-q5-a'], isFlagged: false },
      { questionId: 'db-q6', selectedOptionIds: ['db-q6-d'], isFlagged: false },
      { questionId: 'db-q7', selectedOptionIds: ['db-q7-a', 'db-q7-b', 'db-q7-d'], isFlagged: false }
    ],
    startedAt: '2026-01-07T11:00:00Z',
    submittedAt: '2026-01-07T11:40:00Z',
    score: 40,
    totalMarks: 40,
    percentage: 100,
    passed: true,
    timeTaken: 2400
  },
  {
    id: 'sub-5',
    examId: 'exam-2',
    studentId: 'std-4',
    studentName: 'Sarah Davis',
    studentEmail: 's.davis@university.edu',
    answers: [
      { questionId: 'db-q1', selectedOptionIds: ['db-q1-a'], isFlagged: false },
      { questionId: 'db-q2', selectedOptionIds: ['db-q2-a', 'db-q2-b'], isFlagged: false },
      { questionId: 'db-q3', selectedOptionIds: ['db-q3-a'], isFlagged: false },
      { questionId: 'db-q4', selectedOptionIds: ['db-q4-b'], isFlagged: false },
      { questionId: 'db-q5', selectedOptionIds: ['db-q5-a'], isFlagged: false },
      { questionId: 'db-q6', selectedOptionIds: ['db-q6-a'], isFlagged: false },
      { questionId: 'db-q7', selectedOptionIds: ['db-q7-a', 'db-q7-c'], isFlagged: false }
    ],
    startedAt: '2026-01-07T14:00:00Z',
    submittedAt: '2026-01-07T14:35:00Z',
    score: 15,
    totalMarks: 40,
    percentage: 37.5,
    passed: false,
    timeTaken: 2100
  }
];

export const mockStatistics: ExamStatistics = {
  totalExams: 3,
  totalSubmissions: 5,
  averageScore: 61.5,
  activeExams: 3,
  passRate: 60
};

// Helper function to get exam by ID
export const getExamById = (id: string): Exam | undefined => {
  return mockExams.find(exam => exam.id === id);
};

// Helper function to get submissions for an exam
export const getSubmissionsByExamId = (examId: string): ExamSubmission[] => {
  return mockSubmissions.filter(sub => sub.examId === examId);
};

// Helper function to calculate score for a submission
export const calculateScore = (exam: Exam, answers: { questionId: string; selectedOptionIds: string[] }[]): { score: number; results: { questionId: string; isCorrect: boolean; marksObtained: number }[] } => {
  let score = 0;
  const results: { questionId: string; isCorrect: boolean; marksObtained: number }[] = [];

  exam.questions.forEach(question => {
    const answer = answers.find(a => a.questionId === question.id);
    const correctOptionIds = question.options.filter(o => o.isCorrect).map(o => o.id);
    
    if (answer) {
      const selectedSet = new Set(answer.selectedOptionIds);
      const correctSet = new Set(correctOptionIds);
      
      // Check if all selected options are correct and all correct options are selected
      const isCorrect = 
        selectedSet.size === correctSet.size &&
        [...selectedSet].every(id => correctSet.has(id));
      
      const marksObtained = isCorrect ? question.marks : 0;
      score += marksObtained;
      results.push({ questionId: question.id, isCorrect, marksObtained });
    } else {
      results.push({ questionId: question.id, isCorrect: false, marksObtained: 0 });
    }
  });

  return { score, results };
};
