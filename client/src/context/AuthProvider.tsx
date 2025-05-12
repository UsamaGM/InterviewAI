import { useState, ReactNode, useEffect, useCallback, useMemo } from "react";
import { AxiosResponse } from "axios";
import { handleError } from "@/utils/errorHandler";
import { User } from "@/utils/types";
import { AuthContext, errorType, loadingType } from "./AuthContext";
import api from "@/services/api";

const TOKEN_EXPIRY_BUFFER = 300000; // 5 minutes in milliseconds

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
      setError((prev) => ({ ...prev, registering: null }));

      await api.post("/auth/register", userData);
      return true;
    } catch (err) {
      setError((prev) => ({
        ...prev,
        registering: handleError(err, "Failed to register"),
      }));
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, registering: false }));
    }
  }, []);

  const logout = useCallback(async () => {
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

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    try {
      if (token) {
        setLoading((prev) => ({ ...prev, initializing: true }));
        setError((prev) => ({ ...prev, initializing: null }));

        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = tokenData.exp * 1000;

        if (expirationTime - Date.now() < TOKEN_EXPIRY_BUFFER) {
          await logout();
          return;
        }

        const userResponse: AxiosResponse<User> = await api.get(
          "/users/profile"
        );
        setUser(userResponse.data);
      }
    } catch (err) {
      setError((prev) => ({
        ...prev,
        initializing: handleError(err, "Failed to fetch user"),
      }));
      await logout();
    } finally {
      setLoading((prev) => ({ ...prev, initializing: false }));
      setIsReady(true);
    }
  }, [logout]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser, isAuthenticated]);

  const updateUser = useCallback(
    async (
      userData: Partial<User> & {
        currentPassword?: string;
        newPassword?: string;
      }
    ) => {
      try {
        setLoading((prev) => ({ ...prev, updatingUser: true }));
        setError((prev) => ({ ...prev, updatingUser: null }));

        const response = await api.put("/users/profile", userData);
        setUser(response.data);
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

  const updatePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        setLoading((prev) => ({ ...prev, updatingUser: true }));
        setError((prev) => ({ ...prev, updatingUser: null }));

        await api.post("/auth/update-password", {
          currentPassword,
          newPassword,
        });
        return true;
      } catch (err) {
        setError((prev) => ({
          ...prev,
          updatingUser: handleError(err, "Failed to update password"),
        }));
        return false;
      } finally {
        setLoading((prev) => ({ ...prev, updatingUser: false }));
      }
    },
    []
  );

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
      updatePassword,
      fetchCandidates,
      forgotPassword,
      resetPassword,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
