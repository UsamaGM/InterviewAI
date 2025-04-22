import { AuthProvider } from "./context/AuthProvider";
import { InterviewProvider } from "./context/InterviewProvider";
import { AppRoutes } from "./routes/RouteComponents";
import { useAuth } from "./hooks";
import { LoadingSpinner } from "./components/common";

function InitializationWrapper({ children }: { children: React.ReactNode }) {
  const { isReady } = useAuth();

  if (!isReady) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <InitializationWrapper>
          <AppRoutes />
        </InitializationWrapper>
      </InterviewProvider>
    </AuthProvider>
  );
}

export default App;
