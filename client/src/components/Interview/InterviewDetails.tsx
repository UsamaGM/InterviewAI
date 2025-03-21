import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Interview } from "../../utils/types";
import { AxiosError } from "axios";

const InterviewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await api.get(`/interviews/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setInterview(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(
            "Error fetching interview. Please try again later. " + error.message
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  const handleStartInterview = async () => {
    if (!interview) return;
    try {
      await api.post(
        `/interviews/${id}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/interviews/take/" + id, { state: { interview } });
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(
          "Error starting interview. Please try again. Error: " +
            error?.response?.data.message
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
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
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!interview) {
    return <p className="text-center">Interview not found.</p>;
  }

  if (interview.status === "in-progress") {
    navigate("/interviews/take/" + id);
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h4 className="text-2xl font-semibold text-center mb-4">
            {interview.title}
          </h4>
          <p className="text-center text-gray-700 mb-4">
            {interview.description}
          </p>
          {interview.status === "draft" && (
            <div className="flex justify-center mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleStartInterview}
              >
                Start Interview
              </button>
            </div>
          )}
        </div>

        {interview.status === "completed" && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h5 className="text-lg font-semibold mb-2">Interview Results</h5>
            <p>Overall Score: {interview.score}</p>
            <p>Overall Feedback: {interview.feedback}</p>
            <ul className="list-disc list-inside mt-4">
              {interview.questions.map((question) => (
                <li key={question._id} className="mb-2">
                  {question.questionText} - {question.aiAssessment?.feedback}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewDetails;
