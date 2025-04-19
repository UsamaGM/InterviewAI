import { useState, ReactNode, useEffect, useCallback } from "react";
import { handleError } from "../utils/errorHandler";
import { AxiosResponse } from "axios";
import { User } from "../utils/types";
import { AuthContext, errorType, loadingType } from "./AuthContext";
import api from "../services/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [candidates, setCandidates] = useState<User[]>([]);
  const isCandidate = user ? user.role === "candidate" : null;
  const [loading, setLoading] = useState<loadingType>({
    initializing: false,
    loggingIn: false,
    registering: false,
    updatingUser: false,
    fetchingCandidates: false,
  });
  const [error, setError] = useState<errorType>({
    initializing: null,
    loggingIn: null,
    registering: null,
    updatingUser: null,
    fetchingCandidates: null,
  });

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      const isAuthenticated = !!token;
      setIsAuthenticated(isAuthenticated);
      if (isAuthenticated) {
        console.log("Initializing...");
        try {
          setLoading((prev) => ({ ...prev, initializing: true }));

          const userResponse: AxiosResponse<User> = await api.get(
            "/users/profile"
          );
          setUser(userResponse.data);

          setError((prev) => ({ ...prev, initializing: null }));
        } catch (err) {
          setError((prev) => ({
            ...prev,
            initializing: handleError(err, "Failed to fetch user"),
          }));
        } finally {
          setLoading((prev) => ({ ...prev, initializing: false }));
          setIsReady(true);
        }
      }
      console.log("Initialized Auth");
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
      fetchingCandidates: null,
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

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, fetchingCandidates: true }));
      const { data } = await api.get("/users/candidates");
      setCandidates(data);
      setError((prev) => ({ ...prev, fetchingCandidates: null }));
    } catch (error) {
      setError((prev) => ({
        ...prev,
        fetchingCandidates: handleError(error, "Failed to load candidates!"),
      }));
    } finally {
      setLoading((prev) => ({ ...prev, fetchingCandidates: false }));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isReady,
        isCandidate,
        user,
        candidates,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        fetchCandidates,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
