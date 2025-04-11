import { useInterview } from "../../context/InterviewContext";
import { LoadingSpinner } from "../common";
import InterviewCard from "../interview/InterviewCard";

function CandidateInterviewList() {
  const {
    interviews,
    loading: { fetchingInterviews },
  } = useInterview();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Interviews</h1>

      {interviews && interviews.length > 0 ? (
        <ul className="space-y-4">
          {fetchingInterviews ? (
            <LoadingSpinner size="lg" />
          ) : (
            interviews.map((interview) => (
              <InterviewCard
                key={interview._id}
                interview={interview}
                role="candidate"
                actions={[
                  {
                    label: "Start Interview",
                    to: `/candidate/take-interview/${interview._id}`,
                    condition: interview.status === "scheduled",
                  },
                  {
                    label: "Continue Interview",
                    to: `/candidate/take-interview/${interview._id}`,
                    condition: interview.status === "in-progress",
                  },
                  {
                    label: "View Results",
                    to: `/candidate/interview-results/${interview._id}`,
                    condition: interview.status === "completed",
                  },
                ]}
              />
            ))
          )}
        </ul>
      ) : (
        <div className="text-center mt-8">
          <p className="text-gray-600">
            You don't have any interviews scheduled yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default CandidateInterviewList;
