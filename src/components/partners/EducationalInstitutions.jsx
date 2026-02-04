import React from "react";
import { Box, Grid, Card, Typography, Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { partnersList } from "../../utility/partnersList";
import { fonts } from "../../utility/fonts";

const EducationalInstitutions = () => {
  return (
    <Box>
      <Grid container spacing={4}>
        {partnersList.map((partner) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={partner.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
                borderRadius: "15px",
                boxShadow: "0px 6px 9px 0px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "123px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={partner.logo}
                  alt={partner.name}
                  sx={{
                    maxWidth: "90%",
                    maxHeight: "90%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: fonts.poppins,
                  fontWeight: 600,
                  fontSize: "16px",
                  textAlign: "center",
                  color: "#000000",
                  lineHeight: "1.2",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  height: "3.6em", // Approx 3 lines
                }}
              >
                {partner.name}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Load More Button - Visual only as requested */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <Button
          variant="contained"
          endIcon={<KeyboardArrowDownIcon />}
          sx={{
            background: "linear-gradient(156.46deg, #bf2f75 3.87%, #720361 63.8%)",
            borderRadius: "90px",
            px: 4,
            py: 1.5,
            textTransform: "none",
            fontFamily: fonts.poppins,
            fontWeight: 600,
            fontSize: "16px",
            "&:hover": {
              background: "linear-gradient(156.46deg, #bf2f75 3.87%, #720361 63.8%)",
              opacity: 0.9,
            },
          }}
        >
          Load More
        </Button>
      </Box>
    </Box>
  );
};

export default EducationalInstitutions;
