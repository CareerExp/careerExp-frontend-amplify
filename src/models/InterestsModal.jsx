import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
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
import { notify } from "../redux/slices/alertSlice.js";
import { fontWeight } from "@mui/system";
import styles from "../styles/SurveyQuestion7Card.module.css";

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
      dispatchToRedux(
        notify({ type: "success", message: "Interests added successfully" })
      );
      setIsButtonLoading2(false);

      if (result.meta.requestStatus === "fulfilled") {
        handleClose();
      }
    } catch (error) {
      dispatchToRedux(
        notify({
          type: "error",
          message: "Something went wrong, please try again",
        })
      );
      setIsButtonLoading2(false);
    }
  };

  const handleCheckboxToggle = (category) => {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
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
            md: 640, // desktop (600px and above)
          },
          maxWidth: "96vw",
          maxHeight: "90vh",
          overflow: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "25px",
        }}
        className="scrollbar-hide"
      >
        <Box
          sx={{
            position: "absolute",
            top: "20px",
            right: "20px",
            cursor: "pointer",
            display: "grid",
            placeContent: "center",
            placeItems: "center",
            background: "#FFFFFF33",
            width: 36,
            height: 36,
            borderRadius: "50%",
            zIndex: 1000,
          }}
          onClick={handleClose}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15"
              stroke="white"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 5L15 15"
              stroke="white"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>
        <Box
          sx={{
            background:
              "linear-gradient(125deg, #BF2F75 -3.87%, #720361 63.8%)",
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
                xs: "1.5rem", // mobile
                sm: "2rem", // desktop
              },
            }}
          >
            Start exploring
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            justifyContent: "between",
            alignItems: "center",
            padding: "30px 30px 12px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "12px",
              justifyContent: "between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                textAlign: "left",
                color: "#6B7280",
                fontFamily: fonts.poppins,
                fontSize: { xs: "14px", sm: "16px", md: "16px" },
                lineHeight: 1.4,
              }}
            >
              Pick atleast 3 interests to help us show better suggestions
            </Typography>
            <Box
              sx={{
                width: "90px",
                border: "1px solid #E5E7EB",
                background: "#F5F5F5",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: "0",
                height: "26px",
                fontSize: "14px",
                color: "#720361",
                padding: "3px 8px"
              }}
            >
              <span style={{ fontWeight: "600", marginRight: "4px" }}>
                {selected.length}{" "}
              </span>{" "}
              selected
            </Box>
          </Box>
          {/* === THE INTEREST TILES === */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "start",
            }}
          >
            {categories.map((category) => {
              const isSelected = selected.includes(category);

              return (
                <Box
                  key={category}
                  sx={{
                    borderRadius: "24px",
                    border: "1px solid",
                    borderColor: isSelected ? "#BF2F75" : "divider",
                    px: 1.5,
                    py: 1.2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    minWidth: "fit-content",
                    cursor: "pointer",
                    bgcolor: isSelected ? "#EF5BA31F" : "transparent",

                    "&:hover": {
                      bgcolor: isSelected ? "#EF5BA31F" : "action.hover",
                    },
                  }}
                  onClick={() => handleCheckboxToggle(category)}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      userSelect: "none",
                      color: "#292C39",
                    }}
                  >
                    {category}
                  </Typography>

                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCheckboxToggle(category)}
                    onClick={(e) => e.stopPropagation()} // prevents double toggle
                    className={styles.checkbox}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* === THE INTEREST TILES === */}
        {/* <ToggleButtonGroup
          // value={selected}
          // onChange={handleSelect}
          aria-label="interests"
          sx={{
            mt: 3,
            px: 3,
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
            "& .MuiToggleButtonGroup-grouped": {
              borderRadius: "24px", // full rounding on every button
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
              "&.Mui-selected": {
                borderColor: "#BF2F75",
              },
            },
          }}
        >
          {categories.map((category) => (
            <ToggleButton
              key={category}
              value={category}
              selected={false}
              disableRipple
              sx={{
                borderRadius: "24px",
                border: "1px solid",
                textTransform: "none",
                px: 1.5,
                py: 1.2,
                "&:hover": {
                  bgcolor: selected.includes(category)
                    ? "primary.dark"
                    : "action.hover",
                },
                display: "flex",
                "&.Mui-selected": {
                  bgcolor: "#EF5BA31F",
                  borderColor: "#BF2F75",
                },

                "&.Mui-selected:hover": {
                  bgcolor: "#EF5BA31F",
                  borderColor: "#BF2F75",
                },
                gap: 1,
              }}
            >
              {category}

              <input
                type="checkbox"
                checked={selected.includes(category) ? true : false}
                onChange={() => handleCheckboxToggle(category)}
                onClick={(e) => e.stopPropagation()}
                className={styles.checkbox}
              />
            </ToggleButton>
          ))}
        </ToggleButtonGroup> */}

        {/* interest tile */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            padding: "24px 30px",
            borderTop: "1px solid #F3F4F6",
          }}
        >
          <Button
            variant="contained"
            sx={{
              background:
                "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
              width: "100%", // mobile - full width
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
            disabled={selected.length < 3}
          >
            {isButtonLoading2 ? (
              <CircularProgress size={25} color="inherit" />
            ) : (
              <p style={{ textTransform: "capitalize" }}>Save</p>
              // "Save"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default InterestsModal;
