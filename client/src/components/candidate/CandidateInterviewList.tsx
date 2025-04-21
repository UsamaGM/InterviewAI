import { LoadingSpinner } from "@/components/common";
import { InterviewCard } from "@/components/interview";
import { useInterview } from "@/hooks";

function CandidateInterviewList() {
  const {
    interviews,
    loading: { fetchingInterviews },
  } = useInterview();

  if (fetchingInterviews) return <LoadingSpinner size="lg" />;

  return (
    <div className="container">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Interviews</h1>
      {interviews && interviews.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {interviews.map((interview) => (
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
          ))}
        </div>
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
