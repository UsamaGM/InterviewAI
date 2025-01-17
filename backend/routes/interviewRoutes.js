const express = require("express");
const {
  scheduleInterview,
  getUserInterviews,
  getCancelledUserInterviews,
  getCompletedUserInterviews,
  getNextInterview,
  updateInterview,
  cancelInterview,
} = require("../controllers/interviewController.js");

const router = express.Router();

router.get("/", getUserInterviews);
router.get("/next", getNextInterview);
router.post("/", scheduleInterview);
router.patch("/:id", updateInterview);
router.delete("/:id", cancelInterview);

module.exports = router;
