export const EXAMINER_CREDENTIALS = {
  email: "examiner@exam-mastermind.com",
  password: "password123",
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
