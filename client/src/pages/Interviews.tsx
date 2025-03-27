import React from "react";
import InterviewList from "../components/Interview/InterviewList/InterviewList";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const Interviews: React.FC = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col min-h-[calc(100vh-125px)] p-6">
        <InterviewList />
      </div>
      <Footer />
    </>
  );
};

export default Interviews;
