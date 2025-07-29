import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import commonStyle from "../../styles/Common.module.css";

const ContentSection = ({ activeSection, children, handleSaveSection, sectionList, handleGenerateClick }) => {
  // Check if current section is the last one
  const isLastSection = sectionList.indexOf(activeSection) === sectionList.length - 1;

  // Handle button click based on whether it's the last section
  const handleButtonClick = () => {
    if (isLastSection) {
      handleGenerateClick();
    } else {
      handleSaveSection(activeSection);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h6" fontWeight="bold">
        {activeSection}
      </Typography>
      <Divider sx={{ my: "1rem" }} />
      {children}
      <Box
        mt={3}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button className={commonStyle.navButton} onClick={handleButtonClick}>
          {isLastSection ? "Generate Resume" : "Save & Next"}
        </button>
      </Box>
    </Box>
  );
};

export default ContentSection;
