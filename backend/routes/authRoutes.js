const express = require("express");
const protect = require("../middleware/authMiddleware.js");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController.js");

const router = express.Router();
router.use(express.json());

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;
