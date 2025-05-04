import { useNavigate } from "react-router-dom";
import { LoadingSpinner, StyledButton } from "../common";
import { useInterview, useQuestion } from "@/hooks";

function ActionButtons() {
  const { submitAnswers, submitInterview, assessAnswer, loading, error } =
    useInterview();
  const { currentQuestion, currentIndex } = useQuestion();

  const navigate = useNavigate();

  async function handleSaveAnswers() {
    await submitAnswers();
    if (error.submittingAnswers) return;
    navigate("/candidate/dashboard");
  }

  async function handleSumbitInterview() {
    await submitInterview();
    if (error.submittingInterview) {
      navigate("/candidate/dashboard");
    }
  }

  const assessmentButtonDisabled =
    loading.assessingAnswer ||
    currentQuestion?.answerText === undefined ||
    currentQuestion.answerText === "" ||
    currentQuestion?.aiAssessment?.score !== undefined;

  return (
    <div className="flex space-x-6">
      <div className="flex flex-2/5">
        <StyledButton
          disabled={loading.submittingAnswers}
          onClick={handleSaveAnswers}
        >
          {loading.submittingAnswers ? (
            <LoadingSpinner size="sm" />
          ) : (
            "Save Answers"
          )}
        </StyledButton>
        <StyledButton
          disabled={loading.submittingInterview}
          onClick={handleSumbitInterview}
        >
          {loading.submittingInterview ? (
            <LoadingSpinner size="sm" />
          ) : (
            "Submit Interview"
          )}
        </StyledButton>
      </div>
      <div className="flex-3/5">
        <StyledButton
          onClick={() =>
            assessAnswer(currentIndex, currentQuestion?.answerText as string)
          }
          disabled={assessmentButtonDisabled}
        >
          {loading.assessingAnswer ? (
            <LoadingSpinner size="sm" />
          ) : (
            "Assess the answer"
          )}
        </StyledButton>
      </div>
    </div>
  );
}

export default ActionButtons;
