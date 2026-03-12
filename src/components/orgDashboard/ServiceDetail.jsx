import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
  Grid,
  Avatar,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LanguageIcon from "@mui/icons-material/Language";
import TagIcon from "@mui/icons-material/Tag";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LinkIcon from "@mui/icons-material/Link";
import { fonts } from "../../utility/fonts";

const ServiceDetail = ({ service, onBack, onEdit, onDelete }) => {
  const [calendarLinkPopupOpen, setCalendarLinkPopupOpen] = useState(false);

  if (!service) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const responses = service.ctaResponses || [];
  const cta =
    typeof service.cta === "string"
      ? (() => {
          try {
            return JSON.parse(service.cta);
          } catch {
            return null;
          }
        })()
      : service.cta;
  const ctaHref =
    cta?.value && cta?.type === "EMAIL" ? `mailto:${cta.value}` : cta?.value;

  return (
    <Box sx={{ p: 4, minHeight: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          gap: 2,
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={onBack} sx={{ p: 0 }}>
            <Box
              sx={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                border: "1px solid #EAECF0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
              }}
            >
              <ArrowBackIcon sx={{ color: "#000" }} />
            </Box>
          </IconButton>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: "26px",
              color: "#000",
            }}
          >
            Details
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            onClick={() => onDelete(service)}
            sx={{
              height: "48px",
              px: 3,
              borderRadius: "90px",
              border: "1px solid #D0D5DD",
              color: "#344054",
              textTransform: "none",
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: "16px",
              backgroundColor: "#fff",
              "&:hover": { backgroundColor: "#F9FAFB" },
            }}
          >
            Delete
          </Button>
          <Button
            onClick={() => onEdit(service)}
            variant="contained"
            sx={{
              height: "48px",
              px: 3,
              borderRadius: "90px",
              background:
                "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
              color: "#fff",
              textTransform: "none",
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: "16px",
              "&:hover": { opacity: 0.9 },
            }}
          >
            Edit Details
          </Button>
        </Box>
      </Box>

      {/* Main Content Card */}
      <Paper
        elevation={0}
        sx={{
          p: "30px",
          borderRadius: "15px",
          backgroundColor: "#fff",
          boxShadow: "0px 6px 9px 0px rgba(0,0,0,0.1)",
          mb: 4,
        }}
      >
        {/* Header Info */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <CalendarTodayIcon sx={{ color: "#545454", fontSize: "20px" }} />
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 500,
                fontSize: "14px",
                color: "#545454",
              }}
            >
              Created on: {formatDate(service.createdAt)}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "rgba(43, 192, 13, 0.1)",
              borderRadius: "10px",
              px: 1.5,
              py: 0.5,
            }}
          >
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: "14px",
                fontWeight: 600,
                color: "#2BC00D",
                textTransform: "capitalize",
              }}
            >
              {service.status?.toLowerCase() || "Published"}
            </Typography>
          </Box>
        </Box>

        {/* Banner with Overlay */}
        <Box
          sx={{
            width: "100%",
            height: "400px",
            borderRadius: "8px",
            overflow: "hidden",
            position: "relative",
            mb: 4,
            backgroundColor: "#f2f2f2",
          }}
        >
          <Box
            component="img"
            src={service.coverImage || service.image}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Overlay Text */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              backdropFilter: "blur(3.5px)",
              backgroundColor: "rgba(0, 0, 0, 0.58)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              borderRight: "1px solid rgba(255, 255, 255, 0.1)",
              p: "20px",
              borderBottomLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 500,
                fontSize: "24px",
                color: "#fff",
                letterSpacing: "-0.48px",
                lineHeight: "30px",
              }}
            >
              {service.category}
            </Typography>
          </Box>
        </Box>

        {/* Metadata Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={1}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LinkIcon sx={{ fontSize: "18px", color: "#BC2876" }} />
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#BC2876",
                  }}
                >
                  Calendar Link
                </Typography>
              </Box>
              <Typography
                component="span"
                onClick={() =>
                  service.calendarLink && setCalendarLinkPopupOpen(true)
                }
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: "15px",
                  color: service.calendarLink ? "#BC2876" : "#101828",
                  pl: "26px",
                  textDecoration: service.calendarLink ? "underline" : "none",
                  cursor: service.calendarLink ? "pointer" : "default",
                  "&:hover": service.calendarLink ? { opacity: 0.85 } : {},
                }}
              >
                {service.calendarLink?.trim() ? "View Link" : "—"}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={1}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LanguageIcon sx={{ fontSize: "18px", color: "#BC2876" }} />
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#BC2876",
                  }}
                >
                  Mode
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: "15px",
                  color: "#101828",
                  pl: "26px",
                  textTransform: "capitalize",
                }}
              >
                {service.serviceMode?.toLowerCase() || "Online"}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={1}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TagIcon sx={{ fontSize: "18px", color: "#BC2876" }} />
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#BC2876",
                  }}
                >
                  Ref No
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: "15px",
                  color: "#101828",
                  pl: "26px",
                }}
              >
                {service.referenceNumber?.trim() || "—"}
              </Typography>
            </Stack>
          </Grid>
          {cta?.value && (
            <Grid item xs={12} sm={6} md={3}>
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LinkIcon sx={{ fontSize: "18px", color: "#BC2876" }} />
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#BC2876",
                    }}
                  >
                    CTA
                  </Typography>
                </Box>
                <Box sx={{ pl: "26px" }}>
                  <Box
                    component="div"
                    // href={ctaHref}
                    // target={cta?.type === "LINK" ? "_blank" : undefined}
                    // rel={
                    //   cta?.type === "LINK" ? "noopener noreferrer" : undefined
                    // }
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "15px",
                      color: "#545454",
                      //   textDecoration: "underline",
                      "&:hover": { color: "#BC2876" },
                    }}
                  >
                    Label: {cta.label || "NA"}
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "14px",
                      color: "#545454",
                      mt: 0.5,
                    }}
                  >
                    {cta.value}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          )}
        </Grid>

        {/* Description */}
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 400,
            fontSize: "16px",
            color: "#545454",
            lineHeight: "28px",
            whiteSpace: "pre-wrap",
            mb: 4,
          }}
        >
          {service.description}
        </Typography>

        <Grid container spacing={4}>
          {/* What's Included */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CheckCircleOutlineIcon sx={{ color: "#BC2876" }} />
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 700,
                  fontSize: "20px",
                  color: "#000",
                }}
              >
                What's Included
              </Typography>
            </Box>
            <Stack spacing={1.5}>
              {service.whatsIncluded?.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "#BC2876",
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "15px",
                      color: "#545454",
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* CTAs Received Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "20px",
          backgroundColor: "#fff",
          boxShadow: "0px 4px 20px 0px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: "24px",
            color: "#000",
            mb: 3,
          }}
        >
          CTAs received
        </Typography>

        {responses.length > 0 ? (
          <Grid container spacing={2.5}>
            {responses.map((resp) => {
              const user = resp.userId || {};
              const displayName =
                [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                "Unknown";
              return (
                <Grid item key={resp._id} xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      backgroundColor: "#f4f7fe",
                      borderRadius: "12px",
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar
                      src={user.profilePicture}
                      sx={{ width: 48, height: 48, backgroundColor: "#e5e7eb" }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: fonts.sans,
                          fontWeight: 600,
                          fontSize: "16px",
                          color: "#000",
                        }}
                      >
                        {displayName}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: fonts.sans,
                          fontWeight: 400,
                          fontSize: "14px",
                          color: "#666",
                        }}
                      >
                        {formatDate(resp.respondedAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "16px",
              color: "#667085",
              py: 2,
            }}
          >
            No responses received yet.
          </Typography>
        )}
      </Paper>

      {/* Calendar link popup */}
      <Dialog
        open={calendarLinkPopupOpen}
        onClose={() => setCalendarLinkPopupOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            maxWidth: 420,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: "1rem",
          }}
        >
          Calendar Link
        </DialogTitle>
        <DialogContent>
          <Typography
            component="a"
            href={service.calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              fontFamily: fonts.sans,
              fontSize: "0.875rem",
              color: "#BC2876",
              wordBreak: "break-all",
              textDecoration: "underline",
              "&:hover": { opacity: 0.85 },
            }}
          >
            {service.calendarLink?.trim()}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => window.open(service.calendarLink, "_blank")}
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 600,
              color: "#fff",
              borderRadius: "90px",
              background:
                "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
              "&:hover": { backgroundColor: "#9e2062" },
            }}
          >
            Open link
          </Button>
          <Button
            onClick={() => setCalendarLinkPopupOpen(false)}
            sx={{ fontFamily: fonts.sans, fontWeight: 600, color: "#344054" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceDetail;
