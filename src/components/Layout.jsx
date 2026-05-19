import { Box } from "@mui/system";
import React from "react";
import { Outlet } from "react-router-dom";

import Footer from "./Footer.jsx";
import Headers from "./Headers.jsx";
import ScrollToTop from "./ScrollToTop.jsx";

const Layout = () => {
  return (
    <Box sx={{ backgroundColor: "#edeaeae01" }}>
      <ScrollToTop />
      <Headers />
      {/* pages */}
      <Outlet />
      <Footer />
    </Box>
  );
};

export default Layout;
