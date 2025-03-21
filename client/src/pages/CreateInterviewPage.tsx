import React from "react";
import CreateInterview from "../components/Interview/CreateInterview";

const CreateInterviewPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-3xl font-semibold text-center mb-6">
            Create New Interview
          </h3>
          <CreateInterview />
        </div>
      </div>
    </div>
  );
};

export default CreateInterviewPage;
