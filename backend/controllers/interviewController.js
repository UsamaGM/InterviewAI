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
  const userId = req.id;

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

const updateInterview = async (req, res) => {
  const { date, time, questionIds } = req.body;
  const interviewId = req.params.id;

  try {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (String(interview.recruiter) !== req.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this interview" });
    }

    interview.date = date || interview.date;
    interview.time = time || interview.time;

    if (questionIds) {
      const questions = await Question.find({ _id: { $in: questionIds } });
      interview.questions = questions.map((question) => question._id);
    }

    const updatedInterview = await interview.save();
    res.json(updatedInterview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelInterview = async (req, res) => {
  const interviewId = req.params.id;

  try {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (String(interview.recruiter) !== req.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to cancel this interview" });
    }

    interview.status = "Cancelled";
    const canceledInterview = await interview.save();
    res.json({ message: "Interview cancelled", canceledInterview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  scheduleInterview,
  getUserInterviews,
  updateInterview,
  cancelInterview,
};
