const Question = require("../models/questionModel.js");
const { createLog } = require("../utils/logger.js"); // Import log utility

const addQuestion = async (req, res) => {
  const { question, answer, difficulty, category } = req.body;

  try {
    const q = await Question.create({
      question,
      answer,
      difficulty,
      category,
    });

    // Log the question addition event
    await createLog(
      "question_added",
      req.id, // Assuming req.id is the ID of the user making the request
      `A new question was added by user ${req.id}`,
      { question, answer, difficulty, category }
    );

    res.status(201).json(q);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//TODO: update question

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({});

    // Log the action of fetching questions
    await createLog(
      "fetch_questions",
      req.id, // Assuming req.id is the ID of the user making the request
      `Questions were fetched by user ${req.id}`,
      { count: questions.length }
    );

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addQuestion, getQuestions };
