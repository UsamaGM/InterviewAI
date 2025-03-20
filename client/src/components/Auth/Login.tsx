import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AxiosResponse } from "axios";
import { handleError } from "../../utils/errorHandler";
import {
  StyledButton,
  StyledContainer,
  StyledLink,
  StyledPaper,
  StyledTitle,
} from "../../MUIStyles";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response: AxiosResponse = await api.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      setError(handleError(error, "Failed to log in"));
    }
  };

  return (
    <StyledContainer>
      <StyledPaper elevation={3}>
        <StyledTitle variant="h4" align="center" marginBottom={2}>
          Login
        </StyledTitle>
        <Typography
          variant="body2"
          align="center"
          color="textSecondary"
          gutterBottom
        >
          Please log in to your account.
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
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            variant="outlined"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Typography
            variant="body2"
            style={{ marginTop: "16px" }}
            align="center"
          >
            Don't have an account yet?{" "}
            <StyledLink to="/register">Register</StyledLink>
          </Typography>
          <StyledButton>
            <button type="submit">Log In</button>
          </StyledButton>
        </form>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Login;
