import { Question } from "@/utils/types";
import { createContext } from "react";

interface QuestionContextType {
  currentQuestion: Question | null;
  questions: Question[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  setQuestions: (questions: Question[]) => void;
  hasAssessment: boolean;
}

export const QuestionContext = createContext<QuestionContextType | undefined>(
  undefined
);
