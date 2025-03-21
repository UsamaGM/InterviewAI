import React, { useState } from "react";
import AlertWithOptions from "../Alerts/AlertWithOptions";
import StyledNavLink from "./StyledNavLink";

const Header: React.FC = () => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const handleLogout = () => {
    setShowAlert(true);
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="bg-white/70 backdrop-blur-md text-gray-800 p-4 sticky top-0 w-full z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold">InterviewAI</h1>
        <nav className="flex items-center space-x-4">
          <StyledNavLink title="Interviews" to="/interviews" />
          <StyledNavLink title="Profile" to="/profile" />
          <div className="relative">
            <button
              onClick={() => setShowAlert(true)}
              className="bg-red-200 hover:bg-red-300 text-red-700 px-4 py-2 rounded transition-colors duration-200"
            >
              Logout
            </button>
            {showAlert && (
              <AlertWithOptions
                title="Log out"
                subtitle="Are you sure you want to logout?"
                onOkay={handleLogout}
                onCancel={() => setShowAlert(false)}
                className="absolute top-full right-0 mt-2 bg-white rounded-md shadow-lg p-4"
              />
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
