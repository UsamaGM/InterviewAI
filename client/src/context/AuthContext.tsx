import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { handleError } from "../utils/errorHandler";
import { AxiosResponse } from "axios";
import { User } from "../utils/types";
import api from "../services/api";

interface errorType {
  initializing: string | null;
  loggingIn: string | null;
  registering: string | null;
  updatingUser: string | null;
}

interface loadingType {
  initializing: boolean;
  loggingIn: boolean;
  registering: boolean;
  updatingUser: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isCandidate: boolean | null;
  user: User | null;
  error: errorType;
  loading: loadingType;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: User) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token")
  );
  const [isCandidate, setIsCandidate] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<loadingType>({
    initializing: false,
    loggingIn: false,
    registering: false,
    updatingUser: false,
  });
  const [error, setError] = useState<errorType>({
    initializing: null,
    loggingIn: null,
    registering: null,
    updatingUser: null,
  });

  useEffect(() => {
    async function fetchUser() {
      console.log("Initializing...");
      if (isAuthenticated) {
        try {
          setLoading((prev) => ({ ...prev, initializing: true }));

          const userResponse: AxiosResponse<User> = await api.get(
            "/users/profile"
          );

          setIsCandidate(userResponse.data.role === "candidate");
          setUser(userResponse.data);

          setError({
            initializing: null,
            registering: null,
            updatingUser: null,
            loggingIn: null,
          });
        } catch (err) {
          setError((prev) => ({
            ...prev,
            initializing: handleError(err, "Failed to fetch user role"),
          }));
        } finally {
          setLoading((prev) => ({ ...prev, initializing: false }));
        }
      }
    }

    fetchUser();
  }, [isAuthenticated]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading((prev) => ({ ...prev, loggingIn: true }));

      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);

      setIsAuthenticated(true);
      setError((prev) => ({ ...prev, loggingIn: null }));
    } catch (err) {
      setError((prev) => ({
        ...prev,
        loggingIn: handleError(err, "Failed to login"),
      }));
    } finally {
      setLoading((prev) => ({ ...prev, loggingIn: false }));
    }
  }, []);

  const register = useCallback(async (userData: User) => {
    try {
      setLoading((prev) => ({ ...prev, registering: true }));

      await api.post("/auth/register", userData);

      setError((prev) => ({ ...prev, registering: null }));

      window.location.href = "/auth/login";
    } catch (err) {
      setError((prev) => ({
        ...prev,
        registering: handleError(err, "Failed to register"),
      }));
    } finally {
      setLoading((prev) => ({ ...prev, registering: false }));
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setError({
      initializing: null,
      loggingIn: null,
      registering: null,
      updatingUser: null,
    });
  }, []);

  const updateUser = useCallback(async (user: User) => {
    try {
      setLoading((prev) => ({ ...prev, updatingUser: true }));
      const response = await api.put("/users/profile", user);
      setUser(response.data);
      setError((prev) => ({ ...prev, updatingUser: null }));
    } catch (err) {
      setError((prev) => ({
        ...prev,
        updatingUser: handleError(err, "Failed to update user"),
      }));
    } finally {
      setLoading((prev) => ({ ...prev, updatingUser: false }));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isCandidate,
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
