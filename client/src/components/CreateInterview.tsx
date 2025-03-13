import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { InterviewForm, JobRole } from "../utils/types";
import { AxiosError } from "axios";

const CreateInterview: React.FC = () => {
  const [interviewForm, setInterviewForm] = useState<InterviewForm>({
    title: "",
    description: "",
    jobRole: JobRole.SoftwareEngineer.toString(),
  } as InterviewForm);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInterviewForm({ ...interviewForm, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      await api.post(
        "/interviews",
        {
          title: interviewForm.title,
          description: interviewForm.description,
          jobRole: interviewForm.jobRole,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/interviews");
    } catch (error: AxiosError | unknown) {
      let errorMessage = "Error creating interview. Please try again.";
      if (error instanceof AxiosError) {
        errorMessage = `${errorMessage} Error: ${error?.response?.data.message}`;
      }
      setError(errorMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      {error && (
        <Box mb={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={interviewForm.title}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={interviewForm.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          multiline
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            name="jobRole"
            value={interviewForm.jobRole}
            label="JobRole"
            onChange={(e) =>
              setInterviewForm({
                ...interviewForm,
                jobRole: e.target.value as keyof JobRole,
              })
            }
          >
            {Object.keys(JobRole).map((key) => (
              <MenuItem key={key} value={JobRole[key as keyof typeof JobRole]}>
                {JobRole[key as keyof typeof JobRole]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box mt={2} display="flex" justifyContent="center">
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CreateInterview;
