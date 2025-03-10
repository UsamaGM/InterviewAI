import React from "react";
import CreateInterview from "../components/CreateInterview";
import { Container, Box, Typography, Paper } from "@mui/material";

const CreateInterviewPage: React.FC = () => {
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
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            style={{ marginBottom: "20px" }}
          >
            Create New Interview
          </Typography>
          <CreateInterview />
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateInterviewPage;
