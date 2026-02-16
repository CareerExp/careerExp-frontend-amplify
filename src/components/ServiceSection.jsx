import React from "react";
import { Box, Typography, Pagination } from "@mui/material";
import ServiceCard from "./ServiceCard";
import InitialLoaders from "../loaders/InitialLoaders.jsx";
import { fonts } from "../utility/fonts.js";

const ServiceSection = ({
  services = [],
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}) => {
  return (
    <Box sx={{ marginTop: "2rem" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: "30px",
          margin: "auto",
          width: "100%",
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "40vh",
              width: "85vw",
              margin: "auto",
              gridColumn: "1 / -1",
            }}
          >
            <InitialLoaders />
          </Box>
        ) : services.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "30vh",
              width: "90vw",
              margin: "auto",
              gridColumn: "1 / -1",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: fonts.sans,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              No Services Found
            </Typography>
          </Box>
        ) : (
          services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2rem",
          padding: "1rem",
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          size="large"
          onChange={onPageChange}
        />
      </Box>
    </Box>
  );
};

export default ServiceSection;
