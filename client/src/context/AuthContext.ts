import { createContext } from "react";
import { User } from "../utils/types";

export type errorType = {
  initializing: string | null;
  loggingIn: string | null;
  registering: string | null;
  updatingUser: string | null;
  fetchingCandidates: string | null;
};

export type loadingType = {
  initializing: boolean;
  loggingIn: boolean;
  registering: boolean;
  updatingUser: boolean;
  fetchingCandidates: boolean;
};

interface AuthContextType {
  isAuthenticated: boolean;
  isCandidate: boolean | null;
  isReady: boolean;
  user: User | null;
  candidates: User[];
  error: errorType;
  loading: loadingType;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: User) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => Promise<void>;
  fetchCandidates: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
