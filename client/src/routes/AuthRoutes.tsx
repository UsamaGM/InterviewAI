import { lazy, ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));

export default function AuthRoutes() {
  const { isAuthenticated, isCandidate } = useAuth();
  console.log("AuthRoutes", isAuthenticated, isCandidate);

  function AuthenticateRoute({ route }: { route: ReactNode }) {
    if (isAuthenticated) {
      if (isCandidate) return <Navigate to="/candidate/dashboard" />;
      return <Navigate to="/recruiter/dashboard" />;
    }
    return route;
  }

  return (
    <Routes>
      <Route
        path="login"
        element={<AuthenticateRoute route={<LoginPage />} />}
      />
      <Route
        path="register"
        element={<AuthenticateRoute route={<RegisterPage />} />}
      />
      <Route
        path="*"
        element={<AuthenticateRoute route={<Navigate to="/" />} />}
      />
    </Routes>
  );
}
