import { Box, Button, CircularProgress, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthenticated, selectToken, selectUserId } from "../redux/slices/authSlice.js";
import { initiatePayment } from "../redux/slices/paymentSlice.js";
import { fonts } from "../utility/fonts.js";

const PayNowModal = ({ open, onClose }) => {
  const dispatchToRedux = useDispatch();
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const authenticated = useSelector(selectAuthenticated);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const handleProceed = async () => {
    if (authenticated) {
      try {
        setIsButtonLoading(true);

        // Dispatch initiatePayment (assuming it returns a promise)
        const result = await dispatchToRedux(initiatePayment({ userId, token }));

        // Assuming `result` contains the link to Stripe checkout
        if (result && result.payload.url) {
          // Redirect the user to the Stripe checkout page
          window.location.href = result.payload.url;
        } else {
          console.error("Payment initiation failed, no link returned");
        }
      } catch (error) {
        console.error("Error during payment initiation:", error);
      } finally {
        setIsButtonLoading(false);
      }
    } else {
      console.log("User is not authenticated");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          // width: 600,
          width: { xs: "90%", sm: "80%", md: 600 },
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "10px",
          // p: 3,
          p: { xs: 2, sm: 3, md: 3 },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            marginBottom: "1rem",
            fontFamily: fonts.sans,
            fontWeight: "bold",
            textAlign: "center",
            fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
          }}
        >
          Please click below to be directed to the Payment page.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleCancel}
            sx={{
              fontFamily: "Poppins, sans-serif",
              borderColor: "#720361",
              color: "#720361",
              padding: "0.5rem 1.5rem",
              borderRadius: "90px",
              "&:hover": {
                borderColor: "#bf2f75",
                color: "#bf2f75",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleProceed}
            sx={{
              fontFamily: "Poppins, sans-serif",
              background: "linear-gradient(to right, #720361, #bf2f75)",
              color: "white",
              padding: "0.5rem 1.5rem",
              borderRadius: "90px",
              "&:hover": {
                background: "linear-gradient(to right, #720361, #bf2f75)",
              },
            }}
          >
            {isButtonLoading ? <CircularProgress color="inherit" size={24} /> : "Proceed"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PayNowModal;
