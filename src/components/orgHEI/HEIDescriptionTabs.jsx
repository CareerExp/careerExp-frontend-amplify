import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Tabs, Tab, Divider } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
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
import { selectOrganizationProfile } from "../../redux/slices/organizationSlice";

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
          "& > .MuiTypography-root": {
            wordBreak: { xs: "break-word", md: "normal" },
            overflowWrap: { xs: "anywhere", md: "normal" },
            maxWidth: { xs: "100%", md: "none" },
          },
        }}
      >
        {children}
      </Box>
    </Box>
    {!isLast && <Divider sx={{ borderColor: "#f0f0f0" }} />}
  </Box>
);

const TabPanel = ({ value, index, children }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

/** HEI/org data may be at top level (public org profile) or under organization (userProfile.organization). */
function getHeiProfile(profile) {
  return profile?.organization ?? profile;
}

const HEIDescriptionTabs = ({ profile: profileProp }) => {
  const [tabValue, setTabValue] = useState(0);
  const profileFromRedux = useSelector(selectOrganizationProfile);
  const orgProfile = profileProp ?? profileFromRedux;
  const hei = getHeiProfile(orgProfile);

  const socialLinks = orgProfile?.socialLinks || hei?.socialLinks || {};
  const socialIconsMap = [
    { key: "facebook", icon: FacebookIcon, link: socialLinks.facebook },
    { key: "instagram", icon: InstagramIcon, link: socialLinks.instagram },
    { key: "tiktok", icon: TikTokIcon, link: socialLinks.tiktok },
    { key: "linkedin", icon: LinkedinIcon, link: socialLinks.linkedIn },
    { key: "youtube", icon: YoutubeIcon, link: socialLinks.youtube },
    { key: "telegram", icon: TelegramIcon, link: socialLinks.telegram },
    { key: "twitter", icon: TwitterIcon, link: socialLinks.twitter },
  ].filter((item) => item.link);

  const languages = orgProfile?.languages || hei?.languages || [];
  const description =
    orgProfile?.description || hei?.description || "No description available.";
  const specializations =
    orgProfile?.specializations ?? hei?.specializations ?? [];
  const website = orgProfile?.website || hei?.website || "";
  const contactEmail = String(
    orgProfile?.contactEmail ?? hei?.contactEmail ?? "",
  ).trim();
  const galleryImages = hei?.galleryImages ?? orgProfile?.galleryImages ?? [];
  const locations = hei?.locations ?? orgProfile?.locations ?? [];

  const formatAddressLine = (loc) => {
    const parts = [loc.address, loc.state, loc.country].filter(Boolean);
    return parts.join(", ") || "—";
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "0 0 20px 20px",
        width: "100%",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <Tabs
        value={tabValue}
        onChange={(_, v) => setTabValue(v)}
        TabIndicatorProps={{ sx: { backgroundColor: "#BC2876", height: 3 } }}
        sx={{
          px: 3,
          pt: 1,
          borderBottom: "1px solid #f0f0f0",
          "& .MuiTab-root": {
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: "16px",
            textTransform: "none",
            color: "rgba(0,0,0,0.6)",
          },
          "& .MuiTab-root.Mui-selected": { color: "#BC2876" },
          "& .MuiTabs-indicator": { backgroundColor: "#BC2876", height: 3 },
          "& .MuiTab-root.Mui-focusVisible": { outlineColor: "#BC2876" },
          "& .MuiTabs-flexContainer .MuiButtonBase-root": {
            "&.Mui-selected": { color: "#BC2876" },
            "&.Mui-focusVisible": {
              outline: "2px solid #BC2876",
              outlineOffset: 2,
            },
          },
          "& .MuiTab-root .MuiTouchRipple-root .MuiTouchRipple-child": {
            backgroundColor: "rgba(188, 40, 118, 0.3)",
          },
        }}
      >
        <Tab label="Description" />
        <Tab label="Campus Details" />
        <Tab label="Photo Gallery" />
      </Tabs>

      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4, maxWidth: "100%", minWidth: 0 }}>
        <TabPanel value={tabValue} index={0}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: "16px",
              color: "#000",
              mb: 1,
            }}
          >
            About Institute
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 400,
              fontSize: "16px",
              color: "#545454",
              lineHeight: "25px",
              mb: 3,
              wordBreak: { xs: "break-word", md: "normal" },
              overflowWrap: { xs: "anywhere", md: "normal" },
            }}
          >
            {description}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Divider sx={{ borderColor: "#f0f0f0" }} />
            <InfoRow label="Languages">
              {languages.length > 0 ? (
                languages.map((lang) => (
                  <Typography
                    key={typeof lang === "string" ? lang : (lang?.name ?? lang)}
                    sx={{
                      fontFamily: fonts.sans,
                      color: "#545454",
                      fontSize: "16px",
                    }}
                  >
                    {typeof lang === "string" ? lang : (lang?.name ?? lang)}
                  </Typography>
                ))
              ) : (
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    color: "rgba(0,0,0,0.5)",
                    fontSize: "16px",
                  }}
                >
                  —
                </Typography>
              )}
            </InfoRow>
            <InfoRow label="Specializations">
              {Array.isArray(specializations) && specializations.length > 0 ? (
                specializations.map((s) => (
                  <Typography
                    key={typeof s === "string" ? s : (s?.name ?? s)}
                    sx={{
                      fontFamily: fonts.sans,
                      color: "#545454",
                      fontSize: "16px",
                    }}
                  >
                    {typeof s === "string" ? s : (s?.name ?? s)}
                  </Typography>
                ))
              ) : (
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    color: "rgba(0,0,0,0.5)",
                    fontSize: "16px",
                  }}
                >
                  —
                </Typography>
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
                      alt=""
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
            {website && (
              <InfoRow label="Website">
                <Typography
                  component="a"
                  href={
                    website.startsWith("http") ? website : `https://${website}`
                  }
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
                  {website.replace(/^https?:\/\//i, "")}
                </Typography>
              </InfoRow>
            )}
            <InfoRow label="Email" isLast>
              {contactEmail ? (
                <Typography
                  component="a"
                  href={`mailto:${contactEmail}`}
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
                  {contactEmail}
                </Typography>
              ) : null}
            </InfoRow>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {locations.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              {locations.map((loc, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: { xs: "100%", sm: 297.5 },
                    minWidth: 0,
                    backgroundColor: "#fff",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "15px",
                    boxShadow: "0px 6px 24px 0px rgba(0,0,0,0.1)",
                    p: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {/* <Box
                    sx={{
                      height: 153,
                      borderRadius: "6px",
                      overflow: "hidden",
                      backgroundColor: "#d9d9d9",
                    }}
                  >
                    {loc.image ? (
                      <Box
                        component="img"
                        src={loc.image}
                        alt={loc.name || "Campus"}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : null}
                  </Box> */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: fonts.sans,
                        fontWeight: 700,
                        fontSize: "18px",
                        color: "#000",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        mb: 1,
                      }}
                    >
                      {loc.name || "Campus"}
                    </Typography>
                    {formatAddressLine(loc) !== "—" && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: "7px",
                          alignItems: "flex-start",
                        }}
                      >
                        <LocationOnIcon
                          sx={{
                            fontSize: 18,
                            color: "#BC2876",
                            flexShrink: 0,
                            mt: 0.25,
                          }}
                        />
                        <Typography
                          sx={{
                            fontFamily: fonts.sans,
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "rgba(0,0,0,0.5)",
                            lineHeight: 1.4,
                          }}
                        >
                          {formatAddressLine(loc)}
                        </Typography>
                      </Box>
                    )}
                    {loc.email && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: "7px",
                          alignItems: "center",
                        }}
                      >
                        <EmailOutlinedIcon
                          sx={{ fontSize: 18, color: "#BC2876", flexShrink: 0 }}
                        />
                        <Typography
                          component="a"
                          href={`mailto:${loc.email}`}
                          sx={{
                            fontFamily: fonts.sans,
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "rgba(0,0,0,0.5)",
                            textDecoration: "none",
                            "&:hover": { color: "#BC2876" },
                            wordBreak: { xs: "break-word", md: "normal" },
                          }}
                        >
                          {loc.email}
                        </Typography>
                      </Box>
                    )}
                    {loc.mobile && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: "7px",
                          alignItems: "center",
                        }}
                      >
                        <PhoneInTalkIcon
                          sx={{ fontSize: 18, color: "#BC2876", flexShrink: 0 }}
                        />
                        <Typography
                          component="a"
                          href={`tel:${loc.mobile.replace(/\s/g, "")}`}
                          sx={{
                            fontFamily: fonts.sans,
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "rgba(0,0,0,0.5)",
                            textDecoration: "none",
                            "&:hover": { color: "#BC2876" },
                          }}
                        >
                          {loc.mobile}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 400,
                fontSize: "16px",
                color: "#545454",
                lineHeight: "25px",
              }}
            >
              No campus locations added yet.
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {galleryImages.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 2,
              }}
            >
              {galleryImages.map((img, idx) => (
                <Box key={img.id ?? img._id ?? idx}>
                  <Box
                    component="img"
                    src={img.url}
                    alt={img.caption || "Gallery"}
                    sx={{
                      width: "100%",
                      aspectRatio: "4/3",
                      borderRadius: "12px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  {img.caption && (
                    <Typography
                      sx={{
                        fontFamily: fonts.sans,
                        fontSize: "14px",
                        color: "rgba(0,0,0,0.6)",
                        mt: 0.5,
                      }}
                    >
                      {img.caption}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 400,
                fontSize: "14px",
                color: "rgba(0,0,0,0.5)",
              }}
            >
              No photos in gallery yet.
            </Typography>
          )}
        </TabPanel>
      </Box>
    </Box>
  );
};

export default HEIDescriptionTabs;
