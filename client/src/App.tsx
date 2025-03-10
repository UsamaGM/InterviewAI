import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Interviews from "./pages/Interviews";
import CreateInterviewPage from "./pages/CreateInterviewPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import InterviewDetailsPage from "./pages/InterviewDetailsPage";
import UserProfilePage from "./pages/UserProfilePage";
import TakeInterviewPage from "./pages/TakeInterviewPage";
import { Container } from "@mui/material"; // Import Container

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Container maxWidth="xl">
        {" "}
        {/* Wrap Routes with Container for consistent padding */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/interviews"
            element={
              isAuthenticated ? <Interviews /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/interviews/create"
            element={
              isAuthenticated ? (
                <CreateInterviewPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/interviews/:id"
            element={
              isAuthenticated ? (
                <InterviewDetailsPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/interviews/take/:id"
            element={
              isAuthenticated ? <TakeInterviewPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? <UserProfilePage /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
