import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import { Box, Button, IconButton, Typography, Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../redux/slices/alertSlice.js";
import {
  getServiceById,
  registerServiceCta,
} from "../redux/slices/serviceSlice.js";
import { selectAuthenticated, selectToken, selectUserId } from "../redux/slices/authSlice.js";
import {
  getServiceRatingStatus,
  rateService,
} from "../redux/slices/ratingSlice.js";
import { fonts } from "../utility/fonts.js";
import { colors } from "../utility/color.js";
import { eventsPlaceholder } from "../assets/assest.js";
import InitialLoaders from "../loaders/InitialLoaders.jsx";

const ACCENT = "#DD4595";
const ACCENT_DARK = "#720361";

const ServiceDetailContent = ({ serviceId, onBack }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const isAuthenticated = useSelector(selectAuthenticated);
  const [service, setService] = useState(null);
  const [organizationDetails, setOrganizationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(null);
  const [totalRatings, setTotalRatings] = useState(null);

  const imageUrl =
    service?.coverImage || service?.image || eventsPlaceholder;
  const cta = service?.cta || {};
  const durationStr = service?.duration
    ? `${service.duration.value || ""} ${(service.duration.unit || "min").toLowerCase()}`.trim()
    : "";
  const serviceMode = (service?.serviceMode || "Online").toString();
  const priceLabel =
    service?.priceType === "FREE"
      ? "Free"
      : service?.priceType === "CUSTOM"
        ? "Custom"
        : service?.price != null
          ? `${service.currency || "INR"} ${service.price}`
          : "—";

  useEffect(() => {
    const fetchDetail = async () => {
      if (!serviceId) return;
      try {
        setLoading(true);
        const res = await dispatch(getServiceById(serviceId)).unwrap();
        if (res?.data) {
          setService(res.data);
          if (res.data.averageRating != null) setAverageRating(Number(res.data.averageRating));
          if (res.data.totalRatings != null) setTotalRatings(Number(res.data.totalRatings));
        } else {
          setService(null);
        }
        if (res?.organizationDetails != null)
          setOrganizationDetails(res.organizationDetails);
        else setOrganizationDetails(null);
      } catch (e) {
        dispatch(notify({ type: "error", message: "Service not found" }));
        onBack?.();
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [serviceId, dispatch, onBack]);

  useEffect(() => {
    const fetchServiceRating = async () => {
      if (!serviceId || !userId || !token || !isAuthenticated) return;
      try {
        const res = await dispatch(
          getServiceRatingStatus({ serviceId, userId, token })
        ).unwrap();
        setUserRating(Number(res?.rating) || 0);
      } catch (e) {
        setUserRating(0);
      }
    };
    fetchServiceRating();
  }, [serviceId, userId, token, isAuthenticated, dispatch]);

  const handleRatingChange = async (event, newValue) => {
    if (!isAuthenticated || !token || !userId) {
      dispatch(notify({ type: "warning", message: "Please log in to rate this service" }));
      return;
    }
    if (!serviceId || newValue == null) return;
    try {
      setUserRating(newValue);
      const res = await dispatch(
        rateService({ serviceId, userId, rating: newValue, token })
      ).unwrap();
      if (res?.averageRating != null) setAverageRating(Number(res.averageRating));
      if (res?.totalRatings != null) setTotalRatings(Number(res.totalRatings));
      dispatch(
        notify({
          type: "success",
          message: res?.message || "Rating saved successfully",
        })
      );
    } catch (err) {
      setUserRating(userRating);
      dispatch(
        notify({
          type: "error",
          message: err?.message || "Failed to save rating",
        })
      );
    }
  };

  const handleShare = () => {
    const url = window.location.origin + `/explore/service/${serviceId}`;
    if (navigator.share) {
      navigator.share({ title: service?.title, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      dispatch(notify({ type: "success", message: "Link copied" }));
    }
  };

  const handleEnquireNow = async () => {
    if (!serviceId) return;
    if (isAuthenticated && token) {
      try {
        await dispatch(
          registerServiceCta({
            id: serviceId,
            actionType: "CLICK",
            token,
          })
        ).unwrap();
        dispatch(notify({ type: "success", message: "Response recorded successfully." }));
      } catch (err) {
        dispatch(notify({ type: "error", message: err?.message || "Could not record response." }));
        return;
      }
    } else {
      dispatch(notify({ type: "warning", message: "Please log in to enquire" }));
      return;
    }
    // if (cta.type === "LINK" && cta.value) {
    //   window.open(cta.value.startsWith("http") ? cta.value : `https://${cta.value}`, "_blank");
    // } else if (cta.type === "EMAIL" && cta.value) {
    //   window.location.href = `mailto:${cta.value}`;
    // }
  };

  const messageProviderHref =
    organizationDetails?.contactEmail || service?.createdBy?.email
      ? `mailto:${organizationDetails?.contactEmail || service?.createdBy?.email}`
      : null;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "9rem",
        }}
      >
        <InitialLoaders />
      </Box>
    );
  }

  if (!service) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        marginTop: "8.5rem",
        pb: 4,
        pt: 2,
        boxSizing: "border-box",
        marginLeft: "5rem",
        marginRight: "5rem",
        "@media (max-width: 480px)": {
          marginLeft: "1rem",
          marginRight: "1rem",
        },
      }}
    >
      <Typography
        component="button"
        onClick={onBack}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          fontFamily: fonts.sans,
          fontSize: "16px",
          fontWeight: 600,
          color: ACCENT,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          mb: 2,
          "&:hover": { textDecoration: "underline" },
        }}
      >
        <ArrowBackIcon sx={{ fontSize: "1.25rem" }} />
        Back to Services
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          marginTop: "1rem",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "2px 2px 10px #a7a7a764",
              border: "1px solid #eeeeee",
              p: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                {service.category && (
                  <span
                    style={{
                      display: "inline-flex",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      backgroundColor: "#BC2876",
                      color: "white",
                      fontFamily: fonts.sans,
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                    }}
                  >
                    {service.category}
                  </span>
                )}
                <span
                  style={{
                    display: "inline-flex",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    backgroundColor: "#FFF3E0",
                    color: "#E65100",
                    fontFamily: fonts.sans,
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {serviceMode}
                </span>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
                <IconButton onClick={handleShare} size="small" sx={{ color: ACCENT }} aria-label="Share">
                  <ShareIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ color: ACCENT }}
                  aria-label="Bookmark"
                  onClick={() => setBookmarked((b) => !b)}
                >
                  <BookmarkBorderIcon />
                </IconButton>
              </Box>
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: { xs: "1.35rem", sm: "1.6rem" },
                color: colors.darkGray,
                lineHeight: 1.3,
                mb: 1.5,
              }}
            >
              {service.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 2 }}>
              {(organizationDetails?.organizationName || service.createdBy) && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {organizationDetails?.logo ? <Box component="img" src={organizationDetails.logo} alt="" sx={{ width: 48, height: 48, borderRadius: "10px", objectFit: "cover" }} /> : <BusinessCenterIcon sx={{ fontSize: 18, color: ACCENT }} />}
                  <Typography variant="body2" sx={{ fontFamily: fonts.sans, color: colors.darkGray }}>
                    {organizationDetails?.organizationName ||
                      [service.createdBy?.firstName, service.createdBy?.lastName].filter(Boolean).join(" ") ||
                      "—"}
                  </Typography>
                </Box>
              )}
              {durationStr && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 18, color: ACCENT }} />
                  <Typography variant="body2" sx={{ fontFamily: fonts.sans, color: colors.darkGray }}>
                    {durationStr}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                mb: 3,
                backgroundColor: "#e8e8e8",
                minHeight: 320,
              }}
            >
              <img
                src={imageUrl}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: 320,
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
            </Box>

            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: "1.125rem",
                color: colors.darkGray,
                mb: 1.5,
              }}
            >
              About This Service
            </Typography>
            {service.description && (
              <Box
                className="service-description"
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  color: colors.darkGray,
                  "& p": { mb: 1.5 },
                  "& h2, & h3": { fontFamily: fonts.sans, fontWeight: 600, mt: 2, mb: 1 },
                  "& ul, & ol": { pl: 2.5, mb: 1.5 },
                  "& a": { color: ACCENT, textDecoration: "underline" },
                  mb: 3,
                }}
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            )}

            {Array.isArray(service.whatsIncluded) && service.whatsIncluded.length > 0 && (
              <>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    color: colors.darkGray,
                    mb: 1.5,
                  }}
                >
                  What&apos;s Included
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5, mb: 3, listStyle: "none" }}>
                  {service.whatsIncluded.map((item, idx) => (
                    <Box
                      key={idx}
                      component="li"
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        mb: 0.75,
                        fontFamily: fonts.sans,
                        fontSize: "1rem",
                        color: colors.darkGray,
                      }}
                    >
                      <CheckCircleOutlineIcon sx={{ color: "#2E7D32", fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                      <span>{typeof item === "string" ? item : item?.text || item?.title || ""}</span>
                    </Box>
                  ))}
                </Box>
              </>
            )}

            {Array.isArray(service.whatYouWillLearn) && service.whatYouWillLearn.length > 0 && (
              <>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    color: colors.darkGray,
                    mb: 1.5,
                  }}
                >
                  What You Will Learn
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5, listStyle: "none" }}>
                  {service.whatYouWillLearn.map((item, idx) => (
                    <Box
                      key={idx}
                      component="li"
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        mb: 0.75,
                        fontFamily: fonts.sans,
                        fontSize: "1rem",
                        color: colors.darkGray,
                      }}
                    >
                      <LightbulbOutlinedIcon sx={{ color: ACCENT_DARK, fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                      <span>{typeof item === "string" ? item : item?.text || item?.title || ""}</span>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: 340 },
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignSelf: { md: "flex-start" },
          }}
        >
          {/* Service Overview card – Figma: key-value rows, rating stars, gradient + outlined buttons */}
          <Box
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              p: 2.5,
            }}
          >
            {/* Key-value rows: label left (muted), value right (bold) */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mb: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: "13px", color: "#999999", fontWeight: 500 }}>
                  Duration:
                </Typography>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: "14px", color: "#000000", fontWeight: 600 }}>
                  {durationStr || "—"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: "13px", color: "#999999", fontWeight: 500 }}>
                  Service Mode:
                </Typography>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: "14px", color: "#000000", fontWeight: 600 }}>
                  {serviceMode}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: "13px", color: "#999999", fontWeight: 500 }}>
                  Price:
                </Typography>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: "14px", color: "#000000", fontWeight: 600 }}>
                  {priceLabel}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: "13px", color: "#999999", fontWeight: 500 }}>
                  Your Rating:
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Rating
                    value={isAuthenticated ? userRating : (averageRating ?? 0)}
                    onChange={handleRatingChange}
                    readOnly={!isAuthenticated}
                    precision={1}
                    max={5}
                    size="small"
                    sx={{
                      "& .MuiRating-iconFilled": { color: "#FF8A00" },
                      "& .MuiRating-iconEmpty": { color: "#D0D5DD" },
                    }}
                  />
                  {totalRatings != null && totalRatings > 0 && (
                    <Typography
                      component="span"
                      sx={{ fontFamily: fonts.sans, fontSize: "12px", color: colors.midGray, ml: 0.5 }}
                    >
                      ({totalRatings})
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={handleEnquireNow}
              sx={{
                background: "linear-gradient(125deg, #BF2F75 -3.87%, #720361 63.8%)",
                boxShadow: "0 2px 8px rgba(114, 3, 97, 0.35)",
                textTransform: "none",
                borderRadius: "25px",
                py: 1.5,
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: "1rem",
                mb: 1.5,
                "&:hover": {
                  background: "linear-gradient(90deg, #5a0250 0%, #9f2663 50%, #c43d82 100%)",
                  boxShadow: "0 2px 12px rgba(114, 3, 97, 0.4)",
                },
              }}
            >
              {"Enquire Now"}
            </Button>
            {messageProviderHref && (
              <Button
                variant="outlined"
                fullWidth
                href={messageProviderHref}
                component="a"
                sx={{
                  border: "2px solid",
                  borderColor: ACCENT,
                  color: "#BC2876",
                  backgroundColor: "transparent",
                  textTransform: "none",
                  borderRadius: "25px",
                  py: 1.5,
                  fontFamily: fonts.sans,
                  fontWeight: 700,
                  fontSize: "1rem",
                  "&:hover": {
                    borderColor: ACCENT_DARK,
                    backgroundColor: "rgba(114, 3, 97, 0.04)",
                  },
                }}
              >
                Message Provider
              </Button>
            )}
          </Box>

          {organizationDetails && (
            <Box
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "2px 2px 10px #a7a7a764",
                p: 2.5,
              }}
            >
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 600,
                  fontSize: "1.125rem",
                  color: colors.darkGray,
                  mb: 2,
                }}
              >
                Institution Details
              </Typography>
              {organizationDetails.logo ? (
                <Box
                  component="img"
                  src={organizationDetails.logo}
                  alt=""
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "10px",
                    objectFit: "cover",
                    mb: 1.5,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "120px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, rgba(191, 47, 117, 0.06) 0%, rgba(114, 3, 97, 0.06) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontWeight: 700,
                      fontSize: "2rem",
                      color: ACCENT_DARK,
                    }}
                  >
                    {(organizationDetails.organizationName || "")
                      .split(/\s+/)
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 3)
                      .toUpperCase()}
                  </Typography>
                </Box>
              )}
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: ACCENT,
                  mb: 2,
                }}
              >
                {organizationDetails.organizationName}
              </Typography>
              {organizationDetails.address && (
                <Box sx={{ display: "flex", gap: 1, mb: 1, alignItems: "flex-start" }}>
                  <LocationOnOutlinedIcon sx={{ fontSize: 20, color: "#FF8A00", mt: 0.25 }} />
                  <Typography sx={{ fontFamily: fonts.sans, fontSize: "0.875rem", color: colors.midGray }}>
                    {organizationDetails.address}
                  </Typography>
                </Box>
              )}
              {(organizationDetails.contactEmail || service?.createdBy?.email) && (
                <Box sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
                  <EmailOutlinedIcon sx={{ fontSize: 20, color: "#FF8A00" }} />
                  <Typography
                    component="a"
                    href={`mailto:${organizationDetails.contactEmail || service?.createdBy?.email}`}
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "0.875rem",
                      color: colors.midGray,
                      textDecoration: "none",
                    }}
                  >
                    {organizationDetails.contactEmail || service?.createdBy?.email}
                  </Typography>
                </Box>
              )}
              {organizationDetails.website && (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <LanguageIcon sx={{ fontSize: 20, color: "#FF8A00" }} />
                  <Typography
                    component="a"
                    href={
                      organizationDetails.website.startsWith("http")
                        ? organizationDetails.website
                        : `https://${organizationDetails.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "0.875rem",
                      color: colors.midGray,
                      textDecoration: "none",
                    }}
                  >
                    {organizationDetails.website.replace(/^https?:\/\//i, "")}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ServiceDetailContent;
