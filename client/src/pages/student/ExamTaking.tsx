import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Flag, ChevronLeft, ChevronRight, Send, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useExamContext } from '@/contexts/ExamContext';
import { useTimer } from '@/hooks/useTimer';
import { StudentAnswer, Question, Exam } from '@/types/exam';
import { cn } from '@/lib/utils';

/**
 * Exam Taking Interface - Main exam interface with timer, questions, and navigation
 */
const ExamTaking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFullExam, addSubmission } = useExamContext();
  
  const [exam, setExam] = useState<Exam | undefined>(undefined);
  const [examLoading, setExamLoading] = useState(true);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [startedAt] = useState(new Date().toISOString());

  // Fetch full exam from API
  useEffect(() => {
    const loadExam = async () => {
      if (!id) return;
      setExamLoading(true);
      const fullExam = await getFullExam(id);
      setExam(fullExam);
      if (fullExam) {
        setAnswers(
          fullExam.questions.map(q => ({
            questionId: q.id,
            selectedOptionIds: [],
            isFlagged: false
          }))
        );
      }
      setExamLoading(false);
    };
    loadExam();
  }, [id, getFullExam]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    setShowTimeUpDialog(true);
  }, []);

  const timer = useTimer({
    initialTime: exam ? exam.duration * 60 : 0,
    onTimeUp: handleTimeUp,
    autoStart: true
  });

  if (examLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Exam not found</p>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  // Handle answer selection
  const handleSingleChoice = (optionId: string) => {
    setAnswers(prev => prev.map((a, i) => 
      i === currentQuestionIndex 
        ? { ...a, selectedOptionIds: [optionId] }
        : a
    ));
  };

  const handleMultipleChoice = (optionId: string, checked: boolean) => {
    setAnswers(prev => prev.map((a, i) => {
      if (i !== currentQuestionIndex) return a;
      const newIds = checked 
        ? [...a.selectedOptionIds, optionId]
        : a.selectedOptionIds.filter(id => id !== optionId);
      return { ...a, selectedOptionIds: newIds };
    }));
  };

  const toggleFlag = () => {
    setAnswers(prev => prev.map((a, i) => 
      i === currentQuestionIndex 
        ? { ...a, isFlagged: !a.isFlagged }
        : a
    ));
  };

  // Navigation
  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Submit exam
  const handleSubmit = async () => {
    timer.pause();
    const submittedAt = new Date().toISOString();
    const timeTaken = exam.duration * 60 - timer.timeRemaining;

    try {
      // Submit to backend — server auto-grades
      const submission = await addSubmission({
        examId: exam.id,
        studentId: 'current-student',
        studentName: 'Current Student',
        studentEmail: 'student@example.com',
        answers,
        startedAt,
        submittedAt,
        timeTaken,
      });
      
      // Navigate to results with submission data
      navigate(`/student/exam/${exam.id}/results`, { 
        state: { submission, exam }
      });
    } catch (error) {
      console.error('Failed to submit exam:', error);
    }
  };

  // Calculate progress
  const answeredCount = answers.filter(a => a.selectedOptionIds.length > 0).length;
  const flaggedCount = answers.filter(a => a.isFlagged).length;
  const progress = (answeredCount / exam.questions.length) * 100;

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Fixed Header with Timer */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold truncate">{exam.title}</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </p>
            </div>
            
            {/* Timer */}
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold",
              timer.isDanger && "bg-destructive/10 text-destructive animate-pulse",
              timer.isWarning && !timer.isDanger && "bg-warning/10 text-warning",
              !timer.isWarning && !timer.isDanger && "bg-secondary text-foreground"
            )}>
              <Clock className="h-5 w-5" />
              {timer.formattedTime}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>{answeredCount} of {exam.questions.length} answered</span>
              {flaggedCount > 0 && <span>{flaggedCount} flagged</span>}
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Question Panel */}
          <Card className="animate-fade-in">
            <CardContent className="p-6">
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">
                    {currentQuestion.type === 'single-choice' && 'Single Choice'}
                    {currentQuestion.type === 'multiple-choice' && 'Multiple Choice'}
                    {currentQuestion.type === 'true-false' && 'True / False'}
                  </Badge>
                  <Badge variant="secondary">
                    {currentQuestion.marks} marks
                  </Badge>
                </div>
                <Button
                  variant={currentAnswer?.isFlagged ? 'default' : 'outline'}
                  size="sm"
                  onClick={toggleFlag}
                  className="gap-2"
                >
                  <Flag className={cn("h-4 w-4", currentAnswer?.isFlagged && "fill-current")} />
                  {currentAnswer?.isFlagged ? 'Flagged' : 'Flag'}
                </Button>
              </div>

              {/* Question Text */}
              <h2 className="text-lg font-medium mb-6">
                {currentQuestionIndex + 1}. {currentQuestion.text}
              </h2>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.type === 'single-choice' || currentQuestion.type === 'true-false' ? (
                  <RadioGroup
                    value={currentAnswer?.selectedOptionIds[0] || ''}
                    onValueChange={handleSingleChoice}
                  >
                    {currentQuestion.options.map((option) => (
                      <Label
                        key={option.id}
                        htmlFor={option.id}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                          currentAnswer?.selectedOptionIds.includes(option.id)
                            ? "border-primary bg-primary/5"
                            : "hover:bg-secondary/50"
                        )}
                      >
                        <RadioGroupItem value={option.id} id={option.id} />
                        <span>{option.text}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground mb-2">
                      Select all correct answers
                    </p>
                    {currentQuestion.options.map((option) => (
                      <Label
                        key={option.id}
                        htmlFor={option.id}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                          currentAnswer?.selectedOptionIds.includes(option.id)
                            ? "border-primary bg-primary/5"
                            : "hover:bg-secondary/50"
                        )}
                      >
                        <Checkbox
                          id={option.id}
                          checked={currentAnswer?.selectedOptionIds.includes(option.id)}
                          onCheckedChange={(checked) => 
                            handleMultipleChoice(option.id, checked as boolean)
                          }
                        />
                        <span>{option.text}</span>
                      </Label>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={goToPrevious}
                  disabled={currentQuestionIndex === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                {currentQuestionIndex === exam.questions.length - 1 ? (
                  <Button
                    onClick={() => setShowSubmitDialog(true)}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Submit Exam
                  </Button>
                ) : (
                  <Button
                    onClick={goToNext}
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Question Navigation Grid - Desktop */}
          <div className="hidden lg:block">
            <Card className="sticky top-32">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Question Navigator</h3>
                <div className="grid grid-cols-5 gap-2">
                  {exam.questions.map((_, index) => {
                    const answer = answers[index];
                    const isAnswered = answer?.selectedOptionIds.length > 0;
                    const isFlagged = answer?.isFlagged;
                    const isCurrent = index === currentQuestionIndex;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => goToQuestion(index)}
                        className={cn(
                          "h-10 w-10 rounded-md text-sm font-medium transition-all",
                          isCurrent && "ring-2 ring-primary ring-offset-2",
                          isAnswered && !isCurrent && "bg-answered text-white",
                          isFlagged && !isAnswered && "bg-flagged text-white",
                          !isAnswered && !isFlagged && !isCurrent && "bg-secondary hover:bg-secondary/80"
                        )}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
                
                {/* Legend */}
                <div className="mt-6 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-answered" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-flagged" />
                    <span>Flagged</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-secondary" />
                    <span>Not answered</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={() => setShowSubmitDialog(true)}
                  className="w-full mt-6 gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit Exam
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Question Navigator - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-card border-t p-4">
        <div className="container">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {exam.questions.map((_, index) => {
              const answer = answers[index];
              const isAnswered = answer?.selectedOptionIds.length > 0;
              const isFlagged = answer?.isFlagged;
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={cn(
                    "h-8 w-8 shrink-0 rounded-md text-xs font-medium transition-all",
                    isCurrent && "ring-2 ring-primary",
                    isAnswered && !isCurrent && "bg-answered text-white",
                    isFlagged && !isAnswered && "bg-flagged text-white",
                    !isAnswered && !isFlagged && !isCurrent && "bg-secondary"
                  )}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Examination?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>Please review before submitting:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Answered: {answeredCount} of {exam.questions.length} questions</li>
                  {flaggedCount > 0 && (
                    <li className="text-warning">Flagged for review: {flaggedCount}</li>
                  )}
                  <li>Time remaining: {timer.formattedTime}</li>
                </ul>
                <p className="pt-2">
                  Once submitted, you cannot change your answers.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Answers</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              Submit Exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time Up Dialog */}
      <AlertDialog open={showTimeUpDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Time's Up!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your examination time has ended. Your answers will be submitted automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSubmit}>
              View Results
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExamTaking;
