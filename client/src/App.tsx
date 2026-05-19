import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ExamProvider } from "@/contexts/ExamContext";
import PortalRouteGuard from "@/components/auth/PortalRouteGuard";
import PortalAuthPage from "@/pages/auth/PortalAuthPage";

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

import Index from "./pages/Index";
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
            <Route path="/" element={<Index />} />

            <Route path="/sign-in/:portal" element={<PortalAuthPage mode="sign-in" />} />
            <Route path="/sign-up/:portal" element={<PortalAuthPage mode="sign-up" />} />

            {/* Student Routes */}
            <Route element={<PortalRouteGuard role="student" />}>
              <Route path="/student" element={<StudentLayout />}>
                <Route index element={<StudentDashboard />} />
                <Route path="exam/:id/instructions" element={<ExamInstructions />} />
                <Route path="exam/:id/take" element={<ExamTaking />} />
                <Route path="exam/:id/results" element={<ExamResults />} />
              </Route>
            </Route>

            {/* Examiner Routes */}
            <Route element={<PortalRouteGuard role="examiner" />}>
              <Route path="/examiner" element={<ExaminerLayout />}>
                <Route index element={<ExaminerDashboard />} />
                <Route path="exams" element={<ExamList />} />
                <Route path="exams/new" element={<CreateEditExam />} />
                <Route path="exams/:id/edit" element={<CreateEditExam />} />
                <Route path="exams/:id/submissions" element={<ViewSubmissions />} />
              </Route>
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
