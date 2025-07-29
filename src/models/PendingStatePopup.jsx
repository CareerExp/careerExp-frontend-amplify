import { Backdrop, Box, Divider, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fonts } from "../utility/fonts.js";

const PendingStatePopup = ({ message }) => {
  const [openBackdrop, setOpenBackdrop] = useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    setOpenBackdrop(false);
    navigate("/");
  };

  return (
    <div>
      <div>
        <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }} open={openBackdrop} />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            backgroundColor: "white",
            padding: "20px",
            width: "40%",
            textAlign: "center",
            borderRadius: 5,
            zIndex: (theme) => theme.zIndex.drawer + 1,
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
            onClick={handleClick}
            style={{
              background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
              width: "30%",
              "&:hover": {
                background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
              },
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
      </div>
    </div>
  );
};

export default PendingStatePopup;
