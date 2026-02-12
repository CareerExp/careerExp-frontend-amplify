import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserId } from "../redux/slices/authSlice.js";
import { fonts } from "../utility/fonts.js";

const SubscriptionCancelPage = () => {
  const navigate = useNavigate();
  const userId = useSelector(selectUserId);

  const handleTryAgain = () => {
    if (userId) {
      navigate(`/workspace/${userId}`, {
        state: { openSubscriptionTab: true },
      });
    } else {
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "#F9F9F9",
        textAlign: "center",
        padding: 3,
      }}
    >
      <CancelOutlinedIcon sx={{ fontSize: 80, color: "#BF2F75", mb: 2 }} />
      <Typography
        variant="h4"
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 700,
          color: "#333",
          mb: 2,
        }}
      >
        Checkout Cancelled
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontFamily: fonts.sans,
          color: "#555",
          mb: 3,
          maxWidth: 400,
        }}
      >
        Your subscription checkout was cancelled. You can try again whenever
        you’re ready.
      </Typography>
      <Button
        variant="contained"
        onClick={handleTryAgain}
        sx={{
          fontFamily: fonts.sans,
          background: "linear-gradient(180deg, #BF2F75 0%, #720361 100%)",
          color: "white",
          padding: "0.8rem 2rem",
          fontSize: "16px",
          textTransform: "none",
          borderRadius: "50px",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            background: "linear-gradient(180deg, #BF2F75 0%, #720361 100%)",
            opacity: 0.92,
            boxShadow: "none",
          },
        }}
      >
        Please Try Again
      </Button>
    </Box>
  );
};

export default SubscriptionCancelPage;
