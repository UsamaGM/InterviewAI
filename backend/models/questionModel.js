const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: {
    type: String,
    enum: ["GK", "IT", "Business", "Science"],
    default: "IT",
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium",
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
