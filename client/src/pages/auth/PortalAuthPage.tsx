import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { SignIn, SignUp, useUser } from "@clerk/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EXAMINER_CREDENTIALS, loginExaminer, isExaminerLoggedIn } from "@/lib/examinerAuth";
import {
  normalizePortalRole,
  portalDescriptions,
  portalHomePath,
  portalLabels,
  portalSignInPath,
  portalSignUpPath,
} from "@/lib/portal";

type PortalAuthPageProps = {
  mode: "sign-in" | "sign-up";
};

const isGmailAddress = (email: string) => /@gmail\.com$/i.test(email.trim());

const PortalAuthPage = ({ mode }: PortalAuthPageProps) => {
  const { portal } = useParams<{ portal: string }>();
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const role = normalizePortalRole(portal);

  useEffect(() => {
    console.log("[auth] portal page state", {
      mode,
      portal,
      role,
      isSignedIn,
      userId: user?.id ?? null,
    });
  }, [isSignedIn, mode, portal, role, user?.id]);

  if (!role) {
    console.warn("[auth] invalid portal in URL", portal);
    return <Navigate to="/" replace />;
  }

  const signInPath = portalSignInPath(role);
  const signUpPath = portalSignUpPath(role);
  const title = `${portalLabels[role]} ${mode === "sign-in" ? "Sign in" : "Sign up"}`;

  if (role === 'examiner' && isExaminerLoggedIn()) {
    console.log("[auth] examiner already logged in, redirecting to examiner portal");
    return <Navigate to={portalHomePath(role)} replace />;
  }

  if (role !== 'examiner' && isSignedIn) {
    const currentRole = normalizePortalRole(
      ((user?.publicMetadata as { role?: string } | undefined)?.role ??
        (user?.unsafeMetadata as { role?: string } | undefined)?.role) as string | undefined
    );

    if (currentRole) {
      console.log("[auth] clerk session detected, redirecting by role", currentRole);
      return <Navigate to={portalHomePath(currentRole)} replace />;
    }
  }

  const handleExaminerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[auth] examiner login submitted", {
      email,
      emailMatchesExpected: email === EXAMINER_CREDENTIALS.email,
      passwordLength: password.length,
    });

    if (email === EXAMINER_CREDENTIALS.email && password === EXAMINER_CREDENTIALS.password) {
      loginExaminer();
      console.log("[auth] examiner login succeeded");
      navigate(portalHomePath("examiner"), { replace: true });
    } else {
      console.warn("[auth] examiner login failed: invalid credentials");
      setError("Invalid email or password");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.12),_transparent_28%),linear-gradient(135deg,_hsl(var(--background))_0%,_hsl(var(--muted)/0.5)_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.18)_50%,transparent_100%)] opacity-30" />
      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground">
            <Sparkles className="h-4 w-4" />
            Exam Mastermind
          </Link>

          <div className="max-w-2xl space-y-5">
            <Badge className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]">
              {portalLabels[role]} portal
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              {portalDescriptions[role]} Only Gmail addresses are accepted here, and Google sign-in is available as the social login option.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
              <CardContent className="p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="text-base font-semibold text-foreground">Gmail only</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  We reject non-Gmail addresses on both sign in and sign up.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
              <CardContent className="p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ArrowRight className="h-5 w-5" />
                </div>
                <h2 className="text-base font-semibold text-foreground">Google login</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Use Google for quick access without typing credentials.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-primary/10 blur-3xl" />
          <div className="relative rounded-[2rem] border border-border/60 bg-card/85 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="space-y-5">
              {role === 'examiner' ? (
                <div className="bg-background rounded-xl p-6 border shadow-sm">
                  <h3 className="text-xl font-semibold mb-4 text-center">Examiner Login</h3>
                  {error && <div className="mb-4 text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
                  <form onSubmit={handleExaminerLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full">Sign in</Button>
                  </form>
                </div>
              ) : mode === "sign-in" ? (
                <SignIn
                  routing="path"
                  path={signInPath}
                  signUpUrl={signUpPath}
                  forceRedirectUrl={portalHomePath(role)}
                  appearance={{ elements: { formButtonPrimary: "bg-primary text-primary-foreground" } }}
                />
              ) : (
                <SignUp
                  routing="path"
                  path={signUpPath}
                  signInUrl={signInPath}
                  forceRedirectUrl={portalHomePath(role)}
                  unsafeMetadata={{ role }}
                  appearance={{ elements: { formButtonPrimary: "bg-primary text-primary-foreground" } }}
                />
              )}

              {role !== 'examiner' && (
                <div className="rounded-2xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                  {mode === "sign-in" ? (
                    <>
                      Need a new account? <Link to={signUpPath} className="font-medium text-foreground underline-offset-4 hover:underline">Sign up for the {portalLabels[role]} portal</Link>.
                    </>
                  ) : (
                    <>
                      Already have an account? <Link to={signInPath} className="font-medium text-foreground underline-offset-4 hover:underline">Go to sign in</Link>.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalAuthPage;
