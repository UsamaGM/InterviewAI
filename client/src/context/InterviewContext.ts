import { createContext } from "react";
import { Interview, InterviewForm } from "../utils/types";

export interface loadingType {
  generatingQuestions: boolean;
  creatingInterview: boolean;
  updatingInterview: boolean;
  startingInterview: boolean;
  deletingInterview: boolean;
  savingAnswer: boolean;
  assessingAnswer: boolean;
  submittingAnswers: boolean;
  submittingInterview: boolean;
  fetchingInterviews: boolean;
  fetchingInterviewWithId: boolean;
  schedulingInterview: boolean;
  invitingCandidate: boolean;
}

export interface errorType {
  generatingQuestions: string | null;
  creatingInterview: string | null;
  updatingInterview: string | null;
  startingInterview: string | null;
  deletingInterview: string | null;
  savingAnswer: string | null;
  assessingAnswer: string | null;
  submittingAnswers: string | null;
  submittingInterview: string | null;
  fetchingInterviews: string | null;
  fetchingInterviewWithId: string | null;
  schedulingInterview: string | null;
  invitingCandidate: string | null;
}

export interface InterviewContextType {
  interviews: Interview[];
  selectedInterview: Interview | null;
  loading: loadingType;
  error: errorType;
  setInterviews: (interviews: Interview[]) => void;
  setSelectedInterview: (interview: Interview | null) => void;
  createInterview: (interview: InterviewForm) => Promise<Interview>;
  fetchInterviewWithId: (id: string) => Promise<void>;
  updateInterviews: () => Promise<void>;
  updateInterview: (interview: Interview) => Promise<void>;
  startInterview: () => Promise<void>;
  deleteInterview: () => Promise<void>;
  generateQuestions: () => Promise<void>;
  saveAnswer: (questionId: string, answer: string) => Promise<void>;
  submitAnswers: () => Promise<void>;
  assessAnswer: (questionIndex: number, answer: string) => Promise<void>;
  submitInterview: () => Promise<void>;
  inviteCandidate: (
    interviewId: string,
    inviteData: { email: string; scheduledTime: string }
  ) => Promise<void>;
}

export const InterviewContext = createContext<InterviewContextType | null>(
  null
);
