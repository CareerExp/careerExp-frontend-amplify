import React from "react";
import { List, ListItem, ListItemText, Box, useMediaQuery, useTheme } from "@mui/material";
import commonStyle from "../../styles/Common.module.css";
import dashboardStyles from "../../styles/ResumeDashboard.module.css";

const SectionNavigation = ({ activeSection, setActiveSection, sectionList }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {isMobile ? (
        // Horizontal scrollable navigation for mobile
        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
            display: "flex",
            flexDirection: "row",
            mb: 2,
            "&::-webkit-scrollbar": {
              height: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#bf2f75",
              borderRadius: "6px",
            },
          }}
        >
          {sectionList.map((section, index) => (
            <Box
              key={index}
              onClick={() => setActiveSection(section)}
              className={
                activeSection === section
                  ? `${dashboardStyles["active-section"]} ${dashboardStyles["section"]}`
                  : dashboardStyles["section"]
              }
              sx={{
                minWidth: "max-content",
                padding: "10px 15px",
                margin: "0 5px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {section}
            </Box>
          ))}
        </Box>
      ) : (
        // Vertical navigation for desktop
        <List sx={{ width: "100%", maxWidth: "100%" }}>
          {sectionList.map((section, index) => (
            <ListItem
              key={index}
              button
              onClick={() => setActiveSection(section)}
              className={
                activeSection === section
                  ? `${dashboardStyles["active-section"]} ${dashboardStyles["section"]}`
                  : dashboardStyles["section"]
              }
            >
              <ListItemText primary={section} />
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};

export default SectionNavigation;
