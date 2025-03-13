// client/src/components/InterviewList.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { Interview } from "../utils/types";
import api from "../services/api";

const InterviewList: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get("/interviews");
        setInterviews(Array.isArray(response.data) ? response.data : []);
        console.log(response);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <Container maxWidth="md">
      <Box style={{ marginTop: "20px" }}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h4" gutterBottom>
            Interview List
          </Typography>
          <List>
            {interviews.length ? (
              interviews.map((interview) => (
                <ListItem
                  key={interview._id}
                  component={Link}
                  to={
                    interview.status === "scheduled"
                      ? `/interviews/take/${interview._id}`
                      : `/interviews/${interview._id}`
                  }
                  style={{ width: "100%" }} // Add style to ListItem
                >
                  <ListItemText
                    primary={interview.title}
                    secondary={interview.description}
                  />
                </ListItem>
              ))
            ) : (
              <Typography>No interviews yet! Let's create some</Typography>
            )}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default InterviewList;
