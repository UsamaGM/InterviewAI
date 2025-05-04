import { useQuestion } from "@/hooks";

function AiAssessmentResults() {
  const { currentQuestion } = useQuestion();
  return (
    <div className="w-full h-fit transition-all duration-300">
      <h4 className="text-xl font-semibold text-gray-700 mb-4">
        AI Assessment
      </h4>
      {currentQuestion && currentQuestion.aiAssessment?.score !== undefined ? (
        <div className="space-y-3 text-sm">
          <div className="flex w-full space-x-4">
            <div className="flex flex-col justify-between bg-blue-50 p-3 rounded-md flex-1">
              <div className="flex justify-between">
                <span className="font-semibold text-blue-800">Score:</span>
                <span className="font-medium text-blue-900">
                  {currentQuestion.aiAssessment.score}
                </span>
              </div>
              <hr className="text-blue-300" />
              <div className="flex justify-between">
                <span className="font-semibold text-blue-800">Sentiment:</span>
                <span className="font-medium text-blue-900">
                  {currentQuestion.aiAssessment.sentiment?.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-md flex-2">
              <div className="font-medium text-blue-700 mb-2">Keywords:</div>
              <div className="flex flex-wrap gap-2">
                {currentQuestion.aiAssessment.keywords!.map(
                  (keyword, index) => (
                    <span
                      key={index}
                      className="bg-green-200 text-green-900 text-xs px-3 py-1 rounded-full"
                    >
                      {keyword}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-md">
            <div className="font-semibold text-blue-700 mb-2">Feedback:</div>
            <p className="text-blue-800 leading-relaxed">
              {currentQuestion.aiAssessment.feedback}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-800 text-sm">
          Click "Assess the answer" for AI Assessment and Feedback
        </p>
      )}
    </div>
  );
}

export default AiAssessmentResults;
