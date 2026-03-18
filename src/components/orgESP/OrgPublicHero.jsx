import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { fonts } from "../../utility/fonts";
import { defaultHeroBG } from "../../assets/assest";
import { selectToken, selectUserId } from "../../redux/slices/authSlice";
import { toggleFollow } from "../../redux/slices/followerSlice";
import { getDashboardFollowing } from "../../redux/slices/dashboardActivitySlice";
import { selectDashboardFollowing } from "../../redux/slices/dashboardActivitySlice";
import { notify } from "../../redux/slices/alertSlice";

function getOrgPublicUrl(profile) {
  if (!profile) return null;
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const path =
    profile.organizationType === "HEI"
      ? `/org-hei/${profile.slug || profile.userId || profile._id}`
      : `/org-esp/${profile.slug || profile.userId || profile._id}`;
  return `${base}${path}`;
}

const OrgPublicHero = ({ profile }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const { items: followingItems } = useSelector(selectDashboardFollowing);
  const [followLoading, setFollowLoading] = useState(false);

  const orgTargetId = profile?.userId || profile?._id;
  const isFollowing =
    !!orgTargetId &&
    followingItems.some(
      (item) => item.id === orgTargetId || item.userId === orgTargetId,
    );

  // Skip getDashboardFollowing when viewer is the org (own page) — that API returns 403 for org users.
  useEffect(() => {
    if (token && orgTargetId && userId !== orgTargetId) {
      dispatch(getDashboardFollowing({ token }));
    }
  }, [dispatch, token, orgTargetId, userId]);

  const handleFollowClick = async () => {
    if (!token) {
      dispatch(notify({ message: "Please sign in to follow", type: "error" }));
      return;
    }
    if (!orgTargetId) return;
    if (userId === orgTargetId) return;
    setFollowLoading(true);
    try {
      const result = await dispatch(
        toggleFollow({ targetUserId: orgTargetId, token }),
      );
      if (toggleFollow.fulfilled.match(result)) {
        dispatch(
          notify({
            message: isFollowing
              ? "Unfollowed successfully"
              : "Following successfully",
            type: "success",
          }),
        );
        dispatch(getDashboardFollowing({ token }));
      } else {
        dispatch(
          notify({
            message: result.payload?.error || "Failed to update follow",
            type: "error",
          }),
        );
      }
    } finally {
      setFollowLoading(false);
    }
  };

  const shareUrl = getOrgPublicUrl(profile);
  const handleShare = async () => {
    if (!shareUrl) return;
    const title = profile?.organizationName || "Organization";
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: profile?.subtitle || "",
          url: shareUrl,
        });
        dispatch(notify({ message: "Link shared!", type: "success" }));
      } else {
        await navigator.clipboard.writeText(shareUrl);
        dispatch(
          notify({ message: "Link copied to clipboard", type: "success" }),
        );
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(shareUrl);
          dispatch(
            notify({ message: "Link copied to clipboard", type: "success" }),
          );
        } catch {
          dispatch(
            notify({ message: "Could not share or copy link", type: "error" }),
          );
        }
      }
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          height: { xs: "220px", md: "182px" },
          backgroundImage: `url(${profile?.bannerImage || profile?.banner || defaultHeroBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "20px 20px 0 0",
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.2)",
            pointerEvents: "none",
          },
        }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: { xs: 2, md: 4 },
          mt: { xs: "-180px", md: "-120px" },
          position: "relative",
          zIndex: 2,
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            width: "120px",
            height: "120px",
            background: profile?.logo
              ? "#fff"
              : "linear-gradient(125deg, #BF2F75 -3.87%, #720361 63.8%)",
            borderRadius: "20px 20px 0 0",
            border: "4px solid #fff",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {profile?.logo ? (
            <Box
              component="img"
              src={profile.logo}
              sx={{ width: "80%", height: "80%", objectFit: "contain" }}
              alt=""
            />
          ) : (
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: "2rem",
                color: "#ffffff",
              }}
            >
              {(profile?.organizationName || "Org")
                .split(/\s+/)
                .map((w) => w[0])
                .join("")
                .slice(0, 3)
                .toUpperCase()}
            </Typography>
          )}
        </Box>
        <Box sx={{ flexGrow: 1, textAlign: { xs: "center", md: "left" } }}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: { xs: "22px", md: "28px" },
              color: "#fff",
              lineHeight: 1.2,
              textShadow: { xs: "none", md: "0px 2px 4px rgba(0,0,0,0.3)" },
            }}
          >
            {profile?.organizationName || "Organization"}
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 500,
              fontSize: { xs: "16px", md: "20px" },
              color: { xs: "rgba(0,0,0,0.65)", md: "#fff" },
              mt: 0.5,
              textShadow: { xs: "none", md: "0px 2px 4px rgba(0,0,0,0.3)" },
            }}
          >
            {profile?.subtitle || ""}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mt: { xs: 2, md: 0 },
            mb: { xs: 2, md: 0 },
          }}
        >
          <Button
            variant="contained"
            onClick={handleFollowClick}
            disabled={followLoading || !orgTargetId || userId === orgTargetId}
            sx={{
              backgroundColor: "#fafafa",
              borderRadius: "90px",
              px: 3,
              py: 1,
              textTransform: "none",
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: "18px",
              "& .MuiTypography-root": {
                background:
                  "linear-gradient(146.73deg, #BF2F75 3.87%, #720361 63.8%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              },
              "&:hover": { backgroundColor: "#fff", opacity: 0.9 },
            }}
          >
            {followLoading ? (
              <CircularProgress size={20} sx={{ color: "#720361" }} />
            ) : (
              <Typography sx={{ fontWeight: 700, fontSize: "18px" }}>
                {isFollowing ? "Following" : "Follow"}
              </Typography>
            )}
          </Button>
          <Tooltip title="Share">
            <IconButton
              onClick={handleShare}
              aria-label="Share company page"
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                color: "#fff",
                width: "48px",
                height: "48px",
                border: "1.5px solid #fff",
                backdropFilter: "blur(22px)",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.4)" },
              }}
            >
              <ShareIcon sx={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default OrgPublicHero;
