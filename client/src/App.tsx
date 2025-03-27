import Interviews from "./pages/Interviews";
import CreateInterviewPage from "./pages/CreateInterviewPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import InterviewDetailsPage from "./pages/InterviewDetailsPage";
import UserProfilePage from "./pages/UserProfilePage";
import TakeInterviewPage from "./pages/TakeInterviewPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import EditInterviewPage from "./pages/EditInterviewPage";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/interviews" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          element={!isAuthenticated ? <Navigate to="/login" /> : undefined}
        >
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/interviews/new" element={<CreateInterviewPage />} />
          <Route
            path="/interviews/:id/details"
            element={<InterviewDetailsPage />}
          />
          <Route path="/interviews/:id/take" element={<TakeInterviewPage />} />
          <Route path="/interviews/:id/edit" element={<EditInterviewPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
