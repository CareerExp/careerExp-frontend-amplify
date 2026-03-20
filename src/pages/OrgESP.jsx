import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ESPHero from "../components/orgESP/ESPHero";
import ESPInfoPanel from "../components/orgESP/ESPInfoPanel";
import ESPCounsellors from "../components/orgESP/ESPCounsellors";
import OrgPublicHero from "../components/orgESP/OrgPublicHero";
import OrgPublicAnnouncementsAndEvents from "../components/orgESP/OrgPublicAnnouncementsAndEvents";
import OrgPublicServices from "../components/orgESP/OrgPublicServices";
import OrgPublicSharedContent from "../components/orgESP/OrgPublicSharedContent";
import OrgPublicCounsellors from "../components/orgESP/OrgPublicCounsellors";
import ESPAnnouncements from "../components/orgESP/ESPAnnouncements";
import ESPSharedContent from "../components/orgESP/ESPSharedContent";
import {
  getPublicOrgProfile,
  resetOrgPublic,
  selectOrgPublicProfile,
  selectOrgPublicProfileLoading,
} from "../redux/slices/orgPublicSlice";
import { selectOrganizationProfile } from "../redux/slices/organizationSlice";

const OrgESP = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const orgProfile = useSelector(selectOrganizationProfile);
  const publicProfile = useSelector(selectOrgPublicProfile);
  const publicProfileLoading = useSelector(selectOrgPublicProfileLoading);

  const identifier = slug ?? orgProfile?.slug ?? orgProfile?.userId;
  const idType = slug || orgProfile?.slug ? "slug" : "userId";
  const profile = publicProfile || orgProfile;

  useEffect(() => {
    if (slug) {
      dispatch(resetOrgPublic());
      dispatch(getPublicOrgProfile({ identifier: slug, idType: "slug" }));
    }
  }, [dispatch, slug]);

  const usePublicSections = Boolean(identifier);
  const showPublicHero = Boolean(
    slug && (publicProfile || publicProfileLoading),
  );

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
        {showPublicHero && publicProfile ? (
          <OrgPublicHero profile={publicProfile} />
        ) : (
          <ESPHero skipFollowCheck />
        )}
        <ESPInfoPanel profile={profile} />
        {/* {usePublicSections ? (
          <> */}
        <OrgPublicAnnouncementsAndEvents
          identifier={identifier}
          idType={idType}
        />
        <OrgPublicServices identifier={identifier} idType={idType} />
        <OrgPublicCounsellors identifier={identifier} idType={idType} />
        <OrgPublicSharedContent identifier={identifier} idType={idType} />
        {/* </>
        ) : (
          <>
            <ESPAnnouncements />
            <ESPCounsellors />
            <ESPSharedContent />
          </>
        )} */}
      </Box>
    </Box>
  );
};

export default OrgESP;
