import React, { useState, useEffect } from "react";
import { Interview } from "../../utils/types";
import { handleError } from "../../utils/errorHandler";
import api from "../../services/api";
import InterviewCard from "../Cards/InterviewCard";
import AddInterviewButton from "../Buttons/AddInterviewButton";

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto flex-grow max-w-3xl">
        {error ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        ) : (
          <>
            {interviews.length > 0 ? (
              <ul className="space-y-4">
                {interviews.map((interview) => (
                  <InterviewCard key={interview._id} interview={interview} />
                ))}
              </ul>
            ) : (
              <div className="text-center mt-8 p-4 bg-white rounded-lg shadow-md">
                <p className="text-gray-600">
                  No interviews yet! Let's create some.
                </p>
              </div>
            )}
          </>
        )}
        <div className="mt-8 flex justify-center">
          <AddInterviewButton />
        </div>
      </div>
    </div>
  );
};

export default InterviewList;
