import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInterview } from "@/hooks";
import { JobRole } from "@/utils/types";
import {
  DatetimeSelector,
  Dropdown,
  ErrorAlert,
  InputBox,
  LoadingSpinner,
  TextArea,
  Toggle,
} from "@/components/common";

const scheduleInterviewSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    jobRole: z.nativeEnum(JobRole, {
      required_error: "Please select a job role",
    }),
    scheduleNow: z.boolean(),
    candidateEmail: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    scheduledTime: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.scheduleNow) {
        return !!data.candidateEmail && !!data.scheduledTime;
      }
      return true;
    },
    {
      message:
        "Candidate email and scheduled time are required when scheduling now",
      path: ["scheduleNow"],
    }
  );

type ScheduleFormData = z.infer<typeof scheduleInterviewSchema>;

type Props = {
  id?: string;
};

function ScheduleInterviewForm({ id: interviewId }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleInterviewSchema),
    defaultValues: {
      scheduleNow: true,
      title: "",
      description: "",
      candidateEmail: "",
      scheduledTime: "",
    },
  });

  const navigate = useNavigate();

  const {
    inviteCandidate,
    createInterview,
    loading: { schedulingInterview, creatingInterview },
    error: {
      schedulingInterview: scheduleError,
      creatingInterview: createError,
    },
  } = useInterview();

  const scheduleNow = watch("scheduleNow");

  const jobRoles = Object.values(JobRole).map((role) => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1),
  }));

  const toggleOptions = [
    { label: "schedule_later", value: "Schedule Later" },
    { label: "schedule_now", value: "Schedule Now" },
  ];

  const onSubmit = async (data: ScheduleFormData) => {
    if (interviewId) {
      await inviteCandidate(interviewId, {
        email: data.candidateEmail!,
        scheduledTime: new Date(data.scheduledTime!).toISOString(),
      });
    } else {
      const newInterview = await createInterview({
        title: data.title,
        description: data.description,
        jobRole: data.jobRole,
        scheduledTime: data.scheduledTime,
      });

      if (data.scheduleNow && newInterview?._id && data.candidateEmail) {
        await inviteCandidate(newInterview._id, {
          email: data.candidateEmail,
          scheduledTime: new Date(data.scheduledTime!).toISOString(),
        });
      }
    }

    if (!createError && !scheduleError) {
      navigate("/recruiter/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 h-fit">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
        {interviewId ? "Schedule Interview" : "Create Interview"}
      </h2>

      {(createError || scheduleError) && (
        <ErrorAlert
          title="Error!"
          subtitle={createError || scheduleError || "Something went wrong!"}
        />
      )}

      {!interviewId && (
        <>
          <InputBox
            id="title"
            placeholder="Interview Title"
            {...register("title")}
            error={errors.title?.message}
          />

          <TextArea
            id="description"
            placeholder="Job Description"
            {...register("description")}
            error={errors.description?.message}
          />

          <Dropdown
            id="jobRole"
            placeholder="Select Job Role"
            options={jobRoles}
            value={watch("jobRole") || ""}
            onChange={(value) => setValue("jobRole", value as JobRole)}
            error={errors.jobRole?.message}
            register={register("jobRole")}
          />
        </>
      )}

      <Toggle
        checked={scheduleNow}
        options={toggleOptions}
        onChange={(e) => setValue("scheduleNow", e.target.checked)}
        registration={register("scheduleNow")}
        error={errors.scheduleNow?.message}
      />

      {scheduleNow && (
        <>
          <InputBox
            id="candidateEmail"
            placeholder="Candidate Email"
            type="email"
            {...register("candidateEmail")}
            error={errors.candidateEmail?.message}
          />

          <DatetimeSelector
            id="scheduledTime"
            placeholder="Interview Date & Time"
            value={watch("scheduledTime") || ""}
            onChange={(value) => setValue("scheduledTime", value)}
          />
          {errors.scheduledTime?.message && (
            <p className="mt-1 text-sm text-red-600">
              {errors.scheduledTime.message}
            </p>
          )}
        </>
      )}

      <button
        type="submit"
        disabled={creatingInterview || schedulingInterview}
        className="bg-blue-200 w-full hover:bg-blue-400 text-blue-500 hover:text-blue-800 cursor-pointer font-bold py-2 px-6 rounded-md shadow transition-colors duration-300 ease-in-out"
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
