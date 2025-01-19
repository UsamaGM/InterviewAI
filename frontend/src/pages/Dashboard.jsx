/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import {
  FaClipboardList,
  FaCalendarCheck,
  FaCalendarTimes,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
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
        const [userData, scheduledData, cancelledData, completedData] =
          await Promise.all([
            API.get("/users"),
            API.get("/interviews?status=Scheduled"),
            API.get("/interviews?status=Cancelled"),
            API.get("/interviews?status=Completed"),
          ]);

        setUser(userData.data);
        setScheduled(scheduledData.data);
        setCancelled(cancelledData.data);
        setCompleted(completedData.data);
      } catch (error) {
        const message =
          error.code === "ERR_NETWORK"
            ? "Network Error! Please try later."
            : error.response?.data?.message || "An unexpected error occurred";

        setError(message);
        toast.error(message, { position: "top-right" });

        if (error.code !== "ERR_NETWORK") {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  const today = useRef(null);
  today.current = new Date();
  const isCandidate = useMemo(() => user?.role === "candidate", [user]);

  const nextInterview = useMemo(() => scheduled[0], [scheduled]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-primary/10">
        <BallTriangle color="#1F5AC2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-100">
        <h2 className="text-2xl text-red-500 font-bold">Error</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-primary/10">
        <h2 className="text-2xl font-bold text-primary">
          Loading user data...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4.5rem)] p-5 bg-secondary/25 text-dark">
      <WelcomeCard />
      <StatsCard />
      <InterviewSection title="Scheduled Interviews" interviews={scheduled} />
      <InterviewSection title="Completed Interviews" interviews={completed} />
      <InterviewSection title="Cancelled Interviews" interviews={cancelled} />
    </div>
  );

  function WelcomeCard() {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto bg-accent text-accentContrast text-center p-6 rounded-lg shadow-md mb-5"
      >
        <h1 className="text-3xl font-bold">Welcome, {user.username}!</h1>
        <p className="text-lg mt-2">
          {nextInterview
            ? `Your next interview is with ${
                isCandidate
                  ? nextInterview.recruiter.username
                  : nextInterview.candidate.username
              } on ${formatDate(nextInterview.date)} at ${formatTime(
                nextInterview.time
              )}.`
            : "No upcoming interviews at the moment. Keep up the good work!"}
        </p>
      </motion.div>
    );
  }

  function StatsCard() {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto flex justify-between bg-secondary text-light p-4 rounded-lg shadow-md mb-5"
      >
        <Stat
          label="Scheduled"
          value={scheduled.length}
          icon={<FaClipboardList size={24} color="#7F7" />}
        />
        <Stat
          label="Completed"
          value={completed.length}
          icon={<FaCalendarCheck size={24} color="#1E88E5" />}
        />
        <Stat
          label="Cancelled"
          value={cancelled.length}
          icon={<FaCalendarTimes size={24} color="#F44336" />}
        />
      </motion.div>
    );
  }

  function Stat({ label, value, icon }) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-2">{icon}</div>
        <h2 className="text-2xl font-bold text-accentLight">{value}</h2>
        <p className="text-lg">{label}</p>
      </div>
    );
  }

  function InterviewSection({ title, interviews }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8"
      >
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        {interviews.length === 0 ? (
          <p className="text-gray-500">No {title.toLowerCase()} yet.</p>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {interviews.map((interview) => (
              <motion.div
                key={interview._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <InterviewCard interview={interview} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    );
  }

  function InterviewCard({ interview }) {
    const {
      recruiter: { username: recruiterName },
      candidate: { username: candidateName },
      date,
      time,
    } = interview;

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-secondaryContrast border border-secondary/50 rounded-lg shadow-sm p-4 text-center transition-shadow duration-300"
      >
        <h4 className="text-lg font-bold mb-2">
          {isCandidate
            ? `Recruiter: ${recruiterName}`
            : `Candidate: ${candidateName}`}
        </h4>
        <p className="text-sm text-gray-600">
          <FaCalendarAlt className="inline mr-1" />
          <strong>Date:</strong> {formatDate(date)}
        </p>
        <p className="text-sm text-gray-600">
          <FaClock className="inline mr-1" />
          <strong>Time:</strong> {formatTime(time)}
        </p>
        <Link
          to={`/profile/${
            isCandidate ? interview.recruiter._id : interview.candidate._id
          }`}
          className="text-blue-500 hover:underline mt-2 block"
        >
          View Profile
        </Link>
      </motion.div>
    );
  }

  function formatDate(date) {
    const parsedDate = new Date(date);

    // Validate the parsed date
    if (isNaN(parsedDate.getTime())) {
      return "Invalid Date";
    }

    return parsedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatTime(time) {
    const [hour, minute] = time.split(":").map(Number);

    if (
      isNaN(hour) ||
      isNaN(minute) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      return "Invalid Time";
    }

    const period = hour >= 12 ? "PM" : "AM";
    const adjustedHour = String(hour % 12 || 12).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");

    return `${adjustedHour}:${formattedMinute} ${period}`;
  }
}

export default Dashboard;
