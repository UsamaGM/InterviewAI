import React from "react";
import InterviewList from "../components/InterviewList";
import { Link } from "react-router-dom";
import { Button, Container, Box, Typography } from "@mui/material";

const Interviews: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginTop="20px"
        marginBottom="20px"
      >
        <Typography variant="h4">Interviews</Typography>
        <Button
          component={Link}
          to="/interviews/create"
          variant="contained"
          color="primary"
        >
          Create Interview
        </Button>
      </Box>
      <InterviewList />
    </Container>
  );
};

export default Interviews;
