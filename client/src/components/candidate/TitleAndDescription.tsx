import { ErrorAlert } from "@/components/common";
import { useInterview } from "@/hooks";

export default function TitleAndDescriptionWithActions() {
  const { selectedInterview: interview } = useInterview();
  const {
    error: {
      submittingAnswers: submitAnswerError,
      submittingInterview: submitInterviewError,
    },
  } = useInterview();

  if (!interview) return null;

  return (
    <div className="flex flex-col flex-2/5 h-full space-y-6">
      {(submitAnswerError || submitInterviewError) && (
        <ErrorAlert
          title="Error!"
          subtitle={submitAnswerError || submitInterviewError}
        />
      )}
      <h2 className="text-2xl font-bold text-gray-700 mb-2 line-clamp-2 tracking-tight">
        {interview.title}
      </h2>
      <div className="text-gray-600 prose prose-sm max-w-none max-h-26 overscroll-y-auto text-justify">
        {interview.description?.split("\n").map((line, index) => (
          <p key={index} className="mb-1">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
