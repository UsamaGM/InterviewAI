import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { StyledNavLink } from "../common";

function Header() {
  const { isCandidate, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const logoutMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close the logout confirmation when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        logoutMenuRef.current &&
        !logoutMenuRef.current.contains(event.target as Node)
      ) {
        setShowLogoutConfirm(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (showLogoutConfirm || isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLogoutConfirm, isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-lg text-gray-800 p-4 sticky top-0 w-full z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
        >
          InterviewAI
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
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
              className="bg-red-50 cursor-pointer hover:bg-red-100 text-red-600 px-4 py-2 rounded-md transition-colors duration-200 font-medium flex items-center"
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
              <div className="absolute top-full right-0 mt-2 w-md bg-white rounded-lg shadow-lg shadow-gray-300 overflow-hidden z-50 animate-fade-in">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-600">
                    Confirm Logout
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to log out of your account?
                  </p>
                </div>
                <div className="p-3 flex justify-end space-x-2">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer rounded-md transition-colors duration-200"
                  >
                    No
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 text-sm cursor-pointer bg-red-500 hover:bg-red-600 text-red-50 font-bold rounded-md transition-colors duration-200"
                  >
                    Yes
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 animate-slide-down"
        >
          <div className="container mx-auto py-4 space-y-3">
            {isCandidate ? (
              <NavLink
                to="/candidate/dashboard"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                  }`
                }
              >
                My Interviews
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/recruiter/dashboard"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md transition-colors duration-200 ${
                      isActive
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                    }`
                  }
                >
                  Interviews
                </NavLink>
                <NavLink
                  to="/recruiter/schedule"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md transition-colors duration-200 ${
                      isActive
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                    }`
                  }
                >
                  New Interview
                </NavLink>
              </>
            )}
            <NavLink
              to="/shared/profile"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                }`
              }
            >
              Profile
            </NavLink>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center"
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
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
