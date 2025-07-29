import React from "react";
import { Box, Typography, Pagination } from "@mui/material";
import VideoCard from "./VideoCard";
import InitialLoaders from "../loaders/InitialLoaders.jsx";
import { fonts } from "../utility/fonts.js";

const VideoSection = ({
  title = "",
  videos = [],
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}) => {
  return (
    <Box sx={{ marginTop: "2rem" }}>
      {title && (
        <Typography
          variant="h5"
          sx={{
            fontFamily: fonts.sans,
            fontWeight: "600",
            paddingBottom: "1.5rem",
            margin: "auto",
            width: "1280px",
            maxWidth: "100%",
          }}
        >
          {title}
        </Typography>
      )}

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
          width: "1280px",
          maxWidth: "100%",
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
            }}
          >
            <InitialLoaders />
          </Box>
        ) : videos.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "30vh",
              width: "90vw",
              margin: "auto",
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
              No Videos Found
            </Typography>
          </Box>
        ) : (
          videos.map((video) => <VideoCard key={video._id} video={video} />)
        )}
      </Box>

      {/* {totalPages > 1 && ( */}
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
      {/* )} */}
    </Box>
  );
};

export default VideoSection;
