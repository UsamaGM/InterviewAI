import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";

function RootRedirect() {
  const { isAuthenticated, isCandidate, isReady } = useAuth();
  console.log("Root Redirect");

  if (!isReady) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isCandidate) {
    return <Navigate to="/candidate/dashboard" replace />;
  }

  return <Navigate to="/recruiter/dashboard" replace />;
}

export default RootRedirect;
