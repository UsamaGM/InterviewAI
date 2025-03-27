import React from "react";
import TakeInterview from "../components/Interview/TakeInterview/TakeInterview";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const TakeInterviewPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row justify-center min-h-[calc(100vh-125px)] items-center md:items-start p-6">
        <TakeInterview />
      </div>
      <Footer />
    </>
  );
};

export default TakeInterviewPage;
