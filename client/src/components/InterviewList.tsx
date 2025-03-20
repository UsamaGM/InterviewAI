import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Fab,
  List,
  ListItemText,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Interview } from "../utils/types";
import { StyledFab, StyledListItem } from "../MUIStyles";
import { handleError } from "../utils/errorHandler";
import api from "../services/api";
import { theme } from "../MUIStyles/theme";

const InterviewList: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get("/interviews");
        setInterviews(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError(handleError(error, "Failed to fetch interviews"));
      }
    };

    fetchInterviews();
  }, []);

  return (
    <Container
      maxWidth="md"
      style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        height: "100vh",
      }}
    >
      {error ? (
        <Typography
          justifySelf="center"
          variant="body1"
          color="error"
          align="center"
        >
          {error}
        </Typography>
      ) : (
        <List>
          {interviews.length > 0 ? (
            interviews.map((interview) => (
              <Link
                to={`/interviews/${interview._id}`}
                key={interview._id}
                style={{ textDecoration: "none" }}
              >
                <StyledListItem style={{ width: "100%", display: "flex" }}>
                  <ListItemText
                    primary={interview.title}
                    secondary={interview.description}
                  />
                  <Box gap={1} display="flex">
                    <Link to={`/interviews/${interview._id}/edit`}>
                      <Edit
                        sx={{
                          color: "grey.500",
                          transition: "color 0.3s ease, transform 0.3s ease",
                          "&:hover": {
                            color: "primary.main",
                            transform: "scale(1.2)",
                          },
                        }}
                      />
                    </Link>
                    <Delete
                      sx={{
                        color: "gray",
                        transition: "transform 0.3s ease, color 1s ease",
                        "&:hover": {
                          transform: "scale(1.2)",
                          color: theme.palette.error.main,
                        },
                      }}
                    />
                  </Box>
                </StyledListItem>
              </Link>
            ))
          ) : (
            <Typography
              variant="body1"
              align="center"
              style={{ marginTop: "16px" }}
            >
              No interviews yet! Let's create some.
            </Typography>
          )}
          <Link to="/interviews/new">
            <StyledFab title="Create Interview" icon={<Add />} />
          </Link>
        </List>
      )}
    </Container>
  );
};

export default InterviewList;
