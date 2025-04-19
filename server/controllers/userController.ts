import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";

// Get all users (admin only)
export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// Get a specific user
export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getCandidates(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const candidates = await User.find({ role: "candidate" });
    res.status(200).json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getRecruiters(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const recruiters = await User.find({ role: "recruiter" });
    res.status(200).json(recruiters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getCurrentUserProfile(
  req: any,
  res: Response
): Promise<void> {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// Update a user (admin or self)
export async function updateUserProfile(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = (req as any).user._id;
    const { password, ...updateData } = req.body;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// Delete a user (admin only)
export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
