/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { toast } from "react-toastify";
import { formatDate, formatTime } from "../../utils/dateTimeFormatter";
import API from "../../services/api";

function InterviewList() {
  const [scheduled, setScheduled] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [cancelled, setCancelled] = useState([]);
  const [stats, setStats] = useState({
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInterviews() {
      try {
        const [scheduledRes, completedRes, cancelledRes, interviewStatsRes] =
          await Promise.all([
            API.get("/interviews"),
            API.get("/interviews?status=Completed"),
            API.get("/interviews?status=Cancelled"),
            API.get("/interviews/stats"),
            API.get("/stats"),
          ]);

        setScheduled(scheduledRes.data);
        setCompleted(completedRes.data);
        setCancelled(cancelledRes.data);
        setStats(interviewStatsRes.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error(
          error.code === "ERR_NETWORK"
            ? "Network Error! Please try later."
            : error.response?.data?.message ?? "Failed to fetch interviews."
        );
      }
    }
    fetchInterviews();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      title: {
        display: true,
        text: "Interview Stats",
        position: "bottom",
      },
    },
  };

  const data = {
    labels: ["Scheduled", "Completed", "Cancelled"],
    datasets: [
      {
        label: "Interviews",
        data: [stats.scheduled, stats.completed, stats.cancelled],
        backgroundColor: ["#00A8FF", "#00FF6D", "#FF6D6D"],
      },
    ],
  };

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
    <div className="min-h-[calc(100vh-4.5rem)] p-5 bg-gradient-to-br from-secondary/30 to-accent/30">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {stats.scheduled === 0 &&
        stats.completed === 0 &&
        stats.cancelled === 0 ? (
          <p>No interviews yet.</p>
        ) : (
          <>
            <section className="w-full max-w-3xl overflow-hidden mb-6">
              <div className="pb-2 w-fit">
                <h2 className="text-2xl font-bold mb-4 text-dark">Stats</h2>
                <Doughnut
                  className="max-h-60 bg-white/35 backdrop-blur-md shadow-md shadow-shadowDark rounded-xl"
                  data={data}
                  options={options}
                />
              </div>
            </section>
            <div className="w-full space-y-4">
              <Interview
                interviews={scheduled}
                title="Scheduled"
                alt="No Scheduled Interviews"
              />
              <Interview
                interviews={completed}
                title="Completed"
                alt="No Completed Interviews"
              />
              <Interview
                interviews={cancelled}
                title="Cancelled"
                alt="No cancelled Interviews"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );

  function Interview({ interviews, title, alt }) {
    return (
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <div className="bg-white/35 backdrop-blur-md shadow-md shadow-shadowDark rounded-xl px-5 py-3">
          <ul>
            {interviews.length > 0 ? (
              interviews.map((interview) => (
                <li key={interview._id} className="mb-3 border-b">
                  <h3 className="font-bold">{interview.title}</h3>
                  <p>
                    {formatDate(interview.date)} at {formatTime(interview.time)}
                  </p>
                </li>
              ))
            ) : (
              <p>{alt}</p>
            )}
          </ul>
        </div>
      </section>
    );
  }
}

export default InterviewList;
