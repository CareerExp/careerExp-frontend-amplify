import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ESPHero from "../components/orgESP/ESPHero";
import HEIKeyStatsSection from "../components/orgHEI/HEIKeyStatsSection";
import HEIDescriptionTabs from "../components/orgHEI/HEIDescriptionTabs";
import OrgPublicHero from "../components/orgESP/OrgPublicHero";
import OrgPublicAnnouncementsAndEvents from "../components/orgESP/OrgPublicAnnouncementsAndEvents";
import OrgPublicServices from "../components/orgESP/OrgPublicServices";
import OrgPublicSharedContent from "../components/orgESP/OrgPublicSharedContent";
import OrgPublicCounsellors from "../components/orgESP/OrgPublicCounsellors";
import ESPAnnouncements from "../components/orgESP/ESPAnnouncements";
import ESPCounsellors from "../components/orgESP/ESPCounsellors";
import ESPSharedContent from "../components/orgESP/ESPSharedContent";
import {
  getPublicOrgProfile,
  resetOrgPublic,
  selectOrgPublicProfile,
  selectOrgPublicProfileLoading,
  selectOrgPublicProfileError,
  selectOrgPublicProfileErrorCode,
} from "../redux/slices/orgPublicSlice";
import { selectOrganizationProfile } from "../redux/slices/organizationSlice";

const OrgHEI = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const orgProfile = useSelector(selectOrganizationProfile);
  const publicProfile = useSelector(selectOrgPublicProfile);
  const publicProfileLoading = useSelector(selectOrgPublicProfileLoading);
  const publicProfileError = useSelector(selectOrgPublicProfileError);
  const publicProfileErrorCode = useSelector(selectOrgPublicProfileErrorCode);

  const identifier = slug ?? orgProfile?.slug ?? orgProfile?.userId;
  const idType = (slug || orgProfile?.slug) ? "slug" : "userId";
  const profile = publicProfile || orgProfile;

  useEffect(() => {
    if (slug) {
      dispatch(resetOrgPublic());
      dispatch(getPublicOrgProfile({ identifier: slug, idType: "slug" }));
    }
  }, [dispatch, slug]);

  const usePublicSections = Boolean(identifier);

  if (slug && publicProfileLoading && !publicProfile) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          pt: "10rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#BC2876" }} />
      </Box>
    );
  }

  if (slug && !publicProfileLoading && !publicProfile) {
    const isNotAvailable =
      publicProfileErrorCode === "PUBLIC_HOME_NOT_AVAILABLE" ||
      publicProfileError?.toLowerCase?.().includes("not available");
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          pt: "10rem",
          pb: 8,
          px: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "1.25rem", mb: 2 }}>
          {isNotAvailable ? "Page not available" : "Organization not found"}
        </Typography>
        <Typography sx={{ color: "#666", maxWidth: 420 }}>
          {isNotAvailable
            ? "This institution's public page is not available yet."
            : publicProfileError || "The organization you're looking for doesn't exist or the link may be incorrect."}
        </Typography>
      </Box>
    );
  }

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
        {slug && publicProfile ? (
          <OrgPublicHero profile={publicProfile} />
        ) : !slug ? (
          <ESPHero />
        ) : null}
        <HEIKeyStatsSection profile={profile} />
        <HEIDescriptionTabs profile={profile} />
        {usePublicSections ? (
          <>
            <OrgPublicAnnouncementsAndEvents identifier={identifier} idType={idType} />
            <OrgPublicServices identifier={identifier} idType={idType} />
            <OrgPublicCounsellors identifier={identifier} idType={idType} />
            <OrgPublicSharedContent identifier={identifier} idType={idType} />
          </>
        ) : (
          <>
            <ESPAnnouncements />
            <ESPCounsellors />
            <ESPSharedContent />
          </>
        )}
      </Box>
    </Box>
  );
};

export default OrgHEI;
