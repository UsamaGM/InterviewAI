import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const CandidateDashboard = lazy(
  () => import("../pages/candidate/CandidateDashboard")
);
const TakeInterviewPage = lazy(
  () => import("../pages/candidate/TakeInterviewPage")
);
const InterviewDetailsPage = lazy(
  () => import("../pages/common/InterviewDetailsPage")
);

export default function CandidateRoutes() {
  const { isAuthenticated, isCandidate } = useAuth();
  console.log("CandidateRoutes", isAuthenticated, isCandidate);

  if (!isAuthenticated) return <Navigate to="/auth/login" />;
  if (!isCandidate) return <Navigate to="/recruiter/dashboard" />;

  return (
    <Routes>
      <Route path="dashboard" element={<CandidateDashboard />} />
      <Route path="interview-details" element={<InterviewDetailsPage />} />
      <Route path="interview-details/:id" element={<InterviewDetailsPage />} />
      <Route path="take-interview" element={<TakeInterviewPage />} />
      <Route path="take-interview/:id" element={<TakeInterviewPage />} />
      <Route path="*" element={<Navigate to="/candidate/dashboard" />} />
    </Routes>
  );
}
