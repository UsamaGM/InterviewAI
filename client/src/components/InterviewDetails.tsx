import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  List,
  ListItem,
  Button,
  Box,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import api from "../services/api";
import { Interview } from "../utils/types";
import { AxiosError } from "axios";

const InterviewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await api.get(`/interviews/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setInterview(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(
            "Error fetching interview. Please try again later. " + error.message
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  const handleStartInterview = async () => {
    if (!interview) return;
    try {
      await api.post(
        `/interviews/${id}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/interviews/take/" + id, { state: { interview } });
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(
          "Error starting interview. Please try again. Error: " +
            error?.response?.data.message
        );
      }
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!interview) {
    return <Typography>Interview not found.</Typography>;
  }

  if (interview.status === "in-progress") {
    navigate("/interviews/take/" + id);
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={2} style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          {interview.title}
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          {interview.description}
        </Typography>
        {interview.status === "draft" && (
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartInterview}
            >
              Start Interview
            </Button>
          </Box>
        )}
      </Paper>

      {interview.status === "completed" && (
        <Paper elevation={2} style={{ padding: "20px", marginTop: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Interview Results
          </Typography>
          <Typography>Overall Score: {interview.score}</Typography>
          <Typography>Overall Feedback: {interview.feedback}</Typography>
          <List>
            {interview.questions.map((question) => (
              <ListItem key={question._id} divider>
                <Typography>
                  {question.questionText} - {question.aiAssessment?.feedback}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default InterviewDetails;
