import { useNavigate } from "react-router-dom";
import { Interview } from "../../utils/types";
import { formatDate } from "../../utils/helpers";

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
    <div className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
            {interview.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-1">
            {interview.jobRole || "Not specified"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
        <span>{formatDate(interview.scheduledTime)}</span>
        {interview.score && (
          <span className="font-medium text-gray-800">
            Score: {interview.score * 10}%
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-md transition-colors duration-200"
          onClick={() =>
            navigate(`/${role}/interview-details/${interview._id}`)
          }
        >
          Details
        </button>
        {actions
          .filter(
            (action) => action.condition === undefined || action.condition
          )
          .map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.to)}
              className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-md transition-colors duration-200"
            >
              {action.label}
            </button>
          ))}
      </div>
    </div>
  );
};

export default InterviewCard;
