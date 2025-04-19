import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  InputBox,
  Dropdown,
  DatetimeSelector,
  LoadingSpinner,
  ErrorAlert,
  TextArea,
} from "../common";
import { JobRole } from "../../utils/types";
import useInterview from "../../hooks/useInterview";

interface FormDataType {
  title: string;
  description: string;
  jobRole: JobRole | null;
  scheduleNow: boolean;
  candidateEmail?: string;
  scheduledTime?: string;
}

function ScheduleInterviewForm() {
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    scheduleNow: true,
    jobRole: null,
    candidateEmail: undefined,
    scheduledTime: undefined,
  });
  const { id } = useParams();

  const navigate = useNavigate();
  const {
    selectedInterview,
    createInterview,
    inviteCandidate,
    fetchInterviewWithId,
    loading: {
      fetchingInterviewWithId,
      creatingInterview,
      schedulingInterview,
    },
    error: {
      fetchingInterviewWithId: fetchError,
      creatingInterview: createError,
      schedulingInterview: scheduleError,
    },
  } = useInterview();

  useEffect(() => {
    async function fetchInterview() {
      if (id) await fetchInterviewWithId(id);
    }

    fetchInterview();
  }, [id]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (id) {
      await inviteCandidate(id, {
        email: formData.candidateEmail!,
        scheduledTime: new Date(formData.scheduledTime!).toISOString(),
      });
    } else {
      const newInterview = await createInterview({
        title: formData.title,
        description: formData.description,
        jobRole: formData.jobRole as JobRole,
        scheduledTime: formData.scheduledTime,
      });
      if (formData.scheduleNow) {
        if (newInterview?._id && formData.candidateEmail) {
          await inviteCandidate(newInterview._id, {
            email: formData.candidateEmail,
            scheduledTime: new Date(formData.scheduledTime!).toISOString(),
          });
        }
      }
    }

    if (createError || scheduleError) return;

    navigate("/recruiter/dashboard");
  }

  return (
    <div className="place-self-center w-full max-w-2xl">
      {id && fetchingInterviewWithId ? (
        <LoadingSpinner size="md" />
      ) : (
        <>
          {id && selectedInterview && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                {selectedInterview.title}
              </h3>
              <p className="text-gray-600 mt-2">
                {selectedInterview.description}
              </p>
            </div>
          )}
          {fetchError && <div className="text-red-600 mb-4">{fetchError}</div>}
        </>
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white/80 backdrop-blur-lg p-6 rounded-lg shadow-md h-fit transition-all duration-300 ease-in-out"
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
            <InputBox
              id="title"
              placeholder="Interview Title"
              value={formData.title}
              onChange={handleChange}
            />
            <TextArea
              id="description"
              placeholder="Job Description"
              value={formData.description}
              onChange={handleChange}
            />

            <Dropdown
              id="jobRole"
              placeholder="Select Job Role"
              value={formData.jobRole || ""}
              onChange={(value) => setFormData({ ...formData, jobRole: value })}
            />
          </>
        )}

        {formData.scheduleNow && (
          <>
            <InputBox
              id="candidateEmail"
              placeholder="Candidate Email"
              value={formData.candidateEmail!}
              onChange={handleChange}
              type="email"
            />

            <DatetimeSelector
              id="scheduledTime"
              placeholder="Interview Date & Time"
              value={formData.scheduledTime?.slice(0, 16) || ""}
              onChange={(value) =>
                setFormData({ ...formData, scheduledTime: value })
              }
            />
          </>
        )}

        <button
          type="button"
          onClick={() =>
            setFormData({ ...formData, scheduleNow: !formData.scheduleNow })
          }
          className="transition-colors duration-300 ease-in-out text-blue-500 hover:bg-blue-100 hover:text-blue-700 p-2 rounded-md cursor-pointer"
        >
          {formData.scheduleNow ? "Schedule Later?" : "Schedule Now?"}
        </button>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={schedulingInterview}
            className="bg-blue-600 w-full hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow-md shadow-black/35 focus:outline-none focus:shadow-outline"
          >
            {creatingInterview || schedulingInterview ? (
              <LoadingSpinner size="sm" />
            ) : (
              "Schedule Interview"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ScheduleInterviewForm;
