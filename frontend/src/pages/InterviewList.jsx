/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
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

  const interviewStyle = useMemo(
    () => "px-5 py-4 rounded-xl bg-light shadow-md shadow-shadowDark",
    []
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
              <h2 className="text-2xl font-bold mt-4">Scheduled Interviews</h2>
              <ul>
                {/*TODO:style*/}
                {scheduled.length > 0 ? (
                  scheduled.map((interview) => (
                    <Interview key={interview._id} interview={interview} />
                  ))
                ) : (
                  <p>No scheduled interviews yet!</p>
                )}
              </ul>
              <h2 className="text-2xl font-bold">Completed Interviews</h2>
              <ul>
                {completed.length > 0 ? (
                  completed.map((interview) => (
                    <Interview key={interview._id} interview={interview} />
                  ))
                ) : (
                  <p>Lets finish an interview</p>
                )}
              </ul>
              <h2 className="text-2xl font-bold">Cancelled Interviews</h2>
              <ul>
                {cancelled.length > 0 ? (
                  cancelled.map((interview) => (
                    <Interview key={interview._id} interview={interview} />
                  ))
                ) : (
                  <p>No interviews cancelled!</p>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );

  function Interview({ interview }) {
    return (
      <li className={interviewStyle}>
        <h3 className="font-bold">{interview.title}</h3>
        <p>
          {formatDate(interview.date)} at {formatTime(interview.time)}
        </p>
      </li>
    );
  }
}

export default InterviewList;
