const Interview = require("../models/interviewModel.js");
const { createLog } = require("../utils/logger.js");

const getStats = async (req, res) => {
  try {
    // Current date and 7 days from now
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    // Fetch interviews scheduled within the week
    const interviewsThisWeek = await Interview.find(
      {
        status: "Scheduled",
        date: {
          $gte: now,
          $lt: sevenDaysFromNow,
        },
      },
      { candidates: 1, questions: 1 }
    );

    // Total number of interviews this week
    const totalInterviewsThisWeek = interviewsThisWeek.length;

    // Extract unique candidates
    const uniqueCandidates = new Set(
      interviewsThisWeek.reduce((sum, interview) => {
        interview.candidates.forEach((c) => sum.add(c.toString()));
        return sum;
      }, new Set())
    );
    const totalCandidates = uniqueCandidates.size;

    // Count all associated questions
    const totalQuestions = interviewsThisWeek.reduce(
      (sum, interview) =>
        sum + (interview.questions ? interview.questions.length : 0),
      0
    );

    // Log the action of fetching stats
    await createLog("fetch_stats", req.id, `Fetched stats for user ${req.id}`, {
      totalInterviewsThisWeek,
      totalCandidates,
      totalQuestions,
    });

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

const getCandidatePerformance = async (req, res) => {
  try {
    const candidates = await Interview.aggregate([
      { $group: { _id: "$candidate", avgScore: { $avg: "$score" } } },
    ]);
    res.json(candidates);
  } catch (error) {
    console.log("Error, ", error);
    res.status(500).json({ message: "Error fetching stats", error });
  }
};

module.exports = { getStats, getCandidatePerformance };
