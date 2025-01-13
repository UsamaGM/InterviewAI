const express = require("express");
const protect = require("../middleware/authMiddleware.js");
const {
  scheduleInterview,
  getUserInterviews,
  updateInterview,
  cancelInterview,
} = require("../controllers/interviewController.js");

const router = express.Router();

router.post("/", protect, scheduleInterview);
router.get("/", protect, getUserInterviews);
router.patch("/:id", protect, updateInterview);
router.delete("/:id", protect, cancelInterview);

module.exports = router;
