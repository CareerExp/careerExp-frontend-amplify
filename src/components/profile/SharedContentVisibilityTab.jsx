import React, { useState } from "react";
import { Box, Typography, Button, Switch } from "@mui/material";
import { fonts } from "../../utility/fonts";

const gradientBtn = {
  background: "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
  color: "#fff",
  borderRadius: "24px",
  textTransform: "none",
  fontFamily: fonts.sans,
  fontWeight: 600,
  fontSize: "16px",
  px: 4,
  py: 1.5,
  boxShadow: "none",
  "&:hover": {
    opacity: 0.92,
    boxShadow: "none",
    background: "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
  },
};

/**
 * Organization Profile – Shared Content Visibility tab (Figma 863-150991).
 * UI only; integration-ready. Wire onSaveChanges(visibleOnProfile) when API is ready.
 */
const SharedContentVisibilityTab = ({
  visibleOnProfile: controlledVisible,
  onVisibleChange,
  onSaveChanges,
  isSaving = false,
}) => {
  const [localVisible, setLocalVisible] = useState(true);
  const isControlled = controlledVisible !== undefined && onVisibleChange != null;
  const visibleOnProfile = isControlled ? controlledVisible : localVisible;

  const handleToggle = (event) => {
    const next = event.target.checked;
    if (isControlled) {
      onVisibleChange(next);
    } else {
      setLocalVisible(next);
    }
  };

  const handleSave = () => {
    if (onSaveChanges) {
      onSaveChanges(visibleOnProfile);
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Figma 863-151998: title + description on left; "Visible on Profile" + toggle on right, one row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 3,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "18px",
              fontWeight: 700,
              color: "#101828",
              mb: 1,
            }}
          >
            Show Counsellor Content on My Profile
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "14px",
              color: "#667085",
              lineHeight: 1.5,
            }}
          >
            Control whether content created by your counsellors (videos, podcasts, articles) appears on your public profile page.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "14px",
              fontWeight: 500,
              color: visibleOnProfile ? "#166534" : "#667085",
            }}
          >
            Visible on Profile
          </Typography>
          <Switch
            checked={visibleOnProfile}
            onChange={handleToggle}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#720361",
                "& + .MuiSwitch-track": {
                  backgroundColor: "#BF2F75",
                  opacity: 0.5,
                },
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#BF2F75",
              },
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaving}
          sx={gradientBtn}
        >
          {isSaving ? "Saving…" : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
};

export default SharedContentVisibilityTab;
