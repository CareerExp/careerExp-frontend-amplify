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
        minHeight: "100vh",
        bgcolor: "#F9F9F9",
        padding: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 520,
          bgcolor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          p: 4,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
    </Box>
  );
};

export default PaymentCancelPage;
