import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../common";
import { useInterview } from "../../context/InterviewContext";
import InterviewCard from "../interview/InterviewCard";

function RecruiterDashboard() {
  const {
    interviews,
    setSelectedInterview,
    loading: { fetchingInterviews: loading },
    error: { fetchingInterviews: error },
  } = useInterview();

  useEffect(() => setSelectedInterview(null), []);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Interviews</h1>
        <Link
          to="/recruiter/schedule"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Schedule New Interview
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : interviews && interviews.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {error && <p className="text-red-500">{error}</p>}
          {interviews.map((interview) => (
            <InterviewCard
              key={interview._id}
              interview={interview}
              role="recruiter"
              actions={[
                {
                  label: "Invite Candidate",
                  to: `/recruiter/schedule/${interview._id}`,
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
