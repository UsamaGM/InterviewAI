import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

const StyledLink = styled(NavLink)(({ theme }) => ({
  color: "white",
  textDecoration: "none",
  marginRight: theme.spacing(2),
}));

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          InterviewAI
        </Typography>
        <StyledLink to="/interviews">Interviews</StyledLink>
        <StyledLink to="/profile">Profile</StyledLink>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
