const express = require("express");
const protect = require("../middleware/authMiddleware.js");
const {
  scheduleInterview,
  getUserInterviews,
} = require("../controllers/interviewController.js");

const router = express.Router();

router.post("/", protect, scheduleInterview);
router.get("/", protect, getUserInterviews);

module.exports = router;
