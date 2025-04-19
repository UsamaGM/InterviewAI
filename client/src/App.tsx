import { AuthProvider } from "./context/AuthProvider";
import { InterviewProvider } from "./context/InterviewProvider";
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
