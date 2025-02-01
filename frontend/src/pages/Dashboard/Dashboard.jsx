import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";
import { formatDate, formatTime } from "../../utils/dateTimeFormatter";
import API from "../../services/api";

function Dashboard() {
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    interviewsThisWeek: 0,
    totalCandidates: 0,
    totalQuestions: 0,
  });
  const [loading, setLoading] = useState(true);

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

        console.log(interviewsRes.data);

        if (!userRes.data) {
          toast.error("You are not authorized to access this page.");
          Navigate()("/");
        }

        setUpcomingInterviews(interviewsRes.data);
        setRecentActivity(activityRes.data);
        setStats(statsRes.data);
        setLoading(false);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load dashboard data."
        );
      }
    }

    fetchData();
  }, []);

  const linkStyle = useMemo(
    () =>
      "bg-primary/50 backdrop-blur-xl text-dark rounded-md px-4 py-2 hover:bg-accent hover:text-accentContrast hover:scale-110 transition-all duration-300",
    []
  );

  if (loading)
    return (
      <div className="p-6 bg-gradient-to-tr from-primary/25 to-tertiary/25 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-6 bg-gradient-to-tr from-secondary/35 to-tertiary/35 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Upcoming Interviews */}
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3">Upcoming Interviews</h2>
          <div className="bg-white/25 backdrop-blur-md shadow-md rounded-lg p-4">
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex justify-between gap-1 items-center border-b border-shadowDark py-2"
                >
                  <span className="flex-1">{formatDate(interview.date)}</span>
                  <span className="mr-5">{formatTime(interview.time)}</span>
                  <span className="flex-1">
                    {interview.candidates.map((c) => c.name).join(", ")}
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
          <div className="bg-white/25 backdrop-blur-md shadow-md rounded-lg p-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="border-b border-shadowDark py-2">
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
          <div className="bg-white/25 backdrop-blur-md shadow-md rounded-lg p-4 grid grid-cols-3 gap-4">
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
            <Link to="/interviews" className={linkStyle}>
              Manage Interviews
            </Link>
            <Link to="/candidates" className={linkStyle}>
              Manage Candidates
            </Link>
            <Link to="/questions" className={linkStyle}>
              Manage Question
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
