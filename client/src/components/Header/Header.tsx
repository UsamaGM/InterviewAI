import React, { useState, useEffect } from "react";
import AlertWithOptions from "../Alerts/AlertWithOptions";
import StyledNavLink from "./StyledNavLink";
import api from "../../services/api";

const Header: React.FC = () => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/users/profile");
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    if (localStorage.getItem("token")) {
      fetchUserProfile();
    }
  }, []);
  
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
          {userRole === "recruiter" ? (
            <>
              <StyledNavLink title="Interviews" to="/interviews" />
              <StyledNavLink title="Create Interview" to="/interviews/new" />
            </>
          ) : userRole === "candidate" ? (
            <StyledNavLink title="My Interviews" to="/candidate/dashboard" />
          ) : null}
          
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
