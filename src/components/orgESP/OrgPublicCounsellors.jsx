import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Paper, Avatar, CircularProgress } from "@mui/material";
import { fonts } from "../../utility/fonts";
import ESPSlider from "./ESPSlider";
import {
  getPublicCounsellors,
  selectOrgPublicCounsellors,
  selectOrgPublicCounsellorsLoading,
} from "../../redux/slices/orgPublicSlice";

const CounsellorCard = ({ counsellor }) => {
  const navigate = useNavigate();
  const id = counsellor?._id;
  const name = [counsellor?.firstName, counsellor?.lastName].filter(Boolean).join(" ").trim() || "Counsellor";
  const profilePicture = counsellor?.profilePicture;

  return (
    <Paper
      elevation={0}
      onClick={() => id && navigate(`/profile/${id}`)}
      sx={{
        width: { xs: "298px", md: "189px" },
        minWidth: { xs: "298px", md: "189px" },
        p: "15px",
        boxSizing: "border-box",
        borderRadius: "15px",
        boxShadow: "0px 6px 9px 0px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "13px",
        scrollSnapAlign: "start",
        cursor: id ? "pointer" : "default",
        "&:hover": id ? { boxShadow: "0px 8px 16px rgba(0,0,0,0.12)" } : {},
      }}
    >
      <Box
        sx={{
          width: { xs: "268px", md: "159px" },
          height: { xs: "272px", md: "160px" },
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Avatar
          src={profilePicture || undefined}
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: 0,
            fontSize: "3rem",
            bgcolor: profilePicture ? "transparent" : "#e0e0e0",
          }}
        >
          {!profilePicture && name ? name.charAt(0).toUpperCase() : null}
        </Avatar>
      </Box>
      <Box sx={{ width: "100%", textAlign: "center" }}>
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: "16px",
            color: "#000",
            lineHeight: "1.2",
            mb: "3px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {name}
        </Typography>
      </Box>
    </Paper>
  );
};

const OrgPublicCounsellors = ({ identifier, idType }) => {
  const dispatch = useDispatch();
  const counsellors = useSelector(selectOrgPublicCounsellors);
  const loading = useSelector(selectOrgPublicCounsellorsLoading);

  useEffect(() => {
    if (!identifier || !idType) return;
    dispatch(getPublicCounsellors({ identifier, idType, limit: 24 }));
  }, [dispatch, identifier, idType]);

  if (!identifier) return null;

  if (loading && counsellors.length === 0) {
    return (
      <Box sx={{ my: 6, display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress sx={{ color: "#BC2876" }} />
      </Box>
    );
  }

  if (counsellors.length === 0) {
    return (
      <Box sx={{ my: 6 }}>
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: { xs: "24px", md: "32px" },
            color: "#000",
            mb: 3,
            lineHeight: 1.2,
          }}
        >
          Counsellors & Advisers
        </Typography>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: "16px", color: "#666" }}>
          No counsellors yet.
        </Typography>
      </Box>
    );
  }

  return (
    <ESPSlider title="Counsellors & Advisers">
      {counsellors.map((c) => (
        <CounsellorCard key={c._id} counsellor={c} />
      ))}
    </ESPSlider>
  );
};

export default OrgPublicCounsellors;
