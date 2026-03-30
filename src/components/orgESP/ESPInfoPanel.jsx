import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Grid, Chip, Divider, Paper } from "@mui/material";
import { fonts } from "../../utility/fonts";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
  TikTokIcon,
  TelegramIcon,
} from "../../assets/assest";
import BusinessIcon from "@mui/icons-material/Business";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { selectOrganizationProfile } from "../../redux/slices/organizationSlice";
import { countryList } from "../../utility/countryList";

/** Resolve flag image URL: use location.countryFlag, or look up by country name/code from countryList */
function getLocationCountryFlagUrl(location) {
  if (location?.countryFlag) return location.countryFlag;
  const country = location?.country;
  if (!country || typeof country !== "string") return null;
  const trimmed = country.trim();
  const found = countryList.find(
    (c) =>
      c.name?.toLowerCase() === trimmed.toLowerCase() ||
      c.code?.toUpperCase() === trimmed.toUpperCase(),
  );
  return found?.image ?? null;
}

const InfoRow = ({ label, children, isLast = false }) => (
  <Box sx={{ width: "100%", maxWidth: "100%", minWidth: 0 }}>
    <Box
      sx={{
        display: "flex",
        gap: 2,
        py: 1.5,
        alignItems: "flex-start",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
      }}
    >
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: "16px",
          color: "#000",
          width: { xs: "100%", md: "140px" },
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          flexGrow: 1,
          minWidth: 0,
          maxWidth: { xs: "100%", md: "none" },
          width: { xs: "100%", md: "auto" },
          "& a": {
            wordBreak: "break-word",
            overflowWrap: "anywhere",
            maxWidth: "100%",
          },
        }}
      >
        {children}
      </Box>
    </Box>
    {!isLast && <Divider sx={{ borderColor: "#f0f0f0" }} />}
  </Box>
);

const mutedPlaceholderSx = {
  fontFamily: fonts.sans,
  color: "rgba(0,0,0,0.45)",
  fontSize: "16px",
};

const LocationCard = ({ index, location }) => {
  const countryFlagUrl = getLocationCountryFlagUrl(location);
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: "15px",
        border: "1px solid rgba(0,0,0,0.1)",
        width: { xs: "100%", md: "297.5px" },
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        backgroundColor: "#fff",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: "14px",
            color: "#000",
            mb: 0.5,
          }}
        >
          Location {index}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 17,
              height: "auto",
              //   borderRadius: "50%",
              //   backgroundColor: "#eee",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {countryFlagUrl ? (
              <img
                src={countryFlagUrl}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  scale: 3,
                }}
              />
            ) : (
              <Box
                sx={{ width: "100%", height: "100%", backgroundColor: "#eee" }}
              />
            )}
          </Box>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "12px",
              color: "rgba(0,0,0,0.5)",
            }}
          >
            {location?.country?.trim() || "—"}
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}
          >
            <BusinessIcon sx={{ fontSize: "17px", color: "#BF2F75" }} />
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: "12px",
                color: "rgba(0,0,0,0.5)",
              }}
            >
              {location?.state?.trim() || "—"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MailOutlineIcon sx={{ fontSize: "17px", color: "#BF2F75" }} />
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "12px",
              color: "rgba(0,0,0,0.5)",
            }}
          >
            {location?.email?.trim() || "—"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PhoneInTalkIcon sx={{ fontSize: "17px", color: "#BF2F75" }} />
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "12px",
              color: "rgba(0,0,0,0.5)",
            }}
          >
            {location?.mobile?.trim() || "—"}
          </Typography>
        </Box>

        {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WhatsAppIcon sx={{ fontSize: '17px', color: 'rgba(0,0,0,0.5)' }} />
                <Typography sx={{ fontFamily: fonts.sans, fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>
                    {location?.mobile || "+1 000 0000 000"}
                </Typography>
            </Box> */}
      </Box>
    </Paper>
  );
};

const ESPInfoPanel = ({ profile: profileProp }) => {
  const profileFromRedux = useSelector(selectOrganizationProfile);
  const orgProfile =
    profileProp !== undefined ? profileProp : profileFromRedux;

  const specializations = Array.isArray(orgProfile?.specializations)
    ? orgProfile.specializations.filter(Boolean)
    : [];

  const socialLinks = orgProfile?.socialLinks || {};

  const socialIconsMap = [
    { key: "facebook", icon: FacebookIcon, link: socialLinks.facebook },
    { key: "instagram", icon: InstagramIcon, link: socialLinks.instagram },
    { key: "tiktok", icon: TikTokIcon, link: socialLinks.tiktok },
    { key: "linkedin", icon: LinkedinIcon, link: socialLinks.linkedIn },
    { key: "youtube", icon: YoutubeIcon, link: socialLinks.youtube },
    { key: "telegram", icon: TelegramIcon, link: socialLinks.telegram },
    { key: "twitter", icon: TwitterIcon, link: socialLinks.twitter },
  ].filter((item) => item.link);

  const languages = Array.isArray(orgProfile?.languages)
    ? orgProfile.languages.filter(Boolean)
    : [];
  const hashtags = Array.isArray(orgProfile?.tags)
    ? orgProfile.tags.filter(Boolean)
    : [];
  const locations = Array.isArray(orgProfile?.locations)
    ? orgProfile.locations
    : [];

  const orgContactEmail = String(orgProfile?.contactEmail || "").trim();

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        p: { xs: 2.5, md: "30px" },
        borderRadius: "0 0 20px 20px",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflow: { xs: "hidden", md: "visible" },
        boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Grid container spacing={4}>
        {/* Description Section */}
        <Grid item xs={12}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: "16px",
              color: "#000",
              mb: 1,
            }}
          >
            Description
          </Typography>
          {orgProfile?.description?.trim() ? (
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 400,
                fontSize: "16px",
                color: "#545454",
                lineHeight: "25px",
                wordBreak: { xs: "break-word", md: "normal" },
                overflowWrap: { xs: "anywhere", md: "normal" },
              }}
            >
              {orgProfile.description}
            </Typography>
          ) : (
            <Typography sx={{ ...mutedPlaceholderSx, lineHeight: "25px" }}>
              Description
            </Typography>
          )}
        </Grid>

        {/* Info List Section */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Divider sx={{ borderColor: "#f0f0f0" }} />

            <InfoRow label="Specializations">
              {specializations.length > 0 ? (
                specializations.map((spec) => (
                  <Chip
                    key={spec}
                    label={spec}
                    sx={{
                      backgroundColor: "rgba(188, 40, 118, 0.1)",
                      color: "#BC2876",
                      fontFamily: fonts.sans,
                      fontWeight: 500,
                      fontSize: "14px",
                      borderRadius: "90px",
                      height: { xs: "auto", md: "31px" },
                      maxWidth: { xs: "100%", md: "none" },
                      "& .MuiChip-label": {
                        px: 1.5,
                        py: { xs: 0.5, md: 0 },
                        whiteSpace: { xs: "normal", md: "nowrap" },
                        overflow: { xs: "visible", md: "hidden" },
                        textOverflow: { xs: "clip", md: "ellipsis" },
                        display: "block",
                      },
                    }}
                  />
                ))
              ) : (
                <Typography sx={mutedPlaceholderSx}>Specialization</Typography>
              )}
            </InfoRow>

            <InfoRow label="Hashtags">
              {hashtags.length > 0 ? (
                hashtags.map((tag) => (
                  <Typography
                    key={tag}
                    sx={{
                      fontFamily: fonts.sans,
                      color: "#545454",
                      fontSize: "16px",
                    }}
                  >
                    {tag.startsWith("#") ? tag : `#${tag}`}
                  </Typography>
                ))
              ) : (
                <Typography sx={mutedPlaceholderSx}>Hashtag</Typography>
              )}
            </InfoRow>

            <InfoRow label="Languages">
              {languages.length > 0 ? (
                languages.map((lang) => (
                  <Typography
                    key={lang}
                    sx={{
                      fontFamily: fonts.sans,
                      color: "#545454",
                      fontSize: "16px",
                    }}
                  >
                    {lang}
                  </Typography>
                ))
              ) : (
                <Typography sx={mutedPlaceholderSx}>Language</Typography>
              )}
            </InfoRow>

            <InfoRow label="Follow on">
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                {socialIconsMap.length > 0 ? (
                  socialIconsMap.map((item) => (
                    <Box
                      key={item.key}
                      component="img"
                      src={item.icon}
                      onClick={() => window.open(item.link, "_blank")}
                      sx={{ width: 25, height: 25, cursor: "pointer" }}
                    />
                  ))
                ) : (
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      color: "rgba(0,0,0,0.5)",
                      fontSize: "14px",
                    }}
                  >
                    No social links available
                  </Typography>
                )}
              </Box>
            </InfoRow>

            <InfoRow label="Website">
              {orgProfile?.website?.trim() ? (
                <Typography
                  component="a"
                  href={orgProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 500,
                    fontSize: "16px",
                    color: "#BC2876",
                    textDecoration: "none",
                    wordBreak: { xs: "break-word", md: "normal" },
                    overflowWrap: { xs: "anywhere", md: "normal" },
                    maxWidth: { xs: "100%", md: "none" },
                    display: "inline-block",
                  }}
                >
                  {orgProfile.website}
                </Typography>
              ) : (
                <Typography sx={mutedPlaceholderSx}>Website</Typography>
              )}
            </InfoRow>

            <InfoRow label="Email ID" isLast>
              {orgContactEmail ? (
                <Typography
                  component="a"
                  href={`mailto:${orgContactEmail}`}
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 500,
                    fontSize: "16px",
                    color: "#BC2876",
                    textDecoration: "none",
                    wordBreak: { xs: "break-word", md: "normal" },
                    overflowWrap: { xs: "anywhere", md: "normal" },
                    maxWidth: { xs: "100%", md: "none" },
                    display: "inline-block",
                  }}
                >
                  {orgContactEmail}
                </Typography>
              ) : null}
            </InfoRow>
          </Box>
        </Grid>

        {/* Locations Grid Section – only show when ESP has locations */}
        {locations.length > 0 && (
          <Grid item xs={12}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5, mt: 2 }}>
              {locations.map((loc, idx) => (
                <LocationCard key={idx} index={idx + 1} location={loc} />
              ))}
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ESPInfoPanel;
