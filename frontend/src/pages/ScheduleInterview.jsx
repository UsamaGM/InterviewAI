import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AiFillCalendar } from "react-icons/ai";
import Select from "react-select";
import DatePicker from "react-datepicker";
import RoundedButton from "../components/RoundedButton";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import PropTypes from "prop-types";

import "react-datepicker/dist/react-datepicker.css";

function ScheduleInterviewPage() {
  const [formData, setFormData] = useState({
    recruiterId: "",
    date: null,
    time: "",
    candidateIds: [],
    questionIds: [],
  });

  const [candidates, setCandidates] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, candidatesRes, questionsRes] = await Promise.all([
          API.get("/users"),
          API.get("/users/candidates"),
          API.get("/questions"),
        ]);

        if (userRes.data.role !== "recruiter") {
          toast.error("You are not authorized to access this page.");
          navigate("/");
        }

        setCandidates(
          candidatesRes.data.map((candidate) => ({
            value: candidate._id,
            label: candidate.username,
          }))
        );

        setQuestions(
          questionsRes.data.map((question) => ({
            value: question._id,
            label: question.question,
          }))
        );

        setFormData((prev) => ({ ...prev, recruiterId: userRes.data._id }));
      } catch (error) {
        toast.error(
          error.code === "ERR_NETWORK"
            ? "Network Error! Please try later."
            : error.response?.data?.message || "An error occurred."
        );
      }
    }

    fetchData();
  }, [navigate]);

  function handleInputChange(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.candidateIds)
      newErrors.candidateId = "Candidate is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    if (!formData.time) newErrors.time = "Time is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await API.post("/interviews", {
        ...formData,
        questionIds: formData.questionIds.map((q) => q.value),
      });

      toast.success("Interview scheduled successfully!");

      setFormData({
        recruiterId: formData.recruiterId,
        candidateId: "",
        date: null,
        time: "",
        questionIds: [],
      });
      setErrors({});
    } catch (error) {
      toast.error(
        error.code === "ERR_NETWORK"
          ? "Network Error! Please try later."
          : error.response?.data?.message || "Failed to schedule interview."
      );
    }
  }

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center bg-gradient-to-tr from-primary/25 to-tertiary/25 p-6">
      <div className="max-w-lg w-full mx-auto bg-primary/25 backdrop-blur-md rounded-3xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-dark mb-6">
          Schedule an Interview
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1">
              Date
            </label>
            <DatePicker
              selected={formData.date}
              onChange={(date) => handleInputChange("date", date)}
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              className="px-3 py-2 rounded-lg shadow-md shadow-shadowDark bg-light text-dark outline-none w-full"
              placeholderText="Select a date"
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}
          </div>

          {/* Time Input */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1">
              Time
            </label>
            <input
              type="time"
              className="w-full px-3 py-2 rounded-lg shadow-md shadow-shadowDark"
              value={formData.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
            />
            {errors.time && (
              <p className="text-red-500 text-xs mt-1">{errors.time}</p>
            )}
          </div>

          {/* Candidate Selector */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1">
              Candidate
            </label>
            <Select
              options={candidates}
              isMulti
              placeholder="Select a candidate..."
              onChange={(selected) =>
                handleInputChange(
                  "candidateIds",
                  selected.map((s) => s.value) || []
                )
              }
              isClearable
              className="shadow-md shadow-shadowDark"
            />
            {errors.candidateId && (
              <p className="text-red-500 text-xs mt-1">{errors.candidateId}</p>
            )}
          </div>

          {/* Question Selector */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1">
              Questions
            </label>
            <Select
              options={questions}
              isMulti
              placeholder="Select questions..."
              onChange={(selected) =>
                handleInputChange("questionIds", selected || [])
              }
              className="shadow-md shadow-shadowDark"
            />
          </div>

          {/* Buttons */}
          <RoundedButton
            className="bg-accent hover:bg-accentLight"
            icon={AiFillCalendar}
            title="Schedule Interview"
            submitButton
          />
        </form>
      </div>
    </div>
  );
}

ScheduleInterviewPage.propTypes = {
  onClose: PropTypes.func,
};

export default ScheduleInterviewPage;
