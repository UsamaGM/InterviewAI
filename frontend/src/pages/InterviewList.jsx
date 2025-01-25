/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import { formatDate, formatTime } from "../utils/dateTimeFormatter";

function InterviewList() {
  const [scheduled, setScheduled] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [cancelled, setCancelled] = useState([]);
  const [stats, setStats] = useState({
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    async function fetchInterviews() {
      try {
        const [scheduledRes, completedRes, cancelledRes, statsRes] =
          await Promise.all([
            API.get("/interviews"),
            API.get("/interviews?status=Completed"),
            API.get("/interviews?status=Cancelled"),
            API.get("/interviews/stats"),
          ]);

        setScheduled(scheduledRes.data);
        setCompleted(completedRes.data);
        setCancelled(cancelledRes.data);
        setStats(statsRes.data);
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

  return (
    <div className="min-h-[calc(100vh-4.5rem)] p-5 bg-gradient-to-br from-secondary/30 to-accent/30">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {stats.scheduled === 0 &&
        stats.completed === 0 &&
        stats.cancelled === 0 ? (
          <p>No interviews yet.</p>
        ) : (
          <>
            <section className="w-full mb-6">
              <h2 className="text-2xl font-bold mb-4 text-dark">Stats</h2>
              <div className="bg-white shadow-md shadow-shadowDark rounded-lg p-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold">{stats.scheduled}</p>
                  <p className="text-sm">Scheduled</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{stats.completed}</p>
                  <p className="text-sm">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{stats.cancelled}</p>
                  <p className="text-sm">Cancelled</p>
                </div>
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
    console.log(interviews);
    return (
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <div className="bg-white shadow-md shadow-shadowDark rounded-xl px-5 py-3">
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
