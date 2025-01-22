const User = require("../models/userModel.js");
const { createLog } = require("../utils/logger.js"); // Import log utility

const getRecruiters = async (req, res) => {
  try {
    const recruiters = await User.where("role", "recruiter").select(
      "_id username"
    );

    // Log the action of fetching recruiters
    await createLog(
      "fetch_recruiters",
      req.id, // Assuming req.id is the ID of the user making the request
      `Recruiters list fetched by user ${req.id}`,
      { count: recruiters.length }
    );

    res.json(recruiters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCandidates = async (req, res) => {
  try {
    const candidates = await User.where("role", "candidate").select(
      "_id username"
    );

    // Log the action of fetching candidates
    await createLog(
      "fetch_candidates",
      req.id, // Assuming req.id is the ID of the user making the request
      `Candidates list fetched by user ${req.id}`,
      { count: candidates.length }
    );

    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id ?? req.id).select("-password");

    if (user) {
      // Log the action of fetching user details
      await createLog(
        "fetch_user",
        req.id, // Assuming req.id is the ID of the user making the request
        `User details fetched for ${user.username} by user ${req.id}`,
        { fetchedUserId: user._id }
      );

      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getRecruiters, getCandidates, getUser };
