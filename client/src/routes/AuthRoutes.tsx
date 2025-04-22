import { lazy, ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));

export default function AuthRoutes() {
  const { isAuthenticated, isCandidate } = useAuth();
  console.log("AuthRoutes", isAuthenticated, isCandidate);

  function AuthenticateRoute({ children }: { children: ReactNode }) {
    if (isAuthenticated) {
      if (isCandidate) return <Navigate to="/candidate/dashboard" />;
      return <Navigate to="/recruiter/dashboard" />;
    }
    return children;
  }

  return (
    <Routes>
      <Route
        path="login"
        element={
          <AuthenticateRoute>
            <LoginPage />
          </AuthenticateRoute>
        }
      />
      <Route
        path="register"
        element={
          <AuthenticateRoute>
            <RegisterPage />
          </AuthenticateRoute>
        }
      />
      <Route
        path="*"
        element={
          <AuthenticateRoute>
            <Navigate to="/" />
          </AuthenticateRoute>
        }
      />
    </Routes>
  );
}
