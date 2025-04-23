# InterviewAI

## Overview

InterviewAI is a comprehensive platform designed to streamline the interview process for both recruiters and candidates. It leverages AI-driven assessments, scheduling tools, and user-friendly interfaces to enhance the hiring experience for tech giants and other organizations.

## Features

- **AI-Powered Assessments**: Automatically evaluate candidate responses using AI.
- **Interview Scheduling**: Simplify the process of scheduling interviews with built-in tools.
- **User Management**: Manage profiles for candidates, recruiters, and administrators.
- **Real-Time Feedback**: Provide instant feedback to candidates during assessments.
- **Secure Authentication**: Robust authentication system for secure access.

## Project Structure

The project is divided into two main parts:

### Client

The client-side application is built using React and TypeScript. It includes the following key directories:

- `components/`: Reusable UI components such as buttons, forms, and alerts.
- `pages/`: Page-level components for different user roles (e.g., candidate, recruiter).
- `hooks/`: Custom React hooks for managing state and logic.
- `context/`: Context providers for global state management.
- `services/`: API service layer for client-server communication.
- `utils/`: Utility functions and type definitions.

### Server

The server-side application is built using Node.js and Express. It includes the following key directories:

- `controllers/`: Business logic for handling API requests.
- `models/`: Mongoose models for database interactions.
- `routes/`: API route definitions.
- `services/`: Service layer for external integrations (e.g., AI, email).
- `middleware/`: Middleware for authentication and request validation.
- `config/`: Configuration files for database and environment variables.

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/interview-ai.git
   cd interview-ai
   ```
2. Install dependencies for both client and server:
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```
3. Configure environment variables:

   - Create a `.env` file in the `server` directory.
   - Add the required variables (e.g., `MONGO_URI`, `JWT_SECRET`).

4. Start the development servers:
   - Client:
     ```bash
     cd client
     npm run dev
     ```
   - Server:
     ```bash
     cd server
     npm run dev
     ```

## Usage

- Access the client application at `http://localhost:3000`.
- Use the API endpoints exposed by the server for integration.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your fork.
4. Submit a pull request.

## Contact

For questions or support, please contact [usamamangi.fl@gmail.com](mailto:usamamangi.fl@gmail.com).
