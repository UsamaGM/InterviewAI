import React from "react";
import InterviewList from "../components/InterviewList";
import { Container } from "@mui/material";

const Interviews: React.FC = () => {
  return (
    <Container
      style={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <InterviewList />
    </Container>
  );
};

export default Interviews;
