import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, TrendingUp, Clock, Download, Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useExamContext } from '@/contexts/ExamContext';
import { Exam, ExamSubmission } from '@/types/exam';
import { useToast } from '@/hooks/use-toast';

/**
 * View Submissions - Shows all submissions for a specific exam
 */
const ViewSubmissions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getFullExam, getSubmissionsByExamId, refreshSubmissions } = useExamContext();
  const { toast } = useToast();
  
  const [exam, setExam] = useState<Exam | undefined>(undefined);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      const [fullExam] = await Promise.all([
        getFullExam(id),
        refreshSubmissions(id),
      ]);
      setExam(fullExam);
      setLoading(false);
    };
    load();
  }, [id, getFullExam, refreshSubmissions]);

  // Update submissions from context when it changes
  useEffect(() => {
    if (id) {
      setSubmissions(getSubmissionsByExamId(id));
    }
  }, [id, getSubmissionsByExamId]);

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
        <Users className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Exam Not Found</h2>
        <p className="text-muted-foreground mb-4">Unable to find the requested examination.</p>
        <Link to="/examiner/exams">
          <Button>Back to Exams</Button>
        </Link>
      </div>
    );
  }

  // Calculate statistics
  const passedCount = submissions.filter(s => s.passed).length;
  const failedCount = submissions.filter(s => !s.passed).length;
  const averageScore = submissions.length > 0 
    ? submissions.reduce((sum, s) => sum + s.percentage, 0) / submissions.length 
    : 0;
  const averageTime = submissions.length > 0
    ? submissions.reduce((sum, s) => sum + s.timeTaken, 0) / submissions.length
    : 0;

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  // Export to CSV (mock)
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Submissions data is being prepared for download.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/examiner/exams">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{exam.title}</h1>
          <p className="text-muted-foreground">
            Student submissions and performance analysis
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Submissions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pass Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions.length > 0 ? ((passedCount / submissions.length) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {passedCount} passed, {failedCount} failed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
            <Progress value={averageScore} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Time Taken
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(averageTime)}</div>
            <p className="text-xs text-muted-foreground">
              of {exam.duration} min allowed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
          <CardDescription>
            Detailed view of all student submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No submissions yet for this examination.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead className="text-center">Percentage</TableHead>
                    <TableHead className="text-center">Time Taken</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.studentName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {submission.studentEmail}
                      </TableCell>
                      <TableCell className="text-center">
                        {submission.score}/{submission.totalMarks}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Progress 
                            value={submission.percentage} 
                            className="h-2 w-16" 
                          />
                          <span className="text-sm">{submission.percentage.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {formatTime(submission.timeTaken)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={submission.passed ? 'default' : 'destructive'}>
                          {submission.passed ? (
                            <><CheckCircle className="h-3 w-3 mr-1" /> Passed</>
                          ) : (
                            <><XCircle className="h-3 w-3 mr-1" /> Failed</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <SubmissionDetailDialog submission={submission} exam={exam} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Submission Detail Dialog - Shows detailed answers for a submission
 */
const SubmissionDetailDialog: React.FC<{ 
  submission: ExamSubmission; 
  exam: { questions: any[] } 
}> = ({ submission, exam }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Eye className="h-4 w-4" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{submission.studentName}'s Submission</DialogTitle>
          <DialogDescription>
            Score: {submission.score}/{submission.totalMarks} ({submission.percentage.toFixed(1)}%)
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {exam.questions.map((question, index) => {
            const answer = submission.answers.find(a => a.questionId === question.id);
            const correctOptionIds = question.options.filter((o: any) => o.isCorrect).map((o: any) => o.id);
            const selectedOptionIds = answer?.selectedOptionIds || [];
            
            const isCorrect = 
              correctOptionIds.length === selectedOptionIds.length &&
              correctOptionIds.every((id: string) => selectedOptionIds.includes(id));

            return (
              <div key={question.id} className="p-4 rounded-lg border">
                <div className="flex items-start gap-2 mb-3">
                  <Badge variant="outline">Q{index + 1}</Badge>
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <span className="font-medium flex-1">{question.text}</span>
                </div>
                
                <div className="space-y-1 ml-8">
                  {question.options.map((option: any) => {
                    const isSelected = selectedOptionIds.includes(option.id);
                    const isCorrectOption = option.isCorrect;
                    
                    return (
                      <div
                        key={option.id}
                        className={`text-sm p-2 rounded ${
                          isCorrectOption ? 'bg-success/10 text-success' :
                          isSelected && !isCorrectOption ? 'bg-destructive/10 text-destructive line-through' :
                          'text-muted-foreground'
                        }`}
                      >
                        {isSelected && '→ '}{option.text}
                        {isCorrectOption && ' ✓'}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSubmissions;
