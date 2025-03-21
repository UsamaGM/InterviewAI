import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Question, Interview } from "../utils/types";
import { AxiosError } from "axios";

const TakeInterview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const interviewResponse = await api.post(
          `/interviews/${id}/generate-questions`
        );
        setInterview(interviewResponse.data);
        const initialAnswers: { [key: string]: string } = {};
        interviewResponse.data.questions.forEach((question: Question) => {
          initialAnswers[question._id] = question.answerText || "";
        });
        setAnswers(initialAnswers);
      } catch (error: AxiosError | unknown) {
        setError(
          error instanceof AxiosError
            ? error.message
            : "Error fetching interview"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  const getQuestionStatus = (question: Question) => {
    if (question.aiAssessment && question.aiAssessment.score !== undefined) {
      return "assessed";
    } else if (answers[question._id]) {
      return "answered";
    } else {
      return "pending";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "assessed":
        return <p>Checked</p>;
      case "answered":
        return <p>Answered</p>;
      case "pending":
        return <p>Pending</p>;
      default:
        return null;
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      saveAnswer(questionId, answer);
    }, 1000);
  };

  const saveAnswer = async (questionId: string, answer: string) => {
    if (!interview) return;

    try {
      const updatedQuestions = interview.questions.map((question) => {
        if (question._id === questionId) {
          return { ...question, answerText: answer };
        }
        return question;
      });

      await api.put(`/interviews/${id}`, { questions: updatedQuestions });
      console.log(`Answer saved for question ${questionId}`);
    } catch (error: AxiosError | unknown) {
      setError(
        error instanceof AxiosError ? error.message : "Error saving answer"
      );
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < interview!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitAnswers = async () => {
    if (!interview) return;

    try {
      const questionsWithAnswers = interview.questions.map((question) => ({
        ...question,
        answerText: answers[question._id] || "",
      }));

      await api.put(`/interviews/${id}`, { questions: questionsWithAnswers });
      navigate("/interviews");
    } catch (error: AxiosError | unknown) {
      setError(
        error instanceof AxiosError ? error.message : "Error submitting answers"
      );
    }
  };

  const handleAssessAnswer = async (
    questionId: string,
    questionIndex: number
  ) => {
    if (!interview) return;

    setLoading(true);

    try {
      const response = await api.post(`/interviews/${id}/assess-answer`, {
        questionIndex: questionIndex,
        answerText: answers[questionId],
      });

      setInterview(response.data);
    } catch (error: AxiosError | unknown) {
      setError(
        error instanceof AxiosError ? error.message : "Error assessing answer"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitInterview = async () => {
    if (!interview) return;

    try {
      await api.post(`/interviews/${id}/rate-interview`, {});
      const response = await api.get(`/interviews/${id}`);
      setInterview(response.data);
    } catch (error: AxiosError | unknown) {
      setError(
        error instanceof AxiosError
          ? error.message
          : "Error submitting interview"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!interview) {
    return <p className="text-center">Interview not found.</p>;
  }

  const question: Question = interview.questions[currentQuestionIndex];

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl w-full">
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h4 className="text-2xl font-semibold text-center mb-4">
            {interview.title}
          </h4>
          <p className="text-center text-gray-700">{interview.description}</p>
        </div>

        {interview.status === "in-progress" && question ? (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <h5 className="text-xl font-semibold mb-2">
                {currentQuestionIndex + 1}. {question.questionText}
              </h5>
              <div className="flex items-center mb-2">
                {getStatusIcon(
                  getQuestionStatus(interview.questions[currentQuestionIndex])
                )}
                <span className="ml-2">
                  {getQuestionStatus(interview.questions[currentQuestionIndex])}
                </span>
              </div>
              <textarea
                className="w-full border rounded-lg p-2 mb-2"
                rows={4}
                value={answers[question._id] || ""}
                onChange={(e) =>
                  handleAnswerChange(question._id, e.target.value)
                }
              />
              <div className="flex justify-end mb-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() =>
                    handleAssessAnswer(question._id, currentQuestionIndex)
                  }
                  disabled={!answers[question._id]}
                >
                  Assess Answer
                </button>
              </div>
              {question.aiAssessment && (
                <div className="border-t pt-2">
                  <h6 className="font-semibold">AI Assessment:</h6>
                  <p>Score: {question.aiAssessment.score}</p>
                  <p>Keywords: {question.aiAssessment.keywords?.join(", ")}</p>
                  <p>Sentiment: {question.aiAssessment.sentiment}</p>
                  <p>Feedback: {question.aiAssessment.feedback}</p>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={handleNextQuestion}
                disabled={
                  currentQuestionIndex === interview.questions.length - 1
                }
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center">
            No questions found for this interview. Did you add any?
          </p>
        )}

        {interview.status === "in-progress" && question && (
          <div className="flex justify-center mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={handleSubmitAnswers}
            >
              Save Answers
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSubmitInterview}
            >
              Submit Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeInterview;
