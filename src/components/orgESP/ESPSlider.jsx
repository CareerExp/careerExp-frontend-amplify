import React, { useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { fonts } from "../../utility/fonts";

const navIconButtonSx = {
  width: "61px",
  height: "61px",
  background: "linear-gradient(155.92deg, #BF2F75 3.87%, #720361 63.8%)",
  color: "#fff",
  "&:disabled": {
    background: "#ddd",
    opacity: 0.5,
  },
  "&:hover": {
    opacity: 0.9,
    background: "linear-gradient(155.92deg, #BF2F75 3.87%, #720361 63.8%)",
  },
};

function NavButtons({ onPrev, onNext, prevDisabled, nextDisabled }) {
  return (
    <Box sx={{ display: "flex", gap: 2, flexShrink: 0 }}>
      <IconButton
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label="Previous"
        sx={navIconButtonSx}
      >
        <ArrowBackIcon sx={{ fontSize: "30px" }} />
      </IconButton>
      <IconButton
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Next"
        sx={navIconButtonSx}
      >
        <ArrowForwardIcon sx={{ fontSize: "30px" }} />
      </IconButton>
    </Box>
  );
}

const titleTypographySx = {
  fontFamily: fonts.sans,
  fontWeight: 700,
  fontSize: { xs: "24px", md: "32px" },
  color: "#000",
  lineHeight: 1.2,
};

/** @deprecated use ESPSlider only; kept for any external import */
const ESPSectionHeader = ({ title, onPrev, onNext, prevDisabled, nextDisabled }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 3,
    }}
  >
    <Typography sx={titleTypographySx}>{title}</Typography>
    <NavButtons
      onPrev={onPrev}
      onNext={onNext}
      prevDisabled={prevDisabled}
      nextDisabled={nextDisabled}
    />
  </Box>
);

const ESPSlider = ({ title, children }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(checkScroll, 100);

    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }

    return () => {
      clearTimeout(timer);
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      }
    };
  }, [children]);

  const handleNext = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const navProps = {
    onPrev: handlePrev,
    onNext: handleNext,
    prevDisabled: !canScrollLeft,
    nextDisabled: !canScrollRight,
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        my: 6,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      {/* Mobile: title only (no side buttons — avoids overflow) */}
      <Box sx={{ display: { xs: "block", md: "none" }, mb: 3 }}>
        <Typography sx={titleTypographySx}>{title}</Typography>
      </Box>

      {/* Desktop: title + buttons in one row */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography sx={titleTypographySx}>{title}</Typography>
        <NavButtons {...navProps} />
      </Box>

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 3,
          pb: 2,
          maxWidth: "100%",
          scrollSnapType: "x mandatory",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          "& > *": {
            flexShrink: 0,
            scrollSnapAlign: "start",
          },
        }}
      >
        {children}
      </Box>

      {/* Mobile: nav below cards */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mt: 1,
          pb: 1,
        }}
      >
        <NavButtons {...navProps} />
      </Box>
    </Box>
  );
};

export default ESPSlider;
export { ESPSectionHeader };
