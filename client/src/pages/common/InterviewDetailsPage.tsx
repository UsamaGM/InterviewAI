import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { ErrorAlert, LoadingSpinner, StyledButton } from "@/components/common";
import { formatDate, statusConfig } from "@/utils/helpers";
import { useAuth, useInterview } from "@/hooks";

type DetailItemProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  fullWidth?: boolean;
};

type DescriptionTextProps = {
  description: string;
};

function DetailItem({ icon: Icon, label, value, fullWidth }: DetailItemProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-4 transition-all duration-200 hover:shadow-md ${
        fullWidth ? "col-span-full" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="bg-blue-50 p-2 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">{label}</dt>
          <dd className="mt-1 text-base font-semibold text-gray-900">
            {value}
          </dd>
        </div>
      </div>
    </div>
  );
}

function DescriptionText({ description }: DescriptionTextProps) {
  const [readMore, setReadMore] = useState<boolean>(false);
  const lines = description.split("\n");

  return (
    <div className="flex flex-col">
      {lines.map((line, index) => (
        <p
          key={index}
          className={`text-gray-700 ${
            index === 0
              ? readMore
                ? "line-clamp-none"
                : "line-clamp-3"
              : readMore
              ? "line-clamp-none"
              : "hidden"
          }`}
        >
          {line}
        </p>
      ))}
      {description.length > 200 && (
        <button
          className="text-blue-600 hover:text-blue-800 cursor-pointer w-fit text-sm font-medium mt-2 transition-colors duration-200"
          onClick={() => setReadMore(!readMore)}
        >
          {readMore ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

function ConfirmationModal({
  type,
  onConfirm,
  onCancel,
  isLoading,
  error,
}: {
  type: "delete" | "cancel";
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  error?: string | null;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {type === "delete" ? "Delete Interview" : "Cancel Interview"}
        </h3>
        <p className="mt-2 text-gray-600">
          Are you sure you want to {type} this interview? This action cannot be
          undone.
        </p>
        {error && <ErrorAlert title={`Failed to ${type}!`} subtitle={error} />}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 ${
              type === "delete"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-yellow-600 hover:bg-yellow-700"
            }`}
          >
            {isLoading ? <LoadingSpinner size="sm" /> : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InterviewDetailsPage() {
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
    if (id) {
      fetchInterviewWithId(id);
    }
  }, [id, fetchInterviewWithId]);

  const handleStartInterview = async () => {
    if (!selectedInterview) return;

    if (selectedInterview.status === "in-progress") {
      navigate(`/candidate/take-interview/${selectedInterview._id}`);
      return;
    }

    await startInterview();
    navigate(`/candidate/take-interview/${selectedInterview._id}`);
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!selectedInterview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorAlert
          title="Invalid Interview!"
          subtitle="No interview for this URL. Please check the URL again!"
        />
      </div>
    );
  }

  function ActionButtons() {
    if (
      isCandidate &&
      selectedInterview &&
      statusConfig[selectedInterview.status].action
    ) {
      return (
        <div className="flex gap-3">
          <StyledButton
            disabled={loading.startingInterview}
            onClick={handleStartInterview}
          >
            {loading.startingInterview ? (
              <LoadingSpinner size="sm" />
            ) : (
              statusConfig[selectedInterview.status].action
            )}
          </StyledButton>
        </div>
      );
    }

    if (!isCandidate && selectedInterview) {
      return (
        <div className="flex gap-3">
          <StyledButton
            disabled={false}
            onClick={() => navigate("/recruiter/edit-interview")}
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit
          </StyledButton>
          {selectedInterview.status !== "cancelled" && (
            <StyledButton
              disabled={false}
              onClick={() => setShowModal("cancel")}
            >
              <XMarkIcon className="h-5 w-5 mr-2" />
              Cancel
            </StyledButton>
          )}
          <StyledButton disabled={false} onClick={() => setShowModal("delete")}>
            <TrashIcon className="h-5 w-5 mr-2" />
            Delete
          </StyledButton>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
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
        <div className="bg-white rounded-lg shadow-sm p-4">
          <DescriptionText description={selectedInterview.description!} />
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
                (selectedInterview.candidate?.email || "No Candidate yet")
          }
        />
        <DetailItem
          icon={ClockIcon}
          label="Status"
          value={statusConfig[selectedInterview.status].title ?? "Unknown"}
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

      {/* Actions Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {error.startingInterview && (
            <ErrorAlert
              title="Failed to start!"
              subtitle={error.startingInterview}
            />
          )}
          <ActionButtons />
        </div>
      </div>

      {showModal && (
        <ConfirmationModal
          type={showModal}
          onConfirm={showModal === "delete" ? handleDelete : handleCancel}
          onCancel={() => setShowModal(null)}
          isLoading={loading.deletingInterview || loading.updatingInterview}
          error={
            showModal === "delete"
              ? error.deletingInterview
              : error.updatingInterview
          }
        />
      )}
    </div>
  );
}

export default InterviewDetailsPage;
