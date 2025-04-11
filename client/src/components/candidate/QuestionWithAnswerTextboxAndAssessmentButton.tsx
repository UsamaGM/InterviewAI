import { useEffect, useRef, useState } from "react";
import { useInterview } from "../../context/InterviewContext";
import { Question } from "../../utils/types";
import { ErrorAlert, LoadingSpinner, TextArea } from "../common";

interface props {
  currentQuestionIndex: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  questions: Question[];
}

export default function QuestionWithAnswerTextBoxAndAssessmentButton({
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

  useEffect(() => {
    async function initializeQuestions() {
      if (questions?.length === 0) await generateQuestions();

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

  return (
    <div className="w-2/4 bg-white/50 min-h-[300px] h-fit backdrop-blur-lg rounded-md p-6">
      {generatingQuestions && (
        <div className="flex flex-col gap-6 justify-center items-center">
          <LoadingSpinner size="lg" />
          <p>Generating Questions</p>
        </div>
      )}
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
            <div className="flex space-x-2">{renderNavigationDots()}</div>
            <button
              className="px-4 py-2 rounded-md disabled:cursor-default cursor-pointer text-blue-400 hover:text-blue-800 disabled:hover:bg-transparent hover:bg-blue-100  disabled:text-gray-400 font-semibold transition duration-200"
              onClick={handleNextQuestion}
              disabled={isLastQuestion}
            >
              Next
            </button>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">
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
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
              onClick={() => assessAnswer(currentQuestionIndex, currentAnswer)}
              disabled={
                !currentAnswer ||
                hasAssessment ||
                savingAnswer ||
                assessingAnswer
              }
            >
              {assessingAnswer ? (
                <>
                  <LoadingSpinner size="sm" />
                  Assessing...
                </>
              ) : (
                "Assess Answer"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );

  function renderNavigationDots() {
    return Array.from({ length: totalQuestions }).map((_, i) => (
      <div
        key={i}
        className={`relative group flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
          currentQuestionIndex === i
            ? "bg-blue-500 text-white"
            : "bg-gray-100 hover:bg-gray-200"
        } ${i < currentQuestionIndex ? "bg-blue-200" : ""}`}
        style={{
          cursor: currentQuestionIndex !== i ? "pointer" : "default",
        }}
        onClick={() => setIndex(i)}
        title={`Question ${i + 1}`}
      >
        <span className="text-xs font-medium">{i + 1}</span>
        {currentQuestionIndex === i && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
        )}
      </div>
    ));
  }
}
