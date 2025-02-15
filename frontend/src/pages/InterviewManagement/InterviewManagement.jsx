import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { BallTriangle } from "react-loader-spinner";
import { FaPen, FaTrash } from "react-icons/fa";
import FilterRow from "./FilterRow";
import InterviewForm from "./InterviewForm";
import CandidateCell from "./CandidateCell";
import { formatDate, formatTime } from "../../utils/dateTimeFormatter";
import {
  fetchInterviews,
  addInterview as addInterviewService,
  updateInterview as updateInterviewService,
  deleteInterview as deleteInterviewService,
} from "../../services/interviewService";

function InterviewManagement() {
  const [interviews, setInterviews] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({});
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInterviews() {
      try {
        const data = await fetchInterviews();
        setInterviews(data);
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    }
    loadInterviews();
  }, []);

  async function addInterview(interviewData) {
    try {
      const newInterview = await addInterviewService(interviewData);
      setInterviews([...interviews, newInterview]);
      toast.success("Interview scheduled successfully!");
    } catch (error) {
      handleError(error);
    }
  }

  async function updateInterview(interviewData) {
    try {
      const updatedInterview = await updateInterviewService(
        selectedInterview._id,
        interviewData
      );
      const mappedInterviews = interviews.map((i) =>
        i._id === selectedInterview._id ? updatedInterview : i
      );
      setInterviews(mappedInterviews);
      toast.success("Successfully updated interview.");
    } catch (error) {
      handleError(error);
    }
  }

  async function deleteInterview() {
    try {
      await deleteInterviewService(selectedInterview._id);
      toast.success("Interview deleted successfully!");
      setInterviews(interviews.filter((i) => i._id !== selectedInterview._id));
    } catch (error) {
      handleError(error);
    } finally {
      setShowDeleteModal(false);
    }
  }

  const filteredInterviews = useMemo(() => {
    let result = interviews;

    if (filterCriteria.title) {
      result = result.filter((i) =>
        i.title.toLowerCase().includes(filterCriteria.title.toLowerCase())
      );
    }
    if (filterCriteria.candidate) {
      result = result.filter((i) =>
        i.candidates.some((c) =>
          c.name.toLowerCase().includes(filterCriteria.candidate.toLowerCase())
        )
      );
    }
    if (filterCriteria.status) {
      result = result.filter(
        (i) => i.status.toLowerCase() === filterCriteria.status.toLowerCase()
      );
    }
    if (filterCriteria.dateFrom) {
      result = result.filter((i) => i.date >= filterCriteria.dateFrom);
    }
    if (filterCriteria.dateTo) {
      result = result.filter((i) => i.date <= filterCriteria.dateTo);
    }

    return result;
  }, [interviews, filterCriteria]);

  function filterInterviews(criteria) {
    setFilterCriteria(criteria);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BallTriangle />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4.5rem)] w-full bg-gradient-to-bl from-accent/25 to-secondary/25 space-y-4 p-6">
      {/*Add Interview*/}
      <button
        className="bg-primary/80 text-primaryContrast hover:bg-primary border-none shadow-md shadow-shadowDark rounded-md transition-all duration-200 px-4 py-2"
        onClick={() => setShowAddModal(true)}
      >
        Add Interview
      </button>

      <FilterRow submitFunction={filterInterviews} />

      <table className="table-auto w-full">
        <thead className="bg-accent">
          <tr className="text-left">
            <th>Title</th>
            <th>Date</th>
            <th>Time</th>
            <th>Candidates</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInterviews.map((interview) => (
            <tr key={interview._id}>
              <td>{interview.title}</td>
              <td>{formatDate(interview.date)}</td>
              <td>{formatTime(interview.time)}</td>
              <CandidateCell candidates={interview.candidates} />
              <td>{interview.status}</td>
              <td>
                <div className="flex items-center gap-4">
                  <FaPen
                    onClick={() => {
                      setSelectedInterview(interview);
                      setShowEditModal(true);
                    }}
                    className="cursor-pointer text-primary/75 hover:text-primary transition-all duration-200 size-4"
                  />
                  <FaTrash
                    onClick={() => {
                      setSelectedInterview(interview);
                      setShowDeleteModal(true);
                    }}
                    className="cursor-pointer text-red-500/75 hover:text-red-500 transition-all duration-200 size-4"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <InterviewForm
        isOpen={showAddModal}
        onSubmit={addInterview}
        onClose={() => setShowAddModal(false)}
      />
      <InterviewForm
        interview={selectedInterview}
        isOpen={showEditModal}
        onSubmit={updateInterview}
        onClose={() => setShowEditModal(false)}
      />
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-dark">
              Cancel Interview
            </h2>
            <p className="text-lg mb-4">
              Are you sure you want to cancel{" "}
              <span className="font-semibold">{selectedInterview.title}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg mr-4"
                onClick={deleteInterview}
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

function handleError(error) {
  toast.error(
    error.code === "ERR_NETWORK"
      ? "Network Error! Please try later."
      : error.response?.data?.message || "An error occurred.",
    { position: "top-right" }
  );
}

export default InterviewManagement;
