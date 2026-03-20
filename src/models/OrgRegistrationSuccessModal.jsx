import React from "react";
import { Dialog, Box, Typography, Button, IconButton } from "@mui/material";
import { Close, Check } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fonts } from "../utility/fonts.js";
import { logout } from "../redux/slices/authSlice.js";

/**
 * Modal shown after successful HEI/ESP organization registration.
 * On dismiss (button or X): logs out any logged-in user and redirects to login.
 */
const OrgRegistrationSuccessModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDismiss = () => {
    dispatch(logout());
    onClose?.();
    navigate("/login", { replace: true });
  };

  return (
    <Dialog
      open={open}
      onClose={handleDismiss}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          maxWidth: "640px",
          p: 0,
          overflow: "visible",
          boxShadow: "0px 14px 44px 0px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          p: 3,
          pt: 4,
          pb: 3,
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Close (X) - top right, grey circle */}
        <IconButton
          onClick={handleDismiss}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            width: 32,
            height: 32,
            bgcolor: "rgba(0,0,0,0.08)",
            color: "#333",
            "&:hover": { bgcolor: "rgba(0,0,0,0.12)" },
          }}
          aria-label="Close"
        >
          <Close sx={{ fontSize: 18 }} />
        </IconButton>

        {/* Purple circle with checkmark */}
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            // bgcolor: "#5B21B6",
            background:
              "linear-gradient(162.56deg, #BF2F75 11.43%, #720361 61.54%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <Check sx={{ color: "#fff", fontSize: 32 }} />
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#000",
            textAlign: "center",
            mb: 1.5,
            px: 1,
          }}
        >
          Thank you for registering your organization
        </Typography>

        {/* Body */}
        <Typography
          sx={{
            fontFamily: fonts.poppins,
            fontSize: "0.9375rem",
            color: "#545454",
            textAlign: "center",
            lineHeight: 1.5,
            mb: 3,
            px: "1rem",
          }}
        >
          Your corporate details and verification information have been
          successfully submitted. Our team will verify your information and
          you'll receive a confirmation email within 24-48 hours.
        </Typography>

        {/* CTA Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleDismiss}
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: 600,
            maxWidth: "234px",
            margin: "auto",
            fontSize: "1rem",
            py: 1.5,
            borderRadius: "25px",
            background:
              "linear-gradient(162.56deg, #BF2F75 11.43%, #720361 61.54%)",
            textTransform: "none",
            "&:hover": { bgcolor: "#4C1D99" },
          }}
        >
          Go to Login
        </Button>
      </Box>
    </Dialog>
  );
};

export default OrgRegistrationSuccessModal;
