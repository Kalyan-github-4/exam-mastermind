import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusCircle, Menu, X, ClipboardList } from 'lucide-react';
import { UserButton, useUser } from '@clerk/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Layout component for the Examiner Dashboard
 * Provides consistent navigation and structure across all examiner pages
 */
const ExaminerLayout: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { isSignedIn } = useUser();

  const navItems = [
    { path: '/examiner', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/examiner/exams', label: 'All Exams', icon: FileText },
    { path: '/examiner/exams/new', label: 'Create Exam', icon: PlusCircle },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    if (path === '/examiner/exams/new') {
      return location.pathname === path;
    }
    if (path === '/examiner/exams') {
      return location.pathname.startsWith('/examiner/exams') && 
             !location.pathname.includes('/new');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/examiner" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10">
                <ClipboardList className="h-5 w-5" />
              </div>
              <span className="hidden font-semibold text-lg md:inline-block">
                Examiner Dashboard
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    'gap-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10',
                    isActive(item.path, item.exact) && 'bg-primary-foreground/10 text-primary-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Role Switcher */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={() => {
                import('@/lib/examinerAuth').then(({ logoutExaminer }) => {
                  logoutExaminer();
                  window.location.href = '/sign-in/examiner';
                });
              }}
              className="hidden md:flex text-primary-foreground hover:bg-primary-foreground/10"
            >
              Sign out
            </Button>

            <Button 
              asChild
              variant="outline" 
              size="sm" 
              className="hidden md:flex border-primary-foreground/20 text-black hover:bg-slate-900/10"
            >
              <Link to="/sign-in/student">
                Student sign in
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-primary-foreground/10 md:hidden">
            <nav className="container py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start gap-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10',
                      isActive(item.path, item.exact) && 'bg-primary-foreground/10 text-primary-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              <Button 
                asChild
                variant="outline" 
                className="w-full mt-2 text-black"
              >
                <Link to="/sign-in/student" onClick={() => setMobileMenuOpen(false)}>
                  Student sign in
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container py-6 md:py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>© 2026 Online Examination System. Examiner Portal.</p>
        </div>
      </footer>
    </div>
  );
};

export default ExaminerLayout;
