import React from "react";
import TakeInterview from "../components/TakeInterview";

const TakeInterviewPage: React.FC = () => {
  return (
    <div className="flex justify-center items-start min-h-screen p-8">
      <div className="w-full max-w-6xl">
        <h3 className="text-4xl font-semibold text-center mb-8">
          Take Interview
        </h3>
        <TakeInterview />
      </div>
    </div>
  );
};

export default TakeInterviewPage;
