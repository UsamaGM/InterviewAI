import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Alert,
} from "@mui/material";
import {
  StyledButton,
  StyledContainer,
  StyledLink,
  StyledPaper,
  StyledTitle,
} from "../../MUIStyles";
import { handleError } from "../../utils/errorHandler";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"recruiter" | "candidate">("candidate");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/auth/register", { email, password, role });
      navigate("/login");
    } catch (error) {
      handleError(error, "Failed to register");
    }
  };

  return (
    <StyledContainer>
      <StyledPaper elevation={8}>
        <StyledTitle variant="h4" align="center" marginBottom={2}>
          Register
        </StyledTitle>
        <Typography align="center">
          Register now to avail an early bird discount
        </Typography>
        {error && (
          <Box mb={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={role}
              label="Role"
              onChange={(e) =>
                setRole(e.target.value as "recruiter" | "candidate")
              }
              variant="outlined"
            >
              <MenuItem value={"candidate"}>Candidate</MenuItem>
              <MenuItem value={"recruiter"}>Recruiter</MenuItem>
            </Select>
          </FormControl>
          <Typography
            variant="body2"
            style={{ marginTop: "16px" }}
            align="center"
          >
            Already have an account? <StyledLink to="/login">Login</StyledLink>
          </Typography>
          <StyledButton>
            <button type="submit">Register</button>
          </StyledButton>
        </form>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Register;
