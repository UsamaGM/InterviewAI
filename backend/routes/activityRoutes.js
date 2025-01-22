const router = require("express").Router();
const { getRecentActivity } = require("../controllers/activityController.js");

router.get("/recent", getRecentActivity);

module.exports = router;
