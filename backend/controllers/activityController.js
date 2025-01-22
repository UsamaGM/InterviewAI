const Activity = require("../models/logModel.js");

const getRecentActivity = async (req, res) => {
  try {
    const activity = await Activity.find({}).sort({ createdAt: -1 }).limit(5);

    if (!activity) {
      return res.status(404).json({ message: "No recent activity found" });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecentActivity };
