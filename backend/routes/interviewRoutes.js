const express = require("express");
const {
  scheduleInterview,
  getUserInterviews,
  getNextInterview,
  updateInterview,
  cancelInterview,
} = require("../controllers/interviewController.js");

const router = express.Router();

router.post("/", scheduleInterview);
router.get("/", getUserInterviews);
router.get("/next", getNextInterview);
router.patch("/:id", updateInterview);
router.delete("/:id", cancelInterview);

module.exports = router;
