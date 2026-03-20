import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { fonts } from "../../utility/fonts";
import ESPSlider from "./ESPSlider";
import {
  getPublicVideos,
  selectOrgPublicVideos,
  selectOrgPublicVideosLoading,
} from "../../redux/slices/orgPublicSlice";

const OrgPublicVideoCard = ({ video }) => {
  const navigate = useNavigate();
  const id = video?._id;
  const title = video?.title || "";
  const thumbnail =
    video?.youtubeVideoId
      ? `https://img.youtube.com/vi/${video.youtubeVideoId}/0.jpg`
      : video?.thumbnail || "";
  const creator = video?.creatorId || {};
  const creatorName = [creator.firstName, creator.lastName].filter(Boolean).join(" ") || "Creator";

  return (
    <Paper
      elevation={0}
      onClick={() => id && navigate(`/video/${id}`)}
      sx={{
        width: "287.5px",
        minWidth: "287.5px",
        p: "10px",
        borderRadius: "15px",
        boxShadow: "0px 6px 9px 0px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        flexShrink: 0,
        scrollSnapAlign: "start",
        cursor: "pointer",
        "&:hover": { boxShadow: "0px 8px 16px rgba(0,0,0,0.12)" },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "150.5px",
          borderRadius: "8px",
          mb: "12px",
          overflow: "hidden",
          backgroundColor: "#f0f0f0",
        }}
      >
        {thumbnail ? (
          <Box component="img" src={thumbnail} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ fontFamily: fonts.sans, color: "#999", fontSize: "14px" }}>No thumbnail</Typography>
          </Box>
        )}
      </Box>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: "14px",
          color: "#000",
          lineHeight: "1.2",
          mb: "3px",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {title}
      </Typography>
      <Typography sx={{ fontFamily: fonts.sans, fontWeight: 400, fontSize: "12px", color: "rgba(0,0,0,0.5)" }}>
        {creatorName}
      </Typography>
    </Paper>
  );
};

const OrgPublicSharedContent = ({ identifier, idType }) => {
  const dispatch = useDispatch();
  const videos = useSelector(selectOrgPublicVideos);
  const loading = useSelector(selectOrgPublicVideosLoading);

  useEffect(() => {
    if (!identifier || !idType) return;
    dispatch(getPublicVideos({ identifier, idType, limit: 12 }));
  }, [dispatch, identifier, idType]);

  if (!identifier) return null;

  if (loading && videos.length === 0) {
    return (
      <Box sx={{ my: 6, display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress sx={{ color: "#BC2876" }} />
      </Box>
    );
  }

  if (videos.length === 0) {
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
          Shared Content
        </Typography>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: "16px", color: "#666" }}>
          No shared content yet.
        </Typography>
      </Box>
    );
  }

  return (
    <ESPSlider title="Shared Content">
      {videos.map((v) => (
        <OrgPublicVideoCard key={v._id} video={v} />
      ))}
    </ESPSlider>
  );
};

export default OrgPublicSharedContent;
