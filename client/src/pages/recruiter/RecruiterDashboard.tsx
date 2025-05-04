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
    <div className="container mx-auto sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage your interviews and candidates
        </p>
      </div>

      {fetchError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{fetchError}</p>
        </div>
      )}

      {interviews && interviews.length > 0 ? (
        <div className="flex flex-wrap justify-between gap-4">
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
        <div className="max-w-2xl mx-auto text-center mt-12 p-8 bg-white rounded-xl shadow-lg">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            No interviews yet
          </h2>
          <p className="text-gray-600 mb-6">
            Get started by creating your first interview
          </p>
          <Link
            to="/recruiter/schedule"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Create Interview
          </Link>
        </div>
      )}
    </div>
  );
}

export default RecruiterDashboard;
