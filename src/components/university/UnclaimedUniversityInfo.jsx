import React from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
} from "../../assets/assest";
import { fonts } from "../../utility/fonts";

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

const UnclaimedUniversityInfo = ({ university }) => {
  if (!university) return null;
  const social = university.socialLinks || {};
  const links = [
    { key: "facebook", url: social.facebook, icon: FacebookIcon },
    { key: "instagram", url: social.instagram, icon: InstagramIcon },
    { key: "youtube", url: social.youtube, icon: YoutubeIcon },
    { key: "linkedIn", url: social.linkedIn, icon: LinkedinIcon },
  ].filter((x) => x.url && String(x.url).trim());

  const description = String(university.description || "").trim();
  const websiteRaw = university.website ? String(university.website).trim() : "";
  const websiteHref = websiteRaw
    ? websiteRaw.startsWith("http")
      ? websiteRaw
      : `https://${websiteRaw}`
    : "";

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
          {description ? (
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
              {description}
            </Typography>
          ) : (
            <Typography sx={{ ...mutedPlaceholderSx, lineHeight: "25px" }}>Description</Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Divider sx={{ borderColor: "#f0f0f0" }} />

            <InfoRow label="Website">
              {websiteRaw ? (
                <Typography
                  component="a"
                  href={websiteHref}
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
                  {websiteRaw}
                </Typography>
              ) : (
                <Typography sx={mutedPlaceholderSx}>Website</Typography>
              )}
            </InfoRow>

            <InfoRow label="Country">
              {university.country ? (
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "16px",
                    color: "#545454",
                  }}
                >
                  {university.country}
                </Typography>
              ) : (
                <Typography sx={mutedPlaceholderSx}>Country</Typography>
              )}
            </InfoRow>

            <InfoRow label="Follow on" isLast>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                {links.length > 0 ? (
                  links.map(({ key, url, icon }) => (
                    <Box
                      key={key}
                      component="img"
                      src={icon}
                      onClick={() => window.open(url, "_blank")}
                      sx={{ width: 25, height: 25, cursor: "pointer" }}
                      aria-label={key}
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

            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: "10px",
                backgroundColor: "rgba(188, 40, 118, 0.06)",
              }}
            >
              <Typography sx={{ fontFamily: fonts.sans, fontSize: "14px", color: "#545454" }}>
                Is this your university? Click &quot;Claim Page&quot; to get started.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UnclaimedUniversityInfo;
