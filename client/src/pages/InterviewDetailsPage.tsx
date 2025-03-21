import React from "react";
import InterviewDetails from "../components/Interview/InterviewDetails";

const InterviewDetailsPage: React.FC = () => {
  return (
    <div className="flex justify-center items-start min-h-screen p-8">
      <div className="w-full max-w-6xl">
        <h3 className="text-4xl font-semibold text-center mb-8">
          Interview Details
        </h3>
        <InterviewDetails />
      </div>
    </div>
  );
};

export default InterviewDetailsPage;
