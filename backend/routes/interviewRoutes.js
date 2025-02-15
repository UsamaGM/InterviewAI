const express = require("express");
const {
  getInterviews,
  createInterview,
  updateInterview,
  deleteInterview,
} = require("../controllers/interviewController.js");

const router = express.Router();

router.get("/", getInterviews);
router.post("/", createInterview);
router.put("/:id", updateInterview);
router.delete("/:id", deleteInterview);

module.exports = router;
