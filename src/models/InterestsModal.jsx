import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import React, { useState } from "react";
import { categories } from "../utility/category";
import { fonts } from "../utility/fonts.js";
import {
  selectUserProfile,
  updateUserProfile,
} from "../redux/slices/profileSlice.js";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAuthenticated,
  selectToken,
  selectUserId,
} from "../redux/slices/authSlice.js";
import toast from "react-hot-toast";

const InterestsModal = ({ open, handleClose }) => {
  const dispatchToRedux = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const [isButtonLoading2, setIsButtonLoading2] = useState(false);
  const userId = useSelector(selectUserId);
  const userData = useSelector(selectUserProfile);
  const authenticated = useSelector(selectAuthenticated);
  const token = useSelector(selectToken);

  const [selected, setSelected] = useState([]);

  const handleSelect = (event, newSelection) => {
    setSelected(newSelection);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      interests: selected,
      hasLoggedIn: true,
    };
    try {
      setIsButtonLoading2(true);
      const result = await dispatchToRedux(
        updateUserProfile({ updatedData, userId: userData?._id, token })
      );
      toast.success("Interests added successfully");
      setIsButtonLoading2(false);

      if (result.meta.requestStatus === "fulfilled") {
        handleClose();
      }
    } catch (error) {
      toast.error("Something went wrong, please try again");
      setIsButtonLoading2(false);
    }
  };

  return (
    <Modal
      open={open}
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: {
            xs: "90%", // mobile (480px and below)
            sm: "80%", // small devices (480px-600px)
            md: 600, // desktop (600px and above)
          },
          maxWidth: "95vw",
          maxHeight: "90vh",
          overflow: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "25px",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(to top left, #720361, #bf2f75)",
            p: {
              xs: 2, // mobile
              sm: 3, // desktop
            },
            borderRadius: "25px 25px 0 0",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              color: "white",
              fontSize: {
                xs: "1rem", // mobile
                sm: "1.25rem", // desktop
              },
            }}
          >
            Select Interests
          </Typography>
        </Box>
        <Typography
          sx={{
            mt: 3,
            px: {
              xs: 2, // mobile
              sm: "2rem", // desktop
            },
            textAlign: "center",
            color: "#787878",
            fontFamily: fonts.poppins,
            fontSize: { xs: "14px", sm: "16px", md: "18px" },
          }}
        >
          Pick atleast 2 interests to help us show better suggestions
        </Typography>

        {/* === THE INTEREST TILES === */}
        <ToggleButtonGroup
          value={selected}
          onChange={handleSelect}
          aria-label="interests"
          sx={{
            mt: 3,
            px: 3,
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
            "& .MuiToggleButtonGroup-grouped": {
              borderRadius: "12px", // full rounding on every button
              border: "1px solid", // full border
              borderColor: "divider",
              margin: 0, // avoid collapse
              "&:not(:first-of-type)": {
                borderLeft: "1px solid", // force left border
                borderColor: "divider",
              },
              "&:not(:last-of-type)": {
                borderRight: "1px solid", // force right border
                borderColor: "divider",
              },
            },
          }}
        >
          {categories.map((category) => (
            <ToggleButton
              key={category}
              value={category}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                textTransform: "none",
                borderColor: "divider",
                px: 2,
                py: 1.2,
                bgcolor: selected.includes(category)
                  ? "primary.main"
                  : "background.paper",
                color: selected.includes(category)
                  ? "common.black"
                  : "text.primary",
                "&:hover": {
                  bgcolor: selected.includes(category)
                    ? "primary.dark"
                    : "action.hover",
                },
                display: "flex",
                gap: 1,
              }}
            >
              {category}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            p: {
              xs: 2, // mobile
              sm: 4, // desktop
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Button
            variant="contained"
            sx={{
              background:
                "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
              width: {
                xs: "100%", // mobile - full width
                sm: "40%", // desktop - 40% width
              },
              "&:hover": {
                background:
                  "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
              },
              "&:disabled": {
                opacity: "70%",
                color: "white",
              },
              borderRadius: "2rem",
              padding: "10px 0px",
              fontWeight: "bold",
              color: "white",
            }}
            onClick={handleSubmit}
            disabled={selected.length < 2}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default InterestsModal;
