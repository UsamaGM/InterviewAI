import { lazy, ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));

interface props {
  isAuthenticated: boolean;
  isCandidate: boolean;
}

export default function AuthRoutes({ isAuthenticated, isCandidate }: props) {
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
