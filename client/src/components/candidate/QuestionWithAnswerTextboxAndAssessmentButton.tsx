import { useEffect, useRef, useState } from "react";
import { useInterview } from "../../context/InterviewContext";
import { Question } from "../../utils/types";
import { LoadingSpinner } from "../common";

interface props {
  currentQuestionIndex: number;
  handleNextQuestion: () => void;
  handlePreviousQuestion: () => void;
}

export default function QuestionWithAnswerTextBoxAndAssessmentButton({
  currentQuestionIndex,
  handleNextQuestion,
  handlePreviousQuestion,
}: props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const {
    error: {
      assessingAnswer: assessError,
      generatingQuestions: generateError,
      savingAnswer: saveError,
    },
    selectedInterview,
    assessAnswer,
    generateQuestions,
    saveAnswer,
    loading: { assessingAnswer, generatingQuestions, savingAnswer },
  } = useInterview();

  const question: Question =
    selectedInterview?.questions[currentQuestionIndex] || ({} as Question);
  const questionsLength = selectedInterview?.questions.length || 0;
  const isLastQuestion = currentQuestionIndex === questionsLength - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const hasAssessment = question?.aiAssessment?.score !== undefined;
  const currentAnswer = answers[question?._id] || "";

  useEffect(() => {
    async function initializeQuestions() {
      const questions = await generateQuestions();

      const initialAnswers = questions.reduce(
        (acc, question: Question) => ({
          ...acc,
          [question._id]: question.answerText || "",
        }),
        {}
      );

      setAnswers(initialAnswers);
    }

    initializeQuestions();
  }, []);

  function handleAnswerChange(questionId: string, answer: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      saveAnswer(questionId, answer);
    }, 1000);
  }

  function renderNavigationDots() {
    return selectedInterview?.questions.map((_, i) => (
      <div
        key={i}
        className={`w-3 h-3 rounded-full mx-1 transition-all duration-600 transform ${
          currentQuestionIndex === i
            ? "bg-blue-500 scale-125 shadow-md"
            : "bg-gray-300 hover:bg-gray-400"
        } ${i < currentQuestionIndex ? "opacity-70" : ""}`}
        title={`Question ${i + 1}`}
        style={{
          cursor: currentQuestionIndex !== i ? "pointer" : "default",
        }}
      />
    ));
  }

  if (generatingQuestions) {
    return (
      <div className="w-2/4 bg-white rounded-lg items-center justify-center shadow-lg p-6">
        <LoadingSpinner size="lg" />
        <p className="text-center text-gray-500">Generating questions...</p>
      </div>
    );
  }

  return (
    <div className="w-2/4 bg-white rounded-lg shadow-lg p-6">
      {(generateError || assessError || saveError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-6">
          <strong className="font-semibold">Error!</strong>
          <span className="ml-2">{`${generateError} ${assessError} ${saveError}`}</span>
        </div>
      )}

      {question && (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              className="text-blue-500 disabled:text-gray-400"
              onClick={handlePreviousQuestion}
              disabled={isFirstQuestion}
            >
              Previous
            </button>
            <div className="flex space-x-2">{renderNavigationDots()}</div>
            <button
              className="text-blue-500 disabled:text-gray-400"
              onClick={handleNextQuestion}
              disabled={isLastQuestion}
            >
              Next
            </button>
          </div>

          <h3 className="text-lg text-justify font-semibold text-gray-800 mb-6">
            {question.questionText}
          </h3>

          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
            disabled={hasAssessment}
            placeholder="Type your answer here..."
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
          />

          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-blue-400 focus:ring-offset-2 ring-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            onClick={() => assessAnswer(currentQuestionIndex, currentAnswer)}
            disabled={
              !currentAnswer || hasAssessment || savingAnswer || assessingAnswer
            }
          >
            {assessingAnswer ? <LoadingSpinner size="sm" /> : "Assess Answer"}
          </button>
        </>
      )}
    </div>
  );
}
