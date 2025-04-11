import { useNavigate } from "react-router-dom";
import { Interview } from "../../utils/types";
import { formatDate, statusConfig } from "../../utils/helpers";

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
  const navigate = useNavigate();

  return (
    <div className="w-[calc(50%-0.5rem)] bg-white/80 backdrop-blur-lg rounded-lg ring-2 ring-gray-300 hover:ring-gray-400 shadow-xl drop-shadow-lg p-6 hover:shadow-none transition-all duration-300">
      <div>
        <div className="flex justify-between">
          <h3 className="text-xl font-semibold text-justify line-clamp-1 h-7 text-gray-800">
            {interview.title}
          </h3>
          <span
            className={`px-3 py-1 min-w-fit rounded-full text-sm font-medium ${
              statusConfig[interview.status].styles
            }`}
          >
            {statusConfig[interview.status].title}
          </span>
        </div>
        <p className="text-gray-600 text-wrap text-justify line-clamp-2 h-12 overflow-ellipsis mt-2">
          {interview.description}
        </p>
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
        <div className="flex items-center space-x-4 mt-4 p-2 bg-gray-100 rounded-md">
          <p className="text-sm text-gray-700">Candidate</p>
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
                onClick={() => {
                  navigate(action.to);
                }}
                className="text-blue-500 hover:text-blue-800 hover:bg-blue-100 hover:shadow transition-all duration-300 font-medium cursor-pointer p-2 rounded-md"
              >
                {action.label}
              </button>
            ))}
        <button
          className="text-blue-500 hover:text-blue-800 hover:bg-blue-100 hover:shadow transition-all duration-300 font-medium cursor-pointer p-2 rounded-md"
          onClick={() =>
            navigate(`/${role}/interview-details/${interview._id}`)
          }
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default InterviewCard;
