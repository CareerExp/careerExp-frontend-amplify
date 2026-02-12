import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserId } from "../redux/slices/authSlice.js";
import { getMyOrganizationProfile } from "../redux/slices/organizationSlice.js";
import { useDispatch } from "react-redux";
import { selectToken } from "../redux/slices/authSlice.js";
import { fonts } from "../utility/fonts.js";

const SubscriptionSuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (userId && token && sessionId) {
      dispatch(getMyOrganizationProfile({ token }));
    }
  }, [userId, token, sessionId, dispatch]);

  const handleGoToDashboard = () => {
    if (userId) {
      navigate(`/workspace/${userId}`);
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
      <CheckCircleOutlineIcon
        sx={{ fontSize: 80, color: "#3A8B3C", mb: 2 }}
      />
      <Typography
        variant="h4"
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 700,
          color: "#333",
          mb: 1,
        }}
      >
        Subscription Active
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontFamily: fonts.sans,
          color: "#555",
          mb: 3,
          maxWidth: 600,
          marginTop: 2,
        }}
      >
        Thank you for subscribing. Your organization profile is now fully activated and live on the platform.
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontFamily: fonts.sans,
          color: "#555",
          mb: 3,
          maxWidth: 600,
        }}
      >
        Your plan renews automatically each month. You can manage billing and subscription settings from your dashboard at any time.
      </Typography>
      <Button
        variant="contained"
        onClick={handleGoToDashboard}
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
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default SubscriptionSuccessPage;
