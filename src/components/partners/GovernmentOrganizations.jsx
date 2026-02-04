import React from "react";
import { Box, Grid, Card, Typography, Button, Stack } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { partnersList2 } from "../../utility/partnersList";
import { fonts } from "../../utility/fonts";

const GovernmentOrganizations = () => {
  return (
    <Box sx={{ pb: 8 }}>
      <Stack spacing={4}>
        {partnersList2.map((partner) => (
          <Card
            key={partner.id}
            sx={{
              p: 2,
              borderRadius: "15px",
              boxShadow: "0px 6px 9px 0px rgba(0,0,0,0.1)",
              position: "relative",
              overflow: "visible",
            }}
          >
            {/* Ribbon Header */}
            <Box
              sx={{
                position: "relative",
                left: -16,
                top: 0,
                mb: 3,
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  bgcolor: "#bc2876",
                  color: "white",
                  px: 2,
                  py: 1,
                  fontSize: "20px",
                  fontWeight: 600,
                  fontFamily: fonts.poppins,
                  boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                {partner.name}
              </Box>
              {/* Decorative Ribbon Fold */}
              <Box
                sx={{
                  width: 0,
                  height: 0,
                  borderTop: "42px solid #bc2876",
                  borderRight: "30px solid transparent",
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                alignItems: "flex-start",
              }}
            >
              {/* Partner Logo */}
              <Box
                sx={{
                  width: { xs: "100%", md: "131px" },
                  height: "123px",
                  backgroundColor: "#F6F6F6",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
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

              {/* Collaboration Info */}
              {partner.collaboration && (
                <Box
                  sx={{
                    flex: 1,
                    border: "1px solid #dddddd",
                    borderRadius: "10px",
                    p: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: fonts.poppins,
                      fontWeight: "bold",
                      fontSize: "16px",
                      mb: 2,
                      color: "#000000",
                    }}
                  >
                    {partner.collaboration.title}
                  </Typography>
                  <Stack spacing={2}>
                    {partner.collaboration.points.map((point, index) => (
                      <Box key={point.id} sx={{ display: "flex", gap: 1.5 }}>
                        <Typography
                          sx={{
                            fontFamily: fonts.poppins,
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "#000000",
                            minWidth: "20px",
                            textAlign: "right",
                          }}
                        >
                          {index + 1}.
                        </Typography>
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: fonts.poppins,
                              fontWeight: 600,
                              fontSize: "16px",
                              color: "#000000",
                              mb: 0.5,
                            }}
                          >
                            {point.heading}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: fonts.poppins,
                              fontWeight: 400,
                              fontSize: "14px",
                              color: "#545454",
                              lineHeight: "1.5",
                            }}
                          >
                            {point.description}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          </Card>
        ))}
      </Stack>

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

export default GovernmentOrganizations;
