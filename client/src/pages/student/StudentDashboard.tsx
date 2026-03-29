import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, FileText, Calendar, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useExamContext } from '@/contexts/ExamContext';
import { Exam } from '@/types/exam';

/**
 * Student Dashboard - Displays available exams and welcome message
 */
const StudentDashboard: React.FC = () => {
  const { exams, loading } = useExamContext();
  
  // Filter only published exams
  const availableExams = exams.filter(exam => exam.status === 'published');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-xl bg-primary p-6 md:p-8 text-primary-foreground">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome Back, Student
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl">
            View and take your assigned examinations. Make sure to read all instructions carefully before starting an exam.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
          <CheckCircle className="h-full w-full" />
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Exams
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableExams.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Questions
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {availableExams.reduce((acc, exam) => acc + (exam.questionCount ?? exam.questions?.length ?? 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Duration
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {availableExams.reduce((acc, exam) => acc + exam.duration, 0)} mins
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Available Exams */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Available Examinations</h2>
        </div>

        {availableExams.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No examinations available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

/**
 * Individual exam card component
 */
const ExamCard: React.FC<{ exam: Exam }> = ({ exam }) => {
  const questionCount = exam.questionCount ?? exam.questions?.length ?? 0;

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <Badge variant="secondary" className="mb-2">
            {exam.subject}
          </Badge>
        </div>
        <CardTitle className="line-clamp-2">{exam.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {exam.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{exam.duration} minutes</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{questionCount} questions • {exam.totalMarks} marks</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Until {new Date(exam.endDate).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Link to={`/student/exam/${exam.id}/instructions`} className="w-full">
          <Button className="w-full gap-2">
            Start Exam
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default StudentDashboard;
