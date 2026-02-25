import React from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import FlagIcon from "@mui/icons-material/Flag";
import { fonts } from "../../utility/fonts";
import { defaultHeroBG, organizationLogo } from "../../assets/assest";

const OrgPublicHero = ({ profile }) => {
  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          height: "182px",
          backgroundImage: `url(${profile?.bannerImage || profile?.banner || defaultHeroBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "20px 20px 0 0",
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.2)",
            pointerEvents: "none",
          },
        }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: { xs: 2, md: 4 },
          mt: "-120px",
          position: "relative",
          zIndex: 2,
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            width: "120px",
            height: "120px",
            backgroundColor: "#fff",
            borderRadius: "20px 20px 0 0",
            border: "4px solid #fff",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={profile?.logo || organizationLogo}
            sx={{ width: "80%", height: "80%", objectFit: "contain" }}
            alt=""
          />
        </Box>
        <Box sx={{ flexGrow: 1, textAlign: { xs: "center", md: "left" } }}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: { xs: "22px", md: "28px" },
              color: "#fff",
              lineHeight: 1.2,
              textShadow: "0px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {profile?.organizationName || "Organization"}
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 500,
              fontSize: { xs: "16px", md: "20px" },
              color: "#fff",
              mt: 0.5,
              textShadow: "0px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {profile?.subtitle || ""}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: { xs: 2, md: 0 } }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#fafafa",
              borderRadius: "90px",
              px: 3,
              py: 1,
              textTransform: "none",
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: "18px",
              "& .MuiTypography-root": {
                background: "linear-gradient(146.73deg, #BF2F75 3.87%, #720361 63.8%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              },
              "&:hover": { backgroundColor: "#fff", opacity: 0.9 },
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "18px" }}>Follow</Typography>
          </Button>
          <IconButton
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              color: "#fff",
              width: "48px",
              height: "48px",
              border: "1.5px solid #fff",
              backdropFilter: "blur(22px)",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.4)" },
            }}
          >
            <ShareIcon sx={{ fontSize: "20px" }} />
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              color: "#fff",
              width: "48px",
              height: "48px",
              border: "1.5px solid #fff",
              backdropFilter: "blur(22px)",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.4)" },
            }}
          >
            <FlagIcon sx={{ fontSize: "20px" }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default OrgPublicHero;
