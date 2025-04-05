import React, { createContext, useState, useContext, ReactNode } from "react";

interface TransitionContextType {
  selectedInterviewId: string | null;
  setSelectedInterviewId: (id: string | null) => void;
  clickPosition: { x: number; y: number } | null;
  setClickPosition: (position: { x: number; y: number } | null) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  selectedInterviewId: null,
  setSelectedInterviewId: () => {},
  clickPosition: null,
  setClickPosition: () => {},
});

export const useTransition = () => useContext(TransitionContext);

export const TransitionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(
    null
  );
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  return (
    <TransitionContext.Provider
      value={{
        selectedInterviewId,
        setSelectedInterviewId,
        clickPosition,
        setClickPosition,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
};
