const Interview = require("../models/interviewModel.js");
const User = require("../models/userModel.js");
const Question = require("../models/questionModel.js");
const { createLog } = require("../utils/logger.js"); // Import log utility

const scheduleInterview = async (req, res) => {
  const { recruiterId, candidateIds, date, time, questionIds } = req.body;

  try {
    console.log(candidateIds);
    const recruiter = await User.findById(recruiterId);
    const candidates = await User.find({
      _id: { $in: candidateIds },
    });
    console.log(candidates);
    const questions = await Question.find({ _id: { $in: questionIds } });

    if (!recruiter || candidates.length === 0) {
      return res
        .status(404)
        .json({ message: "Recruiter or Candidates not found" });
    }

    const interview = await Interview.create({
      recruiter: recruiterId,
      candidates: candidateIds,
      date: date,
      time,
      questions: questions.map((question) => question._id),
    });

    // Log the interview scheduling event
    await createLog(
      "interview_scheduled",
      recruiterId,
      `Interview scheduled by ${recruiter.username} for candidates ${candidates
        .map((c) => c.username)
        .join(", ")}`,
      {
        candidateIds,
        date,
        time,
        questionIds,
      }
    );

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserInterviews = async (req, res) => {
  const {
    id,
    query: { limit, status },
  } = req;

  try {
    const interviews = await Interview.find({
      $and: [
        { $or: [{ recruiter: id }, { candidates: id }] },
        { status: status ?? "Scheduled" },
      ],
    })
      .sort({ date: 1, time: 1 })
      .limit(limit ?? 10)
      .populate("questions", "_id question")
      .populate("recruiter", "username email")
      .populate("candidates", "username email");

    // Log the action of fetching user interviews
    await createLog(
      "fetch_interviews",
      id,
      `Fetched interviews for user ${id}`,
      {
        limit,
        status: status ?? "Scheduled",
      }
    );

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserStats = async (req, res) => {
  const { id } = req;

  try {
    const stats = await Interview.aggregate([
      {
        $match: {
          $or: [{ recruiter: id }, { candidates: id }],
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Log the action of fetching user stats
    await createLog("fetch_stats", id, `Fetched stats for user ${id}`, {});

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNextInterview = async (req, res) => {
  const { id } = req;

  try {
    const interview = await Interview.findOne({
      $or: [{ recruiter: id }, { candidates: id }],
      status: "Scheduled",
      date: { $gte: new Date() },
    })
      .select("-questions")
      .sort({ date: 1, time: 1 });

    if (!interview) {
      return res.status(404).json({ message: "Not found" });
    }

    // Log the action of fetching the next interview
    await createLog(
      "fetch_next_interview",
      id,
      `Fetched the next interview for user ${id}`,
      {
        interviewId: interview._id,
      }
    );

    res.json(interview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateInterview = async (req, res) => {
  const { date, time, questionIds, candidateIds } = req.body;
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

    if (candidateIds) {
      const candidates = await User.find({ _id: { $in: candidateIds } });
      interview.candidates = candidates.map((candidate) => candidate._id);
    }

    const updatedInterview = await interview.save();

    // Log the interview update event
    await createLog(
      "interview_updated",
      req.id,
      `Interview updated by recruiter ${req.id}`,
      {
        interviewId,
        updatedFields: {
          date,
          time,
          questionIds,
          candidateIds,
        },
      }
    );

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

    // Log the interview cancellation event
    await createLog(
      "interview_cancelled",
      req.id,
      `Interview cancelled by recruiter ${req.id}`,
      {
        interviewId,
      }
    );

    res.json({ message: "Interview cancelled", canceledInterview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  scheduleInterview,
  getUserInterviews,
  getNextInterview,
  getUserStats,
  updateInterview,
  cancelInterview,
};
