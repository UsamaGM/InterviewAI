const Question = require("../models/questionModel.js");

const addQuestion = async (req, res) => {
  const { text, difficulty, category } = req.body;

  try {
    const question = await Question.create({ text, difficulty, category });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({});

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addQuestion, getQuestions };
