import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Container,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Alert,
} from "@mui/material";
import { AxiosError } from "axios";
import { StyledButton, StyledLink, StyledPaper } from "../../MUIStyles";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"recruiter" | "candidate">("candidate");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      await api.post("/auth/register", { email, password, role });
      navigate("/login");
    } catch (error: AxiosError | unknown) {
      let errorMessage = "Registration failed. Please try again.";
      if (error instanceof AxiosError) {
        console.error("Registration failed:", error.message);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = error.message;
        }
      } else {
        console.error("Registration failed:", error);
      }
      setError(errorMessage);
    }
  };

  return (
    <Container maxWidth="md">
      <StyledPaper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
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
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
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
            >
              <MenuItem value={"candidate"}>Candidate</MenuItem>
              <MenuItem value={"recruiter"}>Recruiter</MenuItem>
            </Select>
          </FormControl>
          <Typography>
            Don't have an account yet?{" "}
            <StyledLink style={{ textDecoration: "none" }} to="/login">
              Login
            </StyledLink>
          </Typography>
          <Box mt={2} display="flex" justifyContent="center">
            <StyledButton type="submit" variant="contained" color="primary">
              Register
            </StyledButton>
          </Box>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default Register;
