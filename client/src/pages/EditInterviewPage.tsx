import React, { useState, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { handleError } from "../utils/errorHandler";
import { Interview } from "../utils/types";
import InputBox from "../components/InputBox/InputBox";
import TextareaBox from "../components/TextArea/TextArea";
import DatetimeSelector from "../components/DateTimeSelector/DateTimeSelector";
import RotatingButton from "../components/Buttons/RotatingButton";
import Dropdown from "../components/Dropdowns/Dropdown";
import api from "../services/api";

interface EditInterviewPageProps {
  interview: Interview;
}

function EditInterviewPage({
  interview: receivedInterview,
}: EditInterviewPageProps) {
  const { id } = useParams<{ id: string }>();
  const [interview, setInterview] = useState<Interview>(receivedInterview);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // const statusOptions = [
  //   { value: "scheduled", label: "Scheduled" },
  //   { value: "draft", label: "Draft" },
  //   { value: "in-progress", label: "In Progress" },
  //   { value: "completed", label: "Completed" },
  //   { value: "cancelled", label: "Cancelled" },
  // ];

  const handleInputChange = (name: keyof Interview, value: string) => {
    setInterview({ ...interview, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.put(`/interviews/${id}`, {
        title: receivedInterview.title,
        description: receivedInterview.description,
        scheduledTime: receivedInterview.scheduledTime,
        status: receivedInterview.status,
      });
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
          value={receivedInterview.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          required
        />
        <TextareaBox
          placeholder="Description"
          value={receivedInterview.description!}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            handleInputChange("description", e.target.value)
          }
        />
        <DatetimeSelector
          id="datetime"
          placeholder="Date & Time"
          value={receivedInterview.scheduledTime!.toDateString()}
          onChange={(value) => handleInputChange("scheduledTime", value || "")}
        />
        <Dropdown
          id="status"
          placeholder="Status"
          value={receivedInterview.status}
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
