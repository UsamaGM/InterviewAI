import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { StyledNavLink } from "../common";

function Header() {
  const { isCandidate, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const logoutMenuRef = useRef<HTMLDivElement>(null);

  // Close the logout confirmation when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        logoutMenuRef.current &&
        !logoutMenuRef.current.contains(event.target as Node)
      ) {
        setShowLogoutConfirm(false);
      }
    };

    if (showLogoutConfirm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLogoutConfirm]);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg text-gray-800 p-4 sticky top-0 w-full z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold">
          InterviewAI
        </Link>

        <nav className="flex items-center space-x-4">
          {isCandidate ? (
            <StyledNavLink title="My Interviews" to="/candidate/dashboard" />
          ) : (
            <>
              <StyledNavLink title="Interviews" to="/recruiter/dashboard" />
              <StyledNavLink title="New Interview" to="/recruiter/schedule" />
            </>
          )}

          <StyledNavLink title="Profile" to="/shared/profile" />
          <div className="relative" ref={logoutMenuRef}>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="bg-red-100 cursor-pointer hover:bg-red-200 text-red-700 px-4 py-2 rounded-md transition-colors duration-200 font-medium flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>

            {showLogoutConfirm && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Confirm Logout
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Are you sure you want to log out of your account?
                  </p>
                </div>
                <div className="p-3 bg-gray-50 flex justify-end space-x-2">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
