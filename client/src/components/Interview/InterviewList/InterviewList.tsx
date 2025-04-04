import React, { useState, useEffect } from "react";
import { Interview } from "../../../utils/types";
import { handleError } from "../../../utils/errorHandler";
import api from "../../../services/api";
import InterviewCard from "./InterviewCard";
import SlidingIconButton from "../../Buttons/SlidingIconButton";

const InterviewList: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get("/interviews");
        setInterviews(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError(handleError(error, "Failed to fetch interviews"));
      }
    };

    fetchInterviews();
  }, []);

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline ml-2">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto  flex-grow max-w-3xl">
      {/*Create Interview Button*/}
      <div className="fixed bottom-20 right-8 z-50">
        <SlidingIconButton
          link
          title="Create New Interview"
          to="/interviews/new"
        />
      </div>

      {/*List of Interview Cards*/}
      {interviews.length > 0 ? (
        <ul className="space-y-4">
          {interviews.map((interview) => (
            <InterviewCard key={interview._id} interview={interview} />
          ))}
        </ul>
      ) : (
        <div className="text-center mt-8 p-4 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">No interviews yet! Let's create some.</p>
        </div>
      )}
    </div>
  );
};

export default InterviewList;
