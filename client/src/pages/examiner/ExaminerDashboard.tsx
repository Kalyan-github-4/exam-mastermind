import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, TrendingUp, Clock, PlusCircle, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useExamContext } from '@/contexts/ExamContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

/**
 * Examiner Dashboard - Overview with statistics and charts
 */
const ExaminerDashboard: React.FC = () => {
  const { exams, submissions, statistics, loading } = useExamContext();

  // Prepare chart data
  const examSubmissionData = exams.map(exam => ({
    name: exam.title.length > 15 ? exam.title.substring(0, 15) + '...' : exam.title,
    submissions: submissions.filter(s => s.examId === exam.id).length
  }));

  const passFailData = [
    { name: 'Passed', value: submissions.filter(s => s.passed).length },
    { name: 'Failed', value: submissions.filter(s => !s.passed).length }
  ];

  const COLORS = ['hsl(142, 76%, 36%)', 'hsl(0, 84%, 60%)'];

  // Recent submissions
  const recentSubmissions = [...submissions]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your examination system
          </p>
        </div>
        <Link to="/examiner/exams/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Exam
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Exams
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.totalExams ?? exams.length}</div>
            <p className="text-xs text-muted-foreground">
              {exams.filter(e => e.status === 'published').length} published
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Submissions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.totalSubmissions ?? submissions.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all exams
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.averageScore ?? '0.0'}%</div>
            <p className="text-xs text-muted-foreground">
              Overall performance
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pass Rate
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.passRate ?? '0.0'}%</div>
            <p className="text-xs text-muted-foreground">
              Students passing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Submissions by Exam */}
        <Card>
          <CardHeader>
            <CardTitle>Submissions by Exam</CardTitle>
            <CardDescription>Number of submissions per examination</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={examSubmissionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="name" 
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="submissions" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pass/Fail Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Pass/Fail Distribution</CardTitle>
            <CardDescription>Overall student performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={passFailData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {passFailData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>Latest student examination submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentSubmissions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No submissions yet
            </p>
          ) : (
            <div className="space-y-4">
              {recentSubmissions.map((submission) => {
                const exam = exams.find(e => e.id === submission.examId);
                return (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{submission.studentName}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {exam?.title || 'Unknown Exam'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{submission.score}/{submission.totalMarks}</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.percentage.toFixed(1)}%
                        </p>
                      </div>
                      <Badge variant={submission.passed ? 'default' : 'destructive'}>
                        {submission.passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {submissions.length > 5 && (
            <div className="mt-4 text-center">
              <Link to="/examiner/exams">
                <Button variant="outline" className="gap-2">
                  <Eye className="h-4 w-4" />
                  View All Submissions
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExaminerDashboard;
