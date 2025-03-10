import React from "react";
import InterviewDetails from "../components/InterviewDetails";
import { Container, Box, Typography } from "@mui/material";

const InterviewDetailsPage: React.FC = () => {
  return (
    <Container
      maxWidth="xl"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start", // Align to top, as InterviewDetails might be scrollable
        minHeight: "100vh",
        paddingTop: "20px", // Add some padding at the top
      }}
    >
      <Box
        style={{
          width: "100%",
          maxWidth: "1200px", // Adjust max width as needed
          padding: "20px",
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          style={{ marginBottom: "20px" }}
        >
          Interview Details
        </Typography>
        <InterviewDetails />
      </Box>
    </Container>
  );
};

export default InterviewDetailsPage;
