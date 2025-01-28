import { useEffect, useState } from "react";
import InputBox from "./InputBox";
import PropTypes from "prop-types";

function CandidateForm({ candidate, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    appliedRole: "",
    experience: "",
    skills: "",
  });

  useEffect(() => {
    if (candidate) {
      setFormData({ ...candidate, skills: candidate.skills.join(", ") });
    }
  }, [candidate]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSumbit(e) {
    e.preventDefault();
    onSave(formData);
    onClose();
    setFormData({
      name: "",
      email: "",
      appliedRole: "",
      experience: "",
      skills: "",
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white/25 backdrop-blur-md p-6 rounded-xl shadow-md shadow-shadowDark max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add Candidate</h2>
        <form className="space-y-4" onSubmit={handleSumbit}>
          <InputBox
            label="Name"
            name="name"
            placeholder="John Doe"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <InputBox
            label="Email"
            name="email"
            placeholder="johndoe@gmail.com"
            type="text"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <InputBox
            label="Applied Role"
            name="appliedRole"
            placeholder="Frontend Developer"
            type="text"
            value={formData.appliedRole}
            onChange={handleChange}
            required
          />
          <InputBox
            label="Experience (Years)"
            name="experience"
            placeholder="10"
            type="number"
            value={formData.experience}
            onChange={handleChange}
            required
          />
          <InputBox
            label="Skills"
            name="skills"
            placeholder="JavaScript, ReactJS, TailwindCSS, MaterialUI"
            type="text"
            value={formData.skills}
            onChange={handleChange}
            required
          />
          <div className="flex justify-end">
            <button
              className="bg-accent/25 hover:bg-accent/40 backdrop-blur-md text-dark px-2 py-1 rounded-md mr-2"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-primary/25 hover:bg-primary/40 backdrop-blur-md text-dark px-2 py-1 rounded-md"
              type="submit"
            >
              {candidate ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CandidateForm.propTypes = {
  candidate: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};

export default CandidateForm;
