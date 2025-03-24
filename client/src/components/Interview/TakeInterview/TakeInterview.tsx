import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { Question, Interview } from "../../../utils/types";
import { AxiosError, AxiosResponse } from "axios";
import Steps from "./Steps";
import IconButton from "../../Buttons/IconButton";
import SlidingIconButton from "../../Buttons/SlidingIconButton";

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
        const initialAnswers: { [key: string]: string } = {};
        const interviewResponse: AxiosResponse<Interview> = await api.get(
          `/interviews/${id}`
        );

        if (!interviewResponse.data.questions) {
          const interviewResponse = await api.post(
            `/interviews/${id}/generate-questions`
          );
          setInterview(interviewResponse.data);

          interviewResponse.data.questions.forEach((question: Question) => {
            initialAnswers[question._id] = question.answerText || "";
          });
        } else {
          setInterview(interviewResponse.data);
          interviewResponse.data.questions.forEach((question: Question) => {
            initialAnswers[question._id] = question.answerText || "";
          });
        }
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
    setLoading(true);

    try {
      await api.post(`/interviews/${id}/rate-interview`, {});

      navigate(`/interviews/${id}/details`);
    } catch (error: AxiosError | unknown) {
      setError(
        error instanceof AxiosError
          ? error.message
          : "Error submitting interview"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!interview) {
    return <p className="text-center">Interview not found.</p>;
  }

  const question: Question = interview.questions[currentQuestionIndex];
  console.log(question);

  return (
    <div className="flex justify-center items-start h-[calc(100vh-100px)] bg-gray-100 p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong className="font-semibold">Error!</strong>
          <span className="ml-2">{error}</span>
        </div>
      )}

      {interview && (
        <div className="w-1/4 h-full p-8 mr-4 max-h-full overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {interview.title}
          </h2>
          <p className="text-gray-600 text-justify">{interview.description}</p>

          <div className="flex flex-col gap-4 mt-6">
            <SlidingIconButton
              title="Save Answers"
              onClick={handleSubmitAnswers}
            />
            <SlidingIconButton
              title="Submit Interview"
              onClick={handleSubmitInterview}
            />
          </div>
        </div>
      )}

      <div className="w-2/4 bg-white rounded-lg shadow-md p-8">
        {interview?.status === "in-progress" && question && (
          <>
            <h3 className="text-lg text-justify font-semibold text-gray-800 mb-6">
              {question.questionText}
            </h3>

            <textarea
              className="w-full p-4 outline rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 mb-6 min-h-[150px] resize-none"
              value={answers[question._id] || ""}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              placeholder="Type your answer here..."
              disabled={question.aiAssessment?.score !== undefined}
            />

            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-blue-400 focus:ring-offset-2 ring-2 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              onClick={() =>
                handleAssessAnswer(question._id, currentQuestionIndex)
              }
              disabled={
                !answers[question._id] ||
                question.aiAssessment?.score !== undefined
              }
            >
              Assess Answer
            </button>

            <div className="flex justify-between items-center">
              <IconButton
                flipped
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              />
              <Steps
                questions={interview.questions}
                currentIndex={currentQuestionIndex}
              />
              <IconButton
                onClick={handleNextQuestion}
                disabled={
                  currentQuestionIndex === interview.questions.length - 1
                }
              />
            </div>
          </>
        )}
      </div>

      <div className="flow-root w-1/4 mr-4 mb-4 p-6 max-h-full overflow-y-auto">
        <h4 className="font-semibold text-2xl text-gray-800 mb-4">
          AI Assessment
        </h4>
        {question.aiAssessment?.score !== undefined ? (
          <dl className="-my-3 divide-y divide-gray-200 text-sm">
            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Score</dt>

              <dd className="text-gray-700 sm:col-span-2">
                {question.aiAssessment.score}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Keywords</dt>

              <dd className="text-gray-700 sm:col-span-2 flex flex-wrap gap-2">
                {question.aiAssessment.keywords?.map((keyword) => (
                  <span className="bg-green-300 py-1 px-2 rounded-full">{`${keyword}`}</span>
                ))}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Sentiment</dt>

              <dd className="text-gray-700 sm:col-span-2">
                {question.aiAssessment.sentiment?.toUpperCase()}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Feedback</dt>

              <dd className="text-gray-700 sm:col-span-2">
                {question.aiAssessment.feedback}
              </dd>
            </div>
          </dl>
        ) : (
          <p>The answer is not assessed yet.</p>
        )}
      </div>

      {/* No Questions Message */}
      {interview?.status === "in-progress" && !question && (
        <p className="text-center mt-8 text-gray-600">
          No questions found for this interview.
        </p>
      )}
    </div>
  );
};

export default TakeInterview;
