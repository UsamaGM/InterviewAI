import { useState, ReactNode, useEffect, useCallback, useMemo } from "react";
import { AxiosResponse } from "axios";
import { handleError } from "@/utils/errorHandler";
import { User } from "@/utils/types";
import { AuthContext, errorType, loadingType } from "./AuthContext";
import api from "@/services/api";

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
    forgotPassword: false,
    resetPassword: false,
  });
  const [error, setError] = useState<errorType>({
    initializing: null,
    loggingIn: null,
    registering: null,
    updatingUser: null,
    fetchingCandidates: null,
    forgotPassword: null,
    resetPassword: null,
  });

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
      console.log("Initializing...");
      try {
        if (isAuthenticated) {
          setLoading((prev) => ({ ...prev, initializing: true }));

          const userResponse: AxiosResponse<User> = await api.get(
            "/users/profile"
          );
          setUser(userResponse.data);

          setError((prev) => ({ ...prev, initializing: null }));
        }
      } catch (err) {
        setError((prev) => ({
          ...prev,
          initializing: handleError(err, "Failed to fetch user"),
        }));
      } finally {
        setLoading((prev) => ({ ...prev, initializing: false }));
        console.log("Data Ready");
        setIsReady(true);
      }
    }
    console.log("Initialized Auth");

    fetchUser();
  }, [isAuthenticated]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        setLoading((prev) => ({ ...prev, loggingIn: true }));
        setError((prev) => ({ ...prev, loggingIn: null }));

        const response = await api.post("/auth/login", { email, password });

        if (response.status === 200 && response.data.token) {
          localStorage.setItem("token", response.data.token);
          setIsAuthenticated(true);
        } else {
          setError((prev) => ({
            ...prev,
            loggingIn: "Invalid credentials",
          }));
        }
      } catch (err) {
        setError((prev) => ({
          ...prev,
          loggingIn: handleError(err, "Failed to login"),
        }));
      } finally {
        setLoading((prev) => ({ ...prev, loggingIn: false }));
      }
    },
    []
  );

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
      forgotPassword: null,
      resetPassword: null,
    });
  }, []);

  const updateUser = useCallback(
    async (user: User & { currentPassword?: string; newPassword?: string }) => {
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
    },
    []
  );

  async function updatePassword(currentPassword: string, newPassword: string) {
    try {
      setLoading((prev) => ({ ...prev, updatingUser: true }));
      await api.post("/auth/update-password", {
        currentPassword,
        newPassword,
      });
    } catch (err) {
      setError((prev) => ({
        ...prev,
        updatingUser: handleError(err, "Failed to update password"),
      }));
    } finally {
      setLoading((prev) => ({ ...prev, updatingUser: false }));
    }
  }

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

  const forgotPassword = useCallback(async (email: string) => {
    try {
      setLoading((prev) => ({ ...prev, forgotPassword: true }));
      setError((prev) => ({ ...prev, forgotPassword: null }));

      await api.post("/auth/forgot-password", { email });
      return { success: true };
    } catch (err) {
      setError((prev) => ({
        ...prev,
        forgotPassword: handleError(err, "Failed to process password reset"),
      }));
      return { success: false };
    } finally {
      setLoading((prev) => ({ ...prev, forgotPassword: false }));
    }
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    try {
      setLoading((prev) => ({ ...prev, resetPassword: true }));
      setError((prev) => ({ ...prev, resetPassword: null }));

      await api.post(`/auth/reset-password/${token}`, { password });
      return { success: true };
    } catch (err) {
      setError((prev) => ({
        ...prev,
        resetPassword: handleError(err, "Failed to reset password"),
      }));
      return { success: false };
    } finally {
      setLoading((prev) => ({ ...prev, resetPassword: false }));
    }
  }, []);

  const contextValue = useMemo(
    () => ({
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
      updatePassword,
      fetchCandidates,
      forgotPassword,
      resetPassword,
    }),
    [
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
      forgotPassword,
      resetPassword,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
