import express from "express";
import {
  getAllUsers,
  getUserById,
  getCurrentUserProfile,
  updateUserProfile,
  deleteUser,
} from "../controllers/userController";
import { protect, authorizeAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, authorizeAdmin, getAllUsers);
router.get("/profile", protect, getCurrentUserProfile);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUserProfile);
router.delete("/:id", protect, authorizeAdmin, deleteUser);

export default router;
