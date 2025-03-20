import {
  Box,
  Container,
  Fab,
  ListItem,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";

export const StyledContainer = styled(Container)(() => ({
  minWidth: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  borderRadius: 12,
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  borderRadius: 8,
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
  transition: "transform 0.3s ease-in-out, background-color 1s ease",
  "&:hover": {
    transform: "scale(1.01)",
    backgroundColor: "#f4f4f4",
  },
}));

export const StyledButton = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: theme.spacing(3),
  "& button": {
    backgroundColor: "#6200EE",
    color: "white",
    padding: theme.spacing(1.5, 3),
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#4A148C",
    },
  },
}));

export const StyledLink = styled(Link)(() => ({
  color: "#6200EE",
  textDecoration: "none",
  fontWeight: 500,
  "&:hover": {
    textDecoration: "underline",
  },
}));

export const StyledTitle = styled(Typography)(() => ({
  fontWeight: "bold",
  color: "#1414f4",
}));

interface StyledFabProps {
  title: string;
  icon: ReactNode;
}

export const StyledFab = (props: StyledFabProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Fab
      variant="extended"
      color="gray"
      style={{
        position: "fixed",
        bottom: "16px",
        right: "16px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        sx={{
          width: isHovered ? "auto" : 0,
          overflow: "hidden",
          transition: "width 0.3s ease, opacity 0.3s ease",
          opacity: isHovered ? 1 : 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          variant="button"
          sx={{ marginRight: 1, whiteSpace: "nowrap" }}
        >
          {props.title}
        </Typography>
      </Box>
      {props.icon}
    </Fab>
  );
};
