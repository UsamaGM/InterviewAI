import React from "react";
import Register from "../../components/Auth/Register";
import { Container } from "@mui/material";

const RegisterPage: React.FC = () => {
  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Register />
    </Container>
  );
};

export default RegisterPage;
