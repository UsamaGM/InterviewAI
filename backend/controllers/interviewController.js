const Interview = require("../models/interviewModel.js");
const User = require("../models/userModel.js");
const Question = require("../models/questionModel.js");

const scheduleInterview = async (req, res) => {
  const { recruiterId, candidateId, date, time, questionIds } = req.body;

  try {
    const recruiter = await User.findById(recruiterId);
    const candidate = await User.findById(candidateId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    if (!recruiter || !candidate) {
      return res
        .status(404)
        .json({ message: "Recruiter or Candidate not found" });
    }

    const interview = await Interview.create({
      recruiter: recruiterId,
      candidate: candidateId,
      date,
      time,
      questions: questions.map((question) => question._id),
    });

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserInterviews = async (req, res) => {
  const userId = req.body.id;

  try {
    const interviews = await Interview.find({
      $or: [{ recruiter: userId }, { candidate: userId }],
    })
      .populate("recruiter", "name email")
      .populate("candidate", "name email")
      .populate("questions");

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { scheduleInterview, getUserInterviews };
