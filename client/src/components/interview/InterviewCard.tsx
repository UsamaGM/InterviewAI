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
    <div className="relative min-w-[150px] max-w-[49%] bg-white/80 backdrop-blur-lg rounded-lg ring-2 ring-blue-200 hover:ring-blue-400 hover:scale-102 shadow-xl p-4 hover:shadow-none transition-all duration-300 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-justify line-clamp-1 text-gray-800">
          {interview.title}
        </h3>
        <span
          className={`px-2 py-0.5 min-w-fit rounded-full text-sm font-medium ${
            statusConfig[interview.status].styles
          }`}
        >
          {statusConfig[interview.status].title}
        </span>
      </div>

      <p className="text-gray-600 text-justify line-clamp-2 h-10 text-sm">
        {interview.description}
      </p>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Job Role</p>
          <p className="font-medium">{interview.jobRole || "Not specified"}</p>
        </div>
        <div>
          <p className="text-gray-500">Scheduled Time</p>
          <p className="font-medium">{formatDate(interview.scheduledTime)}</p>
        </div>
      </div>

      {interview.candidate && (
        <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-md text-sm">
          <span className="text-gray-700">Candidate:</span>
          <span className="font-medium">
            {interview.candidate.name || interview.candidate.email}
          </span>
        </div>
      )}

      <div className="flex gap-2 mt-auto pt-2">
        <button
          className="text-blue-500 hover:text-blue-800 hover:bg-blue-100 cursor-pointer p-1.5 rounded-md text-sm font-medium transition-all"
          onClick={() =>
            navigate(`/${role}/interview-details/${interview._id}`)
          }
        >
          View Details
        </button>
        {actions
          .filter(
            (action) => action.condition === undefined || action.condition
          )
          .map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.to)}
              className="text-blue-500 hover:text-blue-800 hover:bg-blue-100 cursor-pointer p-1.5 rounded-md text-sm font-medium transition-all"
            >
              {action.label}
            </button>
          ))}
      </div>
    </div>
  );
};

export default InterviewCard;
