const Question = require("../models/questionModel.js");
const { createLog } = require("../utils/logger.js"); // Import log utility

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

const updateQuestion = async (req, res) => {
  const { id } = req.params;
  //updated data only
  const { _id, question, answer, difficulty, category } = req.body;

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      _id,
      {
        question,
        answer,
        difficulty,
        category,
      },
      { new: true }
    );

    // Log the question update event
    await createLog(
      "question_updated",
      req.id,
      `A question was updated by user ${req.id}`,
      { question, answer, difficulty, category }
    );

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    await Question.findByIdAndDelete(id);
    await createLog(
      "question_deleted",
      req.id,
      `A question was deleted by user ${req.id}`,
      { id }
    );

    res.status(204).json({ message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addQuestion, updateQuestion, getQuestions, deleteQuestion };
