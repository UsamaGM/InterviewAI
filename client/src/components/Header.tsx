import React from "react";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold">InterviewAI</h1>
        <nav className="flex items-center">
          <NavLink
            to="/interviews"
            className={({ isActive }) =>
              isActive
                ? "text-white font-semibold mr-4 underline"
                : "text-white mr-4 hover:underline"
            }
          >
            Interviews
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "text-white font-semibold mr-4 underline"
                : "text-white mr-4 hover:underline"
            }
          >
            Profile
          </NavLink>
          <button
            onClick={handleLogout}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
