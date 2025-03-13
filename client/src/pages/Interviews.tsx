import React from "react";
import InterviewList from "../components/InterviewList";
import { Link } from "react-router-dom";
import { Button, Container, Box } from "@mui/material";
import { StyledTitle } from "../MUIStyles";

const Interviews: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        paddingTop="1.5rem"
      >
        <StyledTitle variant="h4">Interviews</StyledTitle>
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
