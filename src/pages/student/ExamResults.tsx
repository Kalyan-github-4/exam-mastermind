import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Trophy, ArrowLeft, Home, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Exam, ExamSubmission, Question } from '@/types/exam';
import { cn } from '@/lib/utils';

/**
 * Exam Results Page - Shows detailed results with question-by-question review
 */
const ExamResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { submission, exam } = location.state as { 
    submission: ExamSubmission; 
    exam: Exam 
  } || {};

  if (!submission || !exam) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <XCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Results Not Found</h2>
        <p className="text-muted-foreground mb-4">Unable to load examination results.</p>
        <Link to="/student">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // Format time taken
  const formatTimeTaken = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };

  // Get question result
  const getQuestionResult = (question: Question) => {
    const answer = submission.answers.find(a => a.questionId === question.id);
    const correctOptionIds = question.options.filter(o => o.isCorrect).map(o => o.id);
    const selectedOptionIds = answer?.selectedOptionIds || [];
    
    const selectedSet = new Set(selectedOptionIds);
    const correctSet = new Set(correctOptionIds);
    
    const isCorrect = 
      selectedSet.size === correctSet.size &&
      [...selectedSet].every(id => correctSet.has(id));

    return {
      isCorrect,
      selectedOptionIds,
      correctOptionIds,
      marksObtained: isCorrect ? question.marks : 0
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link to="/student">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Results Summary Card */}
      <Card className={cn(
        "border-2",
        submission.passed ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
      )}>
        <CardHeader className="text-center pb-2">
          {submission.passed ? (
            <Trophy className="h-16 w-16 text-success mx-auto mb-4" />
          ) : (
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          )}
          <CardTitle className="text-2xl">
            {submission.passed ? 'Congratulations!' : 'Better Luck Next Time'}
          </CardTitle>
          <CardDescription>
            {submission.passed 
              ? 'You have successfully passed the examination.' 
              : 'Unfortunately, you did not meet the passing criteria.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Score Display */}
          <div className="text-center py-6">
            <div className="text-5xl font-bold mb-2">
              {submission.score} / {submission.totalMarks}
            </div>
            <div className="text-2xl text-muted-foreground">
              {submission.percentage.toFixed(1)}%
            </div>
            <Progress 
              value={submission.percentage} 
              className={cn(
                "h-3 mt-4 max-w-md mx-auto",
                submission.passed ? "[&>div]:bg-success" : "[&>div]:bg-destructive"
              )} 
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 rounded-lg bg-card border">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-success" />
              <p className="text-xl font-bold">
                {exam.questions.filter(q => getQuestionResult(q).isCorrect).length}
              </p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-card border">
              <XCircle className="h-6 w-6 mx-auto mb-2 text-destructive" />
              <p className="text-xl font-bold">
                {exam.questions.filter(q => !getQuestionResult(q).isCorrect).length}
              </p>
              <p className="text-sm text-muted-foreground">Incorrect</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-card border">
              <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-xl font-bold">{formatTimeTaken(submission.timeTaken)}</p>
              <p className="text-sm text-muted-foreground">Time Taken</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-card border">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-warning" />
              <p className="text-xl font-bold">{exam.passingMarks}</p>
              <p className="text-sm text-muted-foreground">Passing Marks</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Review */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Review</CardTitle>
          <CardDescription>
            Review all questions with correct answers highlighted
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {exam.questions.map((question, index) => {
            const result = getQuestionResult(question);
            
            return (
              <div key={question.id} className="space-y-4">
                {index > 0 && <Separator />}
                
                <div className="pt-4 first:pt-0">
                  {/* Question Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge variant="outline">
                          Q{index + 1}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {question.type === 'single-choice' && 'Single Choice'}
                          {question.type === 'multiple-choice' && 'Multiple Choice'}
                          {question.type === 'true-false' && 'True/False'}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {question.marks} marks
                        </Badge>
                      </div>
                      <p className="font-medium">{question.text}</p>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                      result.isCorrect 
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    )}>
                      {result.isCorrect ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          +{result.marksObtained}
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          0
                        </>
                      )}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 ml-4">
                    {question.options.map((option) => {
                      const isSelected = result.selectedOptionIds.includes(option.id);
                      const isCorrect = option.isCorrect;
                      
                      return (
                        <div
                          key={option.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border",
                            isCorrect && "border-success bg-success/5",
                            isSelected && !isCorrect && "border-destructive bg-destructive/5",
                            !isSelected && !isCorrect && "border-border"
                          )}
                        >
                          <div className={cn(
                            "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                            isCorrect && "border-success bg-success text-white",
                            isSelected && !isCorrect && "border-destructive bg-destructive text-white",
                            !isSelected && !isCorrect && "border-border"
                          )}>
                            {isCorrect && <CheckCircle className="h-3 w-3" />}
                            {isSelected && !isCorrect && <XCircle className="h-3 w-3" />}
                          </div>
                          <span className={cn(
                            isCorrect && "font-medium text-success",
                            isSelected && !isCorrect && "text-destructive line-through"
                          )}>
                            {option.text}
                          </span>
                          {isSelected && (
                            <Badge variant="outline" className="ml-auto text-xs">
                              Your answer
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="mt-4 p-4 rounded-lg bg-secondary/50 ml-4">
                      <p className="text-sm text-muted-foreground">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
        <Link to="/student">
          <Button variant="outline" className="gap-2 w-full sm:w-auto">
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Button 
          onClick={() => navigate(`/student/exam/${exam.id}/instructions`)}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Retake Exam
        </Button>
      </div>
    </div>
  );
};

export default ExamResults;
