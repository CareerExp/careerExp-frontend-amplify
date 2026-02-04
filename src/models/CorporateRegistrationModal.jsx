import React, { useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Card,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { MdClose } from "react-icons/md";
import { FaGraduationCap, FaBriefcase } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";
import { fonts } from "../utility/fonts";
import ServiceProviderRegistrationModal from "./ServiceProviderRegistrationModal";

const CARD_TYPES = {
  INSTITUTION: "institution",
  SERVICE_PROVIDER: "serviceProvider",
};

const CorporateRegistrationModal = ({ open, onClose, onContinueAsServiceProvider, onContinueAsEducationalInstitution }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedCard, setSelectedCard] = useState(CARD_TYPES.INSTITUTION);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const handleContinue = () => {
    onClose();
    if (selectedCard === CARD_TYPES.SERVICE_PROVIDER) {
      onContinueAsServiceProvider();
    } else if (selectedCard === CARD_TYPES.INSTITUTION) {
      onContinueAsEducationalInstitution();
    }
  };

  const handleCloseRegistration = () => {
    setIsRegistrationOpen(false);
  };

  const cardStyle = (selected) => ({
    flex: 1,
    p: 3,
    borderRadius: "16px",
    border: "2px solid",
    borderColor: selected ? "#BF2F75" : "#D1D5DC",
    background: selected
      ? "linear-gradient(180deg, #FFF5FA 0%, #FFFFFF 100%)"
      : "#FFFFFF",
    boxShadow: selected ? "0px 10px 15px -3px rgba(0, 0, 0, 0.1)" : "none",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
    },
  });

  const iconBoxStyle = (selected) => ({
    width: 64,
    height: 64,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: selected
      ? "linear-gradient(162.56deg, #BF2F75 11.43%, #720361 61.54%)"
      : "rgba(114, 3, 97, 0.1)",
    color: selected ? "white" : "#720361",
  });

  const Tick = () => (
    <Box
      sx={{
        position: "absolute",
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: "50%",
        background:
          "linear-gradient(162.56deg, #BF2F75 11.43%, #720361 61.54%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <IoCheckmark size={20} />
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          p: { xs: 2, md: 4 },
          maxWidth: "1100px",
          width: "100%",
          margin: { xs: 2, md: 4 },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: 700,
              fontSize: { xs: "24px", md: "30px" },
              mb: 1,
            }}
          >
            Corporate Registration
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontSize: "16px",
              color: "#666",
              maxWidth: "800px",
              lineHeight: 1.5,
            }}
          >
            Corporate registration is a premium subscription service that allows you to create a branded 
company presence, access dashboards, and appear as a verified partner.
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <MdClose size={24} />
        </IconButton>
      </Box>

      {/* Cards */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        sx={{ mb: 4 }}
      >
        {/* Educational Institution */}
        <Card
          sx={cardStyle(selectedCard === CARD_TYPES.INSTITUTION)}
          onClick={() => setSelectedCard(CARD_TYPES.INSTITUTION)}
        >
          {selectedCard === CARD_TYPES.INSTITUTION && <Tick />}

          <Box sx={iconBoxStyle(selectedCard === CARD_TYPES.INSTITUTION)}>
            <FaGraduationCap size={32} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: 600,
                fontSize: "20px",
                color:
                  selectedCard === CARD_TYPES.INSTITUTION
                    ? "#BF2F75"
                    : "black",
                mb: 1.5,
              }}
            >
              Educational Institution
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.poppins,
                fontSize: "14px",
                color: "rgba(0,0,0,0.6)",
                lineHeight: 1.6,
              }}
            >
              Establish an official institutional presence to highlight your programs, attract student enquiries, manage courses, and appear as a trusted education partner.
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            disabled={selectedCard !== CARD_TYPES.INSTITUTION}
            onClick={onContinueAsEducationalInstitution}
            sx={{
              background:
                selectedCard === CARD_TYPES.INSTITUTION
                  ? "linear-gradient(178.08deg, #BF2F75 11.43%, #720361 61.54%)"
                  : "rgba(120,120,118,0.6)",
              borderRadius: "90px",
              py: 1.5,
              textTransform: "none",
              fontFamily: fonts.poppins,
              fontWeight: 600,
              fontSize: "16px",
            }}
          >
            Continue as Educational Institution
          </Button>
        </Card>

        {/* Education Service Provider */}
        <Card
          sx={cardStyle(selectedCard === CARD_TYPES.SERVICE_PROVIDER)}
          onClick={() => setSelectedCard(CARD_TYPES.SERVICE_PROVIDER)}
        >
          {selectedCard === CARD_TYPES.SERVICE_PROVIDER && <Tick />}

          <Box sx={iconBoxStyle(selectedCard === CARD_TYPES.SERVICE_PROVIDER)}>
            <FaBriefcase size={32} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: 600,
                fontSize: "20px",
                color:
                  selectedCard === CARD_TYPES.SERVICE_PROVIDER
                    ? "#BF2F75"
                    : "black",
                mb: 1.5,
              }}
            >
              Education Service Provider
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.poppins,
                fontSize: "14px",
                color: "#666",
                lineHeight: 1.6,
              }}
            >
              Create a branded profile to showcase your educational services, connect with students and counsellors, manage enquiries, and grow your reach as a verified service partner.
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            disabled={selectedCard !== CARD_TYPES.SERVICE_PROVIDER}
             onClick={onContinueAsServiceProvider}
            sx={{
              background:
                selectedCard === CARD_TYPES.SERVICE_PROVIDER
                  ? "linear-gradient(178.08deg, #BF2F75 11.43%, #720361 61.54%)"
                  : "rgba(120,120,118,0.6)",
              borderRadius: "90px",
              py: 1.5,
              textTransform: "none",
              fontFamily: fonts.poppins,
              fontWeight: 600,
              fontSize: "16px",
            }}
          >
            Continue as Service Provider
          </Button>
        </Card>
      </Stack>

      {/* Cancel */}
      <Box sx={{ textAlign: "center" }}>
        <Typography
          onClick={onClose}
          sx={{
            fontFamily: fonts.poppins,
            fontSize: "15px",
            color: "#666",
            cursor: "pointer",
            "&:hover": { color: "black" },
          }}
        >
          Cancel
        </Typography>
      </Box>

    </Dialog>
  );
};

export default CorporateRegistrationModal;
