import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { sendEmail } from "../services/emailService";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { Types } from "mongoose"; // Import Types

dotenv.config();

// Extend the Request interface
interface AuthRequest extends Request {
  user?: any; // Or a more specific user type if available.  Ideally, use IUser
}

// Generate JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
};
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role, name } = req.body;

    // Input validation (check for required fields and types)
    if (!email || !password || !role) {
      res
        .status(400)
        .json({ message: "Please provide email, password, and role" });
      return;
    }
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof role !== "string"
    ) {
      res.status(400).json({ message: "Invalid input types" });
      return;
    }
    if (role !== "recruiter" && role !== "candidate") {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");

    // Create user
    const user = await User.create({
      email,
      password,
      role,
      name,
      verificationToken,
    });

    // Send verification email
    const verificationURL = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/verify/${verificationToken}`;
    const emailHTML = `
        <p>Please click the following link to verify your email:</p>
        <a href="${verificationURL}">${verificationURL}</a>
      `;
    await sendEmail(email, "Verify Your Email", emailHTML);

    res.status(201).json({
      message: "User registered successfully.",
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
      return;
    }
    if (typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ message: "Invalid input types" });
      return;
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        res
          .status(400)
          .json({ message: "Please verify your email before logging in." });
        return;
      }
      res.json({
        _id: user._id!.toString(),
        token: generateToken(user._id!.toString()),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc verify user email
// @route GET /api/auth/verify/:token
// @access Public
const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.params.token as string;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      res.status(400).send("Invalid verification token.");
      return;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).send("Email verified successfully. You can now login.");
  } catch (error: any) {
    next(error); // Pass error to error handler
  }
};

// @desc send forgot password link
// @route POST /api/auth/forgot-password
// @access Public
const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Please provide email" });
      return;
    }
    if (typeof email !== "string") {
      res.status(400).json({ message: "Invalid input types" });
      return;
    }
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/reset-password/${resetToken}`;
    const emailHTML = `
      <p>You have requested to reset your password.  Please use the link below:</p>
      <a href="${resetURL}">${resetURL}</a>
    `;
    await sendEmail(email, "Password Reset Request", emailHTML);
    res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    if (!password) {
      res.status(400).json({ message: "Please provide password" });
      return;
    }
    if (typeof password !== "string") {
      res.status(400).json({ message: "Invalid input types" });
      return;
    }
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }, //check token expiry
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired reset token" });
      return;
    }

    // Set the new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc  Get current user's info
// @route GET /api/auth/me
// @access Private
const getCurrentUser = async (req: AuthRequest, res: Response) => {
  // Use AuthRequest
  try {
    // Now TypeScript knows about req.user
    res.status(200).json(req.user);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

export {
  registerUser,
  loginUser,
  verifyUser,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};
