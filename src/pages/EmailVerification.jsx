import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { config } from "../config/config.js";

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  let token;

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    token = searchParams.get("token");
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${config.api}/api/auth/verify-email?token=${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setVerificationStatus(data.message);
          setIsLoading(false);
          // Redirect to login page after successful verification
          setTimeout(() => {
            navigate("/login");
          }, 3000); // Redirect after 3 seconds
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Email verification error:", error.message);
        setVerificationStatus("Error verifying email");
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        bgcolor: "#F9F9F9",
        textAlign: "center",
        padding: 3,
      }}
    >
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <Box
          sx={{
            maxWidth: "500px",
            bgcolor: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            textAlign: "center",
            padding: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "bold",
              color: "#333",
              mb: 2,
            }}
          >
            Account Verification
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "#555",
              mb: 1,
            }}
          >
            Email Verification Status
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "#777",
            }}
          >
            {verificationStatus}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default EmailVerification;
