import React from "react";
import CreateInterview from "../components/Interview/CreateInterview/CreateInterview";

const CreateInterviewPage: React.FC = () => {
  return (
    <div className="flex justify-center min-h-[calc(100vh-100px)] bg-gray-100 items-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
            Create New Interview
          </h2>
          <CreateInterview />
        </div>
      </div>
    </div>
  );
};

export default CreateInterviewPage;
