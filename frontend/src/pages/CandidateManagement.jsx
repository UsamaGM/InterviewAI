import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { BallTriangle } from "react-loader-spinner";
import AddCandidateModal from "../components/AddCandidateModal";
import API from "../services/api";

function CandidateManagement() {
  const [candidates, setCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    name: null,
    minExperience: null,
    role: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const candidatesRes = await API.get("/candidates");
        setCandidates(candidatesRes.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
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

  async function filterCandidates(e) {
    e.preventDefault();
    console.log(searchQuery);
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
    <div className="p-6 bg-gradient-to-tl from-primary/25 to-secondary/25 min-h-[calc(100vh-4.5rem)]">
      <h2 className="text-2xl font-bold mb-4 text-dark">
        Candidate Management
      </h2>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mb-4 rounded-lg"
        onClick={() => setShowModal(true)}
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
              <td>
                <button className="text-blue-500 hover:underline mr-4">
                  Edit
                </button>
                <button className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddCandidateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={addCandidate}
      />
    </div>
  );
}

export default CandidateManagement;
