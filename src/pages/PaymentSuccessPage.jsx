import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectAuthenticated, selectToken, selectUserId } from "../redux/slices/authSlice.js";
import { verifyPayment } from "../redux/slices/paymentSlice.js";

const PaymentSuccessPage = () => {
  const dispatchToRedux = useDispatch();
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);

  const authenticated = useSelector(selectAuthenticated);

  useEffect(() => {
    if (authenticated) {
      dispatchToRedux(verifyPayment({ userId, token }));
    }
  }, []);

  const handleProceed = () => {
    window.location.href = "/assessment-result1";
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
      <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "#4CAF50", mb: 2 }} />
      <Typography
        variant="h4"
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: "bold",
          color: "#333",
          mb: 1,
        }}
      >
        Payment Successful!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontFamily: "Poppins, sans-serif",
          color: "#555",
          mb: 3,
        }}
      >
        Thank you for your payment. You can now proceed to view your assessment results.
      </Typography>
      <Button
        variant="contained"
        onClick={handleProceed}
        sx={{
          fontFamily: "Poppins, sans-serif",
          background: "linear-gradient(to right, #4CAF50, #66BB6A)",
          color: "white",
          padding: "0.8rem 2rem",
          fontSize: "16px",
          textTransform: "none",
          borderRadius: "50px",
          "&:hover": {
            background: "linear-gradient(to right, #43A047, #388E3C)",
          },
        }}
      >
        Proceed to Result Page
      </Button>
    </Box>
  );
};

export default PaymentSuccessPage;
