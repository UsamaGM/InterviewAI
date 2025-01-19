import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { toast } from "react-toastify";
import RoundedButton from "../components/RoundedButton";
import PropTypes from "prop-types";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    toast.success("Goodbye!");
    navigate("/login");
  }

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  return (
    <header
      className="p-5 bg-primary text-primaryContrast shadow-lg transition-transform duration-500"
      style={{ transform: isMenuOpen ? "translateY(0)" : "translateY(0px)" }}
    >
      <div className="w-full mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          className="text-2xl font-bold text-accentLight hover:text-accent transition-all duration-300"
          to="/dashboard"
        >
          Logo Here
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {token ? (
            <>
              <CustomNavLink to="/dashboard" title="Dashboard" />
              <CustomNavLink to="/schedule" title="Schedule" />
              <CustomNavLink to="/interviews" title="Interviews" />
              <RoundedButton
                className="bg-warning text-warningContrast hover:bg-red-400 px-3 py-1 shadow-md transition-all duration-300"
                title="Logout"
                onClick={handleLogout}
              />
            </>
          ) : (
            <>
              <CustomNavLink to="/login" title="Login" />
              <CustomNavLink to="/register" title="Register" />
            </>
          )}
        </nav>

        {/* Mobile Hamburger Menu */}
        <button
          className="md:hidden text-xl text-primaryContrast transition-transform duration-300"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <HiX /> : <HiOutlineMenuAlt3 />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-4 bg-primary py-4 px-6">
          {token ? (
            <>
              <CustomNavLink to="/dashboard" title="Dashboard" />
              <CustomNavLink to="/schedule" title="Schedule" />
              <CustomNavLink to="/interviews" title="Interviews" />
              <button
                onClick={handleLogout}
                className="text-left text-warning hover:text-warningHover font-bold transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <CustomNavLink to="/login" title="Login" />
              <CustomNavLink to="/register" title="Register" />
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function CustomNavLink({ to, title, className = "" }) {
  return (
    <NavLink
      className={({ isActive }) =>
        `hover:text-secondary transition-all duration-300 ${
          isActive ? "text-accent font-bold" : "text-primaryContrast"
        } ${className}`
      }
      to={to}
    >
      {title}
    </NavLink>
  );
}

CustomNavLink.propTypes = {
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Header;
