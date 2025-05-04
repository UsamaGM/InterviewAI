import React, { useEffect, useState } from "react";
import { Question } from "@/utils/types";
import { QuestionContext } from "./QuestionContext";
import { useInterview } from "@/hooks";

export function QuestionProvider({ children }: { children: React.ReactNode }) {
  const { selectedInterview } = useInterview();
  const [questions, setQuestions] = useState<Question[]>(
    selectedInterview?.questions || []
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (selectedInterview && selectedInterview.questions)
      setQuestions(selectedInterview.questions);
  }, [selectedInterview]);

  const currentQuestion = questions[currentIndex] || null;
  const hasAssessment = currentQuestion?.aiAssessment?.score !== undefined;

  return (
    <QuestionContext.Provider
      value={{
        currentQuestion,
        questions,
        currentIndex,
        setCurrentIndex,
        setQuestions,
        hasAssessment,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
}
