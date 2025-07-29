import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Box, Button, Typography } from "@mui/material";
import React from "react";

const PaymentCancelPage = () => {
  const handleRetry = () => {
    window.location.href = "/retry-payment";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "#F9F9F9",
        textAlign: "center",
        padding: 3,
      }}
    >
      <CancelOutlinedIcon sx={{ fontSize: 80, color: "#F44336", mb: 2 }} />
      <Typography
        variant="h4"
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: "bold",
          color: "#333",
          mb: 1,
        }}
      >
        Payment Failed!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontFamily: "Poppins, sans-serif",
          color: "#555",
          mb: 3,
        }}
      >
        Unfortunately, your payment could not be processed. Please try again.
      </Typography>
      <Button
        variant="contained"
        onClick={handleRetry}
        sx={{
          fontFamily: "Poppins, sans-serif",
          background: "linear-gradient(to right, #F44336, #E53935)",
          color: "white",
          padding: "0.8rem 2rem",
          fontSize: "16px",
          textTransform: "none",
          borderRadius: "50px",
          "&:hover": {
            background: "linear-gradient(to right, #D32F2F, #C62828)",
          },
        }}
      >
        Go Back
      </Button>
    </Box>
  );
};

export default PaymentCancelPage;
