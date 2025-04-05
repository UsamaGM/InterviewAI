import { AuthProvider } from "./context/AuthContext";
import { InterviewProvider } from "./context/InterviewContext";
import { AppRoutes } from "./routes/RouteComponents";

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <AppRoutes />
      </InterviewProvider>
    </AuthProvider>
  );
}

export default App;
