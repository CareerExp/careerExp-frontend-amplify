import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUserId, selectToken } from "../redux/slices/authSlice.js";
import { getMyOrganizationProfile } from "../redux/slices/organizationSlice.js";
import { fonts } from "../utility/fonts.js";

const REDIRECT_DELAY_MS = 10000;
const COUNTDOWN_SECONDS = 10;

const BillingReturnPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const redirectTimeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const [secondsRemaining, setSecondsRemaining] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (!userId) return;

    dispatch(getMyOrganizationProfile({ token }));

    redirectTimeoutRef.current = setTimeout(() => {
      navigate(`/workspace/${userId}`, { replace: true });
    }, REDIRECT_DELAY_MS);

    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [userId, token, dispatch, navigate]);

  const handleGoToDashboard = () => {
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
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
        padding: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
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
        <CheckCircleOutlineIcon
          sx={{ fontSize: 80, color: "#3A8B3C", mb: 2 }}
        />
        <Typography
          variant="h4"
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            color: "#333",
            mb: 2,
          }}
        >
          You're All Set!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: fonts.sans,
            color: "#555",
            mb: 3,
            maxWidth: 480,
          }}
        >
          Thanks for managing your subscription.
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
          We're syncing your latest billing updates securely. This usually takes
          just a moment. Hang tight — we'll take you back to your dashboard shortly.
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: fonts.sans,
            color: "#667085",
            mb: 2,
            maxWidth: 600,
            fontSize: "14px",
          }}
        >
          {userId
            ? `You will be automatically redirected in ${secondsRemaining} seconds.`
            : "You can return to your dashboard below."}
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
          👉 Go to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default BillingReturnPage;
