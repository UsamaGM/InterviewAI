import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { formatDate, formatTime } from "../utils/dateTimeFormatter";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    interviewsThisWeek: 0,
    totalCandidates: 0,
    totalQuestions: 0,
  });

  const isCandidate = useMemo(() => user?.role === "candidate", [user]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, interviewsRes, activityRes, statsRes] =
          await Promise.all([
            API.get("/users"),
            API.get("/interviews"),
            API.get("/activity/recent"),
            API.get("/stats"),
          ]);

        setUser(userRes.data);
        setUpcomingInterviews(interviewsRes.data);
        setRecentActivity(activityRes.data);
        setStats(statsRes.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load dashboard data."
        );
      }
    }

    fetchData();
  }, []);

  const linkStyle =
    "bg-primary text-primaryContrast rounded-md px-4 py-2 hover:bg-accent hover:text-accentContrast hover:scale-110 transition-all duration-300";

  return (
    <div className="p-6 bg-gradient-to-tr from-primary/25 to-tertiary/25 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Upcoming Interviews */}
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3">Upcoming Interviews</h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <span>{formatTime(interview.time)}</span>
                  <span>{formatDate(interview.date)}</span>
                  <span>
                    {isCandidate
                      ? interview.recruiter.username
                      : interview.candidates.map((c) => c.username).join(", ")}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No upcoming interviews.</p>
            )}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3">Recent Activity</h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="border-b py-2">
                  <p>{activity.details}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent activity.</p>
            )}
          </div>
        </section>

        {/* Stats */}
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3">Stats</h2>
          <div className="bg-white shadow-md rounded-lg p-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xl font-bold">{stats.interviewsThisWeek}</p>
              <p className="text-sm text-gray-500">Interviews This Week</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{stats.totalCandidates}</p>
              <p className="text-sm text-gray-500">Total Candidates</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{stats.totalQuestions}</p>
              <p className="text-sm text-gray-500">Total Questions</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3">Quick Actions</h2>
          <div className="flex items-center justify-evenly space-x-4">
            <Link to="/schedule" className={linkStyle}>
              Schedule Interview
            </Link>
            <Link to="/candidates/add" className={linkStyle}>
              Add Candidate
            </Link>
            <Link to="/questions/add" className={linkStyle}>
              Add Question
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
