import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../../context/InterviewContext";
import InputBox from "../common/InputBox";
import { DatetimeSelector } from "../common";
import Dropdown from "../common/Dropdown";
import { JobRole } from "../../utils/types";
import { LoadingSpinner } from "../common";

interface ScheduleInterviewFormProps {
  interviewId?: string;
  onSuccess?: () => void;
}

function ScheduleInterviewForm({
  interviewId,
  onSuccess,
}: ScheduleInterviewFormProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [jobRole, setJobRole] = useState<JobRole | "">("");
  const [candidateEmail, setCandidateEmail] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("");

  const navigate = useNavigate();
  const {
    createInterview,
    inviteCandidate,
    loading: { schedulingInterview },
  } = useInterview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (interviewId) {
        await inviteCandidate(interviewId, {
          email: candidateEmail,
          scheduledTime: new Date(scheduledTime).toISOString(),
        });
      } else {
        const newInterview = await createInterview({
          title,
          description,
          jobRole: jobRole as JobRole,
          sheduledTime: scheduledTime,
        });

        if (newInterview?._id) {
          await inviteCandidate(newInterview._id, {
            email: candidateEmail,
            scheduledTime: new Date(scheduledTime).toISOString(),
          });
        }
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/recruiter/dashboard");
      }
    } catch (error) {
      console.error("Failed to schedule interview:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Schedule Interview
      </h2>

      {!interviewId && (
        <>
          <div>
            <InputBox
              id="title"
              placeholder="Interview Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Job Description
            </label>
            <textarea
              id="description"
              placeholder="Job Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div>
            <Dropdown
              id="jobRole"
              placeholder="Select Job Role"
              value={jobRole}
              onChange={(value) => setJobRole(value)}
            />
          </div>
        </>
      )}

      <div>
        <InputBox
          id="candidateEmail"
          placeholder="Candidate Email"
          value={candidateEmail}
          onChange={(e) => setCandidateEmail(e.target.value)}
          type="email"
        />
      </div>

      <div>
        <DatetimeSelector
          id="scheduledTime"
          placeholder="Interview Date & Time"
          value={scheduledTime}
          onChange={(value) => setScheduledTime(value || "")}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={schedulingInterview}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
        >
          {schedulingInterview ? (
            <LoadingSpinner size="sm" />
          ) : (
            "Schedule Interview"
          )}
        </button>
      </div>
    </form>
  );
}

export default ScheduleInterviewForm;
