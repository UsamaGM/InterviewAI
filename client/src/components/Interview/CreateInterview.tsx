import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { InterviewForm, JobRole } from "../../utils/types";
import { AxiosError } from "axios";

const CreateInterview: React.FC = () => {
  const [interviewForm, setInterviewForm] = useState<InterviewForm>({
    title: "",
    description: "",
    jobRole: JobRole.SoftwareEngineer.toString(),
  } as InterviewForm);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInterviewForm({ ...interviewForm, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      await api.post(
        "/interviews",
        {
          title: interviewForm.title,
          description: interviewForm.description,
          jobRole: interviewForm.jobRole,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/interviews");
    } catch (error: AxiosError | unknown) {
      let errorMessage = "Error creating interview. Please try again.";
      if (error instanceof AxiosError) {
        errorMessage = `${errorMessage} Error: ${error?.response?.data.message}`;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-sm w-full p-6 bg-white rounded-lg shadow-md">
        {error && (
          <div className="mb-4">
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="title"
              value={interviewForm.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="description"
              value={interviewForm.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="jobRole"
            >
              Role
            </label>
            <select
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="jobRole"
              value={interviewForm.jobRole}
              onChange={(e) =>
                setInterviewForm({
                  ...interviewForm,
                  jobRole: e.target.value as keyof JobRole,
                })
              }
            >
              {Object.keys(JobRole).map((key) => (
                <option key={key} value={JobRole[key as keyof typeof JobRole]}>
                  {JobRole[key as keyof typeof JobRole]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInterview;
