import { useEffect, useState } from "react";
import API from "../services/api";

function ScheduleInterview({ myId }) {
  const [formData, setFormData] = useState({
    recruiterId: "",
    candidateId: "",
    date: "",
    time: "",
    questionIds: [],
  });

  const [candidates, setCandidates] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [candidateRes, questionRes] = await Promise.all(
          API.get("/users/candidates", config),
          API.get("/questions", config)
        );

        setCandidates(candidateRes.data);
        setQuestions(questionRes.data);
      } catch (error) {
        setError(`Error: ${error}`);
      }
    }
    fetchData();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await API.post("/interviews", formData, config);
      setSuccess(true);
      setFormData({ recruiterId: myId, candidateId: "", date: "", time: "" });
    } catch (error) {
      alert(`Error: ${error}`);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto p-4 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Schedule an Interview</h2>
        {success && (
          <p className="text-green-500">Interview scheduled successfully!</p>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              name="title"
              placeholder="Interview Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            type="submit"
          >
            Schedule
          </button>
        </form>
      </div>
    </div>
  );
}

export default ScheduleInterview;
