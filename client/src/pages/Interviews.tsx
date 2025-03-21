import React from "react";
import InterviewList from "../components/InterviewList";

const Interviews: React.FC = () => {
  return (
    <div className="mt-8 flex flex-col flex-grow p-4">
      <InterviewList />
    </div>
  );
};

export default Interviews;
