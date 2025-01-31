import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import ScheduleInterview from "./pages/ScheduleInterview";
import InterviewList from "./pages/InterviewList";
import CandidateManagement from "./pages/CandidateManagement";
import QuestionManagement from "./pages/QuestionManagement";

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
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
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
          path="/schedule"
          element={
            <PrivateRoute>
              <ScheduleInterview />
            </PrivateRoute>
          }
        />
        <Route
          path="/interviews"
          element={
            <PrivateRoute>
              <InterviewList />
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
      </Routes>
    </Router>
  );
}

export default App;
