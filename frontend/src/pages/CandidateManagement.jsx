import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { BallTriangle } from "react-loader-spinner";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import CandidateForm from "../components/CandidateForm";
import API from "../services/api";
import { Navigate } from "react-router-dom";

function CandidateManagement() {
  const [candidates, setCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    minExperience: "",
    role: null,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await API.get("/users");

        if (!userRes.data) {
          toast.error("You are not authorized to access this page.");
          Navigate()("/");
        }
        const candidatesRes = await API.get("/candidates");
        setCandidates(candidatesRes.data);
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

  const headStyle = useMemo(() => "p-4 text-sm font-semibold text-dark", []);
  const rowStyle = useMemo(() => "p-4 text-dark", []);

  async function addCandidate(candidateData) {
    try {
      const candidateRes = await API.post("/candidates", candidateData);
      const newCandidate = candidateRes.data;
      setCandidates([...candidates, newCandidate]);
    } catch (error) {
      toast.error("Failed to add candidate " + error.message);
    }
  }

  async function updateCandidate(candidateData) {
    try {
      const adjustedCandidate = {
        ...candidateData,
        skills: candidateData.skills.split(", "),
      };

      await API.put("/candidates", candidateData);

      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate._id === adjustedCandidate._id
            ? adjustedCandidate
            : candidate
        )
      );
    } catch (error) {
      toast.error("Failed to update candidate " + error.message);
    }
  }

  async function deleteCandidate() {
    try {
      await API.delete(`/candidates/${selectedCandidate._id}`);
      const updatedCandidates = candidates.filter(
        (candidate) => candidate._id !== selectedCandidate._id
      );
      setCandidates(updatedCandidates);
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete candidate " + error.message);
    }
  }

  async function filterCandidates(e) {
    e.preventDefault();
    try {
      const filteredRes = await API.get(
        `/candidates/search?name=${searchQuery.name}&role=${searchQuery.role}&minExperience=${searchQuery.minExperience}`
      );
      console.log(filteredRes.data);
      setCandidates(filteredRes.data);
      setSearchQuery({
        name: "",
        minExperience: "",
        role: null,
      });
    } catch (error) {
      toast.error("Failed to filter candidates" + error);
    }
  }

  function handleQueryChange(e) {
    setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
  }

  if (loading) return <BallTriangle />;

  return (
    <div className="p-6 bg-gradient-to-tl from-primary/35 to-secondary/35 min-h-[calc(100vh-4.5rem)]">
      <h2 className="text-2xl font-bold mb-4 text-dark">
        Candidate Management
      </h2>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mb-4 rounded-lg"
        onClick={() => setShowAddModal(true)}
      >
        Add Candidate
      </button>
      <form className="flex items-center mb-4" onSubmit={filterCandidates}>
        <input
          className="w-1/3 mx-1 rounded-md outline-accent py-1 px-3 shadow-md shadow-shadowDark"
          name="name"
          placeholder="Search by name"
          type="text"
          value={searchQuery.name}
          onChange={handleQueryChange}
        />
        <input
          className="w-1/3 mx-1 rounded-md outline-accent py-1 px-3 shadow-md shadow-shadowDark"
          name="minExperience"
          placeholder="Minimum Experience"
          type="number"
          value={searchQuery.minExperience}
          onChange={handleQueryChange}
        />
        <Select
          className="w-1/3 mx-1"
          options={[{ label: "Frontend Developer", value: "frontend" }]}
          name="role"
          onChange={(s) =>
            handleQueryChange({
              target: {
                name: "role",
                value: s.value,
              },
            })
          }
        />
        <button type="submit">Filter</button>
      </form>
      <table className="w-full table-auto text-left border-collapse">
        <thead className="bg-accent/25">
          <tr>
            <th className={headStyle}>Name</th>
            <th className={headStyle}>Email</th>
            <th className={headStyle}>Applied Role</th>
            <th className={headStyle}>Experience</th>
            <th className={headStyle}>Skills</th>
            <th className={headStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate._id}>
              <td className={rowStyle}>{candidate.name}</td>
              <td className={rowStyle}>{candidate.email}</td>
              <td className={rowStyle}>{candidate.appliedRole}</td>
              <td className={rowStyle}>{candidate.experience}</td>
              <td className={rowStyle}>{candidate.skills.join(",")}</td>
              <td className={rowStyle}>
                <div className="flex items-center gap-4">
                  <AiFillEdit
                    className="text-blue-500 cursor-pointer hover:scale-150 transition-all duration-300 size-7"
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setShowEditModal(true);
                    }}
                  />
                  <AiFillDelete
                    className="text-red-500 cursor-pointer hover:scale-150 transition-all duration-300 size-7"
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setShowDeleteModal(true);
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CandidateForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={addCandidate}
      />
      <CandidateForm
        candidate={selectedCandidate}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={updateCandidate}
      />
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-dark">
              Delete Candidate
            </h2>
            <p className="text-lg mb-4">
              Are you sure you want to delete candidate{" "}
              <span className="font-semibold">{selectedCandidate.name}</span>?
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
                onClick={deleteCandidate}
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

export default CandidateManagement;
