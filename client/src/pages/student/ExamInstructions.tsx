import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, FileText, AlertTriangle, CheckCircle, ArrowLeft, Play, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useExamContext } from '@/contexts/ExamContext';
import { Exam } from '@/types/exam';

/**
 * Exam Instructions Page - Shows exam details and rules before starting
 */
const ExamInstructions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFullExam } = useExamContext();
  
  const [exam, setExam] = useState<Exam | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExam = async () => {
      if (!id) return;
      setLoading(true);
      const fullExam = await getFullExam(id);
      setExam(fullExam);
      setLoading(false);
    };
    loadExam();
  }, [id, getFullExam]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Exam Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested examination does not exist.</p>
        <Link to="/student">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const questionTypeCounts = {
    'single-choice': exam.questions.filter(q => q.type === 'single-choice').length,
    'multiple-choice': exam.questions.filter(q => q.type === 'multiple-choice').length,
    'true-false': exam.questions.filter(q => q.type === 'true-false').length,
  };

  const handleStartExam = () => {
    navigate(`/student/exam/${exam.id}/take`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link to="/student">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Exam Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Badge variant="secondary" className="mb-2">
                {exam.subject}
              </Badge>
              <CardTitle className="text-2xl">{exam.title}</CardTitle>
              <CardDescription className="mt-2">
                {exam.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Exam Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{exam.duration}</p>
              <p className="text-sm text-muted-foreground">Minutes</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{exam.questions.length}</p>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{exam.totalMarks}</p>
              <p className="text-sm text-muted-foreground">Total Marks</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{exam.passingMarks}</p>
              <p className="text-sm text-muted-foreground">Passing Marks</p>
            </div>
          </div>

          {/* Question Type Breakdown */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Question Types</h3>
            <div className="flex flex-wrap gap-2">
              {questionTypeCounts['single-choice'] > 0 && (
                <Badge variant="outline" className="text-sm py-1 px-3">
                  Single Choice: {questionTypeCounts['single-choice']}
                </Badge>
              )}
              {questionTypeCounts['multiple-choice'] > 0 && (
                <Badge variant="outline" className="text-sm py-1 px-3">
                  Multiple Choice: {questionTypeCounts['multiple-choice']}
                </Badge>
              )}
              {questionTypeCounts['true-false'] > 0 && (
                <Badge variant="outline" className="text-sm py-1 px-3">
                  True/False: {questionTypeCounts['true-false']}
                </Badge>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Instructions */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Important Instructions
            </h3>
            <ul className="space-y-2">
              {exam.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {index + 1}
                  </span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Start Exam Button with Confirmation */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold">Ready to begin?</h3>
              <p className="text-sm text-muted-foreground">
                Make sure you have a stable internet connection and {exam.duration} minutes of uninterrupted time.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg" className="gap-2 min-w-[150px]">
                  <Play className="h-5 w-5" />
                  Begin Exam
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start Examination?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Once you start, the timer will begin counting down from {exam.duration} minutes. 
                    You will not be able to pause the exam. Are you sure you want to proceed?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleStartExam}>
                    Start Now
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamInstructions;
