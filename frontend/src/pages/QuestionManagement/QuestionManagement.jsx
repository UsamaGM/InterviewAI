import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/api";
import QuestionForm from "./QuestionForm";
// import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { FaPen, FaTrash } from "react-icons/fa";

function QuestionManagement() {
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const questionsRes = await API.get("/questions");
        setQuestions(questionsRes.data);

        setLoading(false);
      } catch (error) {
        toast.error(
          error.code === "ERR_NETWORK"
            ? "Network Error! Please try later."
            : error.response.data.message,
          { position: "top-right" }
        );
      }
    }
    fetchData();
  }, []);

  const [headStyle, rowStyle] = useMemo(
    () => [
      "px-4 py-2 text-sm font-semibold text-accentContrast border-none",
      "px-4 py-2 text-dark text-sm",
    ],
    []
  );

  async function addQuestion(questionData) {
    try {
      const questionRes = await API.post("/questions", questionData);
      setQuestions([...questions, questionRes.data]);

      toast.success("Question added successfully!");
    } catch (error) {
      toast.error(
        error.code === "ERR_NETWORK"
          ? "Network Error! Please try later."
          : error.response?.data?.message || "Failed to add question."
      );
    }
  }

  async function updateQuestion(questionData) {
    try {
      questionData._id = selectedQuestion._id;
      const questionRes = await API.put("questions", questionData);

      setQuestions((prev) =>
        prev.map((q) => (q._id === questionRes.data._id ? questionRes.data : q))
      );

      toast.success("Question updated successfully!");
    } catch (error) {
      toast.error("Failed to update question." + error.message);
    }
  }

  async function deleteQuestion() {
    try {
      await API.delete(`/questions/${selectedQuestion._id}`);
      setQuestions((prev) =>
        prev.filter((q) => q._id !== selectedQuestion._id)
      );
      setShowDeleteModal(false);
      toast.success("Question deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete question." + error.message);
    }
  }

  const filteredQuestions = questions.filter(
    (q) =>
      (q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === "" || q.category === selectedCategory) &&
      (selectedDifficulty === "" || q.difficulty === selectedDifficulty)
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 min-h-[calc(100vh-4.5rem)] text-dark bg-gradient-to-tl from-tertiary/25 via-secondary/25 to-accent/25">
      <h2 className="text-2xl font-bold mb-4">Question Management</h2>

      {/* Add Question */}
      <button
        className="px-4 py-2 bg-accent hover:bg-accent/80 text-white font-bold rounded-md shadow-md shadow-shadowDark mb-4"
        onClick={() => setShowAddModal(true)}
      >
        Add Question
      </button>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-4 max-h-20">
        <input
          type="text"
          placeholder="Search questions..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 outline-accent bg-white/55 backdrop-blur-md text- rounded-lg border-none shadow-md shadow-shadowDark w-1/3"
        />
        <select
          className="border px-3 py-2 outline-accent bg-white/55 backdrop-blur-md rounded-lg border-none shadow-md shadow-shadowDark w-1/3"
          name="category"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Filter by Category</option>
          <option value="GK">General Knowledge</option>
          <option value="Business">Business</option>
          <option value="IT">IT</option>
          <option value="Science">Science</option>
        </select>
        <select
          className="border px-3 py-2 outline-accent bg-white/55 backdrop-blur-md rounded-lg border-none shadow-md shadow-shadowDark w-1/3"
          name="difficulty"
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="">Filter by Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Question List */}
      <div className="overflow-x-auto border-none pb-2">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-accent">
            <tr>
              <th className={headStyle}>Question</th>
              <th className={headStyle}>Answer</th>
              <th className={headStyle}>Category</th>
              <th className={headStyle}>Difficulty</th>
              <th className={headStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((question) => (
              <tr key={question._id}>
                <td className={rowStyle}>{question.question}</td>
                <td className={rowStyle}>{question.answer}</td>
                <td className={rowStyle}>{question.category}</td>
                <td className={rowStyle}>{question.difficulty}</td>
                <td>
                  <div className="flex justify-center items-center gap-4">
                    <FaPen
                      className="text-blue-400 cursor-pointer hover:scale-150 transition-all duration-300 size-3"
                      onClick={() => {
                        setSelectedQuestion(question);
                        setShowEditModal(true);
                      }}
                    />
                    <FaTrash
                      className="text-red-500 cursor-pointer hover:scale-150 transition-all duration-300 size-3"
                      onClick={() => {
                        setSelectedQuestion(question);
                        setShowDeleteModal(true);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <QuestionForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={addQuestion}
      />
      <QuestionForm
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        question={selectedQuestion}
        onSave={updateQuestion}
      />
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/25 flex justify-center items-center">
          <div className="max-w-xl w-full bg-accent/25 backdrop-blur-md font-bold p-6 rounded-lg flex flex-col gap-4 shadow-md shadow-shadowDark">
            <p className="text-accentContrast text-xl">
              Delete the selected question?
            </p>
            <p className="text-red-100 text-md">{selectedQuestion.question}</p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-primary/25 text-primaryContrast hover:bg-primary/50 transition-all duration-200 backdrop-blur-md px-4 py-2 rounded-lg"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500/25 text-accentContrast hover:bg-red-500/50 transition-all duration-200 backdrop-blur-md px-4 py-2 rounded-lg"
                onClick={deleteQuestion}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionManagement;
