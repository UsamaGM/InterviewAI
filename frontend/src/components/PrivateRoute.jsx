import { Navigate } from "react-router-dom";

import PropTypes from "prop-types";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;
