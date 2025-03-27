import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Interview } from "../../../utils/types";
import { handleError } from "../../../utils/errorHandler";
import api from "../../../services/api";
import SlidingIconButton from "../../Buttons/SlidingIconButton";
import AlertWithOptions from "../../Alerts/AlertWithOptions";

const InterviewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const interviewTitle = {
    draft: "Start Interview",
    "in-progress": "Go To Interview",
    completed: "Review Interview",
    scheduled: "Check Schedule",
    cancelled: "",
  };

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
    if (interview.status === "completed") {
      navigate(`/interviews/${id}/take`, { state: { interview } });
    } else {
      try {
        await api.post(`/interviews/${id}/start`, {});
        navigate(`/interviews/${id}/take`, { state: { interview } });
      } catch (err) {
        setError(handleError(err, "Failed to start interview"));
      }
    }
  };

  const handleDelete = async () => {
    if (!interview || interview.status === "cancelled") return;

    try {
      await api.delete(`/interviews/${id}`);
      navigate("/interviews");
    } catch (error) {
      setError(handleError(error, "Error Deleting Interview"));
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
    <div className="flow-root max-w-3xl self-center text-justify">
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

              <dd className="text-gray-700 sm:col-span-2">{interview.score}</dd>
            </div>
            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Feedback</dt>

              <dd className="text-gray-700 sm:col-span-2">
                {interview.feedback}
              </dd>
            </div>
          </>
        )}
      </dl>

      {/*Buttons for Starting, Editing, Deleting Interview*/}
      <div className="mt-10 flex space-x-6">
        <SlidingIconButton
          title={interviewTitle[interview.status]}
          onClick={handleStartInterview}
        />
        <SlidingIconButton
          title="Edit"
          color="gray"
          onClick={() => navigate(`/interviews/${id}/edit`)}
        />
        <SlidingIconButton
          title="Cancel"
          color="olive"
          onClick={() => setShowCancelDialog(true)}
        />
        <SlidingIconButton
          title="Delete"
          color="tomato"
          onClick={() => setShowDeleteDialog(true)}
        />
      </div>

      {showCancelDialog && (
        <AlertWithOptions
          title="Cancel Interview"
          subtitle="Are you sure you want to cancel this Interview?"
          onOkay={handleDelete}
          onCancel={() => setShowCancelDialog(false)}
          className="absolute !bg-amber-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-2 rounded-md shadow-lg p-4"
        />
      )}

      {showDeleteDialog && (
        <AlertWithOptions
          title="Delete Interview"
          subtitle="Are you sure you want to delete this Interview?"
          onOkay={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
          className="absolute !bg-red-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-2 rounded-md shadow-lg p-4"
        />
      )}
    </div>
  );
};

export default InterviewDetails;
