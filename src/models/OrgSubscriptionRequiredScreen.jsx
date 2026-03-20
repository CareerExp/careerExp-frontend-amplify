import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CelebrationIcon from "@mui/icons-material/Celebration";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fonts } from "../utility/fonts.js";
import { selectToken } from "../redux/slices/authSlice.js";
import { selectUserProfile } from "../redux/slices/profileSlice.js";
import { selectOrganizationProfile } from "../redux/slices/organizationSlice.js";
import { createSubscriptionCheckoutSession } from "../redux/slices/subscriptionSlice.js";
import { notify } from "../redux/slices/alertSlice.js";
import AlarmClock from "../assets/AlarmClock.png";

// Figma 951-73126: colors and theme
const BG = "#F8F8FC";
const GREEN_BG = "#E6FAE6";
const GREEN_BORDER = "#82DE83";
const GREEN_TITLE = "#3A8B3C";
// Expired subscription banner
const RED_BG = "#FFEBEE";
const RED_BORDER = "#E57373";
const RED_TITLE = "#C62828";
const BODY_GREY = "#4A4A4A";
const CARD_TITLE = "#333333";
const PURPLE_CHECK = "linear-gradient(180deg, #BF2F75 0%, #720361 100%)";
const PLAN_CARD_BG = "#F8ECF7";
const PLAN_CARD_BORDER = "#934091";
const BADGE_BG = "#7A2878";
const BUTTON_GRADIENT = "linear-gradient(180deg, #BF2F75 0%, #720361 100%)";
// Coupon card – Figma 951-73264
const COUPON_ORANGE = "#FF8A00";
const COUPON_ORANGE_LIGHT_BG = "#FFF5E6";
const INPUT_BG_GRAY = "#D0D5DD"; /* Figma Gray/300 */
const COUPON_CODE = "WELCOME20";

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
 * variant: "required" = never had subscription (green banner, choose plan).
 *          "expired"   = subscription expired after grace (Stripe status "canceled") – red banner, resume payment.
 * "Proceed to Payment" starts Stripe Checkout and redirects to the checkout page.
 */
const OrgSubscriptionRequiredScreen = ({
  onProceedToPayment,
  isExpired = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const userData = useSelector(selectUserProfile);
  const orgProfile = useSelector(selectOrganizationProfile);
  const [loading, setLoading] = useState(false);

  const organizationId = userData?.organization?.organizationId;
  const organizationType =
    userData?.organization?.organizationType || orgProfile?.organizationType;
  const isValidType = organizationType === "ESP" || organizationType === "HEI";
  const canProceed = organizationId && isValidType && token;
  const planPrice = organizationType === "HEI" ? 100 : 150;

  const handleProceed = async () => {
    if (canProceed) {
      try {
        setLoading(true);
        const result = await dispatch(
          createSubscriptionCheckoutSession({
            organizationId,
            organizationType,
            token,
          }),
        ).unwrap();
        const checkoutUrl = result?.url ?? result?.data?.url;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          dispatch(
            notify({
              type: "error",
              message: "Could not start checkout. Please try again.",
            }),
          );
        }
      } catch (err) {
        dispatch(
          notify({
            type: "error",
            message: err || "Could not start checkout. Please try again.",
          }),
        );
      } finally {
        setLoading(false);
      }
    } else if (onProceedToPayment) {
      onProceedToPayment();
    } else {
      navigate(location.pathname, {
        state: { openSubscriptionTab: true },
        replace: true,
      });
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
      <Box sx={{ maxWidth: 820, margin: "0 auto" }}>
        {/* Banner – Green (required) or Red (expired) */}
        {isExpired ? (
          <Box
            sx={{
              backgroundColor: RED_BG,
              border: `1px solid ${RED_BORDER}`,
              borderRadius: "12px",
              p: 2,
              mb: 3,
              mt: 2,
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
            }}
          >
            <ErrorOutlineIcon
              sx={{ color: RED_TITLE, fontSize: 28, flexShrink: 0, mt: 0.25 }}
            />
            <Box>
              <Typography
                sx={{
                  fontFamily: fonts.poppins,
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  color: RED_TITLE,
                  mb: 0.5,
                }}
              >
                Subscription Expired
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
                Your subscription has expired due to non-payment.
              </Typography>
            </Box>
          </Box>
        ) : (
          <>
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
              <CelebrationIcon
                sx={{ color: "#EAB308", fontSize: 28, flexShrink: 0, mt: 0.25 }}
              />
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
                  Congratulations! Your profile is now approved. Complete your
                  subscription to activate your public profile and start
                  engaging with students.
                </Typography>
              </Box>
            </Box>
          </>
        )}

        {/* White card – Choose Your Plan (required) or Expired description + plans (expired) */}
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0px 4px 24px rgba(0,0,0,0.08)",
            overflow: "hidden",
            position: "relative",
            mt: 2,
            p: 3,
          }}
        >
          {isExpired ? (
            <>
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
                Please complete your payment to resume your services from where
                you left off. If payment is not received within the next 7 days,
                your profile page will no longer be visible and the counsellors
                associated with your organization will be permanently removed
                from your account.
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                }}
              >
                {/* Monthly Plan card */}
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "12px",
                    border: `2px solid #BF2F75`,
                    background:
                      "linear-gradient(180deg, #FFF5FA 0%, #FFF 80.01%)",
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
                        background:
                          "linear-gradient(163deg, #BF2F75 11.43%, #720361 61.53%)",
                        mb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: fonts.poppins,
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#fff",
                        }}
                      >
                        Recommended
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: fonts.poppins,
                      fontSize: "0.8125rem",
                      color: BODY_GREY,
                      mb: 0.5,
                    }}
                  >
                    Billed monthly
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fonts.poppins,
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      color: CARD_TITLE,
                    }}
                  >
                    ${planPrice}
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        color: BODY_GREY,
                      }}
                    >
                      /month
                    </Typography>
                  </Typography>
                </Box>

                {/* Coupon Code card */}
                <Box
                  sx={{
                    borderRadius: "12px",
                    border: `2px solid ${COUPON_ORANGE}`,
                    backgroundColor: "#fff",
                    p: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: fonts.poppins,
                      fontWeight: 600,
                      fontSize: "20px",
                      // color: "#BF2F75",
                      mb: 0.5,
                    }}
                  >
                    Have a Coupon Code?
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fonts.poppins,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: BODY_GREY,
                      letterSpacing: "0.05em",
                      mb: 1,
                    }}
                  >
                    You can redeem your promo code at checkout.
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                      backgroundColor: "#FFF8F0",
                      border: `1px solid #FF8A004D`,
                      borderRadius: "8px",
                      p: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: COUPON_ORANGE,
                        borderRadius: "50%",
                        p: 0.5,
                        flexShrink: 0,
                        mt: 0.25,
                        height: "32px",
                        width: "32px",
                      }}
                    >
                      <Box
                        component="img"
                        src={AlarmClock}
                        alt="clock"
                        height={16}
                        width={16}
                      />
                    </Box>
                    <Box>
                      <Typography
                        component="span"
                        sx={{
                          fontFamily: fonts.poppins,
                          fontWeight: 700,
                          fontSize: "0.8125rem",
                          color: COUPON_ORANGE,
                        }}
                      >
                        Offers:{" "}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          fontFamily: fonts.poppins,
                          fontSize: "12px",
                          lineHeight: "18px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        For special offers, please contact our support team.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </>
          ) : (
            <>
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
                Unlock tools designed to help education service providers grow
                visibility, manage leads, and build trust.
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                }}
              >
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
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}
                  >
                    {whatYouGetItems.map((text, idx) => (
                      <Box
                        key={idx}
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
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

                <Box>
                  {/* Monthly Plan card */}
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: "12px",
                      border: `2px solid #BF2F75`,
                      background:
                        "linear-gradient(180deg, #FFF5FA 0%, #FFF 80.01%)",
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
                          background:
                            "linear-gradient(163deg, #BF2F75 11.43%, #720361 61.53%)",
                          mb: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: fonts.poppins,
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#fff",
                          }}
                        >
                          Recommended
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: fonts.poppins,
                        fontSize: "0.8125rem",
                        color: BODY_GREY,
                        mb: 0.5,
                      }}
                    >
                      Billed monthly
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: fonts.poppins,
                        fontWeight: 700,
                        fontSize: "1.5rem",
                        color: CARD_TITLE,
                      }}
                    >
                      ${planPrice}
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          color: BODY_GREY,
                        }}
                      >
                        /month
                      </Typography>
                    </Typography>
                  </Box>

                  {/* Coupon Code card – Figma 951-73264 */}
                  <Box
                    sx={{
                      mt: 3,
                      borderRadius: "12px",
                      border: `2px solid ${COUPON_ORANGE}`,
                      backgroundColor: "#fff",
                      p: 2,
                    }}
                  >
                    {/* <Typography
                  sx={{
                    fontFamily: fonts.poppins,
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "#666666",
                    mb: 0.5,
                  }}
                >
                  Coupon Code
                </Typography> */}
                    <Typography
                      sx={{
                        fontFamily: fonts.poppins,
                        fontWeight: 700,
                        fontSize: "24px",
                        color: CARD_TITLE,
                        mb: 1,
                        // mt: 1,
                      }}
                    >
                      Have a Coupon Code?
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: fonts.poppins,
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: BODY_GREY,
                        // textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        mb: 1,
                      }}
                    >
                      You can redeem your promo code at checkout.
                    </Typography>
                    {/* <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: "#FAFAFA",
                    borderRadius: "8px",
                    border: `1px solid #D0D5DD`,
                    px: 2,
                    py: 1.25,
                    mb: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      flex: 1,
                      fontFamily: fonts.poppins,
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "#BF2F75",
                    }}
                  >
                    {COUPON_CODE}
                  </Typography>
                  <Box
                    component="button"
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(COUPON_CODE);
                      } catch {
                        const textArea = document.createElement("textarea");
                        textArea.value = COUPON_CODE;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textArea);
                      }
                      dispatch(
                        notify({ type: "success", message: "Code copied!" }),
                      );
                    }}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "8px",
                      background: PURPLE_CHECK,
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    <ContentCopyIcon sx={{ color: "#fff", fontSize: 20 }} />
                  </Box>
                </Box> */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        backgroundColor: "#FFF8F0",
                        border: `1px solid #FF8A004D`,
                        borderRadius: "8px",
                        p: 1.5,
                      }}
                    >
                      {/* <ScheduleIcon sx={{ color: COUPON_ORANGE, fontSize: 20, flexShrink: 0, mt: 0.25 }} /> */}
                      <Box
                        sx={{
                          fontSize: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: COUPON_ORANGE,
                          borderRadius: "50%",
                          p: 0.5,
                          flexShrink: 0,
                          mt: 0.25,
                          height: "32px",
                          width: "32px",
                        }}
                      >
                        <Box
                          component="img"
                          src={AlarmClock}
                          alt="clock"
                          height={16}
                          width={16}
                        />
                      </Box>

                      <Box>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: fonts.poppins,
                            fontWeight: 700,
                            fontSize: "0.8125rem",
                            color: COUPON_ORANGE,
                          }}
                        >
                          Offers:{" "}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: fonts.poppins,
                            fontSize: "12px",
                            lineHeight: "18px",
                            fontWeight: 400,
                            color: "#666666",
                          }}
                        >
                          For special offers, please contact our support team.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </>
          )}

          {/* Proceed to Payment – redirects to Stripe Checkout */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Box
              component="button"
              onClick={handleProceed}
              disabled={loading}
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
                cursor: loading ? "wait" : "pointer",
                "&:hover": { opacity: loading ? 1 : 0.95 },
                "&:disabled": { opacity: 0.8 },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Proceed to Payment"
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OrgSubscriptionRequiredScreen;
