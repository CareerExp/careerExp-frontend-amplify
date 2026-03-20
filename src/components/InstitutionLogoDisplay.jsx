import React from "react";
import { Box } from "@mui/material";

/**
 * Organization logo: full image visible (contain) with blurred same image filling the frame.
 */
const InstitutionLogoDisplay = ({
  src,
  alt = "",
  size = 100,
  borderRadius = "10px",
  blurPx = 14,
  sx = {},
}) => {
  if (!src) return null;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius,
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        backgroundColor: "rgba(0,0,0,0.06)",
        ...sx,
      }}
    >
      <Box
        component="img"
        src={src}
        alt=""
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: `blur(${blurPx}px)`,
          transform: "scale(1.12)",
        }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <Box
          component="img"
          src={src}
          alt={alt}
          sx={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </Box>
    </Box>
  );
};

export default InstitutionLogoDisplay;
