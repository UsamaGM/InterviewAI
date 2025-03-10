import React from "react";
import UserProfile from "../components/UserProfile";
import { Container, Box, Typography } from "@mui/material";

const UserProfilePage: React.FC = () => {
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
          maxWidth: "600px", // Adjust max width as needed
          padding: "20px",
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          style={{ marginBottom: "20px" }}
        >
          User Profile
        </Typography>
        <UserProfile />
      </Box>
    </Container>
  );
};

export default UserProfilePage;
