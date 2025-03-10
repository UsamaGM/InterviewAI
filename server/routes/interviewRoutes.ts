// server/routes/interviewRoutes.ts
import express, { NextFunction } from "express";
import {
  createInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  scheduleInterview,
  startInterview,
  submitInterview,
  generateAIQuestions,
  assessAnswer,
  rateInterview,
} from "../controllers/interviewController";
import { protect } from "../middleware/authMiddleware"; // Assuming you have an auth middleware

const router = express.Router();

router.post("/", protect, createInterview);
router.get("/", protect, getAllInterviews);
router.get("/:id", protect, getInterviewById);
router.put("/:id", protect, updateInterview);
router.delete("/:id", protect, deleteInterview);
router.post("/:id/schedule", protect, scheduleInterview);
router.post("/:id/start", protect, startInterview);
router.post("/:id/submit", protect, submitInterview);
router.post("/:id/generate-questions", protect, generateAIQuestions);
router.post("/:id/assess-answer", protect, assessAnswer);
router.post("/:id/rate-interview", protect, rateInterview);

export default router;
