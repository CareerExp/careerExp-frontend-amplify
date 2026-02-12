import React from "react";
import { Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { useNavigate, useLocation } from "react-router-dom";
import { fonts } from "../utility/fonts.js";

// Figma 951-73126: colors and theme
const BG = "#F8F8FC";
const GREEN_BG = "#E6FAE6";
const GREEN_BORDER = "#82DE83";
const GREEN_TITLE = "#3A8B3C";
const BODY_GREY = "#4A4A4A";
const CARD_TITLE = "#333333";
const PURPLE_CHECK = "linear-gradient(180deg, #BF2F75 0%, #720361 100%)";
const PLAN_CARD_BG = "#F8ECF7";
const PLAN_CARD_BORDER = "#934091";
const BADGE_BG = "#7A2878";
const BUTTON_GRADIENT = "linear-gradient(180deg, #BF2F75 0%, #720361 100%)";

const whatYouGetItems = [
  "Dedicated company profile page",
  "Add counselors to represent your institution",
  "Promote events to reach prospective students",
  "Receive Premium Onboarding & Dedicated Support",
  "Publish videos, podcasts, and articles",
  "Share institutional news and announcements",
  "Access a built-in Content Management System",
  "View performance through the Administrator Analytics Dashboard",
];

/**
 * Full-page screen when org is approved but subscription is not active/trialing.
 * Matches Figma 951-73126: approval banner + Choose Your Plan card. "Proceed to Payment" opens Profile > Subscription.
 */
const OrgSubscriptionRequiredScreen = ({ onProceedToPayment }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleProceed = () => {
    if (onProceedToPayment) {
      onProceedToPayment();
    } else {
      navigate(location.pathname, { state: { openSubscriptionTab: true }, replace: true });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 112px)",
        backgroundColor: BG,
        p: 2,
        borderRadius: 1,
      }}
    >
      <Box sx={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Green approval banner – Figma */}
        <Box
          sx={{
            backgroundColor: GREEN_BG,
            border: `1px solid ${GREEN_BORDER}`,
            borderRadius: "12px",
            p: 2,
            mb: 3,
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <CelebrationIcon sx={{ color: "#EAB308", fontSize: 28, flexShrink: 0, mt: 0.25 }} />
          <Box>
            <Typography
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: 700,
                fontSize: "1.125rem",
                color: GREEN_TITLE,
                mb: 0.5,
              }}
            >
              Your Profile Has Been Approved!
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.poppins,
                fontSize: "0.9375rem",
                fontWeight: 400,
                color: BODY_GREY,
                lineHeight: 1.5,
              }}
            >
              Congratulations! Your profile is now approved. Complete your subscription to activate your public profile and start engaging with students.
            </Typography>
          </Box>
        </Box>

        {/* White card – Choose Your Plan */}
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0px 4px 24px rgba(0,0,0,0.08)",
            overflow: "hidden",
            position: "relative",
            p: 3,
          }}
        >
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: 700,
              fontSize: "1.5rem",
              color: CARD_TITLE,
              mb: 0.5,
            }}
          >
            Choose Your Plan
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontSize: "0.9375rem",
              fontWeight: 400,
              color: BODY_GREY,
              mb: 3,
              lineHeight: 1.5,
            }}
          >
            Unlock tools designed to help education service providers grow visibility, manage leads, and build trust.
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
            {/* What You Get */}
            <Box>
              <Typography
                sx={{
                  fontFamily: fonts.poppins,
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: CARD_TITLE,
                  mb: 1.5,
                }}
              >
                What You Get
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                {whatYouGetItems.map((text, idx) => (
                  <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: PURPLE_CHECK,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <CheckIcon sx={{ color: "#fff", fontSize: 14 }} />
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: fonts.poppins,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: BODY_GREY,
                        lineHeight: 1.4,
                      }}
                    >
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Monthly Plan card */}
            <Box
              sx={{
                position: "relative",
                borderRadius: "12px",
                border: `2px solid #BF2F75`,
                background: "linear-gradient(180deg, #FFF5FA 0%, #FFF 80.01%)",
                height: "164px",
                p: 2,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -10,
                  right: 10,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: PURPLE_CHECK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckIcon sx={{ color: "#fff", fontSize: 14 }} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                sx={{
                  fontFamily: fonts.poppins,
                  fontWeight: 600,
                  fontSize: "20px",
                  color: "#BF2F75",
                  mb: 0.5,
                }}
              >
                Monthly Plan
              </Typography>
              <Box
                sx={{
                  display: "inline-block",
                  px: 1.5,
                  py: 0.25,
                  borderRadius: "25px",
                  background: "linear-gradient(163deg, #BF2F75 11.43%, #720361 61.53%)",
                  mb: 1,
                }}
              >
                <Typography sx={{ fontFamily: fonts.poppins, fontSize: "12px", fontWeight: 600, color: "#fff" }}>
                  Recommended
                </Typography>
              </Box>
              </Box>
              <Typography sx={{ fontFamily: fonts.poppins, fontSize: "0.8125rem", color: BODY_GREY, mb: 0.5 }}>
                Billed monthly
              </Typography>
              <Typography sx={{ fontFamily: fonts.poppins, fontWeight: 700, fontSize: "1.5rem", color: CARD_TITLE }}>
                $150
                <Typography component="span" sx={{ fontWeight: 500, fontSize: "0.875rem", color: BODY_GREY }}>
                  /month
                </Typography>
              </Typography>
            </Box>
          </Box>

          {/* Proceed to Payment */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Box
              component="button"
              onClick={handleProceed}
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: 700,
                fontSize: "1rem",
                color: "#fff",
                background: BUTTON_GRADIENT,
                border: "none",
                borderRadius: "12px",
                px: 4,
                py: 1.5,
                cursor: "pointer",
                "&:hover": { opacity: 0.95 },
              }}
            >
              Proceed to Payment
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OrgSubscriptionRequiredScreen;
