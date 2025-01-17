/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [scheduled, setScheduled] = useState([]);
  const [cancelled, setCancelled] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        setUser((await API.get("/users")).data);
        setScheduled((await API.get("/interviews?limit=3")).data);
        setCancelled((await API.get("/interviews?status=Cancelled")).data);
        setCompleted((await API.get("/interviews?status=Completed")).data);
      } catch (error) {
        setError(error.response.data?.message);
        toast.error(
          error.code === "ERR_NETWORK"
            ? "Network Error! Please try later."
            : error.response.data.message,
          { position: "top-right" }
        );
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  const today = new Date();
  const isCandidate = useMemo(() => user?.role === "candidate", [user]);
  let nextInterview;

  if (scheduled.length > 0) {
    nextInterview = scheduled.filter(
      (interview) => new Date(interview.date) > today
    )[0];
    nextInterview.date = new Date(nextInterview.date);
  }

  if (loading) {
    return (
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-primary/50">
        <BallTriangle />
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-primary/50">
        <BallTriangle />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-light text-dark flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col items-center bg-tertiary text-light p-5 rounded-3xl shadow-md shadow-dark">
        <h2 className="text-4xl font-bold mb-5">Welcome {user.username}!</h2>
        <NextInterview />
        <div className="w-full px-5 pt-5 text-primary font-bold flex justify-between">
          <h4>Completed: {completed.length}</h4>
          <h4>Scheduled: {scheduled.length}</h4>
          <h4>Cancelled: {cancelled.length}</h4>
        </div>
      </div>
      <ListInterviews interviews={scheduled} title="Upcoming" />
      <ListInterviews interviews={completed} title="Completed" />
      <ListInterviews interviews={cancelled} title="Cancelled" />
    </div>
  );

  function ListInterviews({ interviews, title }) {
    return interviews.length > 0 ? (
      <div className="w-full min-w-fit max-w-3xl flex flex-col p-5 my-10 rounded-3xl shadow-md shadow-dark bg-tertiary">
        <h3 className="font-extrabold text-2xl text-center text-light">
          {title}
        </h3>
        <div className="flex justify-center flex-wrap gap-4 py-5">
          {interviews.map((interview) => {
            const {
              _id,
              recruiter: { _id: rI, username: rN },
              candidate: { _id: cI, username: cN },
              date,
              time,
            } = interview;

            return (
              <div
                className="max-w-md min-w-fit flex-grow flex items-center justify-center text-center gap-2 rounded-3xl shadow-md shadow-dark bg-primary text-primaryContrast p-5"
                key={_id}
              >
                <p>
                  You have an interview with{" "}
                  <Link
                    className="font-bold w-min text-primaryContrast hover:text-tertiary"
                    to={`/profile/${isCandidate ? rI : cI}`}
                  >
                    {isCandidate ? rN : cN}
                  </Link>{" "}
                  at {getTime(time)}, {getDate(date)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    ) : (
      <></>
    );
  }

  function NextInterview() {
    let date, time, rN, cN;
    if (nextInterview) {
      date = nextInterview.date;
      time = nextInterview.time;
      rN = nextInterview.recruiter.username;
      cN = nextInterview.candidate.username;
    }

    return (
      <h4 className="w-full flex justify-center items-center gap-2 px-4 py-1 bg-secondary text-lg text-secondaryContrast shadow-md shadow-dark rounded-full">
        {nextInterview && <b>Next Interview: </b>}
        {nextInterview
          ? `${getDate(date)} at ${getTime(time)} with ${isCandidate ? rN : cN}`
          : "No upcomnig interview!"}
      </h4>
    );
  }

  function getDate(date) {
    const d = new Date(date);
    return d === today
      ? "Today"
      : d.toLocaleString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });
  }

  function getTime(time) {
    const [hour, minutes] = time.split(":");
    return hour >= 12
      ? `${hour - 12 === 0 ? "12" : hour - 12}:${minutes} PM`
      : `${hour === 0 ? "12" : hour}:${minutes} AM`;
  }
}

export default Dashboard;
