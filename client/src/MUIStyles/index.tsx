import { Button, Paper, styled, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  borderRadius: theme.spacing(1),
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
  },
  backgroundColor: "#fff",
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(1),
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
  "&:hover": {
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  backgroundColor: theme.palette.secondary.main,
  color: "#fff",
}));

export const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  fontWeight: 500,
  color: theme.palette.primary.main,
  "&:hover": {
    textDecoration: "underline",
  },
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: "bold",
}));
