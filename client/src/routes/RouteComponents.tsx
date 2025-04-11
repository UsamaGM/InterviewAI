import { Suspense } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import SharedRoutes from "./SharedRoutes";
import RootRedirect from "./RootRedirect";
import AuthRoutes from "./AuthRoutes";
import RecruiterRoutes from "./RecruiterRoutes";
import CandidateRoutes from "./CandidateRoutes";
import { LoadingSpinner } from "../components/common";
import { useAuth } from "../context/AuthContext";

export function AppRoutes() {
  const {
    isAuthenticated,
    isCandidate,
    loading: { initializing },
  } = useAuth();

  if (initializing) {
    return <LoadingSpinner fullScreen size="lg" />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {/* Root redirect */}
          <Route
            path="/"
            element={
              <RootRedirect
                isAuthenticated={isAuthenticated}
                isCandidate={isCandidate}
              />
            }
          />

          {/* Public routes */}
          <Route
            path="/auth/*"
            element={
              <AuthRoutes
                isAuthenticated={isAuthenticated}
                isCandidate={isCandidate}
              />
            }
          />

          {/* Protected routes by role */}
          <Route
            path="/recruiter/*"
            element={
              <RecruiterRoutes
                isAuthenticated={isAuthenticated}
                isCandidate={isCandidate}
              />
            }
          />

          <Route
            path="/candidate/*"
            element={
              <CandidateRoutes
                isAuthenticated={isAuthenticated}
                isCandidate={isCandidate}
              />
            }
          />

          {/* Shared protected routes */}
          <Route
            path="/shared/*"
            element={<SharedRoutes isAuthenticated={isAuthenticated} />}
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
