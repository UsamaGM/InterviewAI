import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  InputBox,
  TextArea,
  DatetimeSelector,
  Dropdown,
  ErrorAlert,
  LoadingSpinner,
} from "@/components/common";
import { useInterview } from "@/hooks";
import { Interview, JobRole } from "@/utils/types";

function EditInterviewPage() {
  const {
    selectedInterview,
    updateInterview,
    loading: { updatingInterview },
    error: { updatingInterview: updateError },
  } = useInterview();
  const [interview, setInterview] = useState<Interview | null>(
    selectedInterview
  );
  const navigate = useNavigate();

  const handleInputChange = (name: keyof Interview, value: string) => {
    if (interview === null) return;

    setInterview({ ...interview, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateInterview(interview!);
    navigate("/interviews");
  };

  const handleCancel = () => {
    navigate("/interviews");
  };

  if (!selectedInterview || !interview) {
    return (
      <ErrorAlert
        title="Invalid Interview"
        subtitle="Make sure you have selected appropriate Interview from the list"
      />
    );
  }

  if (updatingInterview) return <LoadingSpinner size="lg" />;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Edit Interview
      </h1>
      {updateError && (
        <div className="text-red-500 mb-4">
          {<ErrorAlert title="" subtitle={updateError} />}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputBox
          id="title"
          type="text"
          placeholder="Title"
          value={interview.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
        />
        <TextArea
          id="description"
          placeholder="Description"
          value={interview.description!}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
        <DatetimeSelector
          id="scheduledTime"
          placeholder="Date & Time"
          value={
            interview.scheduledTime ? interview.scheduledTime.slice(0, 16) : ""
          }
          onChange={(value) => handleInputChange("scheduledTime", value)}
        />
        <Dropdown
          id="jobRole"
          placeholder="Job Role"
          value={interview.jobRole!}
          onChange={(value) => handleInputChange("jobRole", value)}
          options={Object.values(JobRole).map((role) => ({
            label: role,
            value: role,
          }))}
        />
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={updatingInterview}
            className="flex-2/3 px-4 py-2 bg-blue-500 text-blue-50 rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50"
          >
            {updatingInterview ? <LoadingSpinner size="sm" /> : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={updatingInterview}
            className="flex-1/3 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditInterviewPage;
