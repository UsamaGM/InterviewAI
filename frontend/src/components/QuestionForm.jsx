import { useEffect, useMemo, useState } from "react";
import InputBox from "./InputBox";
import PropTypes from "prop-types";

import "react-datepicker/dist/react-datepicker.css";

function QuestionForm({ isOpen, onClose, onSave, question }) {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    difficulty: "",
  });

  useEffect(() => {
    if (question) {
      setFormData({
        question: question.question,
        answer: question.answer,
        category: question.category,
        difficulty: question.difficulty,
      });
    }
  }, [question]);

  const difficulties = useMemo(
    () => [
      { label: "Easy", value: "Easy" },
      { label: "Medium", value: "Medium" },
      { label: "Hard", value: "Hard" },
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

  function handleInputChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    onSave(formData);
    onClose();
    setFormData({
      question: "",
      answer: "",
      category: "",
      difficulty: "",
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-dark/25 flex justify-center items-center">
      <div className="max-w-lg w-full bg-accent/25 backdrop-blur-md rounded-xl shadow-lg shadow-shadowDark p-6">
        <h2 className="text-2xl font-bold text-dark mb-6">
          Add a new Question
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <InputBox
            label="Question"
            name="question"
            placeholder="Who added this question?"
            type="text"
            required
            value={formData.question}
            onChange={handleInputChange}
          />
          <InputBox
            label="Answer"
            name="answer"
            placeholder="I do not know!"
            type="text"
            required
            value={formData.answer}
            onChange={handleInputChange}
          />
          <div className="mb-4">
            <label
              className="block text-dark text-sm font-bold mb-1"
              htmlFor="category"
            >
              Category
            </label>
            <select
              className="w-full border-none bg-light shadow-md shadow-shadowDark px-5 py-2 rounded-md focus:outline-accent"
              name="category"
              id="category"
              required
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-dark text-sm font-bold mb-1"
              htmlFor="difficulty"
            >
              Difficulty
            </label>
            <select
              className="w-full border-none bg-light shadow-md shadow-shadowDark px-5 py-2 rounded-md focus:outline-accent"
              name="difficulty"
              id="difficulty"
              required
              value={formData.difficulty}
              onChange={handleInputChange}
            >
              <option value="">Select A difficulty level</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button
              className="bg-accent/45 backdrop-blur-md text-accentContrast hover:bg-accent/65 font-bold px-4 py-2 rounded-lg"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="bg-secondary/45 backdrop-blur-md text-secondaryContrast hover:bg-secondary/65 font-bolt px-4 py-2 rounded-lg"
              type="submit"
            >
              {question ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

QuestionForm.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  question: PropTypes.object,
};

export default QuestionForm;
