import React from "react";
import { Box, Typography, Paper, Divider, Link as MuiLink } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { fonts } from "../../utility/fonts";

const rowSx = {
  display: "flex",
  gap: 2,
  py: 1.5,
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "flex-start", sm: "center" },
};

const UnclaimedUniversityInfo = ({ university }) => {
  if (!university) return null;
  const social = university.socialLinks || {};
  const links = [
    { key: "instagram", url: social.instagram, Icon: InstagramIcon },
    { key: "facebook", url: social.facebook, Icon: FacebookIcon },
    { key: "youtube", url: social.youtube, Icon: YouTubeIcon },
    { key: "linkedIn", url: social.linkedIn, Icon: LinkedInIcon },
  ].filter((x) => x.url && String(x.url).trim());

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 4,
        p: 3,
        borderRadius: "15px",
        border: "1px solid rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: "18px",
          color: "#000",
          mb: 2,
        }}
      >
        University details
      </Typography>
      <Box sx={rowSx}>
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: "16px",
            color: "#000",
            minWidth: { sm: "140px" },
          }}
        >
          Website
        </Typography>
        <Box>
          {university.website ? (
            <MuiLink
              href={university.website}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ fontFamily: fonts.sans, fontSize: "16px", wordBreak: "break-all" }}
            >
              {university.website}
            </MuiLink>
          ) : (
            <Typography sx={{ fontFamily: fonts.sans, color: "rgba(0,0,0,0.45)" }}>
              —
            </Typography>
          )}
        </Box>
      </Box>
      <Divider sx={{ borderColor: "#f0f0f0" }} />
      <Box sx={rowSx}>
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: "16px",
            color: "#000",
            minWidth: { sm: "140px" },
          }}
        >
          Country
        </Typography>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: "16px", color: "#545454" }}>
          {university.country || "—"}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "#f0f0f0" }} />
      <Box sx={rowSx}>
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: "16px",
            color: "#000",
            minWidth: { sm: "140px" },
          }}
        >
          QS Rank
        </Typography>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: "16px", color: "#545454" }}>
          {university.qsRank != null && university.qsRank !== "" ? `#${university.qsRank}` : "—"}
        </Typography>
      </Box>
      {links.length > 0 ? (
        <>
          <Divider sx={{ borderColor: "#f0f0f0" }} />
          <Box sx={{ ...rowSx, alignItems: "center" }}>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: "16px",
                color: "#000",
                minWidth: { sm: "140px" },
              }}
            >
              Social
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              {links.map(({ key, url, Icon }) => (
                <MuiLink
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  sx={{ color: "#BC2876", display: "flex" }}
                >
                  <Icon fontSize="medium" />
                </MuiLink>
              ))}
            </Box>
          </Box>
        </>
      ) : null}
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
    </Paper>
  );
};

export default UnclaimedUniversityInfo;
