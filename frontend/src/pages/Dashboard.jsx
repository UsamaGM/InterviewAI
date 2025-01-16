import { useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        setUser((await API.get("/users")).data);
        setInterviews((await API.get("/interviews")).data);
      } catch (error) {
        setError(error.response.data?.message);
        toast.error(
          error.code === "ERR_NETWORK"
            ? "Network Error! Please try later."
            : error.response.data.message,
          { position: "top-right" }
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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

  const today = new Date();
  let nextInterview,
    hour,
    minutes = null;

  if (interviews.length > 0) {
    nextInterview = interviews.filter(
      (interview) => new Date(interview.date) > today
    )[0];
    nextInterview.date = new Date(nextInterview.date);
    [hour, minutes] = nextInterview.time.split(":");
  }

  return (
    <div className="min-h-screen p-5 bg-light text-dark flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-3">Welcome {user.username}!</h2>
      <NextInterview />

      <div>
        {interviews.map((interview) => (
          <>
            <p key={interview._id}>Recruiter: {interview.recruiter.username}</p>
            <p key={interview._id}>Candidate: {interview.candidate.username}</p>
          </>
        ))}
      </div>
    </div>
  );

  function NextInterview() {
    return (
      <h4 className="w-full max-w-3xl flex justify-center items-center gap-2 px-4 py-1 bg-secondary text-secondaryContrast rounded-md">
        {nextInterview && <b>Next Interview: </b>}
        {nextInterview
          ? `${
              nextInterview.date === today
                ? "Today"
                : nextInterview.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
            } at ${
              hour >= 12
                ? `${hour - 12 === 0 ? "12" : hour - 12}:${minutes} PM`
                : `${hour === 0 ? "12" : hour}:${minutes} AM`
            } with ${
              user.role === "candidate"
                ? nextInterview.recruiter.username
                : nextInterview.candidate.username
            }`
          : "No upcomnig interview!"}
      </h4>
    );
  }
}

export default Dashboard;
