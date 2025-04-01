import React, { useState, useEffect } from "react";
import { Interview } from "../../utils/types";
import { handleError } from "../../utils/errorHandler";
import api from "../../services/api";
import InterviewCard from "../Interview/InterviewList/InterviewCard";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const CandidateInterviewList: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidateInterviews = async () => {
      try {
        setLoading(true);
        const response = await api.get("/interviews/candidate");
        setInterviews(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError(handleError(error, "Failed to fetch your interviews"));
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateInterviews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

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
    <div className="container mx-auto flex-grow max-w-3xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Interviews</h2>
      
      {interviews.length > 0 ? (
        <ul className="space-y-4">
          {interviews.map((interview) => (
            <InterviewCard key={interview._id} interview={interview} />
          ))}
        </ul>
      ) : (
        <div className="text-center mt-8 p-4 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">You don't have any interviews scheduled yet.</p>
        </div>
      )}
    </div>
  );
};

const CandidateDashboard: React.FC = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col min-h-[calc(100vh-125px)] p-6">
        <CandidateInterviewList />
      </div>
      <Footer />
    </>
  );
};

export default CandidateDashboard; 