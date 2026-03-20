import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fonts } from "../utility/fonts";
import {
  getPublicOrgProfile,
  resetOrgPublic,
  selectOrgPublicProfile,
  selectOrgPublicProfileError,
  selectOrgPublicProfileErrorCode,
  selectOrgPublicProfileLoading,
} from "../redux/slices/orgPublicSlice";
import OrgPublicHero from "../components/orgESP/OrgPublicHero";
import OrgPublicAnnouncementsAndEvents from "../components/orgESP/OrgPublicAnnouncementsAndEvents";
import OrgPublicServices from "../components/orgESP/OrgPublicServices";
import OrgPublicSharedContent from "../components/orgESP/OrgPublicSharedContent";
import ESPInfoPanel from "../components/orgESP/ESPInfoPanel";
import OrgPublicCounsellors from "../components/orgESP/OrgPublicCounsellors";
import HEIKeyStatsSection from "../components/orgHEI/HEIKeyStatsSection";
import HEIDescriptionTabs from "../components/orgHEI/HEIDescriptionTabs";

const OrgPublicHome = () => {
  const { slug, userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector(selectOrgPublicProfile);
  const profileError = useSelector(selectOrgPublicProfileError);
  const profileErrorCode = useSelector(selectOrgPublicProfileErrorCode);
  const profileLoading = useSelector(selectOrgPublicProfileLoading);

  const identifier = slug || userId;
  const idType = slug ? "slug" : "userId";

  useEffect(() => {
    if (!identifier) return;
    dispatch(resetOrgPublic());
    dispatch(getPublicOrgProfile({ identifier, idType }));
  }, [dispatch, identifier, idType]);

  if (!identifier) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", pt: "10rem" }}>
        <Typography sx={{ fontFamily: fonts.sans, color: "#666" }}>Organization not specified.</Typography>
      </Box>
    );
  }

  if (profileLoading) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", pt: "10rem" }}>
        <CircularProgress sx={{ color: "#BC2876" }} />
      </Box>
    );
  }

  if (profileError || !profile) {
    const isNotAvailable =
      profileErrorCode === "PUBLIC_HOME_NOT_AVAILABLE" ||
      profileError?.toLowerCase?.().includes("not available");
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pt: "10rem",
          px: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: "1.25rem",
            color: "#000",
            mb: 2,
            textAlign: "center",
          }}
        >
          {isNotAvailable ? "Page not available" : "Organization not found"}
        </Typography>
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontSize: "1rem",
            color: "#666",
            mb: 3,
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          {isNotAvailable
            ? "This organization's public page is not available at the moment."
            : profileError || "The organization you're looking for doesn't exist or the link may be incorrect."}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            background: "linear-gradient(155.92deg, #BF2F75 3.87%, #720361 63.8%)",
            textTransform: "none",
            fontFamily: fonts.sans,
            fontWeight: 600,
            borderRadius: "90px",
            px: 3,
            py: 1.5,
          }}
        >
          Go to Home
        </Button>
      </Box>
    );
  }

  const isHEI = profile.organizationType === "HEI";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        pt: "10rem",
        pb: 8,
        px: { xs: "1rem", md: "5rem" },
      }}
    >
      <Box sx={{ width: "100%", mx: "auto" }}>
        <OrgPublicHero profile={profile} />
        {!isHEI && <ESPInfoPanel profile={profile} />}
        {isHEI && <HEIKeyStatsSection profile={profile} />}
        {isHEI && <HEIDescriptionTabs profile={profile} />}
        <OrgPublicAnnouncementsAndEvents identifier={identifier} idType={idType} />
        <OrgPublicServices identifier={identifier} idType={idType} />
        {!isHEI && <OrgPublicCounsellors identifier={identifier} idType={idType} />}
        <OrgPublicSharedContent identifier={identifier} idType={idType} />
      </Box>
    </Box>
  );
};

export default OrgPublicHome;
