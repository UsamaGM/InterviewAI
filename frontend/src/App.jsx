import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Profile from "./pages/ProfileManagement/Profile";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import InterviewManagement from "./pages/InterviewManagement/InterviewManagement";
import QuestionManagement from "./pages/QuestionManagement/QuestionManagement";
import CandidateManagement from "./pages/CandidateManagement/CandidateManagement";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Header />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/interviews"
          element={
            <PrivateRoute>
              <InterviewManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidates"
          element={
            <PrivateRoute>
              <CandidateManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/questions"
          element={
            <PrivateRoute>
              <QuestionManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
