import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../common";
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
import { useInterview } from "../../context/InterviewContext";
import { useAuth } from "../../context/AuthContext";

function InterviewDetails() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<"delete" | "cancel" | null>(null);

  const {
    selectedInterview,
    loading: { startingInterview, deletingInterview },
    error: { startingInterview: startError, deletingInterview: deleteError },
    startInterview,
    deleteInterview,
  } = useInterview();
  const { isCandidate } = useAuth();

  const statusConfig = useMemo(
    () => ({
      draft: {
        status: "Draft",
        color: "bg-gray-100 text-gray-800",
        action: "Start Interview",
        icon: PlayIcon,
      },
      "in-progress": {
        status: "In Progress",
        color: "bg-blue-100 text-blue-800",
        action: "Continue Interview",
        icon: PlayIcon,
      },
      completed: {
        status: "Completed",
        color: "bg-green-100 text-green-800",
        action: "Review Interview",
        icon: StarIcon,
      },
      scheduled: {
        status: "Scheduled",
        color: "bg-purple-100 text-purple-800",
        action: "Join Interview",
        icon: ClockIcon,
      },
      cancelled: {
        status: "Cancelled",
        color: "bg-red-100 text-red-800",
        action: "",
        icon: XMarkIcon,
      },
    }),
    []
  );

  const handleStartInterview = async () => {
    if (!selectedInterview) return;

    if (selectedInterview.status === "in-progress") {
      navigate("/shared/interviews/take");
      return;
    }

    await startInterview();
    navigate("/shared/interviews/take");
  };

  async function handleDelete() {
    if (!selectedInterview) return;

    await deleteInterview();
    navigate("/interviews");
  }

  if (!selectedInterview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Interview not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="place-self-center bg-white py-8 px-4 rounded-lg shadow-md w-full max-w-4xl mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedInterview.title}
              </h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  statusConfig[selectedInterview.status].color
                }`}
              >
                {statusConfig[selectedInterview.status].status}
              </span>
            </div>
            <p className="mt-4 text-gray-600">
              {selectedInterview.description}
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Details */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem
                  icon={BriefcaseIcon}
                  label="Job Role"
                  value={selectedInterview.jobRole ?? "Not specified"}
                />
                <DetailItem
                  icon={UserIcon}
                  label={isCandidate ? "Recruiter" : "Candidate"}
                  value={
                    isCandidate
                      ? selectedInterview.recruiter!.name
                      : selectedInterview.candidate!.name ??
                        selectedInterview.candidate!.email
                  }
                />
                <DetailItem
                  icon={ClockIcon}
                  label="Status"
                  value={
                    statusConfig[selectedInterview.status].status ?? "Unknown"
                  }
                />
                {selectedInterview.status === "completed" && (
                  <>
                    <DetailItem
                      icon={StarIcon}
                      label="Score"
                      value={selectedInterview.score?.toString() ?? "N/A"}
                    />
                    <DetailItem
                      icon={ChatBubbleLeftIcon}
                      label="Feedback"
                      value={selectedInterview.feedback ?? "No feedback"}
                      fullWidth
                    />
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex flex-wrap gap-4">
              {startError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg max-w-md w-full">
                  <div className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5" />
                    <span>{startError}</span>
                  </div>
                </div>
              )}

              {isCandidate && statusConfig[selectedInterview.status].action && (
                <button
                  onClick={handleStartInterview}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {React.createElement(
                    statusConfig[selectedInterview.status].icon,
                    {
                      className: "h-5 w-5 mr-2",
                    }
                  )}
                  {startingInterview ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    statusConfig[selectedInterview.status].action
                  )}
                </button>
              )}
              {!isCandidate && (
                <>
                  {" "}
                  <button
                    onClick={() => navigate("/interviews/edit")}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PencilIcon className="h-5 w-5 mr-2" />
                    Edit
                  </button>
                  {selectedInterview.status !== "cancelled" && (
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
                </>
              )}
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900">
                {showModal === "delete"
                  ? "Delete Interview"
                  : "Cancel Interview"}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to{" "}
                {showModal === "delete" ? "delete" : "cancel"} this interview?
                This action cannot be undone.
              </p>
              {deleteError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg max-w-md w-full">
                  <div className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5" />
                    <span>{deleteError}</span>
                  </div>
                </div>
              )}
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await handleDelete();
                    setShowModal(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {deletingInterview ? (
                    <LoadingSpinner size="sm" />
                  ) : showModal === "delete" ? (
                    "Delete"
                  ) : (
                    "Cancel Interview"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface DetailItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  fullWidth?: boolean;
}

function DetailItem({ icon: Icon, label, value, fullWidth }: DetailItemProps) {
  return (
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
}

export default InterviewDetails;
