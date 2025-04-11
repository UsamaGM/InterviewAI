import { useInterview } from "../../context/InterviewContext";
import { Question } from "../../utils/types";
import { LoadingSpinner } from "../common";

interface props {
  questions: Question[];
  index: number;
}

function AiAssessmentResults({ questions, index }: props) {
  const {
    loading: { assessingAnswer },
  } = useInterview();

  const currentQuestion = questions ? questions[index] : null;

  return (
    <div className="w-full max-w-1/4 p-4">
      <h4 className="text-xl font-semibold text-gray-800 mb-3">
        AI Assessment
      </h4>
      {assessingAnswer ? (
        <LoadingSpinner size="lg" />
      ) : currentQuestion &&
        currentQuestion.aiAssessment &&
        currentQuestion.aiAssessment.score ? (
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <span className="font-medium">Score:</span>
            <span>{currentQuestion.aiAssessment.score}</span>
          </div>

          {currentQuestion.aiAssessment.keywords!.length > 0 && (
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium mb-1">Keywords:</div>
              <div className="flex flex-wrap gap-1">
                {currentQuestion.aiAssessment.keywords!.map(
                  (keyword, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full"
                    >
                      {keyword}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <span className="font-medium">Sentiment:</span>
            <span>{currentQuestion.aiAssessment.sentiment?.toUpperCase()}</span>
          </div>

          {currentQuestion.aiAssessment.feedback && (
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium mb-1">Feedback:</div>
              <p className="text-gray-700">
                {currentQuestion.aiAssessment.feedback}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 italic">The answer is not assessed yet.</p>
      )}
    </div>
  );
}

export default AiAssessmentResults;
