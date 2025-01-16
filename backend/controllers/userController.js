const User = require("../models/userModel.js");

const getRecruiters = async (req, res) => {
  try {
    const recruiters = await User.where("role", "recruiter").select(
      "_id username"
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
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id ?? req.id).select(
      "-password"
    );
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getRecruiters, getCandidates, getUser };
