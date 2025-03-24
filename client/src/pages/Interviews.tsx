import React from "react";
import InterviewList from "../components/Interview/InterviewList/InterviewList";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const Interviews: React.FC = () => {
  return (
    <>
      <Header />
      <InterviewList />
      <Footer />
    </>
  );
};

export default Interviews;
