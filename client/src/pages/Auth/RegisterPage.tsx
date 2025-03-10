import React from "react";
import Register from "../../components/Auth/Register";
import { Container, Box, Typography } from "@mui/material";

const RegisterPage: React.FC = () => {
  return (
    <Container
      maxWidth="md"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "20px",
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          style={{ marginBottom: "20px" }}
        >
          Create an Account
        </Typography>
        <Register />
      </Box>
    </Container>
  );
};

export default RegisterPage;
