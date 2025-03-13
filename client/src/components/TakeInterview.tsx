import React, { useState, useEffect, useRef, ReactElement } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  List,
  ListItem,
  TextField,
  Button,
  Box,
  CircularProgress,
  Paper,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import api from "../services/api";
import { Question, Interview } from "../utils/types";
import { AxiosError, AxiosResponse } from "axios";
import { CheckCircle, HelpOutline, Pending } from "@mui/icons-material";
import { handleError } from "../utils/errorHandler";

const TakeInterview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const interviewResponse = await api.post(
          `/interviews/${id}/generate-questions`
        );
        setInterview(interviewResponse.data);
        const initialAnswers: { [key: string]: string } = {};
        interviewResponse.data.questions.forEach((question: Question) => {
          initialAnswers[question._id] = question.answerText || "";
        });
        setAnswers(initialAnswers);
      } catch (error: AxiosError | unknown) {
        setError(handleError(error, "Error fetching interview"));
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  const getQuestionStatus = (question: Question) => {
    if (question.aiAssessment && question.aiAssessment.score !== undefined) {
      return "assessed";
    } else if (answers[question._id]) {
      return "answered";
    } else {
      return "pending";
    }
  };

  const getStatusIcon = (status: string): ReactElement | undefined => {
    switch (status) {
      case "assessed":
        return <CheckCircle color="success" />;
      case "answered":
        return <HelpOutline color="primary" />;
      case "pending":
        return <Pending color="action" />;
      default:
        return undefined;
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      saveAnswer(questionId, answer);
    }, 1000); // Save after 1 second of inactivity
  };

  const saveAnswer = async (questionId: string, answer: string) => {
    if (!interview) return;

    try {
      const updatedQuestions = interview.questions.map((question) => {
        if (question._id === questionId) {
          return { ...question, answerText: answer };
        }
        return question;
      });

      await api.put(`/interviews/${id}`, { questions: updatedQuestions });
      console.log(`Answer saved for question ${questionId}`);
    } catch (error) {
      setError(handleError(error, "Error saving answer"));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < interview!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitAnswers = async () => {
    if (!interview) return;

    try {
      const questionsWithAnswers = interview.questions.map((question) => ({
        ...question,
        answerText: answers[question._id] || "",
      }));

      await api.put(`/interviews/${id}`, { questions: questionsWithAnswers });
      navigate("/interviews");
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(handleError(error, "Error submitting answers"));
      }
    }
  };

  const handleAssessAnswer = async (
    questionId: string,
    questionIndex: number
  ) => {
    if (!interview) return;

    setLoading(true);

    try {
      const response: AxiosResponse<Interview> = await api.post(
        `/interviews/${id}/assess-answer`,
        {
          questionIndex: questionIndex,
          answerText: answers[questionId],
        }
      );

      setInterview(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(handleError(error, "Error assessing answer"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitInterview = async () => {
    if (!interview) return;

    try {
      await api.post(`/interviews/${id}/rate-interview`, {});
      const response = await api.get(`/interviews/${id}`);
      setInterview(response.data);
    } catch (error) {
      setError(handleError(error, "Error submitting interview"));
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

  if (!interview) {
    return <Typography>Interview not found.</Typography>;
  }

  const question: Question = interview.questions[currentQuestionIndex];

  return (
    <Container maxWidth="md">
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          {interview.title}
        </Typography>
        <Typography variant="body1" align="center">
          {interview.description}
        </Typography>
      </Paper>

      {interview.status === "in-progress" && question ? (
        <>
          <List>
            <ListItem key={question?._id} divider>
              <Paper elevation={1} style={{ width: "100%", padding: "16px" }}>
                <Typography variant="h6" gutterBottom>
                  {currentQuestionIndex + 1}. {question?.questionText}
                </Typography>
                <Chip
                  icon={getStatusIcon(
                    getQuestionStatus(interview.questions[currentQuestionIndex])
                  )}
                  label={getQuestionStatus(
                    interview.questions[currentQuestionIndex]
                  )}
                  size="small"
                />
                <TextField
                  label="Your Answer"
                  multiline
                  fullWidth
                  value={answers[question?._id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question?._id, e.target.value)
                  }
                  margin="normal"
                />
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      handleAssessAnswer(question?._id, currentQuestionIndex)
                    }
                    disabled={!answers[question?._id]}
                  >
                    Assess Answer
                  </Button>
                </Box>
                {question?.aiAssessment && (
                  <Box mt={2}>
                    <Divider style={{ marginBottom: "10px" }} />
                    <Typography variant="subtitle1">AI Assessment:</Typography>
                    <Typography>
                      Score: {question.aiAssessment.score}
                    </Typography>
                    <Typography>
                      Keywords: {question.aiAssessment.keywords?.join(", ")}
                    </Typography>
                    <Typography>
                      Sentiment: {question.aiAssessment.sentiment}
                    </Typography>
                    <Typography>
                      Feedback: {question.aiAssessment.feedback}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </ListItem>
          </List>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === interview.questions.length - 1}
            >
              Next
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography align="center">
            No questions found for this interview. Did you add any?
          </Typography>
        </>
      )}

      {interview.status === "in-progress" && question && (
        <Box mt={2} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitAnswers}
            style={{ marginRight: "10px" }}
          >
            Save Answers
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitInterview}
          >
            Submit Interview
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default TakeInterview;
