import { Request, Response } from "express";
import Interview from "../models/Interview";
import { Types } from "mongoose";
import {
  generateQuestions as aiGenerateQuestions,
  assessAnswer as aiAssessAnswer,
  rateInterview as aiRateInterview,
} from "../services/aiService";

// Create Interview
export const createInterview = async (req: Request, res: Response) => {
  try {
    const { title, description, jobRole } = req.body;
    const recruiterId = (req as any).user._id as Types.ObjectId; // Type assertion

    const newInterview = new Interview({
      title,
      description,
      recruiter: recruiterId,
      jobRole,
    });

    const savedInterview = await newInterview.save();
    res.status(201).json(savedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all interviews
export const getAllInterviews = async (req: Request, res: Response) => {
  try {
    const recruiterId = (req as any).user._id as Types.ObjectId;
    const interviews = await Interview.find({ recruiter: recruiterId });
    res.status(200).json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Interview by ID
export const getInterviewById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const interviewId = req.params.id;
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      res.status(404).json({ message: "Interview not found" });
    }
    res.status(200).json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Interview
export const updateInterview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const interviewId = req.params.id;
    const updatedInterview = await Interview.findByIdAndUpdate(
      interviewId,
      req.body,
      { new: true }
    );
    if (!updatedInterview) {
      res.status(404).json({ message: "Interview not found" });
    }
    res.status(200).json(updatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Interview
export const deleteInterview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const interviewId = req.params.id;
    const deletedInterview = await Interview.findByIdAndDelete(interviewId);
    if (!deletedInterview) {
      res.status(404).json({ message: "Interview not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Schedule Interview
export const scheduleInterview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const interviewId = req.params.id;
    const { scheduledTime, candidateId } = req.body;
    const updatedInterview = await Interview.findByIdAndUpdate(
      interviewId,
      { scheduledTime, candidate: candidateId, status: "scheduled" },
      { new: true }
    )
      .populate("recruiter")
      .populate("candidate");
    if (!updatedInterview) {
      res.status(404).json({ message: "Interview not found" });
    }
    res.status(200).json(updatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Start Interview
export const startInterview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const interviewId = req.params.id;
    const updatedInterview = await Interview.findByIdAndUpdate(
      interviewId,
      { status: "in-progress" },
      { new: true }
    );
    if (!updatedInterview) {
      res.status(404).json({ message: "Interview not found" });
    }
    res.status(200).json(updatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit Interview
export const submitInterview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const interviewId = req.params.id;
    const { questions } = req.body;
    const updatedInterview = await Interview.findByIdAndUpdate(
      interviewId,
      { questions, status: "completed" },
      { new: true }
    );
    if (!updatedInterview) {
      res.status(404).json({ message: "Interview not found" });
    }
    res.status(200).json(updatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Generate AI Questions
export const generateAIQuestions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const interviewId = req.params.id;
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      res.status(404).json({ message: "Interview not found" });
    }

    const questions = await aiGenerateQuestions(
      interview!.jobRole!,
      interview!.description!
    );

    const updatedInterview = interview!.set("questions", questions);
    res.status(200).json(updatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Assess Answer
export const assessAnswer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const interviewId = req.params.id;
    const { questionIndex, answerText } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      res.status(404).json({ message: "Interview not found" });
    }

    if (!interview!.questions[questionIndex]) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    interview!.questions[questionIndex].answerText = answerText;

    const assessment = await aiAssessAnswer(
      interview!.questions[questionIndex].questionText,
      interview!.description!,
      answerText,
      interview!.jobRole!
    );

    interview!.questions[questionIndex].aiAssessment = assessment;

    const updatedInterview = await interview!.save();
    res.status(200).json(updatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Rate Interview
export const rateInterview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const interviewId = req.params.id;
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      res.status(404).json({ message: "Interview not found" });
    }

    //TODO: integrate with aiService.js
    const { score, feedback } = await aiRateInterview([interviewId]);

    interview!.score = score;
    interview!.feedback = feedback;

    const updatedInterview = await interview!.save();
    res.status(200).json(updatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
