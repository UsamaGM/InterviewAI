# InterviewAI

![interview_ai](https://github.com/user-attachments/assets/3eb43a5b-8879-452b-b2f1-31b51141d855)

## Overview

InterviewAI is an AI-powered platform designed to revolutionize the hiring process, benefiting both recruiters and candidates. It streamlines the entire interview workflow, from initial screening to final evaluation, using cutting-edge AI technology. For recruiters, InterviewAI offers a faster, more efficient way to identify top talent, reducing time-to-hire and improving the quality of hires. For candidates, the platform provides a fair, unbiased assessment experience, allowing them to showcase their skills and abilities in a dynamic and engaging manner. InterviewAI supports organizations ranging from tech startups to large enterprises in optimizing their recruitment strategies and securing the best candidates.

## Features

- **AI-Powered Assessments:** Automatically evaluates candidate responses using advanced AI algorithms. This feature analyzes factors such as technical proficiency, communication skills, and problem-solving abilities. For example, in a coding interview, the AI can assess the correctness, efficiency, and style of the code submitted by the candidate. Use Case: Quickly screen hundreds of candidates to identify the most promising individuals for further evaluation.

- **Interview Scheduling:** Simplify the complex process of scheduling interviews with built-in tools. Recruiters can define their availability, and candidates can select convenient time slots. The system automatically handles time zone conversions and sends out reminders to ensure smooth scheduling. Use Case: Eliminate scheduling conflicts and reduce the administrative overhead associated with coordinating interviews.

- **User Management:** Efficiently manage profiles for candidates, recruiters, and administrators. Each user role has specific permissions and access levels, ensuring data security and compliance. Recruiters can create and manage job postings, while candidates can update their profiles and track their application status. Use Case: Centralize user data and streamline access control for different stakeholders.

- **Quick AI-Based Feedback:** Provide instant, AI-driven feedback to candidates during assessments. This helps candidates understand their strengths and weaknesses in real-time, fostering a more interactive and informative interview experience. The feedback can cover areas such as code quality, algorithm design, and communication effectiveness. Use Case: Enhance the candidate experience and provide valuable insights to help them improve their performance.

- **Secure Authentication:** Implement a robust authentication system for secure access to the platform. This includes features such as multi-factor authentication, password encryption, and regular security audits to protect sensitive data. Role-based access control ensures that only authorized users can access specific features and data. Use Case: Protect sensitive candidate and recruiter data from unauthorized access and maintain compliance with data privacy regulations.

## Project Structure

The project is structured into two primary parts: the client-side (frontend) and the server-side (backend). This separation of concerns allows for a more maintainable and scalable application.

### Client

The client-side application is built using React and TypeScript, leveraging modern web development practices to create a responsive and intuitive user interface.

- `components/`: This directory contains reusable UI components such as buttons, forms, alerts, and custom input fields. Each component is designed to be modular and easily integrated into different parts of the application. Key files include `Button.tsx`, `Input.tsx`, and `Alert.tsx`.
- `pages/`: Page-level components for different user roles, such as candidates, recruiters, and administrators. Each page represents a specific view or section of the application. Examples include `CandidateDashboard.tsx`, `RecruiterDashboard.tsx`, and `AdminPanel.tsx`.
- `hooks/`: Custom React hooks for managing state and logic. These hooks encapsulate complex logic and provide a clean and reusable API for components. Examples include `useAuth.ts` (authentication logic) and `useFetch.ts` (data fetching).
- `context/`: Context providers for global state management. React Context is used to share state across the application without prop drilling. Key files include `AuthContext.tsx` (authentication context) and `ThemeContext.tsx` (theme context).
- `services/`: API service layer for client-server communication. This layer abstracts away the details of making HTTP requests to the server, providing a simple and consistent API for components to fetch and update data. Key files include `authService.ts`, `userService.ts`, and `assessmentService.ts`.
- `utils/`: Utility functions and type definitions. This directory contains helper functions and type definitions that are used throughout the application. Examples include `dateUtils.ts` (date formatting) and `types.ts` (shared type definitions).

### Server

The server-side application is built using Node.js and Express, providing a RESTful API for the client to interact with.

- `controllers/`: Business logic for handling API requests. Each controller is responsible for processing incoming requests, interacting with the data models, and returning appropriate responses. Examples include `authController.js`, `userController.js`, and `assessmentController.js`.
- `models/`: Mongoose models for database interactions. These models define the schema for data stored in MongoDB and provide methods for querying and manipulating data. Examples include `User.js`, `Job.js`, and `Assessment.js`.
- `routes/`: API route definitions. This directory defines the routes for each API endpoint, mapping HTTP requests to the appropriate controller functions. Examples include `authRoutes.js`, `userRoutes.js`, and `assessmentRoutes.js`.
- `services/`: Service layer for external integrations (e.g., AI, email). This layer encapsulates the logic for interacting with external services such as AI assessment tools and email providers. Examples include `aiService.js` and `emailService.js`.
- `middleware/`: Middleware for authentication, request validation, and error handling. Middleware functions are executed before or after route handlers, allowing you to add common functionality to your API. Examples include `authMiddleware.js` (authentication) and `errorHandler.js` (error handling).
- `config/`: Configuration files for database and environment variables. This directory contains configuration files for setting up the database connection, defining environment variables, and managing application settings. Key files include `database.js` and `config.js`
