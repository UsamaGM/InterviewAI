import express from "express";
const router = express.Router();
import * as authController from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/verify/:token", authController.verifyUser);
router.post("/update-password", protect, authController.updatePassword);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.get("/me", protect, authController.getCurrentUser);

export default router;
