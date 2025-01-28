const { default: mongoose } = require("mongoose");
const Candidate = require("../models/candidateModel.js");

//get all candidates
const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//add a new candidate
const addCandidate = async (req, res) => {
  try {
    const { name, email, appliedRole, experience, skills, resumeUrl } =
      req.body;
    const candidate = await Candidate.create({
      name,
      email,
      appliedRole,
      experience,
      skills,
      resumeUrl,
    });
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//edit a candidate
const editCandidate = async (req, res) => {
  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.body._id,
      req.body
    );

    res.json(updatedCandidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete a candidate
const deleteCandidate = async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Candidate deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//search and filter candidates
const searchAndFilterCandidates = async (req, res) => {
  try {
    const { name, role, minExperience } = req.query;
    const query = {};

    if (name !== "") query.name = { $regex: name, $options: "i" };
    if (role !== "null") query.appliedRole = { $regex: role, $options: "i" };
    if (minExperience !== "")
      query.experience = { $gte: Number(minExperience) };

    const candidates = await Candidate.find(query);

    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCandidates,
  addCandidate,
  editCandidate,
  deleteCandidate,
  searchAndFilterCandidates,
};
