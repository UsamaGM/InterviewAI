import { useInterview } from "../../context/InterviewContext";
import TitleAndDescriptionWithActions from "./TitleAndDescriptionWithActions";
import QuestionWithAnswerTextBoxAndAssessmentButton from "./QuestionWithAnswerTextboxAndAssessmentButton";
import AiAssessmentResults from "./AiAssessmentResults";
import { useState } from "react";

function TakeInterview() {
  const [index, setIndex] = useState<number>(0);
  const { selectedInterview } = useInterview();

  function handleNextQuestion() {
    if (selectedInterview && index < selectedInterview.questions.length! - 1) {
      setIndex(index + 1);
    }
  }

  function handlePreviousQuestion() {
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  if (!selectedInterview) {
    return <p className="text-center">Interview not found.</p>;
  }

  return (
    <div className="flex space-x-6">
      <TitleAndDescriptionWithActions />
      <QuestionWithAnswerTextBoxAndAssessmentButton
        currentQuestionIndex={index}
        handleNextQuestion={handleNextQuestion}
        handlePreviousQuestion={handlePreviousQuestion}
      />
      <AiAssessmentResults currentQuestionIndex={index} />
    </div>
  );
}

export default TakeInterview;
