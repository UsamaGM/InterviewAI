import { NavLink } from "react-router-dom";

interface StyledNavLinkProps {
  title: string;
  to: string;
}

function StyledNavLink({ title, to }: StyledNavLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-blue-100 text-blue-700 font-semibold"
            : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
        }`
      }
    >
      {title}
    </NavLink>
  );
}

export default StyledNavLink;
