import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, Clock, Users, Edit, Trash2, Eye, PlusCircle, 
  Search, MoreHorizontal, Copy 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Exam } from '@/types/exam';
import { useToast } from '@/hooks/use-toast';

/**
 * Exam List - View and manage all exams
 */
const ExamList: React.FC = () => {
  const { exams, submissions, deleteExam, addExam } = useExamContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);

  // Filter exams based on search
  const filteredExams = exams.filter(exam => 
    exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (exam: Exam) => {
    setExamToDelete(exam);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (examToDelete) {
      deleteExam(examToDelete.id);
      toast({
        title: "Exam Deleted",
        description: `"${examToDelete.title}" has been deleted successfully.`,
      });
      setExamToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleDuplicate = (exam: Exam) => {
    const duplicatedExam: Exam = {
      ...exam,
      id: `exam-${Date.now()}`,
      title: `${exam.title} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString()
    };
    addExam(duplicatedExam);
    toast({
      title: "Exam Duplicated",
      description: `"${duplicatedExam.title}" has been created.`,
    });
  };

  const getSubmissionCount = (examId: string) => {
    return submissions.filter(s => s.examId === examId).length;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">All Exams</h1>
          <p className="text-muted-foreground">
            Manage and monitor your examinations
          </p>
        </div>
        <Link to="/examiner/exams/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Exam
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exams by title or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Exams Table */}
      <Card>
        <CardHeader>
          <CardTitle>Examinations</CardTitle>
          <CardDescription>
            {filteredExams.length} exam{filteredExams.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredExams.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No exams match your search.' : 'No exams created yet.'}
              </p>
              {!searchQuery && (
                <Link to="/examiner/exams/new">
                  <Button>Create Your First Exam</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Questions</TableHead>
                    <TableHead className="text-center">Duration</TableHead>
                    <TableHead className="text-center">Submissions</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium max-w-[200px]">
                        <div className="truncate">{exam.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {exam.totalMarks} marks
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{exam.subject}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {exam.questions.length}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {exam.duration}m
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {getSubmissionCount(exam.id)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusBadgeVariant(exam.status)}>
                          {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => navigate(`/examiner/exams/${exam.id}/submissions`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Submissions
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => navigate(`/examiner/exams/${exam.id}/edit`)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Exam
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(exam)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(exam)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Examination?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{examToDelete?.title}"? This action cannot be undone.
              All associated submissions will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExamList;
