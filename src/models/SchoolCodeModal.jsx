// export default SchoolCodeModal;
import { Box, Button, CircularProgress, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../redux/slices/alertSlice.js";
import { selectAuthenticated, selectToken, selectUserId } from "../redux/slices/authSlice.js";
import { initiatePayment } from "../redux/slices/paymentSlice.js";
import { fonts } from "../utility/fonts.js";

const SchoolCodeModal = ({ open, onClose }) => {
  const dispatchToRedux = useDispatch();
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const authenticated = useSelector(selectAuthenticated);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const handleProceed = async () => {
    await dispatchToRedux(notify({ message: "Please wait...", severity: "info" }));

    if (authenticated) {
      try {
        setIsButtonLoading(true);

        const result = await dispatchToRedux(initiatePayment({ userId, token, couponCode }));

        if (result.error) {
          dispatchToRedux(notify({ message: "Invalid coupon code. Please try again.", type: "error" }));
          setIsButtonLoading(false);
          setCouponCode("");
          return;
        }

        if (result?.payload?.url) {
          window.location.href = result.payload.url;
        } else {
          notify({ message: "Payment initiation failed. Please try again later.", severity: "error" });
        }
      } catch (error) {
        notify({ message: "An error occurred. Please try again later.", severity: "error" });
      } finally {
        setIsButtonLoading(false);
      }
    } else {
      notify({ message: "You need to log in to proceed with the payment.", severity: "warning" });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "500px", md: "600px" },
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "10px",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: "bold",
            textAlign: "center",
            fontSize: { xs: "24px", sm: "28px", md: "32px" },
          }}
        >
          Apply Code
        </Typography>
        <Typography
          variant="h6"
          sx={{
            m: "1rem",
            fontFamily: fonts.sans,
            textAlign: "center",
            fontSize: { xs: "14px", sm: "16px" },
            color: "#787876",
          }}
        >
          If you have a School Code, enter it in the COUPON box. The payment due will be adjusted at checkout.
        </Typography>

        <Box sx={{ margin: "1rem" }}>
          <TextField
            sx={{
              width: "100%",
              backgroundColor: "#F6F6F6",
              fontFamily: fonts.poppins,
              borderRadius: "90px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "90px",
                "& fieldset": { border: "none" },
                "&.Mui-focused fieldset": { border: "2px solid #BF2F75" },
              },
              "& label.Mui-focused": { color: "#A0AAB4" },
              InputLabelProps: { sx: { marginLeft: "15px" } },
              InputProps: {
                disableUnderline: true,
                sx: { fontFamily: fonts.poppins },
                inputProps: { style: { paddingLeft: "20px" } },
              },
            }}
            fullWidth
            label="Enter Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            sx={{
              fontFamily: "Poppins, sans-serif",
              borderColor: "#720361",
              color: "#720361",
              padding: "0.5rem 1.5rem",
              borderRadius: "90px",
              "&:hover": { borderColor: "#bf2f75", color: "#bf2f75" },
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
              "&:hover": { background: "linear-gradient(to right, #720361, #bf2f75)" },
            }}
          >
            {isButtonLoading ? <CircularProgress color="inherit" size={24} /> : "Proceed"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SchoolCodeModal;
