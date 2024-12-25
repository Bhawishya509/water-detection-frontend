import React from "react";
import { CircularProgress, Typography } from "@mui/material";
import './loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <CircularProgress color="primary" />
      <Typography variant="h6" className="loading-text">
        Loading... Please wait
      </Typography>
    </div>
  );
};

export default Loading;
