export interface Question {
  _id: string;
  questionText: string;
  answerText?: string;
  aiAssessment?: {
    score?: number;
    keywords?: string[];
    sentiment?: string;
    feedback?: string;
  };
}

export interface Interview {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
  status: string;
  score?: number;
  feedback?: string;
  jobRole?: JobRole;
}

export enum JobRole {
  SoftwareEngineer = "Software Engineer",
  WebDeveloper = "Web Developer",
  JavaDeveloper = "Java Developer",
  BusinessExecutive = "Business Executive",
  DataAnalyst = "Data Analyst",
  DataScientist = "Data Scientist",
  MachineLearningEngineer = "Machine Learning Engineer",
  ProductManager = "Product Manager",
  ProjectManager = "Project Manager",
  QAEngineer = "QA Engineer",
  SecurityEngineer = "Security Engineer",
  MobileDeveloper = "Mobile Developer",
  MERNStackDeveloper = "MERN Stack Developer",
  MEANStackDeveloper = "MEAN Stack Developer",
  LAMPStackDeveloper = "LAMP Stack Developer",
  PythonDeveloper = "Python Developer",
  RubyDeveloper = "Ruby Developer",
  FullStackDeveloper = "Full Stack Developer",
}

export interface InterviewForm {
  title: string;
  description: string;
  jobRole: keyof JobRole;
}
