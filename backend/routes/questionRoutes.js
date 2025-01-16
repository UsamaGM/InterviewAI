const express = require("express");
const protect = require("../middleware/authMiddleware.js");
const {
  addQuestion,
  getQuestions,
} = require("../controllers/questionController.js");

const router = express.Router();

router.post("/", addQuestion);
router.get("/", getQuestions);

module.exports = router;
