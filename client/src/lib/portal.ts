export type PortalRole = "student" | "examiner";

export const PORTAL_ROLES: PortalRole[] = ["student", "examiner"];

export const portalLabels: Record<PortalRole, string> = {
  student: "Student",
  examiner: "Examiner",
};

export const portalDescriptions: Record<PortalRole, string> = {
  student: "Take exams, review instructions, and view results.",
  examiner: "Create exams, review submissions, and manage assessments.",
};

export const portalHomePath = (role: PortalRole) =>
  role === "student" ? "/student" : "/examiner";

export const portalSignInPath = (role: PortalRole) =>
  role === "student" ? "/sign-in/student" : "/sign-in/examiner";

export const portalSignUpPath = (role: PortalRole) =>
  role === "student" ? "/sign-up/student" : "/sign-up/examiner";

export const isPortalRole = (value: unknown): value is PortalRole =>
  value === "student" || value === "examiner";

export const normalizePortalRole = (value: string | undefined): PortalRole | null => {
  if (!value) {
    return null;
  }

  return isPortalRole(value) ? value : null;
};
