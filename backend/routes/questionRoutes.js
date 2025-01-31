const express = require("express");
const {
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController.js");

const router = express.Router();

router.get("/", getQuestions);
router.post("/", addQuestion);
router.put("/", updateQuestion);
router.delete("/:id", deleteQuestion);

module.exports = router;
