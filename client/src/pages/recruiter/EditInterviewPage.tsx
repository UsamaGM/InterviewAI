import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { handleError } from "../utils/errorHandler";
import { Interview } from "../utils/types";
import {
  InputBox,
  TextArea,
  DatetimeSelector,
  RotatingButton,
  Dropdown,
} from "../components/common/index";
import { useInterview } from "../context/InterviewContext";

function EditInterviewPage() {
  const { selectedInterview, updateInterview } = useInterview();
  const [interview, setInterview] = useState<Interview>(selectedInterview!);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (name: keyof Interview, value: string) => {
    setInterview({ ...interview, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await updateInterview(interview);
      navigate("/interviews");
    } catch (err) {
      setError(handleError(err, "Error updating interview"));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/interviews");
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
      <div className="max-w-2xl mx-auto p-6">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <RotatingButton
          disabled={!error}
          enabledTitle="OK"
          disabledTitle=""
          onClick={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Edit Interview
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputBox
          id="title"
          type="text"
          placeholder="Title"
          value={interview.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          required
        />
        <TextArea
          placeholder="Description"
          value={interview.description!}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            handleInputChange("description", e.target.value)
          }
        />
        <DatetimeSelector
          id="datetime"
          placeholder="Date & Time"
          value={interview.scheduledTime!.toDateString()}
          onChange={(value) => handleInputChange("scheduledTime", value || "")}
        />
        <Dropdown
          id="status"
          placeholder="Status"
          value={interview.status}
          onChange={(value) => handleInputChange("status", value)}
        />
        <div className="flex gap-4">
          <RotatingButton
            disabled={loading}
            enabledTitle="Save Changes"
            disabledTitle="Saving..."
            type="submit"
          />
          <RotatingButton
            disabled={loading}
            enabledTitle="Cancel"
            disabledTitle="Cancel"
            type="button"
            onClick={handleCancel}
          />
        </div>
      </form>
    </div>
  );
}

export default EditInterviewPage;
