import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import ScheduleInterview from "./pages/ScheduleInterview";
import InterviewList from "./pages/InterviewList";

function App() {
  return (
    <Router>
      <Header />
      <ToastContainer />
      <Routes>
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
      </Routes>
    </Router>
  );
}

export default App;
