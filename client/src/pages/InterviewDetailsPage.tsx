import React from "react";
import InterviewDetails from "../components/Interview/InterviewDetails/InterviewDetails";

const InterviewDetailsPage: React.FC = () => {
  return (
    <div className="flex justify-center items-start min-w-screen min-h-[calc(100vh-100px)] bg-gray-100 p-8">
      <InterviewDetails />
    </div>
  );
};

export default InterviewDetailsPage;
