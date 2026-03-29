import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ExamProvider } from "@/contexts/ExamContext";

// Layouts
import StudentLayout from "@/components/layouts/StudentLayout";
import ExaminerLayout from "@/components/layouts/ExaminerLayout";

// Student Pages
import StudentDashboard from "@/pages/student/StudentDashboard";
import ExamInstructions from "@/pages/student/ExamInstructions";
import ExamTaking from "@/pages/student/ExamTaking";
import ExamResults from "@/pages/student/ExamResults";

// Examiner Pages
import ExaminerDashboard from "@/pages/examiner/ExaminerDashboard";
import ExamList from "@/pages/examiner/ExamList";
import CreateEditExam from "@/pages/examiner/CreateEditExam";
import ViewSubmissions from "@/pages/examiner/ViewSubmissions";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ExamProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to student dashboard */}
            <Route path="/" element={<Navigate to="/student" replace />} />
            
            {/* Student Routes */}
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="exam/:id/instructions" element={<ExamInstructions />} />
              <Route path="exam/:id/take" element={<ExamTaking />} />
              <Route path="exam/:id/results" element={<ExamResults />} />
            </Route>

            {/* Examiner Routes */}
            <Route path="/examiner" element={<ExaminerLayout />}>
              <Route index element={<ExaminerDashboard />} />
              <Route path="exams" element={<ExamList />} />
              <Route path="exams/new" element={<CreateEditExam />} />
              <Route path="exams/:id/edit" element={<CreateEditExam />} />
              <Route path="exams/:id/submissions" element={<ViewSubmissions />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ExamProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
