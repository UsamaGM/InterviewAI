import { useEffect, useState } from "react";
import API from "../services/api";

function InterviewList() {
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInterviews() {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await API.get("/interviews", config);
        setInterviews(data);
      } catch (error) {
        setError(`Failed: ${error}`);
      }
    }
    fetchInterviews();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Scheduled Interviews</h2>
      {interviews.length === 0 ? (
        <p>No interviews scheduled yet.</p>
      ) : (
        <ul className="space-y-2">
          {interviews.map((interview) => (
            <li
              className="p-4 border border-gray-300 rounded"
              key={interview.id}
            >
              <h3 className="font-bold">{interview.title}</h3>
              <p>
                {interview.date} at {interview.time}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InterviewList;
