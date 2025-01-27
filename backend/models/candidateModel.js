const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  appliedRole: { type: String, required: true },
  experience: { type: Number, required: true }, // Years of experience
  skills: [String], // Array of skill keywords
  resumeUrl: { type: String }, // Optional field for uploaded resumes
});

module.exports = mongoose.model("Candidate", CandidateSchema);
