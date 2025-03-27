import { Link } from "react-router-dom";
import { Interview } from "../../../utils/types";

interface InterviewCardProps {
  interview: Interview;
}

function InterviewCard({ interview }: InterviewCardProps) {
  return (
    <article className="hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-xs hover:[animation-duration:_4s]">
      <div className="rounded-[10px] bg-white p-4 sm:p-6">
        {interview.scheduledTime && (
          <time
            dateTime={interview.scheduledTime?.toDateString()}
            className="block text-xs text-gray-500"
          >
            {interview.scheduledTime?.toDateString()}
          </time>
        )}

        <Link to={`/interviews/${interview._id}/details`}>
          <h3 className="mt-0.5 text-lg font-semibold text-gray-900">
            {interview.title}
          </h3>
          <h4 className="mt-0.5 text-md font-medium text-gray-700">
            {interview.description}
          </h4>
        </Link>

        <div className="mt-4 flex flex-wrap gap-1">
          <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs whitespace-nowrap text-purple-600">
            {interview.status}
          </span>

          <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs whitespace-nowrap text-purple-600">
            {interview.jobRole}
          </span>
        </div>
      </div>
    </article>
  );
}

export default InterviewCard;
