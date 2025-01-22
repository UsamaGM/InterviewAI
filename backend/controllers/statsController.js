const Interview = require("../models/interviewModel.js");
const User = require("../models/userModel.js");
const Question = require("../models/questionModel.js");

const getStats = async (req, res) => {
  try {
    // Current date and 7 days from now
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    // Fetch interviews scheduled within the week
    const interviewsThisWeek = await Interview.find({
      status: "Scheduled",
      date: {
        $gte: now,
        $lt: sevenDaysFromNow,
      },
    })
      .populate("candidates")
      .populate("questions");

    // Total number of interviews this week
    const totalInterviewsThisWeek = interviewsThisWeek.length;

    // Extract unique candidates
    const uniqueCandidates = new Set(
      interviewsThisWeek.map((interview) =>
        interview.candidates.reduce((sum, cand) => sum + 1)
      )
    );
    const totalCandidates = uniqueCandidates.size;

    // Count all associated questions
    const totalQuestions = interviewsThisWeek.reduce((sum, interview) => {
      return sum + (interview.questions ? interview.questions.length : 0);
    }, 0);

    // Respond with the stats
    res.status(200).json({
      interviewsThisWeek: totalInterviewsThisWeek,
      totalCandidates,
      totalQuestions,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats", error });
  }
};

module.exports = { getStats };
