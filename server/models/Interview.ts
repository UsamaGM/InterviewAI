import mongoose, { Schema, Document, Types } from "mongoose";

export interface IQuestion {
  questionText: string;
  answerText?: string;
  aiAssessment?: {
    score?: number;
    keywords?: string[];
    sentiment?: string;
    feedback?: string;
  };
  questionType?: string; // Optional
}

export interface IInterview extends Document {
  title: string;
  description?: string;
  recruiter: Types.ObjectId;
  candidate?: Types.ObjectId;
  scheduledTime?: Date;
  questions: IQuestion[];
  status: "draft" | "scheduled" | "in-progress" | "completed" | "cancelled";
  score?: number;
  feedback?: string;
  createdAt: Date;
  jobRole?: string; // Optional
}

const InterviewSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  recruiter: { type: Schema.Types.ObjectId, ref: "User", required: true },
  candidate: { type: Schema.Types.ObjectId, ref: "User" },
  scheduledTime: { type: Date },
  questions: [
    {
      questionText: { type: String, required: true },
      answerText: { type: String },
      aiAssessment: {
        score: { type: Number },
        keywords: [{ type: String }],
        sentiment: { type: String },
        feedback: { type: String },
      },
      questionType: { type: String },
    },
  ],
  status: {
    type: String,
    enum: ["draft", "scheduled", "in-progress", "completed", "cancelled"],
    default: "draft",
  },
  score: { type: Number },
  feedback: { type: String },
  createdAt: { type: Date, default: Date.now },
  jobRole: {
    type: String,
    enum: [
      "Backend Developer",
      "Business Executive",
      "Data Analyst",
      "Data Scientist",
      "DevOps Engineer",
      "Frontend Developer",
      "Full Stack Developer",
      "Java Developer",
      "LAMP Stack Developer",
      "Machine Learning Engineer",
      "MEAN Stack Developer",
      "MERN Stack Developer",
      "Mobile Developer",
      "Product Manager",
      "Project Manager",
      "Python Developer",
      "QA Engineer",
      "Ruby Developer",
      "Security Engineer",
      "Software Engineer",
      "UI/UX Designer",
      "Web Developer",
    ],
  },
});

export default mongoose.model<IInterview>("Interview", InterviewSchema);
