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
import { Container, ThemeProvider } from "@mui/material"; // Import Container
import { theme } from "./MUIStyles/theme";

function App() {
  const token = localStorage.getItem("token");
  const isAuthenticated = token !== undefined;
  console.log(token, isAuthenticated, token !== undefined);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: theme.palette.background.default,
            margin: 0,
            padding: 0,
          }}
        >
          <Container maxWidth="xl">
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
                  isAuthenticated ? (
                    <TakeInterviewPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/profile"
                element={
                  isAuthenticated ? (
                    <UserProfilePage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Routes>
          </Container>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
