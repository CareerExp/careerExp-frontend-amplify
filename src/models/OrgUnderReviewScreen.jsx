import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fonts } from "../utility/fonts.js";
import hourglassIcon from "../assets/hourglass.svg";

/**
 * Full-screen view shown when an organization is logged in but account status is not active (e.g. pending approval).
 * Matches Figma: "Your Account is Under Review" with hourglass icon and "Go to Homepage" -> explore page.
 */
const OrgUnderReviewScreen = () => {
  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate("/explore", { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 112px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F8F8FD",
        p: 2,
        borderRadius: 1,
      }}
    >
      <Box
        sx={{
          maxWidth: 448,
          width: "100%",
          bgcolor: "#fff",
          borderRadius: "16px",
          boxShadow: "0px 4px 24px rgba(0,0,0,0.08)",
          p: 3,
          pt: 4,
          pb: 3,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <Box
            component="img"
            src={hourglassIcon}
            alt=""
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>

        <Typography
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "#000",
            mb: 1.5,
          }}
        >
          Your Account is Under Review
        </Typography>

        <Typography
          sx={{
            fontFamily: fonts.poppins,
            fontSize: "0.9375rem",
            color: "#545454",
            lineHeight: 1.6,
            mb: 3,
          }}
        >
          Thank you for registering! Your account has been submitted for review. Our team will verify your information and you'll receive a confirmation email within 24-48 hours.
        </Typography>

        <Button
          fullWidth
          variant="contained"
          onClick={handleGoToHome}
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: 600,
            fontSize: "1rem",
            maxWidth: "234px",
            margin: "auto",
            py: 1.5,
            borderRadius: "25px",
            background: "linear-gradient(162.56deg, #BF2F75 11.43%, #720361 61.54%)",
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(162.56deg, #BF2F75 9.43%, #720361 50.54%)",
            },
          }}
        >
          Go to Homepage
        </Button>
      </Box>
    </Box>
  );
};

export default OrgUnderReviewScreen;
