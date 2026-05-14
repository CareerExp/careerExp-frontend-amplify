import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { fonts } from "../../utility/fonts";
import { defaultHeroBG } from "../../assets/assest";
import { selectToken, selectUserId } from "../../redux/slices/authSlice";
import { selectUserProfile } from "../../redux/slices/profileSlice";
import { notify } from "../../redux/slices/alertSlice";
import ClaimRegistrationModal from "./ClaimRegistrationModal.jsx";

function getInitials(name) {
  if (!name || typeof name !== "string") return "—";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "—";
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function normalizeRoles(profile) {
  const r = profile?.role;
  if (Array.isArray(r)) return r;
  if (r) return [r];
  return [];
}

function getUniversityPublicUrl(slug) {
  if (!slug) return null;
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return `${base}/university/${encodeURIComponent(slug)}`;
}

const UniversityPublicHero = ({ university, onClaimStatusPending }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug: routeSlug } = useParams();
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const userProfile = useSelector(selectUserProfile);
  const [claimOpen, setClaimOpen] = useState(false);

  const slug = university?.slug || routeSlug;
  const shareUrl = getUniversityPublicUrl(slug);
  const roles = normalizeRoles(userProfile);
  const isOrg = roles.includes("organization");
  const isAdmin = roles.includes("admin");

  const claimStatus = university?.claimStatus ?? "unclaimed";
  const claimEnabled = claimStatus === "unclaimed" || claimStatus === "rejected";
  const claimLabel =
    claimStatus === "pending"
      ? "Claim Pending Review"
      : claimStatus === "claimed"
        ? "Claimed"
        : "Claim Page";

  const handleShare = async () => {
    if (!shareUrl) return;
    const title = university?.name || "University";
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: university?.country || "",
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

  const handleClaimClick = () => {
    if (!claimEnabled) return;
    if (!token) {
      dispatch(
        notify({
          message: "Please sign in to claim this page",
          type: "warning",
        }),
      );
      navigate(`/login?redirect=/university/${encodeURIComponent(slug || "")}`);
      return;
    }
    if (isOrg || isAdmin) {
      dispatch(
        notify({
          message:
            "This action is only available for student/individual accounts",
          type: "warning",
        }),
      );
      return;
    }
    setClaimOpen(true);
  };

  const claimButtonSx = (() => {
    if (claimEnabled) {
      return {
        background: "linear-gradient(180deg, #BF2F75 0%, #720361 100%)",
        color: "#fff",
        "&:hover": {
          background: "linear-gradient(180deg, #BF2F75 0%, #720361 100%)",
          opacity: 0.92,
        },
      };
    }
    return {
      backgroundColor: "#9e9e9e",
      color: "#fff",
      "&:hover": { backgroundColor: "#9e9e9e" },
    };
  })();

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          height: { xs: "220px", md: "182px" },
          backgroundImage: `url(${university?.bannerImage || university?.banner || defaultHeroBG})`,
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
            background: university?.logo
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
          {university?.logo ? (
            <Box
              component="img"
              src={university.logo}
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
              {getInitials(university?.name)}
            </Typography>
          )}
        </Box>
        <Box sx={{ flexGrow: 1, textAlign: { xs: "center", md: "left" } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-start" },
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: { xs: "22px", md: "28px" },
                color: "#fff",
                lineHeight: 1.2,
                textShadow: { xs: "none", md: "0px 2px 4px rgba(0,0,0,0.3)" },
              }}
            >
              {university?.name || "University"}
            </Typography>
            {university?.qsRank != null && university.qsRank !== "" && (
              <Chip
                label={`QS Rank #${university.qsRank}`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: "#BC2876",
                  color: "#fff",
                  fontFamily: fonts.sans,
                  fontWeight: 600,
                  textShadow: { xs: "none", md: "0px 1px 2px rgba(0,0,0,0.4)" },
                }}
              />
            )}
          </Box>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 500,
              fontSize: { xs: "16px", md: "20px" },
              color: "#fff",
              mt: 0.5,
              textShadow: { xs: "none", md: "0px 2px 4px rgba(0,0,0,0.3)" },
            }}
          >
            {university?.country || ""}
          </Typography>
          {university?.website ? (
            <Typography
              component="a"
              href={university.website}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 500,
                fontSize: "16px",
                color: "#fff",
                display: "inline-block",
                mt: 0.5,
                textDecoration: "underline",
              }}
            >
              {university.website}
            </Typography>
          ) : null}
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
            onClick={handleClaimClick}
            disabled={!claimEnabled}
            sx={{
              borderRadius: "90px",
              px: 3,
              py: 1,
              textTransform: "none",
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: "18px",
              ...claimButtonSx,
            }}
          >
            {claimLabel}
          </Button>
          <Tooltip title="Share">
            <IconButton
              onClick={handleShare}
              aria-label="Share university page"
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
      <ClaimRegistrationModal
        open={claimOpen}
        onClose={() => setClaimOpen(false)}
        university={university}
        onSuccess={() => {
          setClaimOpen(false);
          onClaimStatusPending?.();
        }}
      />
    </Box>
  );
};

export default UniversityPublicHero;
