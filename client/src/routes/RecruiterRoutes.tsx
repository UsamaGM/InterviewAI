import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RecruiterDashboardPage = lazy(
  () => import("../pages/recruiter/RecruiterDashboard")
);
const ScheduleInterviewPage = lazy(
  () => import("../pages/recruiter/ScheduleInterviewPage")
);
const EditInterviewPage = lazy(
  () => import("../pages/recruiter/EditInterviewPage")
);
const InviteCandidatePage = lazy(
  () => import("../pages/recruiter/InviteCandidatePage")
);

const InterviewDetailsPage = lazy(
  () => import("../pages/common/InterviewDetailsPage")
);

export default function RecruiterRoutes() {
  const { isAuthenticated, isCandidate } = useAuth();
  console.log("Recruiter Routes", isAuthenticated, isCandidate);

  if (!isAuthenticated) return <Navigate to="/auth/login" />;
  if (isCandidate) return <Navigate to="/auth/login" />;

  return (
    <Routes>
      <Route path="dashboard" element={<RecruiterDashboardPage />} />
      <Route path="schedule" element={<ScheduleInterviewPage />} />
      <Route path="schedule/:id" element={<ScheduleInterviewPage />} />
      <Route path="interview-details" element={<InterviewDetailsPage />} />
      <Route path="interview-details/:id" element={<InterviewDetailsPage />} />
      <Route path="edit-interview" element={<EditInterviewPage />} />
      <Route path="invite-candidate/:id" element={<InviteCandidatePage />} />
      <Route path="*" element={<Navigate to="/recruiter/dashboard" />} />
    </Routes>
  );
}
