import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Interview } from "../../../utils/types";
import { handleError } from "../../../utils/errorHandler";
import api from "../../../services/api";
import SlidingIconButton from "../../Buttons/SlidingIconButton";

const InterviewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await api.get(`/interviews/${id}`);
        setInterview(response.data);
      } catch (err) {
        setError(handleError(err, "Error loading interview details"));
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  const handleStartInterview = async () => {
    if (!interview) return;
    try {
      await api.post(`/interviews/${id}/start`, {});
      navigate(`/interviews/${id}/take`, { state: { interview } });
    } catch (err) {
      setError(handleError(err, "Failed to start interview"));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
        <span className="block sm:inline ml-2">{error}</span>
      </div>
    );
  }

  if (!interview) {
    return <p className="text-center mt-8">Interview not found.</p>;
  }

  return (
    <div className="max-w-2xl w-full">
      <div className="flow-root">
        <dl className="-my-3 divide-y divide-gray-200 text-sm">
          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Title</dt>

            <dd className="text-gray-700 sm:col-span-2">{interview.title}</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Description</dt>

            <dd className="text-gray-700 sm:col-span-2">
              {interview.description}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Job Role</dt>

            <dd className="text-gray-700 sm:col-span-2">{interview.jobRole}</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Recruiter</dt>

            <dd className="text-gray-700 sm:col-span-2">
              {interview.recruiter.name}
            </dd>
          </div>
          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Status</dt>

            <dd className="text-gray-700 sm:col-span-2">{interview.status}</dd>
          </div>
          {interview.status === "completed" && (
            <>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Score</dt>

                <dd className="text-gray-700 sm:col-span-2">
                  {interview.score}
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Score</dt>

                <dd className="text-gray-700 sm:col-span-2">
                  {interview.score}
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Score</dt>

                <dd className="text-gray-700 sm:col-span-2">
                  {interview.score}
                </dd>
              </div>
            </>
          )}
        </dl>
      </div>
      <div className="mt-10" />
      <SlidingIconButton
        title={
          interview.status === "in-progress"
            ? "Go to Questions"
            : "Start Interview"
        }
        onClick={handleStartInterview}
      />
    </div>
  );
};

export default InterviewDetails;
