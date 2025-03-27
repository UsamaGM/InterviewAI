import React from "react";
import CreateInterview from "../components/Interview/CreateInterview/CreateInterview";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const CreateInterviewPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="flex justify-center min-h-[calc(100vh-125px)] items-center p-6">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
              Create New Interview
            </h2>
            <CreateInterview />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateInterviewPage;
