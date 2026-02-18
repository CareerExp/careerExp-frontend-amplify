import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fonts } from "../utility/fonts.js";

const CounsellorCard = ({ counsellor }) => {
  const navigate = useNavigate();
  const id = counsellor?._id;
  const firstName = counsellor?.firstName ?? "";
  const lastName = counsellor?.lastName ?? "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "—";
  const profilePicture = counsellor?.profilePicture ?? null;
  const specRaw = counsellor?.specialization ?? counsellor?.introBio ?? "";
  const specStr = typeof specRaw === "string" ? specRaw : String(specRaw?.title ?? specRaw ?? "");
  const displayRole = specStr
    ? specStr.slice(0, 60) + (specStr.length > 60 ? "…" : "")
    : "Career Counsellor";

  const handleClick = () => {
    if (id) navigate(`/profile/${id}`);
  };

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        border: "1px solid #eeeeee",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        cursor: "pointer",
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Avatar
        src={profilePicture || undefined}
        sx={{
          width: 80,
          height: 80,
          mb: 1.5,
          bgcolor: "rgba(114, 3, 97, 0.12)",
          color: "#720361",
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: "1.25rem",
        }}
      >
        {fullName !== "—"
          ? fullName
              .split(/\s+/)
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          : "—"}
      </Avatar>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: "1rem",
          color: "#000000",
          lineHeight: 1.3,
          mb: 0.5,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {fullName}
      </Typography>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontSize: "0.875rem",
          color: "#737373",
          lineHeight: 1.35,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {displayRole}
      </Typography>
    </Box>
  );
};

export default CounsellorCard;
