import React from "react";
import InterviewDetails from "../components/Interview/InterviewDetails/InterviewDetails";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const InterviewDetailsPage: React.FC = () => {
  return (
    <>
      <Header />
      <InterviewDetails />
      <Footer />
    </>
  );
};

export default InterviewDetailsPage;
