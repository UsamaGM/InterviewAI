import { Request, Response } from "express";
import Interview from "../models/Interview";
import { Types } from "mongoose";
import {
  generateQuestions as aiGenerateQuestions,
  assessAnswer as aiAssessAnswer,
  rateInterview as aiRateInterview,
} from "../services/aiService";
import User from "../models/User";
import { sendEmail } from "../services/emailService";

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
    const interview = await Interview.findById(interviewId).populate(
      "recruiter",
      "_id name email"
    );

    if (!interview) {
      res.status(404).json({ message: "Interview not found" });
    } else {
      res.status(200).json(interview);
    }
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
    } else {
      res.status(200).json(updatedInterview);
    }
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
    } else {
      res.status(204).send();
    }
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
    } else {
      res.status(200).json(updatedInterview);
    }
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
    } else {
      res.status(200).json(updatedInterview);
    }
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
    } else {
      res.status(200).json(updatedInterview);
    }
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

    const result = await aiRateInterview(interview?.questions!);
    if ("score" in result && "feedback" in result) {
      const { score, feedback } = result;
      console.log(score, feedback);
      interview!.score = score;
      interview!.feedback = feedback;
      interview!.status = "completed";
    } else {
      throw new Error("Invalid response from aiRateInterview");
    }
    interview!.status = "completed";

    const updatedInterview = await interview!.save();
    res.status(200).json(updatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get interviews for candidate
export const getCandidateInterviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const candidateId = (req as any).user._id as Types.ObjectId;
    const interviews = await Interview.find({ 
      candidate: candidateId,
      status: { $in: ["scheduled", "in-progress", "completed"] }
    }).populate("recruiter", "_id name email");
    
    res.status(200).json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Invite new candidate by email
export const inviteCandidate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const interviewId = req.params.id;
    const { email, scheduledTime } = req.body;
    
    // Check if user exists
    let candidate = await User.findOne({ email });
    
    // If not, create a new candidate user with a temporary password
    if (!candidate) {
      const tempPassword = Math.random().toString(36).slice(-8);
      candidate = await User.create({
        email,
        password: tempPassword,
        role: "candidate",
        isVerified: false
      });
      
      // Send invitation email with temporary password
      const emailHTML = `
        <p>You've been invited to an interview!</p>
        <p>Your temporary password is: ${tempPassword}</p>
        <p>Please login at: ${process.env.CLIENT_URL}/login</p>
      `;
      await sendEmail(email, "Interview Invitation", emailHTML);
    } else {
      // Send notification email to existing user
      const emailHTML = `
        <p>You've been invited to a new interview!</p>
        <p>Please login at: ${process.env.CLIENT_URL}/login to view details.</p>
      `;
      await sendEmail(email, "New Interview Invitation", emailHTML);
    }
    
    // Update the interview with candidate and scheduled time
    const updatedInterview = await Interview.findByIdAndUpdate(
      interviewId,
      { 
        scheduledTime, 
        candidate: candidate._id, 
        status: "scheduled" 
      },
      { new: true }
    );
    
    if (!updatedInterview) {
      res.status(404).json({ message: "Interview not found" });
      return;
    }
    
    res.status(200).json(updatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
