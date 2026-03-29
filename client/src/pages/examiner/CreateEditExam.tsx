import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Save, PlusCircle, Trash2, GripVertical, 
  CheckCircle, XCircle 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useExamContext } from '@/contexts/ExamContext';
import { Exam, Question, Option, QuestionType } from '@/types/exam';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

/**
 * Create/Edit Exam Page - Form for creating or editing exams with questions
 */
const CreateEditExam: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFullExam, addExam, updateExam } = useExamContext();
  const { toast } = useToast();
  
  const isEditing = !!id;

  // Form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60);
  const [passingMarks, setPassingMarks] = useState(40);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  // Load existing exam data if editing
  useEffect(() => {
    const loadExam = async () => {
      if (!isEditing || !id) return;
      const existingExam = await getFullExam(id);
      if (existingExam) {
        setTitle(existingExam.title);
        setSubject(existingExam.subject);
        setDescription(existingExam.description);
        setDuration(existingExam.duration);
        setPassingMarks(existingExam.passingMarks);
        setInstructions(existingExam.instructions.length > 0 ? existingExam.instructions : ['']);
        setQuestions(existingExam.questions);
        setStatus(existingExam.status === 'completed' ? 'draft' : existingExam.status);
      }
    };
    loadExam();
  }, [isEditing, id, getFullExam]);

  // Calculate total marks
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  // Add new question
  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: '',
      type,
      marks: 5,
      options: type === 'true-false' 
        ? [
            { id: `opt-${Date.now()}-1`, text: 'True', isCorrect: false },
            { id: `opt-${Date.now()}-2`, text: 'False', isCorrect: false }
          ]
        : [
            { id: `opt-${Date.now()}-1`, text: '', isCorrect: false },
            { id: `opt-${Date.now()}-2`, text: '', isCorrect: false },
            { id: `opt-${Date.now()}-3`, text: '', isCorrect: false },
            { id: `opt-${Date.now()}-4`, text: '', isCorrect: false }
          ]
    };
    setQuestions([...questions, newQuestion]);
  };

  // Update question
  const updateQuestion = (index: number, updates: Partial<Question>) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, ...updates } : q));
  };

  // Delete question
  const deleteQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  // Update option
  const updateOption = (qIndex: number, oIndex: number, updates: Partial<Option>) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIndex) return q;
      return {
        ...q,
        options: q.options.map((o, j) => j === oIndex ? { ...o, ...updates } : o)
      };
    }));
  };

  // Toggle option correct status
  const toggleOptionCorrect = (qIndex: number, oIndex: number) => {
    const question = questions[qIndex];
    if (question.type === 'single-choice' || question.type === 'true-false') {
      // Single choice - only one correct
      setQuestions(prev => prev.map((q, i) => {
        if (i !== qIndex) return q;
        return {
          ...q,
          options: q.options.map((o, j) => ({ ...o, isCorrect: j === oIndex }))
        };
      }));
    } else {
      // Multiple choice - toggle
      updateOption(qIndex, oIndex, { isCorrect: !question.options[oIndex].isCorrect });
    }
  };

  // Add option to question
  const addOption = (qIndex: number) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIndex) return q;
      return {
        ...q,
        options: [...q.options, { id: `opt-${Date.now()}`, text: '', isCorrect: false }]
      };
    }));
  };

  // Remove option from question
  const removeOption = (qIndex: number, oIndex: number) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIndex || q.options.length <= 2) return q;
      return {
        ...q,
        options: q.options.filter((_, j) => j !== oIndex)
      };
    }));
  };

  // Add instruction
  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  // Update instruction
  const updateInstruction = (index: number, value: string) => {
    setInstructions(prev => prev.map((inst, i) => i === index ? value : inst));
  };

  // Remove instruction
  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Save exam
  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      toast({ title: "Error", description: "Please enter a title.", variant: "destructive" });
      return;
    }
    if (!subject.trim()) {
      toast({ title: "Error", description: "Please enter a subject.", variant: "destructive" });
      return;
    }
    if (questions.length === 0) {
      toast({ title: "Error", description: "Please add at least one question.", variant: "destructive" });
      return;
    }
    
    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        toast({ title: "Error", description: `Question ${i + 1} is empty.`, variant: "destructive" });
        return;
      }
      if (!q.options.some(o => o.isCorrect)) {
        toast({ title: "Error", description: `Question ${i + 1} has no correct answer.`, variant: "destructive" });
        return;
      }
      if (q.type !== 'true-false' && q.options.some(o => !o.text.trim())) {
        toast({ title: "Error", description: `Question ${i + 1} has empty options.`, variant: "destructive" });
        return;
      }
    }

    const examData = {
      title: title.trim(),
      subject: subject.trim(),
      description: description.trim(),
      instructions: instructions.filter(i => i.trim()),
      duration,
      totalMarks,
      passingMarks,
      questions,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status,
      createdAt: new Date().toISOString(),
    } as any;

    try {
      if (isEditing) {
        await updateExam(id!, examData);
        toast({ title: "Success", description: "Exam updated successfully." });
      } else {
        await addExam(examData);
        toast({ title: "Success", description: "Exam created successfully." });
      }
      navigate('/examiner/exams');
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to save exam.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/examiner/exams">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Edit Exam' : 'Create New Exam'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Modify examination details and questions' : 'Build your examination with questions'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="publish-switch">Publish</Label>
            <Switch
              id="publish-switch"
              checked={status === 'published'}
              onCheckedChange={(checked) => setStatus(checked ? 'published' : 'draft')}
            />
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Exam
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main Form */}
        <div className="space-y-6">
          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
              <CardDescription>Basic information about the examination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter exam title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Computer Science"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the examination"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passingMarks">Passing Marks *</Label>
                  <Input
                    id="passingMarks"
                    type="number"
                    min={0}
                    value={passingMarks}
                    onChange={(e) => setPassingMarks(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
              <CardDescription>Guidelines for students taking the exam</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {instructions.map((inst, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                  <Input
                    value={inst}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder="Enter instruction"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInstruction(index)}
                    disabled={instructions.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addInstruction} className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Instruction
              </Button>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Questions</CardTitle>
                  <CardDescription>
                    {questions.length} question{questions.length !== 1 ? 's' : ''} • {totalMarks} total marks
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No questions added yet. Add your first question below.
                </div>
              ) : (
                questions.map((question, qIndex) => (
                  <div key={question.id} className="border rounded-lg p-4 space-y-4">
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                        <Badge variant="outline">Q{qIndex + 1}</Badge>
                        <Badge variant="secondary">
                          {question.type === 'single-choice' && 'Single Choice'}
                          {question.type === 'multiple-choice' && 'Multiple Choice'}
                          {question.type === 'true-false' && 'True/False'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={1}
                          value={question.marks}
                          onChange={(e) => updateQuestion(qIndex, { marks: parseInt(e.target.value) || 1 })}
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">marks</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteQuestion(qIndex)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Question Text */}
                    <Textarea
                      value={question.text}
                      onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
                      placeholder="Enter question text"
                      rows={2}
                    />

                    {/* Options */}
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Options {question.type === 'multiple-choice' && '(select all correct answers)'}
                      </Label>
                      {question.options.map((option, oIndex) => (
                        <div key={option.id} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleOptionCorrect(qIndex, oIndex)}
                            className={cn(
                              "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                              option.isCorrect 
                                ? "border-success bg-success text-white"
                                : "border-border hover:border-primary"
                            )}
                          >
                            {option.isCorrect && <CheckCircle className="h-4 w-4" />}
                          </button>
                          {question.type === 'true-false' ? (
                            <span className="flex-1 text-sm">{option.text}</span>
                          ) : (
                            <Input
                              value={option.text}
                              onChange={(e) => updateOption(qIndex, oIndex, { text: e.target.value })}
                              placeholder={`Option ${oIndex + 1}`}
                              className="flex-1"
                            />
                          )}
                          {question.type !== 'true-false' && question.options.length > 2 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeOption(qIndex, oIndex)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {question.type !== 'true-false' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => addOption(qIndex)}
                          className="gap-2"
                        >
                          <PlusCircle className="h-4 w-4" />
                          Add Option
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Add Question Buttons */}
              <Separator />
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => addQuestion('single-choice')} className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Single Choice
                </Button>
                <Button variant="outline" onClick={() => addQuestion('multiple-choice')} className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Multiple Choice
                </Button>
                <Button variant="outline" onClick={() => addQuestion('true-false')} className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  True/False
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-4">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={status === 'published' ? 'default' : 'secondary'}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Questions</span>
                  <span className="font-medium">{questions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Marks</span>
                  <span className="font-medium">{totalMarks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Passing Marks</span>
                  <span className="font-medium">{passingMarks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{duration} min</span>
                </div>
                <Separator />
                <div className="text-sm">
                  <span className="text-muted-foreground">Question Types:</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {questions.filter(q => q.type === 'single-choice').length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {questions.filter(q => q.type === 'single-choice').length} Single
                      </Badge>
                    )}
                    {questions.filter(q => q.type === 'multiple-choice').length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {questions.filter(q => q.type === 'multiple-choice').length} Multiple
                      </Badge>
                    )}
                    {questions.filter(q => q.type === 'true-false').length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {questions.filter(q => q.type === 'true-false').length} T/F
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateEditExam;
