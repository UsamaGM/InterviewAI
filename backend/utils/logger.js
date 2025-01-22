const Log = require("../models/logModel.js");

const createLog = async (action, userId, details, metadata = {}) => {
  try {
    const log = new Log({
      action,
      user: userId,
      details,
      metadata,
    });
    await log.save();
  } catch (error) {
    console.error("Failed to create log:", error);
  }
};

module.exports = { createLog };
