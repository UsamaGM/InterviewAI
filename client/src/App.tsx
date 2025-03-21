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
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      {isAuthenticated && <Header />}
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
        <Route
          path="/interviews"
          element={isAuthenticated ? <Interviews /> : <Navigate to="/login" />}
        />
        <Route
          path="/interviews/new"
          element={
            isAuthenticated ? <CreateInterviewPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/interviews/take/:id"
          element={
            isAuthenticated ? <TakeInterviewPage /> : <Navigate to="/login" />
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
          path="/profile"
          element={
            isAuthenticated ? <UserProfilePage /> : <Navigate to="/login" />
          }
        />
      </Routes>
      {isAuthenticated && <Footer />}
    </Router>
  );
}

export default App;
