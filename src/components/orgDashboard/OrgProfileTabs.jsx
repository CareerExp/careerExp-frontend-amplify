import React from "react";
import { Tab, Tabs } from "@mui/material";
import { fonts } from "../../utility/fonts";

const indicatorColor = "#b23a7a";
const labelColor = "#9e9e9e";
const selectedColor = "#b23a7a";

const tabSx = {
  color: labelColor,
  fontFamily: fonts.poppins,
  fontWeight: 500,
  fontSize: { xs: 12, sm: 14, md: 16 },
  minWidth: { xs: 120, sm: 160, md: 200 },
  px: { xs: 1, sm: 2 },
  textTransform: "none",
  "&.Mui-selected": {
    color: selectedColor,
  },
};

/**
 * Tabs for Organization Profile only.
 * Order: Subscription | Shared Content Visibility | Personal Information | Change Password
 * When hideSubscriptionAndChangePassword (e.g. admin in AME view): only Shared Content Visibility | Personal Information
 */
const OrgProfileTabs = ({ tabValue, onChange, hideSubscriptionAndChangePassword }) => {
  if (hideSubscriptionAndChangePassword) {
    return (
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => onChange(Number(newValue))}
        TabIndicatorProps={{
          sx: { backgroundColor: indicatorColor, height: 3, borderRadius: 2 },
        }}
        sx={{
          width: "100%",
          fontFamily: fonts.poppins,
          fontWeight: 300,
          minHeight: 48,
          ".MuiTabs-flexContainer": {
            justifyContent: "center",
            width: "100%",
          },
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Tab label="Shared Content Visibility" sx={tabSx} />
        <Tab label="Personal Information" sx={tabSx} />
      </Tabs>
    );
  }
  return (
    <Tabs
      value={tabValue}
      onChange={(e, newValue) => onChange(Number(newValue))}
      TabIndicatorProps={{
        sx: { backgroundColor: indicatorColor, height: 3, borderRadius: 2 },
      }}
      sx={{
        width: "100%",
        fontFamily: fonts.poppins,
        fontWeight: 300,
        minHeight: 48,
        ".MuiTabs-flexContainer": {
          justifyContent: "center",
          width: "100%",
        },
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Tab label="Subscription" sx={tabSx} />
      <Tab label="Shared Content Visibility" sx={tabSx} />
      <Tab label="Personal Information" sx={tabSx} />
      <Tab label="Change Password" sx={tabSx} />
    </Tabs>
  );
};

export default OrgProfileTabs;
