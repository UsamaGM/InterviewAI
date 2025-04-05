import { useNavigate } from "react-router-dom";
import { Interview } from "../../utils/types";
import { useInterview } from "../../context/InterviewContext";
import { useMemo } from "react";

interface ActionLink {
  label: string;
  to: string;
  condition?: boolean;
}

interface InterviewCardProps {
  interview: Interview;
  role: "recruiter" | "candidate";
  actions?: ActionLink[];
}

const InterviewCard = ({
  interview,
  role,
  actions = [],
}: InterviewCardProps) => {
  const { setSelectedInterview } = useInterview();
  const navigate = useNavigate();

  function formatDate(dateString?: string) {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleString();
  }

  const statusDetails = useMemo(
    () => ({
      draft: {
        title: "Draft",
        styles: "bg-gray-200 text-gray-800",
      },
      scheduled: {
        title: "Scheduled",
        styles: "bg-blue-200 text-blue-800",
      },
      "in-progress": {
        title: "In Progress",
        styles: "bg-yellow-200 text-yellow-800",
      },
      completed: {
        title: "Completed",
        styles: "bg-gray-200 text-gray-800",
      },
      cancelled: {
        title: "Cancelled",
        styles: "bg-red-200 text-red-800",
      },
    }),
    []
  );

  return (
    <div className="flex-shrink min-w-lg max-w-2xl bg-white rounded-lg ring-2 ring-gray-300 hover:ring-gray-400 shadow-lg p-6 hover:shadow-none transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {interview.title}
          </h3>

          <p className="text-gray-600 text-wrap text-justify line-clamp-2 h-12 overflow-ellipsis mt-1">
            {interview.description}
          </p>
        </div>
        <span
          className={`px-3 py-1 min-w-fit rounded-full text-sm font-medium ${
            statusDetails[interview.status].styles
          }`}
        >
          {statusDetails[interview.status].title}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Job Role</p>
          <p className="font-medium">{interview.jobRole || "Not specified"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Scheduled Time</p>
          <p className="font-medium">{formatDate(interview.scheduledTime)}</p>
        </div>
      </div>

      {interview.candidate && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-500">Candidate</p>
          <p className="font-medium">
            {interview.candidate.name || interview.candidate.email}
          </p>
        </div>
      )}

      <div className="flex mt-4 gap-4">
        {actions.length > 0 &&
          actions
            .filter(
              (action) => action.condition === undefined || action.condition
            )
            .map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(action.to);
                }}
                className="text-blue-500 hover:text-blue-800 hover:bg-blue-100 hover:shadow transition-all duration-300 font-medium cursor-pointer p-2 rounded-md"
              >
                {action.label}
              </button>
            ))}
        <button
          className="text-blue-500 hover:text-blue-800 hover:bg-blue-100 hover:shadow transition-all duration-300 font-medium cursor-pointer p-2 rounded-md"
          onClick={() => {
            setSelectedInterview(interview);
            navigate(`/${role}/interview-details`);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default InterviewCard;
