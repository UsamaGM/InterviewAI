const express = require("express");
const Interview = require("../models/interviewModel.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { candidate, recruiter, questions } = req.body;

    const newInterview = new Interview({ candidate, recruiter, questions });
    await newInterview.save();

    res.status(201).json({ message: "Interview scheduled successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate(
      "questions"
    );

    res.json(interview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
