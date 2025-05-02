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
    <div className="relative w-[49%] bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl rounded-xl ring-1 ring-blue-100 hover:ring-blue-300 hover:scale-[1.02] shadow-lg hover:shadow-2xl p-6 transition-all duration-300 ease-in-out flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-justify line-clamp-1 text-gray-800 tracking-tight">
          {interview.title}
        </h3>
        <span
          className={`px-3 py-1 min-w-fit rounded-full text-sm font-medium shadow-sm ${
            statusConfig[interview.status].styles
          }`}
        >
          {statusConfig[interview.status].title}
        </span>
      </div>

      <p className="text-gray-600 text-justify line-clamp-2 h-12 text-sm leading-6">
        {interview.description}
      </p>

      <div className="grid grid-cols-2 gap-4 text-sm bg-white/50 rounded-lg p-4">
        <div className="space-y-1">
          <p className="text-gray-500 font-medium">Job Role</p>
          <p className="font-semibold text-gray-800">{interview.jobRole || "Not specified"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 font-medium">Scheduled Time</p>
          <p className="font-semibold text-gray-800">{formatDate(interview.scheduledTime)}</p>
        </div>
      </div>

      {interview.candidate && (
        <div className="flex items-center gap-3 p-3 bg-blue-50/80 rounded-lg text-sm border border-blue-100">
          <span className="text-blue-600 font-medium">Candidate:</span>
          <span className="font-semibold text-gray-800">
            {interview.candidate.name || interview.candidate.email}
          </span>
        </div>
      )}

      <div className="flex gap-3 mt-auto pt-3 border-t border-gray-100">
        <button
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
          onClick={() => navigate(`/${role}/interview-details/${interview._id}`)}
        >
          View Details
        </button>
        {actions
          .filter((action) => action.condition === undefined || action.condition)
          .map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.to)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            >
              {action.label}
            </button>
          ))}
      </div>
    </div>
  );
};

export default InterviewCard;
