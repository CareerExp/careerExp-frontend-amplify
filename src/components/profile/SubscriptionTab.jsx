import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Check from "@mui/icons-material/Check";
import { useDispatch, useSelector } from "react-redux";
import { fonts } from "../../utility/fonts";
import {
  sub1Icon,
  sub2Icon,
  sub3Icon,
  sub4Icon,
  sub5Icon,
  sub6Icon,
  sub7Icon,
} from "../../assets/assest";
import { selectToken } from "../../redux/slices/authSlice.js";
import { selectUserProfile } from "../../redux/slices/profileSlice.js";
import { selectOrganizationProfile } from "../../redux/slices/organizationSlice.js";
import {
  createSubscriptionCheckoutSession,
  selectSubscriptionLoading,
  selectSubscriptionError,
} from "../../redux/slices/subscriptionSlice.js";
import { notify } from "../../redux/slices/alertSlice.js";

const gradientBtn = {
  background: "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
  color: "#fff",
  borderRadius: "24px",
  textTransform: "none",
  fontFamily: fonts.sans,
  fontWeight: 600,
  fontSize: "16px",
  px: 4,
  py: 1.5,
  boxShadow: "none",
  "&:hover": {
    opacity: 0.92,
    boxShadow: "none",
    background: "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
  },
};

// Figma 951-72872: "What You Get" – exact copy with asset icons sub1–sub7
const whatYouGetItems = [
  { icon: sub1Icon, text: "Official El Branded Home Page" },
  { icon: sub2Icon, text: "Visibility on Partners Page" },
  { icon: sub3Icon, text: "Verified Institution badge" },
  { icon: sub4Icon, text: "Access to El Dashboard" },
  { icon: sub5Icon, text: "Course & program visibility" },
  { icon: sub6Icon, text: "Student enquiry management" },
  { icon: sub7Icon, text: "Institutional credibility across the platform" },
];

/**
 * Organization Profile – Subscription tab.
 * Left: What You Get (Figma 951-72872). Right: Available Plans with dynamic selection (Figma 951-73082).
 * "Proceed to Payment" / "Renew Subscription" starts Stripe Checkout for organization subscription.
 */
const SubscriptionTab = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const userData = useSelector(selectUserProfile);
  const orgProfile = useSelector(selectOrganizationProfile);
  const loading = useSelector(selectSubscriptionLoading);
  const subscriptionError = useSelector(selectSubscriptionError);

  const [selectedPlan, setSelectedPlan] = useState("monthly"); // 'annual' | 'monthly'

  const organizationId = userData?.organization?.organizationId;
  const organizationType =
    userData?.organization?.organizationType || orgProfile?.organizationType;
  const isValidType = organizationType === "ESP" || organizationType === "HEI";
  const canProceed = organizationId && isValidType && token;

  const handleProceedToPayment = async () => {
    if (!canProceed) return;
    try {
      const result = await dispatch(
        createSubscriptionCheckoutSession({
          organizationId,
          organizationType,
          token,
        })
      ).unwrap();
      const checkoutUrl = result?.url ?? result?.data?.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        dispatch(
          notify({
            type: "error",
            message: "Could not start checkout. Please try again.",
          })
        );
      }
    } catch (err) {
      dispatch(
        notify({
          type: "error",
          message: err || "Could not start checkout. Please try again.",
        })
      );
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Grid container spacing={4}>
        {/* Left: What You Get (Figma 951-72872) */}
        <Grid item xs={12} md={6}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "18px",
              fontWeight: 700,
              color: "#101828",
              mb: 2,
            }}
          >
            What You Get
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {whatYouGetItems.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={item.icon}
                    alt=""
                    sx={{ width: 22, height: 22, filter: "brightness(0) invert(1)" }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#101828",
                  }}
                >
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Right: Available Plans (Figma 951-73082) – gradient border on selected, tick on border */}
        <Grid item xs={12} md={6}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "18px",
              fontWeight: 700,
              color: "#101828",
              mb: 2,
            }}
          >
            Available Plans
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Annual Plan */}
            {/* <Box
              onClick={() => setSelectedPlan("annual")}
              sx={{
                position: "relative",
                borderRadius: "12px",
                padding: "2px",
                background: selectedPlan === "annual"
                  ? "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)"
                  : "transparent",
                cursor: "pointer",
                border: selectedPlan === "annual" ? "none" : "1px solid #E5E7EB",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -2,
                  right: 12,
                  zIndex: 1,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: selectedPlan === "annual"
                    ? "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)"
                    : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: selectedPlan === "annual" ? "2px solid #fff" : "none",
                  boxSizing: "border-box",
                }}
              >
                {selectedPlan === "annual" && (
                  <CheckCircleIcon sx={{ color: "#fff", fontSize: 18 }} />
                )}
              </Box>
              <Box
                sx={{
                  p: 2,
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  minHeight: 100,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontWeight: 700,
                      fontSize: "16px",
                      color: selectedPlan === "annual" ? "#BF2F75" : "#101828",
                    }}
                  >
                    Annual Plan
                  </Typography>
                  {selectedPlan === "annual" && (
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.25,
                        borderRadius: "6px",
                        backgroundColor: "#720361",
                      }}
                    >
                      <Typography sx={{ fontFamily: fonts.sans, fontSize: "12px", fontWeight: 600, color: "#fff" }}>
                        Your Current Plan
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: "13px", color: "#667085", mb: 1 }}>
                  Billed yearly
                </Typography>
                <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: "24px", color: "#101828" }}>
                  $29,999
                  <Typography component="span" sx={{ fontWeight: 500, fontSize: "14px", color: "#667085" }}> / year</Typography>
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    display: "inline-block",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "6px",
                    backgroundColor: "#DCFCE7",
                  }}
                >
                  <Typography sx={{ fontFamily: fonts.sans, fontSize: "12px", fontWeight: 600, color: "#166534" }}>
                    Save 17% annually
                  </Typography>
                </Box>
              </Box>
            </Box> */}

            {/* Monthly Plan */}
            <Box
              onClick={() => setSelectedPlan("monthly")}
              sx={{
                position: "relative",
                borderRadius: "12px",
                padding: "2px",
                background: selectedPlan === "monthly"
                  ? "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)"
                  : "transparent",
                cursor: "pointer",
                // border: selectedPlan === "monthly" ? "none" : "1px solid #E5E7EB",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -10,
                  right: 12,
                  zIndex: 1,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: selectedPlan === "monthly"
                    ? "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)"
                    : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // border: selectedPlan === "monthly" ? "2px solid #fff" : "none",
                  boxSizing: "border-box",
                }}
              >
                {selectedPlan === "monthly" && (
                  <Check sx={{ color: "#fff", fontSize: 18, backgroundColor: "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)" }} />
                )}
              </Box>
              <Box
                sx={{
                  p: 2,
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontWeight: 700,
                      fontSize: "16px",
                      color: selectedPlan === "monthly" ? "#BF2F75" : "#101828",
                    }}
                  >
                    Monthly Plan
                  </Typography>
                  {selectedPlan === "monthly" && (
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.25,
                        borderRadius: "6px",
                        backgroundColor: "#720361",
                      }}
                    >
                      <Typography sx={{ fontFamily: fonts.sans, fontSize: "12px", fontWeight: 600, color: "#fff" }}>
                        Your Current Plan
                      </Typography>
                    </Box>
                  )}
                </Box>
                {/* <Typography sx={{ fontFamily: fonts.sans, fontSize: "13px", color: "#667085", mb: 1 }}>
                  Billed monthly
                </Typography> */}
                <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: "24px", color: "#720361" }}>
                  $150
                  <Typography component="span" sx={{ fontWeight: 500, fontSize: "14px", color: "#667085" }}> / month</Typography>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
        {subscriptionError && (
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "14px",
              color: "#d32f2f",
              mb: 1,
            }}
          >
            {subscriptionError}
          </Typography>
        )}
        {!canProceed && !loading && (
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "14px",
              color: "#667085",
              mb: 1,
            }}
          >
            Loading organization details…
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={handleProceedToPayment}
          disabled={!canProceed || loading}
          sx={gradientBtn}
        >
          {loading ? (
            <CircularProgress color="inherit" size={24} />
          ) : (
            "Proceed to Payment"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default SubscriptionTab;
