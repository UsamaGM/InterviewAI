import { useInterview } from "../../context/InterviewContext";
import { Question } from "../../utils/types";
import { LoadingSpinner } from "../common";

interface props {
  currentQuestionIndex: number;
}

function AiAssessmentResults({ currentQuestionIndex }: props) {
  const {
    selectedInterview,
    loading: { assessingAnswer },
  } = useInterview();

  const question: Question = selectedInterview!.questions[currentQuestionIndex];

  return (
    <div className="flow-root w-1/4">
      <h4 className="font-semibold text-2xl text-gray-800 mb-4">
        AI Assessment
      </h4>
      {assessingAnswer ? (
        <LoadingSpinner size="lg" />
      ) : question && question.aiAssessment?.score !== undefined ? (
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
              {question.aiAssessment.keywords?.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-green-300 py-1 px-2 rounded-full"
                >{`${keyword}`}</span>
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
  );
}

export default AiAssessmentResults;
