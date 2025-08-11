import { Tab, Tabs } from "@mui/material";
import { fonts } from "../../utility/fonts.js";

const indicatorColor = "#b23a7a";
const labelColor = "#9e9e9e";
const selectedColor = "#b23a7a";

const ProfileTabs = ({ tabValue, setTabValue, userData }) => {
  return (
    <Tabs
      value={tabValue}
      onChange={(e, newValue) => setTabValue(newValue)}
      TabIndicatorProps={{
        sx: { backgroundColor: indicatorColor, height: 3, borderRadius: 2 },
      }}
      sx={{
        fontFamily: fonts.poppins,
        fontWeight: 300,
        minHeight: 48,
        ".MuiTabs-flexContainer": {
          justifyContent: "center",
        },
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Tab
        label="Personal Information"
        sx={{
          color: labelColor,
          fontFamily: fonts.poppins,
          // fontSize: 16,
          // minWidth: 200,
          fontSize: { xs: 12, sm: 14, md: 16 },
          minWidth: { xs: 120, sm: 160, md: 200 },
          px: { xs: 1, sm: 2 },
          textTransform: "none",
          "&.Mui-selected": {
            color: selectedColor,
          },
        }}
      />
      <Tab
        label="Change Password"
        sx={{
          color: labelColor,
          fontFamily: fonts.poppins,
          fontWeight: 500,
          // fontSize: 16,
          // minWidth: 200,
          fontSize: { xs: 12, sm: 14, md: 16 },
          minWidth: { xs: 120, sm: 160, md: 200 },
          px: { xs: 1, sm: 2 },
          textTransform: "none",
          "&.Mui-selected": {
            color: selectedColor,
          },
        }}
      />
      {/* <Tab
        label="Interests"
        sx={{
          display: userData?.activeDashboard !== "user" ? "none" : "block",
          color: labelColor,
          fontFamily: fonts.poppins,
          fontWeight: 500,
          // fontSize: 16,
          // minWidth: 200,
          fontSize: { xs: 12, sm: 14, md: 16 },
          minWidth: { xs: 120, sm: 160, md: 200 },
          px: { xs: 1, sm: 2 },
          textTransform: "none",
          "&.Mui-selected": {
            color: selectedColor,
          },
        }}
      /> */}
      <Tab
        label="Social Account"
        sx={{
          display:
            userData?.activeDashboard === "creator" ||
            userData?.activeDashboard === "admin"
              ? "none"
              : "block",
          color: labelColor,
          fontFamily: fonts.poppins,
          fontWeight: 500,
          // fontSize: 16,
          // minWidth: 200,
          fontSize: { xs: 12, sm: 14, md: 16 },
          minWidth: { xs: 120, sm: 160, md: 200 },
          px: { xs: 1, sm: 2 },
          textTransform: "none",
          "&.Mui-selected": {
            color: selectedColor,
          },
        }}
      />
      <Tab
        label="Educational Information"
        sx={{
          display:
            userData?.activeDashboard === "creator" ||
            userData?.activeDashboard === "admin"
              ? "none"
              : "block",
          color: labelColor,
          fontFamily: fonts.poppins,
          fontWeight: 500,
          // fontSize: 16,
          // minWidth: 200,
          fontSize: { xs: 12, sm: 14, md: 16 },
          minWidth: { xs: 120, sm: 160, md: 200 },
          px: { xs: 1, sm: 2 },
          textTransform: "none",
          "&.Mui-selected": {
            color: selectedColor,
          },
        }}
      />
    </Tabs>
  );
};

export default ProfileTabs;
