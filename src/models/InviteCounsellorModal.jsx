import React, { useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { fonts } from "../utility/fonts";
import { isValidEmail } from "../utility/validate";

const InviteCounsellorModal = ({ open, onClose, onInvite }) => {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendInvite = async () => {
    if (validate()) {
      setIsLoading(true);
      try {
        await onInvite(formData);
        setFormData({ email: "", message: "" });
        onClose();
      } catch (error) {
        console.error("Failed to send invite:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "15px",
          width: "100%",
          maxWidth: "560px",
          p: "32px 24px",
          position: "relative",
          overflow: "visible",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(11px)",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: "10px",
          top: "10px",
          color: "#000",
        }}
      >
        <Close sx={{ fontSize: "24px" }} />
      </IconButton>

      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: "26px",
            color: "#000",
            letterSpacing: "-0.52px",
            mb: 1.5,
          }}
        >
          Invite Counsellor
        </Typography>
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 400,
            fontSize: "16px",
            color: "#787876",
            lineHeight: 1.4,
          }}
        >
          Invite a counsellor to join your institution and manage student
          interactions.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Email Field */}
        <Box>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 500,
              fontSize: "16px",
              color: "#545454",
              mb: 1,
            }}
          >
            Email Address
          </Typography>
          <TextField
            fullWidth
            name="email"
            placeholder="Email Address"
            variant="standard"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <InputAdornment position="end">
                  <MailOutlineIcon sx={{ color: "#787876", fontSize: "24px" }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "#f2f2f2",
                borderRadius: "90px",
                px: "23px",
                height: "54px",
                fontFamily: fonts.sans,
                fontSize: "16px",
                "& .MuiInputBase-input::placeholder": {
                  color: "#000",
                  opacity: 0.5,
                },
              },
            }}
          />
        </Box>

        {/* Message Field */}
        <Box>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 500,
              fontSize: "16px",
              color: "#545454",
              mb: 1,
            }}
          >
            Message
          </Typography>
          <TextField
            fullWidth
            name="message"
            placeholder="Add a personal message to the invitation..."
            variant="standard"
            multiline
            rows={4}
            value={formData.message}
            onChange={handleChange}
            InputProps={{
              disableUnderline: true,
              sx: {
                backgroundColor: "#f2f2f2",
                borderRadius: "18px",
                px: "23px",
                py: "15px",
                minHeight: "132px",
                fontFamily: fonts.sans,
                fontSize: "16px",
                alignItems: "flex-start",
                "& .MuiInputBase-input::placeholder": {
                  color: "#000",
                  opacity: 0.5,
                },
              },
            }}
          />
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            mt: 1,
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              backgroundColor: "#787876",
              color: "#fff",
              height: "48px",
              width: "154px",
              borderRadius: "90px",
              textTransform: "none",
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: "16px",
              "&:hover": {
                backgroundColor: "#666664",
              },
            }}
          >
            Close
          </Button>
          <Button
            onClick={handleSendInvite}
            disabled={isLoading}
            sx={{
              background:
                "linear-gradient(155.92deg, #BF2F75 3.87%, #720361 63.8%)",
              color: "#fff",
              height: "48px",
              width: "154px",
              borderRadius: "90px",
              textTransform: "none",
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: "16px",
              "&:hover": {
                opacity: 0.9,
              },
              "&:disabled": {
                opacity: 0.7,
                color: "#fff",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Send Invite"
            )}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default InviteCounsellorModal;
