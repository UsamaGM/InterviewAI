import { useNavigate } from "react-router-dom";
import { ErrorAlert, LoadingSpinner } from "@/components/common";
import { useInterview } from "@/hooks";
import { Interview } from "@/utils/types";
import { DescriptionText } from "../interview";
import { ReactNode } from "react";

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

type propType = {
  children: ReactNode;
  disabled: boolean;
  onClick: () => void;
};

function StyledButton(props: propType) {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className="w-full bg-blue-200 hover:bg-blue-400 text-blue-500 hover:text-blue-800 font-semibold cursor-pointer m-1 py-2 px-4 rounded-md transition-all ease-in-out duration-300"
    >
      {props.children}
    </button>
  );
}
