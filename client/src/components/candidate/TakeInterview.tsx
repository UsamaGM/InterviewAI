import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  TitleAndDescriptionWithActions,
  QuestionWithAnswerTextBoxAndAssessmentButton,
  AiAssessmentResults,
} from "@/components/candidate";
import { ErrorAlert, LoadingSpinner } from "@/components/common";
import { useInterview } from "@/hooks";

function TakeInterview() {
  const { id } = useParams<{ id: string }>();
  const [index, setIndex] = useState<number>(0);

  const {
    selectedInterview,
    fetchInterviewWithId,
    loading: { fetchingInterviewWithId },
    error: { fetchingInterviewWithId: fetchError },
  } = useInterview();

  useEffect(() => {
    async function fetchInterview() {
      if (id) await fetchInterviewWithId(id);
    }

    fetchInterview();
  }, []);

  if (fetchingInterviewWithId) {
    return <LoadingSpinner size="lg" />;
  }

  if (!selectedInterview) {
    return (
      <ErrorAlert
        title="No interview for the URL!"
        subtitle="Please check if you have entered the correct URL."
      />
    );
  }

  return (
    <div className="flex space-x-6">
      {fetchError && (
        <ErrorAlert
          title="Could not fetch interview!"
          subtitle="Please check if you have entered a valid interview id."
        />
      )}
      <TitleAndDescriptionWithActions interview={selectedInterview} />
      <QuestionWithAnswerTextBoxAndAssessmentButton
        currentQuestionIndex={index}
        setIndex={setIndex}
        questions={selectedInterview.questions}
      />
      <AiAssessmentResults
        questions={selectedInterview.questions}
        index={index}
      />
    </div>
  );
}

export default TakeInterview;
