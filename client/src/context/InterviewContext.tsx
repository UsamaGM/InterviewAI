import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Interview, InterviewForm, Question } from "../utils/types";
import { handleError } from "../utils/errorHandler";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

interface loadingType {
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
  schedulingInterview: boolean;
}

interface errorType {
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
  schedulingInterview: string | null;
}

interface InterviewContextType {
  interviews: Interview[];
  selectedInterview: Interview | null;
  loading: loadingType;
  error: errorType;
  setInterviews: (interviews: Interview[]) => void;
  setSelectedInterview: (interview: Interview | null) => void;
  createInterview: (interview: InterviewForm) => Promise<Interview>;
  updateInterviews: () => Promise<void>;
  updateInterview: (interview: Interview) => Promise<void>;
  startInterview: () => Promise<void>;
  deleteInterview: () => Promise<void>;
  generateQuestions: () => Promise<Question[]>;
  saveAnswer: (questionId: string, answer: string) => Promise<void>;
  submitAnswers: () => Promise<void>;
  assessAnswer: (questionIndex: number, answer: string) => Promise<void>;
  submitInterview: () => Promise<void>;
  inviteCandidate: (
    interviewId: string,
    inviteData: { email: string; scheduledTime: string }
  ) => Promise<void>;
}

const InterviewContext = createContext<InterviewContextType | undefined>(
  undefined
);

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context)
    throw new Error("useInterview must be used within a InterviewProvider");
  return context;
};

export const InterviewProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  );
  const [loading, setLoading] = useState<loadingType>({
    generatingQuestions: false,
    updatingInterview: false,
    startingInterview: false,
    deletingInterview: false,
    savingAnswer: false,
    assessingAnswer: false,
    submittingAnswers: false,
    submittingInterview: false,
    fetchingInterviews: false,
    creatingInterview: false,
    schedulingInterview: false,
  });
  const [error, setError] = useState<errorType>({
    assessingAnswer: null,
    creatingInterview: null,
    deletingInterview: null,
    fetchingInterviews: null,
    generatingQuestions: null,
    savingAnswer: null,
    schedulingInterview: null,
    startingInterview: null,
    submittingAnswers: null,
    submittingInterview: null,
    updatingInterview: null,
  });

  const isCandidate = useAuth().user?.role === "candidate";

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading((prev) => ({ ...prev, fetchingInterviews: true }));
        const response = isCandidate
          ? await api.get("/interviews/candidate")
          : await api.get("/interviews/recruiter");

        setInterviews(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError((prev) => ({
          ...prev,
          fetchingInterviews: handleError(err, "Failed to fetch interviews"),
        }));
      } finally {
        setLoading((prev) => ({ ...prev, fetchingInterviews: false }));
      }
    };

    fetchInterviews();
  }, [isCandidate]);

  async function updateInterviews() {
    try {
      setLoading({ ...loading, fetchingInterviews: true });
      const response = isCandidate
        ? await api.get("/interviews/candidate")
        : await api.get("/interviews/recruiter");
      setInterviews(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError({
        ...error,
        fetchingInterviews: handleError(err, "Failed to fetch interviews"),
      });
    } finally {
      setLoading({ ...loading, fetchingInterviews: false });
    }
  }

  async function createInterview(interview: InterviewForm) {
    try {
      setLoading({ ...loading, creatingInterview: true });
      const { data } = await api.post("/interviews", interview);
      setInterviews([...interviews, data]);
      return data;
    } catch (err) {
      setError({
        ...error,
        creatingInterview: handleError(err, "Error creating interview"),
      });
    } finally {
      setLoading({ ...loading, creatingInterview: false });
    }
  }

  async function updateInterview(interview: Interview) {
    try {
      setLoading({ ...loading, updatingInterview: true });
      const response = await api.put(`/interviews/${interview._id}`, interview);
      setInterviews([...interviews, response.data]);
    } catch (err) {
      setError({
        ...error,
        updatingInterview: handleError(err, "Error updating interview"),
      });
    } finally {
      setLoading({ ...loading, updatingInterview: false });
    }
  }

  async function startInterview() {
    try {
      setLoading({ ...loading, startingInterview: true });
      const response = await api.post(
        `/interviews/${selectedInterview!._id}/start`,
        {}
      );
      setInterviews([...interviews, response.data]);
    } catch (err) {
      setError({
        ...error,
        startingInterview: handleError(err, "Unable to start interview!"),
      });
    } finally {
      setLoading((prev) => ({ ...prev, startingInterview: false }));
    }
  }

  async function deleteInterview() {
    try {
      setLoading({ ...loading, deletingInterview: true });
      await api.delete(`/interviews/${selectedInterview!._id}`);
      await updateInterviews();
    } catch (err) {
      setError({
        ...error,
        deletingInterview: handleError(err, "Unable to delete interview!"),
      });
    } finally {
      setLoading({ ...loading, deletingInterview: false });
    }
  }

  async function generateQuestions() {
    if (!selectedInterview) return [];
    else if (selectedInterview.questions.length === 0) {
      try {
        setLoading({ ...loading, generatingQuestions: true });

        const response = await api.post(
          `/interviews/${selectedInterview!._id}/generate-questions`
        );

        setSelectedInterview(response.data);

        return response.data.questions;
      } catch (err) {
        setError({
          ...error,
          generatingQuestions: handleError(
            err,
            "Failed to generate questions!"
          ),
        });
      } finally {
        setLoading({ ...loading, generatingQuestions: false });
      }
    } else {
      return selectedInterview.questions;
    }
  }

  async function saveAnswer(questionId: string, answer: string) {
    if (!selectedInterview) return;

    try {
      setLoading({ ...loading, savingAnswer: true });
      const updatedQuestions = selectedInterview.questions.map((question) => {
        if (question._id === questionId) {
          return { ...question, answerText: answer };
        }
        return question;
      });

      await api.put(`/interviews/${selectedInterview!._id}`, {
        questions: updatedQuestions,
      });

      setSelectedInterview({
        ...selectedInterview,
        questions: updatedQuestions,
      });
    } catch (err) {
      setError({
        ...error,
        savingAnswer: handleError(err, "Failed to save answer!"),
      });
    } finally {
      setLoading({ ...loading, savingAnswer: false });
    }
  }

  async function assessAnswer(questionIndex: number, answer: string) {
    if (!selectedInterview) return;

    try {
      setLoading({ ...loading, assessingAnswer: true });
      const response = await api.post(
        `/interviews/${selectedInterview!._id}/assess-answer`,
        {
          questionIndex,
          answerText: answer,
        }
      );

      setSelectedInterview({
        ...selectedInterview,
        questions: response.data.questions,
      });
    } catch (err) {
      setError({
        ...error,
        assessingAnswer: handleError(err, "Failed to assess answer!"),
      });
    } finally {
      setLoading({ ...loading, assessingAnswer: false });
    }
  }

  async function submitAnswers() {
    if (!selectedInterview) return;

    try {
      setLoading({ ...loading, submittingAnswers: true });

      const questionsWithAnswers = selectedInterview.questions.map(
        (question) => ({
          ...question,
          answerText: question.answerText || "",
        })
      );

      await api.put(`/interviews/${selectedInterview!._id}`, {
        questions: questionsWithAnswers,
      });
      await updateInterviews();
    } catch (err) {
      setError({
        ...error,
        submittingAnswers: handleError(err, "Failed to submit answers!"),
      });
    } finally {
      setLoading({ ...loading, submittingAnswers: false });
    }
  }

  async function submitInterview() {
    try {
      setLoading({ ...loading, submittingInterview: true });

      await api.post(`/interviews/${selectedInterview!._id}/rate-interview`);

      await updateInterviews();
    } catch (err) {
      setError({
        ...error,
        submittingInterview: handleError(err, "Failed to submit interview!"),
      });
    } finally {
      setLoading({ ...loading, submittingInterview: false });
    }
  }

  const inviteCandidate = async (
    interviewId: string,
    inviteData: { email: string; scheduledTime: string }
  ) => {
    setLoading({ ...loading, schedulingInterview: true });

    try {
      const { data } = await api.post(
        `/interviews/${interviewId}/invite`,
        inviteData
      );

      setInterviews([...interviews, data]);
      setSelectedInterview(data);

      setError({ ...error, schedulingInterview: null });
    } catch (err) {
      setError({
        ...error,
        schedulingInterview: handleError(err, "Failed to invite candidate"),
      });
    } finally {
      setLoading({ ...loading, schedulingInterview: false });
    }
  };

  return (
    <InterviewContext.Provider
      value={{
        interviews,
        selectedInterview,
        loading,
        error,
        setInterviews,
        setSelectedInterview,
        createInterview,
        updateInterviews,
        updateInterview,
        startInterview,
        deleteInterview,
        generateQuestions,
        saveAnswer,
        assessAnswer,
        submitAnswers,
        submitInterview,
        inviteCandidate,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
