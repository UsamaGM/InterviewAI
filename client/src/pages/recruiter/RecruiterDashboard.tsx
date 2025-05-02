import { Link } from "react-router-dom";
import InterviewCard from "@/components/interview/InterviewCard";
import { LoadingSpinner } from "@/components/common";
import { useAuth, useInterview } from "@/hooks";

function RecruiterDashboard() {
  const {
    interviews,
    loading: { fetchingInterviews },
    error: { fetchingInterviews: fetchError },
  } = useInterview();
  const { user } = useAuth();

  if (fetchingInterviews) return <LoadingSpinner size="lg" />;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-red-50">Hey there {user?.name}</h1>

      {fetchError && <p className="text-red-500">{fetchError}</p>}
      {interviews && interviews.length > 0 ? (
        <div className="flex flex-wrap gap-4 justify-center">
          {interviews.map((interview) => (
            <InterviewCard
              key={interview._id}
              interview={interview}
              role="recruiter"
              actions={[
                {
                  label: "Invite Candidate",
                  to: `/recruiter/invite-candidate/${interview._id}`,
                  condition: !interview.candidate,
                },
              ]}
            />
          ))}
        </div>
      ) : (
        <div className="text-center mt-8 p-4 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">
            You haven't created any interviews yet.
          </p>
          <Link
            to="/recruiter/schedule"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Create your first interview
          </Link>
        </div>
      )}
    </div>
  );
}

export default RecruiterDashboard;
