import React from "react";
import TakeInterview from "../components/Interview/TakeInterview/TakeInterview";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const TakeInterviewPage: React.FC = () => {
  return (
    <>
      <Header />
      <TakeInterview />
      <Footer />
    </>
  );
};

export default TakeInterviewPage;
