import { useNavigate } from "react-router-dom";
import { useInterview } from "../../context/InterviewContext";
import { LoadingSpinner } from "../common";
import { Interview } from "../../utils/types";

export default function TitleAndDescriptionWithActions({
  interview,
}: {
  interview: Interview;
}) {
  return (
    <div className="w-1/4 p-4 border-r border-gray-200 flex flex-col h-full">
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {interview.title}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-4">
          {interview.description}
        </p>
      </div>
      <div className="flex gap-2 mt-4">
        <SaveAnswersButton />
        <SubmitInterviewButton />
      </div>
    </div>
  );
}

function SubmitInterviewButton() {
  const {
    submitInterview,
    loading: { submittingInterview },
  } = useInterview();
  const navigate = useNavigate();

  return (
    <button
      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
      onClick={() => {
        submitInterview();
        navigate("/");
      }}
      disabled={submittingInterview}
    >
      {submittingInterview ? <LoadingSpinner size="sm" /> : " Submit Interview"}
    </button>
  );
}

function SaveAnswersButton() {
  const {
    submitAnswers,
    loading: { submittingAnswers },
  } = useInterview();
  const navigate = useNavigate();

  return (
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
      onClick={() => {
        submitAnswers();
        navigate("/");
      }}
      disabled={submittingAnswers}
    >
      {submittingAnswers ? (
        <>
          <LoadingSpinner size="sm" />
          Saving...
        </>
      ) : (
        "Save Answers"
      )}
    </button>
  );
}
