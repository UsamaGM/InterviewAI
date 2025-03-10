import React from "react";
import Login from "../../components/Auth/Login";
import { Container, Box, Typography } from "@mui/material";

const LoginPage: React.FC = () => {
  return (
    <Container
      maxWidth="md"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Make the container take full viewport height
      }}
    >
      <Box
        style={{
          width: "100%",
          maxWidth: "400px", // Limit the width for better readability
          padding: "20px",
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          style={{ marginBottom: "20px" }}
        >
          Welcome Back!
        </Typography>
        <Login />
      </Box>
    </Container>
  );
};

export default LoginPage;
