import Interviews from "./pages/Interviews";
import CreateInterviewPage from "./pages/CreateInterviewPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import InterviewDetailsPage from "./pages/InterviewDetailsPage";
import UserProfilePage from "./pages/UserProfilePage";
import TakeInterviewPage from "./pages/TakeInterviewPage";
import CandidateDashboard from "./components/Candidate/CandidateInterviewList";
import InviteCandidatePage from "./pages/InviteCandidatePage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import EditInterviewPage from "./pages/EditInterviewPage";
import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get("/users/profile");
          setUserRole(response.data.role);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          // Handle token expiration or other auth errors
          localStorage.removeItem("token");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Define route protection components
  const RecruiterRoute = () => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (userRole !== "recruiter") return <Navigate to="/login" />;
    return <Outlet />;
  };

  const CandidateRoute = () => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (userRole !== "candidate") return <Navigate to="/login" />;
    return <Outlet />;
  };

  const ProtectedRoute = () => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    return <Outlet />;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" />
            ) : userRole === "recruiter" ? (
              <Navigate to="/interviews" />
            ) : userRole === "candidate" ? (
              <Navigate to="/candidate/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        
        {/* Public Routes */}
        <Route path="/login" element={
          isAuthenticated ? (
            userRole === "recruiter" ? (
              <Navigate to="/interviews" />
            ) : userRole === "candidate" ? (
              <Navigate to="/candidate/dashboard" />
            ) : (
              <LoginPage />
            )
          ) : (
            <LoginPage />
          )
        } />
        <Route path="/register" element={<RegisterPage />} />

        {/* Recruiter Routes */}
        <Route element={<RecruiterRoute />}>
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/interviews/new" element={<CreateInterviewPage />} />
          <Route path="/interviews/:id/details" element={<InterviewDetailsPage />} />
          <Route path="/interviews/:id/edit" element={<EditInterviewPage interview={{}} />} />
          <Route path="/interviews/:id/invite" element={<InviteCandidatePage />} />
        </Route>

        {/* Candidate Routes */}
        <Route element={<CandidateRoute />}>
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        </Route>

        {/* Shared Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/interviews/:id/take" element={<TakeInterviewPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
