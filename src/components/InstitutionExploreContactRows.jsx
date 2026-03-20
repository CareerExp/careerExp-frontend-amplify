import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import { Box, Typography } from "@mui/material";
import { notify } from "../redux/slices/alertSlice.js";
import { fonts } from "../utility/fonts.js";

export const INSTITUTION_EXPLORE_LINK_COLOR = "#BF2F75";

function normalizeWebsiteHref(website) {
  if (!website || typeof website !== "string") return "";
  const w = website.trim();
  if (!w) return "";
  return w.startsWith("http") ? w : `https://${w}`;
}

/**
 * Explore detail sidebars: email copies on click; website opens in a new tab.
 */
export function InstitutionExploreEmailRow({
  email,
  dispatch,
  iconSx = { fontSize: 20 },
}) {
  if (!email || !String(email).trim()) return null;
  const trimmed = String(email).trim();
  return (
    <Box
      sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}
    >
      <EmailOutlinedIcon sx={iconSx} />
      <Typography
        component="span"
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigator.clipboard.writeText(trimmed).then(
            () =>
              dispatch(
                notify({ message: "Email is copied", type: "success" }),
              ),
            () =>
              dispatch(
                notify({ message: "Could not copy email", type: "error" }),
              ),
          );
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.currentTarget.click();
          }
        }}
        sx={{
          fontFamily: fonts.sans,
          fontSize: "0.875rem",
          color: INSTITUTION_EXPLORE_LINK_COLOR,
          cursor: "pointer",
          textDecoration: "underline",
          "&:hover": { opacity: 0.88 },
        }}
      >
        {trimmed}
      </Typography>
    </Box>
  );
}

export function InstitutionExploreWebsiteRow({
  website,
  iconSx = { fontSize: 20 },
}) {
  if (!website || !String(website).trim()) return null;
  const raw = String(website).trim();
  const href = normalizeWebsiteHref(raw);
  if (!href) return null;
  const display = raw.replace(/^https?:\/\//i, "");
  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <LanguageIcon sx={iconSx} />
      <Typography
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          fontFamily: fonts.sans,
          fontSize: "0.875rem",
          color: INSTITUTION_EXPLORE_LINK_COLOR,
          cursor: "pointer",
          textDecoration: "underline",
          "&:hover": { opacity: 0.88 },
        }}
      >
        {display}
      </Typography>
    </Box>
  );
}
