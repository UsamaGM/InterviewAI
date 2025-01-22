const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "interview_scheduled",
        "interview_completed",
        "interview_cancelled",
        "interview_updated",
        "fetch_interviews",
        "fetch_next_interview",
        "candidate_added",
        "candidate_updated",
        "question_added",
        "question_updated",
        "fetch_questions",
        "user_registered",
        "user_logged_in",
        "fetch_recruiters",
        "fetch_candidates",
        "fetch_user",
        "fetch_stats",
      ], // Extend as needed
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", LogSchema);
