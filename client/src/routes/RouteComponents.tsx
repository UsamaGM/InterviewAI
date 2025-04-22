import { Suspense } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { LoadingSpinner, ErrorBoundary } from "@/components/common";
import {
  AuthRoutes,
  CandidateRoutes,
  RecruiterRoutes,
  RootRedirect,
  SharedRoutes,
} from "./index";
import MainLayout from "@/components/layouts/MainLayout";

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoadingSpinner size="lg" />
          </div>
        </MainLayout>
      }
    >
      <ErrorBoundary>{children}</ErrorBoundary>
    </Suspense>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <SuspenseWrapper>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route
            path="/recruiter/*"
            element={
              <MainLayout>
                <RecruiterRoutes />
              </MainLayout>
            }
          />
          <Route
            path="/candidate/*"
            element={
              <MainLayout>
                <CandidateRoutes />
              </MainLayout>
            }
          />
          <Route
            path="/shared/*"
            element={
              <MainLayout>
                <SharedRoutes />
              </MainLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SuspenseWrapper>
    </BrowserRouter>
  );
}
