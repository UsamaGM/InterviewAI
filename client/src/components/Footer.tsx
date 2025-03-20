import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <AppBar
      position="static"
      color="primary"
      style={{ top: "auto", bottom: 0 }}
    >
      <Toolbar>
        <Typography variant="body2" style={{ margin: "0 auto" }}>
          © {new Date().getFullYear()} InterviewAI. All rights reserved.
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
