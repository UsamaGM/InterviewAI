const router = require("express").Router();
const {
  getStats,
  getCandidatePerformance,
} = require("../controllers/statsController.js");

router.get("/", getStats);
router.get("/candidatePerformance", getCandidatePerformance);

module.exports = router;
