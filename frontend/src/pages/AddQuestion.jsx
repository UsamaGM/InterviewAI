import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineFieldTime, AiOutlineQuestion } from "react-icons/ai";
import Select from "react-select";
import RoundedButton from "../components/RoundedButton";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import "react-datepicker/dist/react-datepicker.css";
import InputBox from "../components/InputBox";

function AddQuestion() {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    difficulty: null,
    category: null,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const difficulties = useMemo(
    () => [
      { label: "Easy", value: "easy" },
      { label: "Medium", value: "medium" },
      { label: "Hard", value: "hard" },
    ],
    []
  );
  const categories = useMemo(
    () => [
      { label: "IT", value: "IT" },
      { label: "General Knowledge", value: "GK" },
      { label: "Business", value: "Business" },
      { label: "Science", value: "Science" },
    ],
    []
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await API.get("/users");

        if (userRes.data.role !== "recruiter") {
          toast.error("You are not authorized to access this page.");
          navigate("/");
        }
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
    if (!formData.difficulty) newErrors.difficulty = "Select one option.";
    if (!formData.answer) newErrors.answer = "Answer is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    console.log(formData);

    try {
      await API.post("/questions", {
        ...formData,
      });

      toast.success("Question added successfully!");

      setFormData({
        question: "",
        answer: "",
        difficulty: null,
        category: null,
      });
      setErrors({});
    } catch (error) {
      toast.error(
        error.code === "ERR_NETWORK"
          ? "Network Error! Please try later."
          : error.response?.data?.message || "Failed to add question."
      );
    }
  }

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center bg-gradient-to-tr from-tertiary/30 to-primary/30 p-5">
      <div className="max-w-lg w-full mx-auto bg-accentLight/20 backdrop-blur-lg rounded-3xl shadow-lg shadow-shadowDark p-6">
        <h2 className="text-2xl font-bold text-center text-dark mb-6">
          Add a new Question
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Question Input */}
          <InputBox
            label="Question"
            name="question"
            type="text"
            icon={AiOutlineQuestion}
            value={formData.question}
            onChange={(e) => handleInputChange("question", e.target.value)}
          />
          {errors.question && (
            <p className="text-red-500 text-xs mt-1">{errors.question}</p>
          )}

          {/* Answer Input */}
          <InputBox
            label="Answer"
            name="answer"
            type="text"
            icon={AiOutlineFieldTime}
            value={formData.answer}
            onChange={(e) => handleInputChange("answer", e.target.value)}
          />
          {errors.time && (
            <p className="text-red-500 text-xs mt-1">{errors.time}</p>
          )}

          {/* Difficulty Selector */}
          <div>
            <label
              htmlFor="difficulty"
              className="block text-sm font-bold text-dark mb-1"
            >
              Difficulty
            </label>
            <Select
              isClearable
              options={difficulties}
              placeholder="Select difficulty..."
              className="shadow-md shadow-shadowDark"
              onChange={(s) => handleInputChange("difficulty", s.value)}
            />
            {errors.difficulties && (
              <p className="text-red-500 text-xs mt-1">{errors.difficulties}</p>
            )}
          </div>

          {/* Question Selector */}
          <div>
            <label className="block text-sm font-bold text-dark mb-1">
              Category
            </label>
            <Select
              isClearable
              options={categories}
              placeholder="Select category"
              className="shadow-md shadow-shadowDark"
              onChange={(s) => handleInputChange("category", s.value)}
            />
          </div>

          {/* Buttons */}
          <RoundedButton
            className="bg-secondary hover:bg-secondary/80 transition-all duration-300"
            title="Add Question"
            submitButton
          />
        </form>
      </div>
    </div>
  );
}

export default AddQuestion;
