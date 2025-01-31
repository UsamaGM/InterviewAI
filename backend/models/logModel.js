const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "user_registered",
        "user_logged_in",
        "fetch_recruiters",
        "fetch_user",
        "fetch_stats",
        "fetch_interviews",
        "fetch_next_interview",
        "interview_scheduled",
        "interview_updated",
        "interview_completed",
        "interview_cancelled",
        "fetch_candidates",
        "candidate_added",
        "candidate_updated",
        "candidate_delted",
        "fetch_questions",
        "question_added",
        "question_updated",
        "question_deleted",
      ],
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
