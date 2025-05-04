import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  TitleAndDescriptionWithActions,
  QuestionWithAnswerAndAssessment,
  AiAssessmentResults,
  ActionButtons,
} from "@/components/candidate";
import { ErrorAlert, LoadingSpinner } from "@/components/common";
import { useInterview } from "@/hooks";
import { QuestionProvider } from "@/context";

function TakeInterviewPage() {
  const { id } = useParams<{ id: string }>();

  const { selectedInterview, fetchInterviewWithId, loading, error } =
    useInterview();

  useEffect(() => {
    async function fetchInterview() {
      if (id) await fetchInterviewWithId(id);
    }

    fetchInterview();
  }, [id, fetchInterviewWithId]);

  if (loading.fetchingInterviewWithId) {
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
    <QuestionProvider>
      <div className="flex flex-col space-y-6 p-8 bg-white shadow-lg rounded-lg">
        {error.fetchingInterviewWithId && (
          <ErrorAlert
            title="Could not fetch interview!"
            subtitle="Please check if you have entered a valid interview id."
          />
        )}
        <div className="flex space-x-8">
          <TitleAndDescriptionWithActions />
          <QuestionWithAnswerAndAssessment />
        </div>
        <ActionButtons />
        <AiAssessmentResults />
      </div>
    </QuestionProvider>
  );
}

export default TakeInterviewPage;
