import { createContext } from "react";
import { User } from "../utils/types";

export type errorType = {
  initializing: string | null;
  loggingIn: string | null;
  registering: string | null;
  updatingUser: string | null;
  fetchingCandidates: string | null;
  forgotPassword: string | null;
  resetPassword: string | null;
};

export type loadingType = {
  initializing: boolean;
  loggingIn: boolean;
  registering: boolean;
  updatingUser: boolean;
  fetchingCandidates: boolean;
  forgotPassword: boolean;
  resetPassword: boolean;
};

export type AuthContextType = {
  isAuthenticated: boolean;
  isCandidate: boolean | null;
  isReady: boolean;
  user: User | null;
  candidates: User[];
  error: errorType;
  loading: loadingType;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: User) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  fetchCandidates: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean }>;
  resetPassword: (
    token: string,
    password: string
  ) => Promise<{ success: boolean }>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
