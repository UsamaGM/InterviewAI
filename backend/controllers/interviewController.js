const { default: mongoose } = require("mongoose");
const Interview = require("../models/interviewModel.js");
const User = require("../models/userModel.js");
const { createLog } = require("../utils/logger.js");

const getInterviews = async (req, res) => {
  try {
    const user = await User.findById(req.id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const interviews = await Interview.find({ recruiter: user._id })
      .populate("candidates recruiter", "_id name email")
      .populate("questions", "_id question difficulty category");
    res.json(interviews);

    await createLog(
      "fetch_interviews",
      user._id,
      `Fetched interview for ${user._id}`,
      {}
    );
  } catch (error) {
    res.status(500).json({ message: "Error fetching interviews" + error });
  }
};

const createInterview = async (req, res) => {
  try {
    const { title, recruiter, candidates, questions, date, time } = req.body;

    console.log(req.body);

    const newInterview = new Interview({
      title,
      recruiter,
      candidates,
      questions,
      date,
      time,
    });

    await newInterview.save();
    await createLog(
      "interview_scheduled",
      req.id,
      `An interview was created by user ${req.id}`,
      { id: newInterview._id }
    );
    res.status(201).json(newInterview);
  } catch (error) {
    res.status(500).json({ message: "Error creating interview" });
  }
};

const updateInterview = async (req, res) => {
  try {
    const { id } = req;
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedInterview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedInterview);
  } catch (error) {
    res.status(500).json({ message: "Error updating interview" });
  }
};

const deleteInterview = async (req, res) => {
  console.log("Here");
  try {
    const { id } = req.params;
    const user = await User.findById(req.id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await Interview.findByIdAndDelete(id);
    res.status(204).json({ message: "Interview deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting interview" });
  }
};

//TODO:Cancel Interview
// const cancelInterview = async (req, res) => {
//   try {
//     const { id } = req;

//     const user = await User.findById(id);

//   } catch (error) {}
// };

module.exports = {
  getInterviews,
  createInterview,
  updateInterview,
  deleteInterview,
};
