import { ReactNode, useEffect, useState } from "react";
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

  async function fetchInterviewWithId(id: string) {
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
  }

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
      const { data } = await api.put(`/interviews/${interview._id}`, interview);
      setInterviews(
        interviews.map((interview) =>
          interview._id === data._id ? data : interview
        )
      );
    } catch (err) {
      setError({
        ...error,
        updatingInterview: handleError(err, "Error updating interview!"),
      });
    } finally {
      setLoading({ ...loading, updatingInterview: false });
    }
  }

  async function startInterview() {
    try {
      setLoading({ ...loading, startingInterview: true });
      await api.post(`/interviews/${selectedInterview!._id}/start`, {});
      await updateInterviews();
      setError({ ...error, startingInterview: null });
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
    if (!selectedInterview) return;

    console.log(selectedInterview);

    if (selectedInterview.questions.length === 0) {
      try {
        setLoading({ ...loading, generatingQuestions: true });

        const response = await api.post(
          `/interviews/${selectedInterview!._id}/generate-questions`
        );

        console.log("Generated questions", response.data.questions);
        setError({ ...error, generatingQuestions: null });
        setSelectedInterview(response.data);
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

  async function inviteCandidate(
    interviewId: string,
    inviteData: { email: string; scheduledTime: string }
  ) {
    setLoading({ ...loading, invitingCandidate: true });

    try {
      await api.post(`/interviews/${interviewId}/invite`, inviteData);

      await updateInterviews();

      setError({ ...error, invitingCandidate: null });
    } catch (err) {
      setError({
        ...error,
        invitingCandidate: handleError(err, "Failed to invite candidate"),
      });
    } finally {
      setLoading({ ...loading, invitingCandidate: false });
    }
  }

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
