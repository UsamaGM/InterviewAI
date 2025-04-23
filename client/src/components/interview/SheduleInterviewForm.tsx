import { useInterview } from "@/hooks";
import { JobRole } from "@/utils/types";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DatetimeSelector,
  Dropdown,
  ErrorAlert,
  InputBox,
  LoadingSpinner,
  TextArea,
  Toggle,
} from "@/components/common";

type FormDataType = {
  title: string;
  description: string;
  jobRole: JobRole | null;
  scheduleNow: boolean;
  candidateEmail?: string;
  scheduledTime?: string;
};

type propTypes = {
  id: string;
};

function ScheduleInterviewForm(props: propTypes) {
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    scheduleNow: true,
    jobRole: null,
    candidateEmail: undefined,
    scheduledTime: undefined,
  });

  const {
    inviteCandidate,
    createInterview,
    loading: { schedulingInterview, creatingInterview },
    error: {
      schedulingInterview: scheduleError,
      creatingInterview: createError,
    },
  } = useInterview();

  const navigate = useNavigate();

  const [jobRoles, toggleOptions] = useMemo(
    () => [
      Object.values(JobRole).map((role) => ({
        value: role,
        label: role.charAt(0).toUpperCase() + role.slice(1),
      })),
      [
        { label: "schedule_later", value: "Schedule Later" },
        { label: "schedule_now", value: "Schedule Now" },
      ],
    ],
    []
  );

  const handleChange = useCallback(function (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  },
  []);

  const handleSubmit = useCallback(
    async function (e: React.FormEvent) {
      e.preventDefault();

      if (props.id) {
        await inviteCandidate(props.id, {
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
    },
    [
      formData,
      createInterview,
      inviteCandidate,
      createError,
      scheduleError,
      navigate,
      props.id,
    ]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 h-fit">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
        {props.id ? "Schedule Interview" : "Create Interview"}
      </h2>

      {createError ||
        (scheduleError && (
          <ErrorAlert
            title="Creatiog Error!"
            subtitle={createError || scheduleError}
          />
        ))}

      {!props.id && (
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
            options={jobRoles}
            onChange={(value) => {
              console.log(value);
              setFormData({ ...formData, jobRole: value as JobRole });
            }}
          />
        </>
      )}

      <Toggle
        checked={formData.scheduleNow}
        options={toggleOptions}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, scheduleNow: e.target.checked }))
        }
      />

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
        type="submit"
        disabled={schedulingInterview}
        className="bg-blue-200 w-full hover:bg-blue-400 text-blue-500 hover:text-blue-800 cursor-pointer font-bold py-2 px-6 rounded-md shadow transition-colors duration-300 ease-in-out "
      >
        {creatingInterview || schedulingInterview ? (
          <LoadingSpinner size="sm" />
        ) : (
          "Schedule Interview"
        )}
      </button>
    </form>
  );
}

export default ScheduleInterviewForm;
