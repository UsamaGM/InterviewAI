import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const CandidateDashboard = lazy(
  () => import("../pages/candidate/CandidateDashboard")
);
const TakeInterviewPage = lazy(
  () => import("../pages/candidate/TakeInterviewPage")
);
const InterviewDetailsPage = lazy(
  () => import("../pages/common/InterviewDetailsPage")
);

interface props {
  isAuthenticated: boolean;
  isCandidate: boolean;
}

export default function CandidateRoutes({
  isAuthenticated,
  isCandidate,
}: props) {
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
