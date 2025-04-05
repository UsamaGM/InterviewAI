import { Navigate } from "react-router-dom";

interface props {
  isAuthenticated: boolean;
  isCandidate: boolean;
}

function RootRedirect({ isAuthenticated, isCandidate }: props) {
  console.log("RootRedirect", isAuthenticated, isCandidate);
  if (!isAuthenticated) return <Navigate to="/auth/login" />;
  if (isCandidate) return <Navigate to="/candidate/dashboard" />;
  return <Navigate to="/recruiter/dashboard" />;
}

export default RootRedirect;
