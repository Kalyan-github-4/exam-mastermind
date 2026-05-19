import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { useUser } from "@clerk/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { portalDescriptions, portalLabels, portalSignInPath, portalSignUpPath, type PortalRole } from "@/lib/portal";

const roleCards: { role: PortalRole; accent: string; icon: typeof GraduationCap }[] = [
  { role: "student", accent: "from-sky-500/20 to-cyan-400/10", icon: GraduationCap },
  { role: "examiner", accent: "from-emerald-500/20 to-teal-400/10", icon: ShieldCheck },
];

const Index = () => {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.14),_transparent_28%),linear-gradient(180deg,_hsl(var(--background))_0%,_hsl(var(--muted)/0.4)_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 rounded-full border bg-card/70 px-4 py-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Exam Mastermind</p>
              <p className="text-xs text-muted-foreground">Separate student and examiner access</p>
            </div>
          </div>

          {!isSignedIn && (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost">
                <Link to={portalSignInPath("student")}>Student sign in</Link>
              </Button>
              <Button asChild>
                <Link to={portalSignInPath("examiner")}>Examiner sign in</Link>
              </Button>
            </div>
          )}
        </header>

        <main className="flex flex-1 items-center py-8 lg:py-12">
          <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <section className="space-y-8">
              <div className="space-y-5">
                <Badge className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.25em]">
                  Clerk-powered portals
                </Badge>
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  One exam platform, two distinct experiences.
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  Students enter through the student portal, and examiners manage the assessment workflow from the examiner portal. Sign in and sign up are split by role to keep the experience clean.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gap-2">
                  <Link to={portalSignInPath("student")}>
                    Student entry <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <Link to={portalSignInPath("examiner")}>
                    Examiner entry <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {roleCards.map(({ role, accent, icon: Icon }) => (
                  <Card key={role} className="overflow-hidden border-border/60 bg-card/80 shadow-sm backdrop-blur">
                    <CardContent className="p-0">
                      <div className={`h-2 bg-gradient-to-r ${accent}`} />
                      <div className="space-y-4 p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h2 className="font-semibold text-foreground">{portalLabels[role]}</h2>
                            <p className="text-sm text-muted-foreground">Dedicated sign in and sign up flow</p>
                          </div>
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">{portalDescriptions[role]}</p>
                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={portalSignInPath(role)}>Sign in</Link>
                          </Button>
                          <Button asChild size="sm">
                            <Link to={role === 'examiner' ? portalSignInPath(role) : portalSignUpPath(role)}>
                              {role === 'examiner' ? 'Sign in' : 'Sign up'}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <aside className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl" />
              <div className="relative rounded-[2rem] border border-border/60 bg-card/80 p-6 shadow-2xl backdrop-blur">
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Auth shortcuts
                  </div>
                  <div className="grid gap-3">
                    <Button asChild className="justify-start gap-2" variant="secondary">
                      <Link to={portalSignInPath("student")}>Student sign in</Link>
                    </Button>
                    <Button asChild className="justify-start gap-2" variant="secondary">
                      <Link to={portalSignUpPath("student")}>Student sign up</Link>
                    </Button>
                    <Button asChild className="justify-start gap-2" variant="secondary">
                      <Link to={portalSignInPath("examiner")}>Examiner sign in</Link>
                    </Button>
                  </div>
                  <div className="rounded-2xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                    If you are already signed in, you will be routed to the correct portal automatically.
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
