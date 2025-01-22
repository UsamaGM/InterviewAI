const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");
const { createLog } = require("../utils/logger.js"); // Import log generation utility

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if the email is already registered
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    if (newUser) {
      // Log the registration event
      await createLog(
        "user_registered",
        newUser._id,
        `User ${newUser.username} registered`,
        { email: newUser.email, role: newUser.role }
      );

      // Return the response
      res.status(201).json({
        _id: newUser._id,
        name: newUser.username,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists and the password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      // Log the login event
      await createLog(
        "user_logged_in",
        user._id,
        `User ${user.username} logged in`,
        { email: user.email, role: user.role }
      );

      // Return the response
      res.json({
        _id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };
