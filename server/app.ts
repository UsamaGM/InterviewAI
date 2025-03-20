import express, { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { scheduleInterviewReminders } from "./services/schedulingService";

const app: Application = express();

// Connect to Database
connectDB();
scheduleInterviewReminders();

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Middleware
app.use(cors());
app.use(limiter);
app.use(express.json());
app.use(helmet());

// Routes
app.use("/api/test", (req: Request, res: Response) => {
  res.json({ message: "Server resonded" });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/interviews", interviewRoutes);

// Basic error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
