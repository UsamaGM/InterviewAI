import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorAlert, LoadingSpinner, TextArea } from "@/components/common";
import { useInterview } from "@/hooks";
import { Question } from "@/utils/types";

interface props {
  currentQuestionIndex: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  questions: Question[];
}

const QuestionWithAnswerTextBoxAndAssessmentButton = React.memo(function ({
  currentQuestionIndex,
  setIndex,
  questions,
}: props) {
  console.log(questions);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const {
    assessAnswer,
    generateQuestions,
    saveAnswer,
    loading: { assessingAnswer, generatingQuestions, savingAnswer },
    error: { generatingQuestions: generateError },
  } = useInterview();

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions?.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const hasAssessment = currentQuestion?.aiAssessment?.score !== undefined;
  const currentAnswer = answers[currentQuestion?._id] || "";
  const { id } = useParams();

  useEffect(() => {
    async function initializeQuestions() {
      if (questions?.length === 0) await generateQuestions(id as string);

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
  }, [questions, id, generateQuestions]);

  function handleNextQuestion() {
    if (!isLastQuestion) {
      setIndex((prev) => prev + 1);
    }
  }

  function handlePreviousQuestion() {
    if (!isFirstQuestion) {
      setIndex((prev) => prev - 1);
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

  if (generatingQuestions) return <LoadingSpinner size="lg" />;

  return (
    <div className="w-2/4 bg-white/80 backdrop-blur-md min-h-[300px] h-fit rounded-md p-6">
      {generateError && (
        <ErrorAlert
          title="Failed to generate questions!"
          subtitle="It seems the server is too busy at the moment! Let's try again after some time."
        />
      )}
      {currentQuestion && (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              className="px-4 py-2 rounded-md disabled:cursor-default cursor-pointer text-blue-400 hover:text-blue-800 disabled:hover:bg-transparent hover:bg-blue-100  disabled:text-gray-400 font-semibold transition duration-200"
              onClick={handlePreviousQuestion}
              disabled={isFirstQuestion}
            >
              Previous
            </button>
            <div className="flex space-x-2">
              <NavigationDots
                currentQuestionIndex={currentQuestionIndex}
                onClick={(i) => setIndex(i)}
                totalQuestions={totalQuestions}
              />
            </div>
            <button
              className="px-4 py-2 rounded-md disabled:cursor-default cursor-pointer text-blue-400 hover:text-blue-800 disabled:hover:bg-transparent hover:bg-blue-100  disabled:text-gray-400 font-semibold transition duration-200"
              onClick={handleNextQuestion}
              disabled={isLastQuestion}
            >
              Next
            </button>
          </div>

          <h3 className="text-lg text-justify font-semibold text-gray-800 mt-6 mb-12">
            {currentQuestion.questionText}
          </h3>

          <TextArea
            disabled={hasAssessment}
            placeholder="Type your answer here..."
            value={currentAnswer}
            onChange={(e) =>
              handleAnswerChange(currentQuestion._id, e.target.value)
            }
          />

          <div className="mt-4">
            <button
              className="w-full bg-blue-500 text-blue-900 hover:bg-blue-400 hover:scale-95 disabled:bg-blue-200 disabled:cursor-not-allowed font-semibold cursor-pointer py-2 px-4 rounded transition-all duration-300 ease-in-out"
              onClick={() => assessAnswer(currentQuestionIndex, currentAnswer)}
              disabled={
                !currentAnswer ||
                hasAssessment ||
                savingAnswer ||
                assessingAnswer
              }
            >
              {assessingAnswer ? <LoadingSpinner size="sm" /> : "Assess Answer"}
            </button>
          </div>
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

const NavigationDots = React.memo(function (props: NavigationDotProps) {
  return Array.from({ length: props.totalQuestions }).map((_, i) => (
    <div
      key={i}
      className={`relative group flex items-center justify-center w-8 h-8 mx-1 rounded-full transition-all duration-300 ease-in-out ${
        props.currentQuestionIndex === i
          ? "bg-blue-500 text-white shadow-lg scale-110"
          : "bg-gray-200 hover:bg-gray-300 hover:scale-105"
      } ${
        i < props.currentQuestionIndex
          ? "bg-blue-100 border-2 border-blue-300"
          : "border-2 border-transparent"
      }`}
      style={{
        cursor: props.currentQuestionIndex !== i ? "pointer" : "default",
      }}
      onClick={() => props.onClick(i)}
      title={`Question ${i + 1}`}
    >
      <span className="text-sm font-semibold">{i + 1}</span>
      {props.currentQuestionIndex === i && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
        </div>
      )}
    </div>
  ));
});

export default QuestionWithAnswerTextBoxAndAssessmentButton;
