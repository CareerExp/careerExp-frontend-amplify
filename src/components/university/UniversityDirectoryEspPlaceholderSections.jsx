import React from "react";
import { Box, Typography } from "@mui/material";
import { fonts } from "../../utility/fonts";

const sectionTitleSx = {
  fontFamily: fonts.sans,
  fontWeight: 700,
  fontSize: { xs: "24px", md: "32px" },
  color: "#000",
  mb: 3,
  lineHeight: 1.2,
};

const sectionBodySx = {
  fontFamily: fonts.sans,
  fontSize: "16px",
  color: "#666",
};

/**
 * Mirrors OrgESP empty-state sections (no org identifier / no API calls).
 */
const UniversityDirectoryEspPlaceholderSections = () => (
  <>
    <Box sx={{ my: 6 }}>
      <Typography sx={sectionTitleSx}>Announcements and Events</Typography>
      <Typography sx={sectionBodySx}>No announcements or events yet.</Typography>
    </Box>
    <Box sx={{ my: 6 }}>
      <Typography sx={sectionTitleSx}>Connect 1-2-1</Typography>
      <Typography sx={sectionBodySx}>No services yet.</Typography>
    </Box>
    <Box sx={{ my: 6 }}>
      <Typography sx={sectionTitleSx}>Counsellors & Advisers</Typography>
      <Typography sx={sectionBodySx}>No counsellors yet.</Typography>
    </Box>
    <Box sx={{ my: 6 }}>
      <Typography sx={sectionTitleSx}>Shared Content</Typography>
      <Typography sx={sectionBodySx}>No shared content yet.</Typography>
    </Box>
  </>
);

export default UniversityDirectoryEspPlaceholderSections;
