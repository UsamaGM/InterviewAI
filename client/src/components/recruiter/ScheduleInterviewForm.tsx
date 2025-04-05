import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  InputBox,
  Dropdown,
  DatetimeSelector,
  LoadingSpinner,
  ErrorAlert,
} from "../common";
import { useInterview } from "../../context/InterviewContext";
import { Interview, JobRole } from "../../utils/types";
import { handleError } from "../../utils/errorHandler";
import { AxiosResponse } from "axios";
import api from "../../services/api";

function ScheduleInterviewForm() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [jobRole, setJobRole] = useState<JobRole | "">("");
  const [candidateEmail, setCandidateEmail] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [interview, setInterview] = useState<Interview | null>(null);
  const [fetchingInterview, setFetchingInterview] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { id } = useParams();

  const navigate = useNavigate();
  const {
    createInterview,
    inviteCandidate,
    loading: { creatingInterview, schedulingInterview },
    error: {
      creatingInterview: createError,
      schedulingInterview: scheduleError,
    },
  } = useInterview();

  useEffect(() => {
    async function fetchInterview() {
      if (id) {
        setFetchingInterview(true);
        try {
          const interviewResponse: AxiosResponse<Interview> = await api.get(
            `/interviews/${id}`
          );
          setInterview(interviewResponse.data);
        } catch (error) {
          setFetchError(
            handleError(error, "Failed to fetch interview details!")
          );
        } finally {
          setFetchingInterview(false);
        }
      }
    }

    fetchInterview();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (id) {
      await inviteCandidate(id, {
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

    navigate("/recruiter/dashboard");
  }

  return (
    <>
      {id && fetchingInterview ? (
        <LoadingSpinner size="md" />
      ) : (
        <>
          {interview && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{interview.title}</h3>
              <p className="text-gray-600 mt-2">{interview.description}</p>
            </div>
          )}
          {fetchError && <div className="text-red-600 mb-4">{fetchError}</div>}
        </>
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Schedule Interview
        </h2>

        {createError && (
          <ErrorAlert title="Creatiog Error!" subtitle={createError} />
        )}
        {scheduleError && (
          <ErrorAlert title="Schedule Error!" subtitle={scheduleError} />
        )}

        {!id && (
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
            {creatingInterview || schedulingInterview ? (
              <LoadingSpinner size="sm" />
            ) : (
              "Schedule Interview"
            )}
          </button>
        </div>
      </form>
    </>
  );
}

export default ScheduleInterviewForm;
