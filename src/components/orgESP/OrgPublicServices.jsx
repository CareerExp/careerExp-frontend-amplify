import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { fonts } from "../../utility/fonts";
import ESPSlider from "./ESPSlider";
import {
  getPublicServices,
  selectOrgPublicServices,
  selectOrgPublicServicesLoading,
} from "../../redux/slices/orgPublicSlice";
import { eventsPlaceholder } from "../../assets/assest";

const OrgPublicServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const id = service?._id;
  const title = service?.title || "";
  const imageUrl = service?.coverImage || service?.image || eventsPlaceholder;
  const category = service?.category || "";
  const priceLabel =
    service?.priceType === "FREE"
      ? "Free"
      : service?.priceType === "CUSTOM"
        ? "Custom"
        : service?.price != null
          ? `${service.currency || "INR"} ${service.price}`
          : "—";

  return (
    <Paper
      elevation={0}
      onClick={() => id && navigate(`/explore/service/${id}`)}
      sx={{
        p: "10px",
        borderRadius: "15px",
        width: "297.5px",
        minWidth: "297.5px",
        backgroundColor: "#fff",
        boxShadow: "0px 6px 9px 0px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        cursor: "pointer",
        "&:hover": { boxShadow: "0px 8px 16px rgba(0,0,0,0.12)" },
      }}
    >
      <Box
        sx={{
          height: "181px",
          width: "100%",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Box
          component="img"
          src={imageUrl}
          alt=""
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
      {category && (
        <Typography
          sx={{
            fontSize: "12px",
            fontFamily: fonts.sans,
            color: "#BC2876",
            fontWeight: 600,
          }}
        >
          {category}
        </Typography>
      )}
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: "16px",
          color: "#000",
          lineHeight: "20px",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{ fontFamily: fonts.sans, fontSize: "14px", color: "#666" }}
      >
        {priceLabel}
      </Typography>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: "14px",
          color: "#BC2876",
        }}
      >
        View details
      </Typography>
    </Paper>
  );
};

const OrgPublicServices = ({ identifier, idType }) => {
  const dispatch = useDispatch();
  const services = useSelector(selectOrgPublicServices);
  const loading = useSelector(selectOrgPublicServicesLoading);

  useEffect(() => {
    if (!identifier || !idType) return;
    dispatch(
      getPublicServices({ identifier, idType, limit: 12, sortBy: "recent" }),
    );
  }, [dispatch, identifier, idType]);

  if (!identifier) return null;

  if (loading && services.length === 0) {
    return (
      <Box sx={{ my: 6, display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress sx={{ color: "#BC2876" }} />
      </Box>
    );
  }

  if (services.length === 0) {
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
          Connect 1-2-1
        </Typography>
        <Typography
          sx={{ fontFamily: fonts.sans, fontSize: "16px", color: "#666" }}
        >
          No services yet.
        </Typography>
      </Box>
    );
  }

  return (
    <ESPSlider title="Connect 1-2-1">
      {services.map((srv) => (
        <OrgPublicServiceCard key={srv._id} service={srv} />
      ))}
    </ESPSlider>
  );
};

export default OrgPublicServices;
