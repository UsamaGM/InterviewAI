import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorAlert, LoadingSpinner } from "../common";
import {
  ClockIcon,
  UserIcon,
  BriefcaseIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { formatDate, statusConfig } from "../../utils/helpers";
import useInterview from "../../hooks/useInterview";
import useAuth from "../../hooks/useAuth";

function InterviewDetails() {
  const { id } = useParams();
  const [showModal, setShowModal] = useState<"delete" | "cancel" | null>(null);
  const navigate = useNavigate();

  const { isCandidate } = useAuth();
  const {
    selectedInterview,
    fetchInterviewWithId,
    updateInterview,
    loading,
    error,
    startInterview,
    deleteInterview,
  } = useInterview();

  useEffect(() => {
    async function fetchInterview() {
      if (id) {
        await fetchInterviewWithId(id);
      }
    }
    fetchInterview();
  }, [id]);

  const handleStartInterview = async () => {
    if (!selectedInterview) return;

    if (selectedInterview.status === "in-progress") {
      navigate("/candidate/take-interview/" + selectedInterview._id);
      return;
    }

    await startInterview();
    navigate("/candidate/take-interview/" + selectedInterview._id);
  };

  async function handleCancel() {
    if (!selectedInterview) return;

    await updateInterview({
      ...selectedInterview,
      status: "cancelled",
    });

    navigate("/recruiter/dashboard");
  }

  async function handleDelete() {
    if (!selectedInterview) return;

    await deleteInterview();
    navigate("/recruiter/dashboard");
  }

  if (loading.fetchingInterviewWithId) {
    return <LoadingSpinner size="lg" />;
  }

  if (!selectedInterview) {
    return (
      <ErrorAlert
        title="Invalid Interview!"
        subtitle="No interview for this URL. Please check the URL again!"
      />
    );
  }

  return (
    <div>
      {loading.fetchingInterviewWithId && <LoadingSpinner size="lg" />}
      {error.fetchingInterviewWithId && (
        <ErrorAlert
          title="Failed to fetch interview!"
          subtitle={error.fetchingInterviewWithId}
        />
      )}
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
                  statusConfig[selectedInterview.status].styles
                }`}
              >
                {statusConfig[selectedInterview.status].title}
              </span>
            </div>
            <DescriptionText description={selectedInterview.description!} />
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
                      : selectedInterview.candidate?.name ??
                        (selectedInterview.candidate?.email ||
                          "No Candidate yet")
                  }
                />
                <DetailItem
                  icon={ClockIcon}
                  label="Status"
                  value={
                    statusConfig[selectedInterview.status].title ?? "Unknown"
                  }
                />
                {selectedInterview.status === "scheduled" && (
                  <DetailItem
                    icon={ClockIcon}
                    label="Scheduled Time"
                    value={formatDate(selectedInterview.scheduledTime!)}
                  />
                )}

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
              {error.startingInterview && (
                <ErrorAlert
                  title="Failed to start!"
                  subtitle={error.startingInterview}
                />
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
                  {loading.startingInterview ? (
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
                    onClick={() => navigate("/recruiter/edit-interview")}
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
        <Modal />
      </div>
    </div>
  );

  function Modal() {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-medium text-gray-900">
            {showModal === "delete" ? "Delete Interview" : "Cancel Interview"}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Are you sure you want to {showModal} this interview? This action
            cannot be undone.
          </p>
          {error.updatingInterview && (
            <ErrorAlert
              title="Failed to cancel!"
              subtitle={error.updatingInterview}
            />
          )}
          {error.deletingInterview && (
            <ErrorAlert
              title="Failed to delete!"
              subtitle={error.deletingInterview}
            />
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
                if (showModal === "delete") await handleDelete();
                else await handleCancel();
                setShowModal(null);
              }}
              className="px-4 py-2 text-sm font-medium hover:scale-105 cursor-crosshair transition-transform duration-300 text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              style={{
                backgroundColor: showModal === "delete" ? "red" : "olive",
              }}
            >
              {loading.deletingInterview || loading.updatingInterview ? (
                <LoadingSpinner size="sm" />
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function DescriptionText({ description }: { description: string }) {
  const [readMore, setReadMore] = useState<boolean>(false);
  return (
    <div className="flex flex-col">
      <p
        className={`mt-4 text-gray-700 text-justify p-2 ${
          readMore ? "" : "line-clamp-4"
        }`}
      >
        {description}
      </p>
      <span
        className="text-blue-500 hover:text-blue-800 cursor-pointer w-fit"
        onClick={() => setReadMore(!readMore)}
      >
        {readMore ? "Hide" : "Show More"}
      </span>
    </div>
  );
}

type DetailItemProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  fullWidth?: boolean;
};

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
