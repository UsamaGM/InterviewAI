import React, { useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { InterviewForm, JobRole } from "../../../utils/types";
import { AxiosError } from "axios";
import InputBox from "../../InputBox/InputBox";
import Dropdown from "../../Dropdowns/Dropdown";
import DatetimeSelector from "../../DateTimeSelector/DateTimeSelector";

const CreateInterview: React.FC = () => {
  const [interviewForm, setInterviewForm] = useState<InterviewForm>({
    title: "",
    description: "",
    jobRole: JobRole.SoftwareEngineer.toString(),
    sheduledTime: new Date().toDateString(),
  } as InterviewForm);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await api.post("/interviews", {
        title: interviewForm.title,
        description: interviewForm.description,
        jobRole: interviewForm.jobRole,
      });
      navigate("/interviews");
    } catch (error: AxiosError | unknown) {
      let errorMessage = "Error creating interview. Please try again.";
      if (error instanceof AxiosError) {
        errorMessage = `${errorMessage} Error: ${error?.response?.data.message}`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="mb-6">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        </div>
      )}
      <InputBox
        id="title"
        placeholder="Title"
        type="text"
        value={interviewForm.title}
        onChange={(e) =>
          setInterviewForm({ ...interviewForm, title: e.target.value })
        }
      />
      <InputBox
        textarea
        id="description"
        placeholder="Description"
        type="text"
        value={interviewForm.description}
        onChange={(e) =>
          setInterviewForm({ ...interviewForm, description: e.target.value })
        }
      />
      <Dropdown
        id="jobRole"
        placeholder="Job Role"
        value={String(interviewForm.jobRole)}
        onChange={(value) =>
          setInterviewForm({
            ...interviewForm,
            jobRole: value,
          })
        }
      />
      <DatetimeSelector
        id="scheduledtime"
        placeholder="Scheduled Time"
        value={interviewForm.sheduledTime}
        onChange={(value) =>
          setInterviewForm({ ...interviewForm, sheduledTime: value! })
        }
      />
      <div className="flex justify-center mt-6">
        <button
          disabled={isLoading}
          type="submit"
          className="inline-block rounded-sm bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:-rotate-2 focus:ring-3 focus:outline-hidden"
        >
          {isLoading ? "Creating " : "Create "} Interview
        </button>
      </div>
    </form>
  );
};

export default CreateInterview;
