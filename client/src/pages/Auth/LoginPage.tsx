import React from "react";
import Login from "../../components/Auth/Login";
import { Container } from "@mui/material";

const LoginPage: React.FC = () => {
  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Login />
    </Container>
  );
};

export default LoginPage;
