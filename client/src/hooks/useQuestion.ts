import { QuestionContext } from "@/context/QuestionContext";
import { useContext } from "react";
import { Question } from "@/utils/types";

interface QuestionContextType {
  currentQuestion: Question | null;
  questions: Question[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  setQuestions: (questions: Question[]) => void;
  hasAssessment: boolean;
}

export default function useQuestion(): QuestionContextType {
  const context = useContext(QuestionContext);
  if (context === undefined) {
    throw new Error("useQuestion must be used within a QuestionProvider");
  }
  return context;
}
