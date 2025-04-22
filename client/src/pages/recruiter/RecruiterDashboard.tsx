import { Link } from "react-router-dom";
import InterviewCard from "@/components/interview/InterviewCard";
import { LoadingSpinner } from "@/components/common";
import { useInterview } from "@/hooks";

function RecruiterDashboard() {
  const {
    interviews,
    loading: { fetchingInterviews },
    error: { fetchingInterviews: fetchError },
  } = useInterview();

  if (fetchingInterviews) return <LoadingSpinner size="lg" />;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Interviews</h1>
        <Link
          to="/recruiter/schedule"
          className="bg-blue-100/80 hover:bg-blue-300/80 backdrop-blur-lg text-blue-600 hover:text-blue-700 font-bold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition duration-300 ease-in-out"
        >
          Create New Interview
        </Link>
      </div>

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
