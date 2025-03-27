import React from "react";
import InterviewDetails from "../components/Interview/InterviewDetails/InterviewDetails";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const InterviewDetailsPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col justify-start items-start w-screen min-h-[calc(100vh-125px)] p-6">
        <InterviewDetails />
      </div>
      <Footer />
    </>
  );
};

export default InterviewDetailsPage;
