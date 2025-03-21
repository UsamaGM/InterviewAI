import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 w-full fixed bottom-0 shadow-inner">
      <div className="container mx-auto py-4 text-center">
        <p className="text-sm opacity-75">
          © {new Date().getFullYear()} InterviewAI. All rights reserved. |
          <a href="/privacy" className="ml-2 hover:underline">
            Privacy Policy
          </a>{" "}
          |
          <a href="/terms" className="ml-2 hover:underline">
            Terms of Service
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
