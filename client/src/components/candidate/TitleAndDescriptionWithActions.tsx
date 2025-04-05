import { useNavigate } from "react-router-dom";
import { useInterview } from "../../context/InterviewContext";
import { LoadingSpinner } from "../common";

export default function TitleAndDescriptionWithActions() {
  const { selectedInterview } = useInterview();
  return (
    <div className="w-1/4 overflow-y-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {selectedInterview?.title}
      </h2>
      <p className="text-gray-600 text-justify">
        {selectedInterview?.description}
      </p>

      <div className="flex flex-col gap-4 mt-6">
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
