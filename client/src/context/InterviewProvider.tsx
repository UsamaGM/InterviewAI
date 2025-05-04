import { ReactNode, useCallback, useEffect, useState } from "react";
import { Interview, InterviewForm } from "../utils/types";
import { handleError } from "../utils/errorHandler";
import { errorType, InterviewContext, loadingType } from "./InterviewContext";
import useAuth from "../hooks/useAuth";
import api from "../services/api";

export function InterviewProvider({ children }: { children: ReactNode }) {
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
    fetchingInterviewWithId: false,
    creatingInterview: false,
    schedulingInterview: false,
    invitingCandidate: false,
  });
  const [error, setError] = useState<errorType>({
    assessingAnswer: null,
    creatingInterview: null,
    deletingInterview: null,
    fetchingInterviews: null,
    fetchingInterviewWithId: null,
    generatingQuestions: null,
    savingAnswer: null,
    schedulingInterview: null,
    startingInterview: null,
    submittingAnswers: null,
    submittingInterview: null,
    updatingInterview: null,
    invitingCandidate: null,
  });

  const { isAuthenticated, isCandidate } = useAuth();

  useEffect(() => {
    async function fetchInterviews() {
      if (isAuthenticated && isCandidate !== null) {
        console.log("Fetching Interviews");
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
      }
      console.log("Initialized Interviews");
    }

    fetchInterviews();
  }, [isAuthenticated, isCandidate]);

  const fetchInterviewWithId = useCallback(async function (id: string) {
    setLoading((prev) => ({ ...prev, fetchingInterviewWithId: true }));
    try {
      const interviewResponse = await api.get(`/interviews/${id}`);
      console.log("Fetched interview", interviewResponse.data);
      setSelectedInterview(interviewResponse.data);
      setError((prev) => ({
        ...prev,
        fetchingInterviewWithId: null,
      }));
    } catch (error) {
      setError((prev) => ({
        ...prev,
        fetchingInterviewWithId: handleError(
          error,
          "Failed to fetch interview details!"
        ),
      }));
    } finally {
      setLoading((prev) => ({ ...prev, fetchingInterviewWithId: false }));
    }
  }, []);

  const updateInterviews = useCallback(
    async function () {
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
    },
    [isCandidate]
  );

  const createInterview = useCallback(async function (
    interview: InterviewForm
  ) {
    try {
      setLoading((prev) => ({ ...prev, creatingInterview: true }));
      const { data } = await api.post("/interviews", interview);
      setInterviews((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError((prev) => ({
        ...prev,
        creatingInterview: handleError(err, "Error creating interview"),
      }));
    } finally {
      setLoading((prev) => ({ ...prev, creatingInterview: false }));
    }
  },
  []);

  const updateInterview = useCallback(async function (interview: Interview) {
    try {
      setLoading((prev) => ({ ...prev, updatingInterview: true }));
      const { data } = await api.put(`/interviews/${interview._id}`, interview);
      setInterviews((prev) =>
        prev.map((interview) => (interview._id === data._id ? data : interview))
      );
    } catch (err) {
      setError((prev) => ({
        ...prev,
        updatingInterview: handleError(err, "Error updating interview!"),
      }));
    } finally {
      setLoading((prev) => ({ ...prev, updatingInterview: false }));
    }
  }, []);

  const startInterview = useCallback(
    async function () {
      try {
        setLoading((prev) => ({ ...prev, startingInterview: true }));
        await api.post(`/interviews/${selectedInterview!._id}/start`, {});
        await updateInterviews();
        setError((prev) => ({ ...prev, startingInterview: null }));
      } catch (err) {
        setError((prev) => ({
          ...prev,
          startingInterview: handleError(err, "Unable to start interview!"),
        }));
      } finally {
        setLoading((prev) => ({ ...prev, startingInterview: false }));
      }
    },
    [selectedInterview, updateInterviews]
  );

  const deleteInterview = useCallback(
    async function () {
      try {
        setLoading((prev) => ({ ...prev, deletingInterview: true }));
        await api.delete(`/interviews/${selectedInterview!._id}`);
        await updateInterviews();
      } catch (err) {
        setError((prev) => ({
          ...prev,
          deletingInterview: handleError(err, "Unable to delete interview!"),
        }));
      } finally {
        setLoading((prev) => ({ ...prev, deletingInterview: false }));
      }
    },
    [updateInterviews, selectedInterview]
  );

  const generateQuestions = useCallback(async function (interviewId: string) {
    try {
      setLoading((prev) => ({ ...prev, generatingQuestions: true }));

      const response = await api.post(
        `/interviews/${interviewId}/generate-questions`
      );

      setError((prev) => ({ ...prev, generatingQuestions: null }));
      setSelectedInterview(response.data);
    } catch (err) {
      setError((prev) => ({
        ...prev,
        generatingQuestions: handleError(err, "Failed to generate questions!"),
      }));
    } finally {
      setLoading((prev) => ({ ...prev, generatingQuestions: false }));
    }
  }, []);

  const saveAnswer = useCallback(async function (
    questionId: string,
    answer: string
  ) {
    try {
      setLoading((prev) => ({ ...prev, savingAnswer: true }));
      console.log("Saving answer...", answer);

      setSelectedInterview((prevInterview) => {
        if (!prevInterview) return null;

        const updatedQuestions = prevInterview.questions.map((question) => {
          if (question._id === questionId) {
            return { ...question, answerText: answer };
          }
          return question;
        });

        api.put(`/interviews/${prevInterview._id}`, {
          questions: updatedQuestions,
        });

        return {
          ...prevInterview,
          questions: updatedQuestions,
        };
      });
    } catch (err) {
      setError((prev) => ({
        ...prev,
        savingAnswer: handleError(err, "Failed to save answer!"),
      }));
    } finally {
      setLoading((prev) => ({ ...prev, savingAnswer: false }));
    }
  },
  []);

  const assessAnswer = useCallback(
    async function (questionIndex: number, answer: string) {
      if (!selectedInterview) return;

      try {
        setLoading((prev) => ({ ...prev, assessingAnswer: true }));
        const response = await api.post(
          `/interviews/${selectedInterview!._id}/assess-answer`,
          {
            questionIndex,
            answerText: answer,
          }
        );

        setSelectedInterview((prev) => ({
          ...prev!,
          questions: response.data.questions,
        }));
      } catch (err) {
        setError((prev) => ({
          ...prev,
          assessingAnswer: handleError(err, "Failed to assess answer!"),
        }));
      } finally {
        setLoading((prev) => ({ ...prev, assessingAnswer: false }));
      }
    },
    [selectedInterview]
  );

  const submitAnswers = useCallback(
    async function () {
      if (!selectedInterview) return;

      try {
        setLoading((prev) => ({ ...prev, submittingAnswers: true }));

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
        setError((prev) => ({ ...prev, submittingAnswers: null }));
      } catch (err) {
        setError((prev) => ({
          ...prev,
          submittingAnswers: handleError(err, "Failed to submit answers!"),
        }));
      } finally {
        setLoading((prev) => ({ ...prev, submittingAnswers: false }));
      }
    },
    [selectedInterview, updateInterviews]
  );

  const submitInterview = useCallback(
    async function () {
      try {
        setLoading((prev) => ({ ...prev, submittingInterview: true }));

        await api.post(`/interviews/${selectedInterview!._id}/rate-interview`);

        await updateInterviews();
      } catch (err) {
        setError((prev) => ({
          ...prev,
          submittingInterview: handleError(err, "Failed to submit interview!"),
        }));
      } finally {
        setLoading((prev) => ({ ...prev, submittingInterview: false }));
      }
    },
    [updateInterviews, selectedInterview]
  );

  const inviteCandidate = useCallback(
    async function (
      interviewId: string,
      inviteData: { email: string; scheduledTime: string }
    ) {
      setLoading((prev) => ({ ...prev, invitingCandidate: true }));

      try {
        await api.post(`/interviews/${interviewId}/invite`, inviteData);

        await updateInterviews();

        setError((prev) => ({ ...prev, invitingCandidate: null }));
      } catch (err) {
        setError((prev) => ({
          ...prev,
          invitingCandidate: handleError(err, "Failed to invite candidate"),
        }));
      } finally {
        setLoading((prev) => ({ ...prev, invitingCandidate: false }));
      }
    },
    [updateInterviews]
  );

  return (
    <InterviewContext.Provider
      value={{
        interviews,
        selectedInterview,
        loading,
        error,
        setInterviews,
        setSelectedInterview,
        fetchInterviewWithId,
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
}
