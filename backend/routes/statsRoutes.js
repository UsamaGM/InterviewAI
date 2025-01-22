const router = require("express").Router();
const { getStats } = require("../controllers/statsController.js");

router.get("/", getStats);

module.exports = router;
