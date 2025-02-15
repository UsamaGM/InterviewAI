import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";
import API from "../../services/api";

import "react-datepicker/dist/react-datepicker.css";

function InterviewForm({ isOpen, onSubmit, onClose, interview }) {
  const [formData, setFormData] = useState({
    title: "",
    recruiter: "",
    candidates: [],
    questions: [],
    date: new Date(),
    time: "",
  });

  const [candidates, setCandidates] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, candidatesRes, questionsRes] = await Promise.all([
          API.get("/users"),
          API.get("/candidates"),
          API.get("/questions"),
        ]);

        setCandidates(
          candidatesRes.data.map((candidate) => ({
            value: candidate._id,
            label: candidate.name,
          }))
        );

        setQuestions(
          questionsRes.data.map((question) => ({
            value: question._id,
            label: question.question,
          }))
        );

        setFormData((prev) =>
          interview
            ? {
                title: interview.title,
                recruiter: interview.recruiter._id,
                candidates: interview.candidates.map((c) => c._id),
                questions: interview.questions.map((q) => q._id),
                date: interview.date,
                time: interview.time,
              }
            : { ...prev, recruiter: userRes.data._id }
        );
      } catch (error) {
        console.error(error);
        toast.error(
          error.code === "ERR_NETWORK"
            ? "Network Error! Please try later."
            : error.response?.data?.message || "An error occurred."
        );
      }
    }

    fetchData();
  }, [interview]);

  function handleInputChange(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({
      title: "",
      recruiter: "",
      candidates: [],
      questions: [],
      date: new Date(),
      time: "",
    });
  }

  if (!isOpen) return null;

  const selectedCandidates = candidates.filter((candidate) =>
    formData.candidates.includes(candidate.value)
  );
  const selectedQuestions = questions.filter((question) =>
    formData.questions?.includes(question.value)
  );

  return (
    <div className="fixed inset-0 min-h-screen flex justify-center items-center bg-dark/25">
      <div className="max-w-lg w-full bg-secondary/25 backdrop-blur-md rounded-lg shadow-lg shadow-shadowDark p-6">
        <h2 className="text-2xl font-bold text-center text-dark mb-6">
          Schedule an Interview
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/*Title Input*/}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-bold text-dark mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="HR Recruitment"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="px-3 py-2 rounded-lg shadow-md shadow-shadowDark bg-light text-dark outline-none w-full"
              required
            />
          </div>

          {/*Date Input*/}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-bold text-dark mb-1"
            >
              Date
            </label>
            <DatePicker
              id="date"
              placeholderText="Select a date"
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              selected={formData.date}
              onChange={(selected) => handleInputChange("date", selected)}
              className="px-3 py-2 rounded-lg shadow-md shadow-shadowDark bg-light text-dark outline-none w-full"
              required
            />
          </div>

          {/*Time Input*/}
          <div>
            <label
              htmlFor="time"
              className="block text-sm font-bold text-dark mb-1"
            >
              Time
            </label>
            <input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              className="w-full px-3 py-2 rounded-lg shadow-md shadow-shadowDark"
              required
            />
          </div>

          {/*Candidates Selector*/}
          <div>
            <label
              htmlFor="candidates"
              className="block text-sm font-bold text-dark mb-1"
            >
              Candidates
            </label>
            <Select
              id="candidates"
              placeholder="Select a candidate..."
              options={candidates}
              value={selectedCandidates}
              onChange={(selected) =>
                handleInputChange(
                  "candidates",
                  selected.map((s) => s.value) || []
                )
              }
              className="shadow-md shadow-shadowDark"
              isMulti
              isClearable
              required
            />
          </div>

          {/*Questions Selector*/}
          <div>
            <label
              htmlFor="questions"
              className="block text-sm font-bold text-dark mb-1"
            >
              Questions
            </label>
            <Select
              id="question"
              placeholder="Select questions..."
              options={questions}
              value={selectedQuestions}
              onChange={(selected) =>
                handleInputChange(
                  "questions",
                  selected.map((s) => s.value) || []
                )
              }
              className="shadow-md shadow-shadowDark"
              isMulti
              required
            />
          </div>
          <div className="flex justify-end gap-4 font-bold">
            <button
              className="bg-gray-500/45 backdrop-blur-md text-light hover:bg-gray-500/65 transition-all duration-200 px-4 py-2 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-accent/45 backdrop-blur-md text-accentContrast hover:bg-accent/65 transition-all duration-200 px-4 py-2 rounded-md"
              type="submit"
            >
              {interview ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

InterviewForm.propTypes = {
  isOpen: PropTypes.bool,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  interview: PropTypes.object,
};

export default InterviewForm;
