import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  CircularProgress,
  Paper,
  Alert,
} from "@mui/material";
import api from "../services/api";
import { AxiosError } from "axios";

interface User {
  _id: string;
  email: string;
  name: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateData, setUpdateData] = useState<Partial<User>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
        setUpdateData(response.data);
      } catch (error: AxiosError | unknown) {
        let errorMessage = "Could not fetch user profile. Please try again.";
        if (error instanceof AxiosError) {
          console.error("Error fetching user profile:", error.message);
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
          console.error("Error fetching user profile:", error);
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUpdateData({ ...updateData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      await api.put("/users/profile", updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuccessMessage("Profile updated successfully!");
    } catch (error: AxiosError | unknown) {
      let errorMessage = "Could not update user profile. Please try again.";
      if (error instanceof AxiosError) {
        console.error("Error updating user profile:", error.message);
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
        console.error("Error updating user profile:", error);
      }
      setError(errorMessage);
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

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        {successMessage && (
          <Box mb={2}>
            <Alert severity="success">{successMessage}</Alert>
          </Box>
        )}
        {user && (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              value={user.email || ""}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Name"
              name="name"
              value={updateData.name || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Box mt={2} display="flex" justifyContent="center">
              <Button type="submit" variant="contained" color="primary">
                Update Profile
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default UserProfile;
