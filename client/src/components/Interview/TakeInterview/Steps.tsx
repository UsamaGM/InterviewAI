import { Question } from "../../../utils/types";

interface StepsProps {
  questions: Question[];
  currentIndex: number;
}

function Steps({ questions, currentIndex }: StepsProps) {
  return (
    <ol className="flex items-center gap-2 text-xs font-medium text-gray-500 sm:gap-4">
      {questions.map((question: Question, index: number) => (
        <li key={index}>
          {question.aiAssessment?.score !== undefined ? (
            <div className="flex">
              <span
                className={`rounded-md p-1 text-green-600 ${
                  currentIndex === index && "border-black border"
                } ${
                  question.aiAssessment.score >= 7
                    ? "bg-green-200"
                    : question.aiAssessment.score >= 4
                    ? "bg-amber-200"
                    : "bg-red-200"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          ) : (
            <div
              className={`flex items-center justify-center gap-2 rounded-md bg-white text-blue-600 p-1 ${
                currentIndex === index && "border-2 border-blue-600"
              }`}
            >
              <span className="size-5 text-center h-full text-sm font-bold">
                {index + 1}
              </span>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

export default Steps;
