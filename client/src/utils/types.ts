export type User = {
  _id?: string;
  name: string;
  email: string;
  role: "recruiter" | "candidate";
  password?: string;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
};

export interface Question {
  _id: string;
  questionText: string;
  answerText?: string;
  aiAssessment?: {
    score?: number;
    keywords?: string[];
    sentiment?: "positive" | "negative" | "neutral";
    feedback?: string;
  };
}

export type Interview = {
  _id: string;
  title: string;
  description?: string;
  recruiter?: User;
  candidate?: User;
  scheduledTime?: string;
  questions: Question[];
  status: "draft" | "scheduled" | "in-progress" | "completed" | "cancelled";
  score?: number;
  feedback?: string;
  createdAt: Date;
  jobRole?: string;
};

export enum JobRole {
  BACKEND_DEVELOPER = "Backend Developer",
  BUSINESS_EXECUTIVE = "Business Executive",
  DATA_ANALYST = "Data Analyst",
  DATA_SCIENTIST = "Data Scientist",
  DEVOPS_ENGINEER = "DevOps Engineer",
  FRONTEND_DEVELOPER = "Frontend Developer",
  FULLSTACK_DEVELOPER = "Full Stack Developer",
  JAVA_DEVELOPER = "Java Developer",
  LAMP_STACK_DEVELOPER = "LAMP Stack Developer",
  MACHINE_LEARNING_ENGINEER = "Machine Learning Engineer",
  MEAN_STACK_DEVELOPER = "MEAN Stack Developer",
  MERN_STACK_DEVELOPER = "MERN Stack Developer",
  MOBILE_DEVELOPER = "Mobile Developer",
  PRODUCT_MANAGER = "Product Manager",
  PROJECT_MANAGER = "Project Manager",
  PYTHON_DEVELOPER = "Python Developer",
  QA_ENGINEER = "QA Engineer",
  RUBY_DEVELOPER = "Ruby Developer",
  SECURITY_ENGINEER = "Security Engineer",
  SOFTWARE_ENGINEER = "Software Engineer",
  UI_UX_DESIGNER = "UI/UX Designer",
  WEB_DEVELOPER = "Web Developer",
}

export type InterviewForm = {
  title: string;
  description: string;
  jobRole: JobRole;
  scheduledTime?: string;
};

export type RouteProps = {
  isAuthenticated: boolean;
  userRole?: string;
};
