import { Link, NavLink, useNavigate } from "react-router-dom";
import RoundedButton from "../components/RoundedButton";

import PropTypes from "prop-types";
import { toast } from "react-toastify";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    toast.success("Good bye!");
    navigate("/login");
  }

  CustomNavLink.propTypes = {
    to: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
  };

  return (
    <header className="text-primaryContrast p-5">
      <div className="w-full min-w-fit max-w-3xl mx-auto flex justify-between items-center rounded-full shadow-md shadow-dark bg-secondary py-3 px-7">
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
                className="bg-red-600 text-secondaryContrast hover:bg-tertiary hover:text-dark px-3 py-1 shadow-sm shadow-dark"
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
