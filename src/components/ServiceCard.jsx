import React, { useState } from "react";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useNavigate } from "react-router-dom";
import { Box, Rating, Typography } from "@mui/material";
import { fonts } from "../utility/fonts.js";
import { servicePL } from "../assets/assest.js";
import SharingVideoModal from "../models/SharingVideoModal.jsx";

const ACCENT = "#BC2876";
const ACCENT_PURPLE = "#720361";

// Service mode pill styles (Figma: Hybrid = cream/orange, In person = pink, Online = green). Offline → "In person".
const SERVICE_MODE_STYLES = {
  hybrid: { bg: "#FFF3E0", textColor: "#E65100", label: "Hybrid" },
  HYBRID: { bg: "#FFF3E0", textColor: "#E65100", label: "Hybrid" },
  "in person": { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  in_person: { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  IN_PERSON: { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  offline: { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  OFFLINE: { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  online: { bg: "#E8F5E9", textColor: "#2E7D32", label: "Online" },
  ONLINE: { bg: "#E8F5E9", textColor: "#2E7D32", label: "Online" },
};

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const stripHtml = (html) => {
    if (!html || typeof html !== "string") return "";
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const title = service?.title || "";
  const category = service?.category || "";
  const description = service?.description
    ? stripHtml(service.description)
    : "";
  const hasCoverImage = service?.coverImage || service?.image;
  const imageUrl = hasCoverImage
    ? service.coverImage || service.image
    : servicePL;
  const isPlaceholder = !hasCoverImage;
  const id = service?._id;

  const rawMode = (service?.serviceMode || "Online")
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "_");
  const modeStyle = SERVICE_MODE_STYLES[rawMode] ??
    SERVICE_MODE_STYLES[service?.serviceMode] ?? {
      bg: "#f5f5f5",
      textColor: "#717171",
      label: "Online",
    };

  const providerName =
    service?.organizationDetails?.organizationName ||
    service?.organizationId?.organizationName ||
    (service?.createdBy
      ? [service.createdBy.firstName, service.createdBy.lastName]
          .filter(Boolean)
          .join(" ")
      : "") ||
    "—";
  const providerLogo =
    service?.organizationDetails?.logo ||
    service?.organizationId?.logo ||
    service?.createdBy?.profilePicture ||
    null;

  const averageRating =
    service?.averageRating != null ? Number(service.averageRating) : null;
  const totalRatings =
    service?.totalRatings != null ? Number(service.totalRatings) : null;

  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (id) navigate(`/explore/service/${id}`);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShareModalOpen(true);
  };

  const shareUrl =
    window.location.origin +
    (id ? `/explore/service/${id}` : window.location.pathname);

  const providerInitials =
    providerName !== "—"
      ? providerName
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "—";

  return (
    <>
      <Box
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          border: "1px solid #eeeeee",
        }}
      >
        {/* Cover image; no price badge when using placeholder */}
        <Box
          sx={{
            position: "relative",
            height: "200px",
            flexShrink: 0,
            overflow: "hidden",
            backgroundColor: "#e8e8e8",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: "-40px",
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(14px)",
              transform: "scale(1.15)",
            }}
            aria-hidden
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.06)",
              pointerEvents: "none",
            }}
            aria-hidden
          />
          <Box
            component="img"
            src={imageUrl}
            alt=""
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: isPlaceholder ? "cover" : "cover",
              objectPosition: "center",
            }}
          />
        </Box>

        {/* Meta row: share (right) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px 0",
          }}
        >
          {/* Category (as heading) */}
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: "1.0625rem",
              lineHeight: 1.35,
              color: "#000000",
              px: 0,
              pt: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {category || "Service"}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              marginLeft: "auto",
            }}
          >
            <Box
              component="button"
              type="button"
              onClick={handleShare}
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid #e0e0e0",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="Share"
            >
              <ShareOutlinedIcon
                sx={{ color: "#717171", fontSize: "1.1rem" }}
              />
            </Box>
            {/* <Box
            component="button"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setBookmarked((b) => !b);
            }}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid #e0e0e0",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="Save"
          >
            <BookmarkBorderIcon
              sx={{ color: bookmarked ? ACCENT : "#717171", fontSize: "1.1rem" }}
            />
          </Box> */}
          </Box>
        </Box>

        {/* Description – 3 lines */}
        {description && (
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "0.875rem",
              color: "#737373",
              lineHeight: 1.45,
              px: 2,
              pt: 0.75,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mt: 0.5,
            }}
          >
            {description}
          </Typography>
        )}

        {/* Provider + rating row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            pt: 1.25,
            pb: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              minWidth: 0,
            }}
          >
            {providerLogo ? (
              <Box
                component="img"
                src={providerLogo}
                alt=""
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: "rgba(114, 3, 97, 0.12)",
                  color: ACCENT_PURPLE,
                  fontFamily: fonts.sans,
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {providerInitials}
              </Box>
            )}
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: "0.8125rem",
                color: "#737373",
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              By{" "}
              <Box component="span" sx={{ color: ACCENT, fontWeight: 700 }}>
                {providerName}
              </Box>
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.25,
              flexShrink: 0,
            }}
          >
            <Rating
              value={averageRating ?? 0}
              readOnly
              precision={0.5}
              size="small"
              sx={{
                "& .MuiRating-iconFilled": { color: "#FF8A00" },
                "& .MuiRating-iconEmpty": { color: "#D0D5DD" },
              }}
            />
            {totalRatings != null && totalRatings > 0 && (
              <Typography
                component="span"
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: "0.75rem",
                  color: "#737373",
                }}
              >
                ({totalRatings})
              </Typography>
            )}
          </Box>
        </Box>

        {/* Footer: service mode pill + Enquire Now button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            padding: "0 16px 16px",
            mt: "auto",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 1.5,
              py: 0.75,
              borderRadius: "999px",
              backgroundColor: modeStyle.bg,
              color: modeStyle.textColor,
              fontFamily: fonts.sans,
              fontSize: "0.8125rem",
              fontWeight: 600,
            }}
          >
            {modeStyle.label}
          </Box>
          <Box
            component="button"
            type="button"
            onClick={handleViewDetails}
            sx={{
              flex: 1,
              minWidth: 0,
              py: 1,
              px: 1.5,
              borderRadius: "999px",
              border: "none",
              background: ACCENT,
              color: "#ffffff",
              fontFamily: fonts.sans,
              fontSize: "0.9375rem",
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "none",
              "&:hover": { opacity: 0.92 },
            }}
          >
            View details
          </Box>
        </Box>
      </Box>
      <SharingVideoModal
        open={shareModalOpen}
        handleClose={() => setShareModalOpen(false)}
        videoUrl={shareUrl}
        videoId={id}
        shareTitle={category || title}
        modalTitle="Share"
      />
    </>
  );
};

export default ServiceCard;
