import { Backdrop, Box, Divider, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fonts } from "../utility/fonts.js";

const PendingStatePopup = ({ message, persistent = false }) => {
  const [openBackdrop, setOpenBackdrop] = useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!persistent) {
      setOpenBackdrop(false);
    }
    navigate("/");
  };

  return (
    <>
      <Backdrop
        sx={{
          position: "fixed",
          zIndex: (theme) => theme.zIndex.modal + 1,
          color: "#fff",
        }}
        open={openBackdrop}
      />
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "white",
          padding: "20px",
          width: { xs: "90%", sm: "40%" },
          maxWidth: 560,
          textAlign: "center",
          borderRadius: 5,
          zIndex: (theme) => theme.zIndex.modal + 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontFamily: fonts.poppins, fontWeight: "600" }}>
            {message}
          </Typography>
        </Box>
        <Divider sx={{ width: "70%", margin: "10px 0" }} />

        <Typography variant="body1" sx={{ padding: "10px", margin: "10px 0", fontFamily: fonts.poppins }}>
          Click Below to go to Home page
        </Typography>

        <button
          type="button"
          onClick={handleClick}
          style={{
            background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
            width: "30%",
            minWidth: 120,
            borderRadius: "90px",
            padding: "10px 0px",
            fontWeight: "bold",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontFamily: fonts.poppins,
            fontSize: "16px",
          }}
        >
          Home
        </button>
      </Box>
    </>
  );
};

export default PendingStatePopup;
