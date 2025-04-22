import { useNavigate } from "react-router-dom";
import { ErrorAlert, LoadingSpinner, StyledButton } from "@/components/common";
import { useInterview } from "@/hooks";
import { Interview } from "@/utils/types";
import { DescriptionText } from "../interview";

type mainPropType = {
  interview: Interview;
};

export default function TitleAndDescriptionWithActions(props: mainPropType) {
  const {
    submitAnswers,
    submitInterview,
    loading: { submittingAnswers, submittingInterview },
    error: {
      submittingAnswers: submitAnswerError,
      submittingInterview: submitInterviewError,
    },
  } = useInterview();

  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-1/4 p-4 h-fit max-h-[calc(100vh-15rem)] bg-white/80 backdrop-blur-md rounded-md">
      <div className="overflow-y-scroll pr-2 flex flex-col">
        {submitAnswerError ||
          (submitInterviewError && (
            <ErrorAlert
              title="Error!"
              subtitle={submitAnswerError || submitInterviewError}
            />
          ))}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
            {props.interview.title}
          </h2>
          <DescriptionText description={props.interview.description!} />
        </div>
      </div>
      <StyledButton
        disabled={submittingAnswers}
        onClick={async () => {
          await submitAnswers();
          if (submitAnswerError) return;
          navigate("/candidate/dashboard");
        }}
      >
        {submittingAnswers ? <LoadingSpinner size="sm" /> : "Save Answers"}
      </StyledButton>
      <StyledButton
        disabled={submittingInterview}
        onClick={async () => {
          await submitInterview();
          if (submitInterviewError) {
            navigate("/candidate/dashboard");
          }
        }}
      >
        {submittingInterview ? (
          <LoadingSpinner size="sm" />
        ) : (
          "Submit Interview"
        )}
      </StyledButton>
    </div>
  );
}
