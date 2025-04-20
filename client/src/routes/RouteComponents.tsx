import { Suspense } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { LoadingSpinner } from "../components/common";
import SharedRoutes from "./SharedRoutes";
import RootRedirect from "./RootRedirect";
import AuthRoutes from "./AuthRoutes";
import RecruiterRoutes from "./RecruiterRoutes";
import CandidateRoutes from "./CandidateRoutes";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense
        name="RouteComponents Suspense"
        fallback={
          <div>
            <LoadingSpinner fullScreen />
            Using fallback...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/recruiter/*" element={<RecruiterRoutes />} />
          <Route path="/candidate/*" element={<CandidateRoutes />} />
          <Route path="/shared/*" element={<SharedRoutes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
