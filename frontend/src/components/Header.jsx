import { Link, NavLink, useNavigate } from "react-router-dom";
import RoundedButton from "../components/RoundedButton";

import PropTypes from "prop-types";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/login");
  }

  CustomNavLink.propTypes = {
    to: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
  };

  return (
    <header className="bg-primary text-primaryContrast py-4 shadow space-y-4 p-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link className="text-2xl font-bold" to="/dashboard">
          Logo here
        </Link>
        <nav className="flex items-center space-x-4">
          {token ? (
            <>
              <div className="space-x-4">
                <CustomNavLink to="/dashboard" title="Dashboard" />
                <CustomNavLink to="/schedule" title="Schedule" />
                <CustomNavLink to="/interviews" title="Interviews" />
              </div>
              <RoundedButton
                className="bg-secondary/75 text-secondaryContrast hover:bg-secondary/100 py-0 px-2 shadow-sm shadow-dark"
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
      </div>
    </header>
  );

  function CustomNavLink({ to, title, className }) {
    return (
      <NavLink
        className={({ isActive }) =>
          `hover:text-tertiary ${
            isActive && "text-primaryContrast font-bold"
          } ${className}`
        }
        to={to}
      >
        {title}
      </NavLink>
    );
  }
}

export default Header;
