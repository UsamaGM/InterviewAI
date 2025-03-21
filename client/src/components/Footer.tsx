import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-500 text-white w-full fixed bottom-0">
      <div className="container mx-auto py-3 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} InterviewAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
