import { Box, Skeleton } from "@mui/material";
import React from "react";

const CareersShimmer = () => {
  return (
    <Box sx={{ width: "100%", padding: "1rem" }}>
      {/* Heading shimmer */}
      <Skeleton variant="text" width={220} height={30} />
      <Skeleton variant="text" width={280} height={24} sx={{ mb: 2 }} />

      {/* Career cards shimmer */}
      <Box sx={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {[1, 2, 3].map((_, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: "100%", sm: "30%" },
              padding: "1rem",
              borderRadius: "12px",
              backgroundColor: "#fff",
            }}
          >
            <Skeleton variant="text" width="80%" height={26} />
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="rectangular" height={60} sx={{ mt: 1 }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CareersShimmer;
