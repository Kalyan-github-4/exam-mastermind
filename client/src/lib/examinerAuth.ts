// Examiner credentials can be provided via Vite environment variables:
// - VITE_EXAMINER_EMAIL
// - VITE_EXAMINER_PASSWORD
// If not provided, sensible defaults are used for local development.
export const EXAMINER_CREDENTIALS = {
  email: (import.meta.env.VITE_EXAMINER_EMAIL as string) || "examiner@exam-mastermind.com",
  password: (import.meta.env.VITE_EXAMINER_PASSWORD as string) || "password123",
};

export const loginExaminer = () => {
  localStorage.setItem("examinerAuth", "true");
};

export const logoutExaminer = () => {
  localStorage.removeItem("examinerAuth");
};

export const isExaminerLoggedIn = () => {
  return localStorage.getItem("examinerAuth") === "true";
};
