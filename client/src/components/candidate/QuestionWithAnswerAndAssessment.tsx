import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorAlert, LoadingSpinner, TextArea } from "@/components/common";
import { useInterview, useQuestion } from "@/hooks";
import { Question } from "@/utils/types";

const QuestionWithAnswerAndAssessment = memo(function () {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const {
    currentQuestion,
    questions,
    currentIndex,
    setCurrentIndex,
    hasAssessment,
  } = useQuestion();

  const {
    generateQuestions,
    saveAnswer,
    loading: { generatingQuestions },
    error: { generatingQuestions: generateError },
  } = useInterview();

  const { id } = useParams();

  const initializeQuestions = useCallback(
    async function () {
      if (questions?.length === 0) await generateQuestions(id as string);

      const initialAnswers = questions.reduce<Record<string, string>>(
        (acc, question: Question) => ({
          ...acc,
          [question._id]: question.answerText || "",
        }),
        {}
      );

      setAnswers(initialAnswers);
    },
    [questions, id, generateQuestions]
  );

  useEffect(() => {
    initializeQuestions();
  }, [initializeQuestions]);

  function handleNextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handlePreviousQuestion() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  function handleAnswerChange(questionId: string, answer: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      saveAnswer(questionId, answer);
    }, 1000);
  }

  if (generatingQuestions)
    return (
      <div className="flex w-full h-full items-center justify-center">
        <LoadingSpinner />
        Generating Questions...
      </div>
    );

  return (
    <div className="flex-3/5 h-fit">
      {generateError && (
        <ErrorAlert
          title="Failed to generate questions!"
          subtitle="It seems the server is too busy at the moment! Let's try again after some time."
        />
      )}
      {currentQuestion && (
        <>
          <div className="flex justify-between items-center mb-6">
            <button
              className="px-3 py-1 rounded-lg disabled:cursor-default cursor-pointer text-blue-500 hover:text-blue-700 disabled:hover:bg-transparent hover:bg-blue-50 disabled:text-gray-400 font-medium transition-all duration-200 flex items-center gap-2"
              onClick={handlePreviousQuestion}
              disabled={currentIndex === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Previous
            </button>
            <div className="flex space-x-2">
              <NavigationDots
                currentQuestionIndex={currentIndex}
                onClick={(i) => setCurrentIndex(i)}
                totalQuestions={questions.length}
              />
            </div>
            <button
              className="px-3 py-1 rounded-lg disabled:cursor-default cursor-pointer text-blue-500 hover:text-blue-700 disabled:hover:bg-transparent hover:bg-blue-50 disabled:text-gray-400 font-medium transition-all duration-200 flex items-center gap-2"
              onClick={handleNextQuestion}
              disabled={currentIndex === questions.length - 1}
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
            <h3 className="text-lg text-justify text-gray-800">
              {currentQuestion.questionText}
            </h3>
          </div>

          <TextArea
            id="answer"
            disabled={hasAssessment}
            placeholder="Type your answer here..."
            value={answers[currentQuestion._id] || ""}
            onChange={(e) =>
              handleAnswerChange(currentQuestion._id, e.target.value)
            }
          />
        </>
      )}
    </div>
  );
});

type NavigationDotProps = {
  totalQuestions: number;
  currentQuestionIndex: number;
  onClick: (index: number) => void;
};

const NavigationDots = function (props: NavigationDotProps) {
  return (
    <div className="relative flex">
      {Array.from({ length: props.totalQuestions }).map((_, i) => (
        <div
          key={i}
          className={`group flex items-center justify-center w-10 h-6 mx-1 rounded-lg transition-colors duration-500 ease-in-out bg-blue-50 hover:bg-blue-100 ${
            props.currentQuestionIndex === i && "text-blue-800"
          }`}
          style={{
            cursor: props.currentQuestionIndex !== i ? "pointer" : "default",
          }}
          onClick={() => props.onClick(i)}
          title={`Question ${i + 1}`}
        >
          <span className="text-sm font-semibold z-20">{i + 1}</span>
        </div>
      ))}
      <div
        className="absolute pointer-events-none z-10 transition-all duration-500 ease-in-out w-10 h-6 rounded-lg bg-blue-200"
        style={{
          left: `${props.currentQuestionIndex * 48 + 4}px`, // 48px = width(40px) + margin(8px)
        }}
      />
    </div>
  );
};

export default QuestionWithAnswerAndAssessment;
