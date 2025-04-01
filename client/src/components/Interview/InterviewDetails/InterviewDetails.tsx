import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Interview } from "../../../utils/types";
import { handleError } from "../../../utils/errorHandler";
import api from "../../../services/api";
import {
  ClockIcon,
  UserIcon,
  BriefcaseIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PlayIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const InterviewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<"delete" | "cancel" | null>(null);

  const statusConfig = {
    draft: {
      color: "bg-gray-100 text-gray-800",
      action: "Start Interview",
      icon: PlayIcon
    },
    "in-progress": {
      color: "bg-blue-100 text-blue-800",
      action: "Continue Interview",
      icon: PlayIcon
    },
    completed: {
      color: "bg-green-100 text-green-800",
      action: "Review Interview",
      icon: StarIcon
    },
    scheduled: {
      color: "bg-purple-100 text-purple-800",
      action: "Join Interview",
      icon: ClockIcon
    },
    cancelled: {
      color: "bg-red-100 text-red-800",
      action: "",
      icon: XMarkIcon
    }
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
      return;
    }

    try {
      await api.post(`/interviews/${id}/start`, {});
      navigate(`/interviews/${id}/take`, { state: { interview } });
    } catch (err) {
      setError(handleError(err, "Failed to start interview"));
    }
  };

  const handleDelete = async () => {
    if (!interview) return;

    try {
      await api.delete(`/interviews/${id}`);
      navigate("/interviews");
    } catch (error) {
      setError(handleError(error, "Error deleting interview"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg max-w-md w-full">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Interview not found</p>
      </div>
    );
  }

  return (
    <div className="place-self-center bg-white py-8 px-4 rounded-lg shadow-md">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{interview.title}</h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[interview.status].color}`}>
              {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
            </span>
          </div>
          <p className="mt-4 text-gray-600">{interview.description}</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Details */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem
                icon={BriefcaseIcon}
                label="Job Role"
                value={interview.jobRole ?? 'Not specified'}
              />
              <DetailItem
                icon={UserIcon}
                label="Recruiter"
                value={interview.recruiter.name ?? 'Unknown'}
              />
              <DetailItem
                icon={ClockIcon}
                label="Status"
                value={interview.status ?? 'Unknown'}
              />
              {interview.status === "completed" && (
                <>
                  <DetailItem
                    icon={StarIcon}
                    label="Score"
                    value={interview.score?.toString() ?? 'N/A'}
                  />
                  <DetailItem
                    icon={ChatBubbleLeftIcon}
                    label="Feedback"
                    value={interview.feedback ?? 'No feedback'}
                    fullWidth
                  />
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex flex-wrap gap-4">
            {statusConfig[interview.status].action && (
              <button
                onClick={handleStartInterview}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {React.createElement(statusConfig[interview.status].icon, { className: "h-5 w-5 mr-2" })}
                {statusConfig[interview.status].action}
              </button>
            )}
            <button
              onClick={() => navigate(`/interviews/${id}/edit`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit
            </button>
            {interview.status !== "cancelled" && (
              <button
                onClick={() => setShowModal("cancel")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </button>
            )}
            <button
              onClick={() => setShowModal("delete")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900">
              {showModal === "delete" ? "Delete Interview" : "Cancel Interview"}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to {showModal === "delete" ? "delete" : "cancel"} this interview?
              This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowModal(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {showModal === "delete" ? "Delete" : "Cancel Interview"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface DetailItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  fullWidth?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon: Icon, label, value, fullWidth }) => (
  <div className={fullWidth ? "col-span-full" : ""}>
    <div className="flex items-start">
      <Icon className="h-5 w-5 text-gray-400 mt-1" />
      <div className="ml-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900">{value}</dd>
      </div>
    </div>
  </div>
);

export default InterviewDetails;