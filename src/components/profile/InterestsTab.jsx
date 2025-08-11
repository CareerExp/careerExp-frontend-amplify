import React, { useState, useEffect } from "react";
import { fonts } from "../../utility/fonts.js";
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
import { categories } from "../../utility/category.js";
import { updateUserProfile } from "../../redux/slices/profileSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "../../redux/slices/authSlice.js";
import { notify } from "../../redux/slices/alertSlice.js";

const InterestsTab = ({ isButtonLoading, userData }) => {
  const dispatchToRedux = useDispatch();
  const token = useSelector(selectToken);

  const [selected, setSelected] = useState([]);
  const [isButtonLoading2, setIsButtonLoading2] = useState(false);

  useEffect(() => {
    // if (userData?.interests?.length > 0) {
    //   setSelected(userData.interests);
    // }
    if (userData?.interests && typeof userData.interests === "object") {
      setSelected(Object.keys(userData.interests));
    }
  }, [userData]);

  const handleSelect = (event, newSelection) => {
    setSelected(newSelection);
  };

  const handleSubmit = async (e) => {
    console.log("userData?.interests", userData?.interests);
    console.log("selected", selected);
    e.preventDefault();
    const userInterestsArray = Object.keys(userData?.interests || {});
    const isBothSame =
      selected?.length === userInterestsArray?.length &&
      selected?.every((item) => userInterestsArray?.includes(item)) &&
      userInterestsArray?.every((item) => selected?.includes(item));
    try {
      if (isBothSame) {
        dispatchToRedux(
          notify({ type: "error", message: "No changes made to interests" })
        );
      } else {
        setIsButtonLoading2(true);
        const updatedData = {
          interests: selected,
        };
        const result = await dispatchToRedux(
          updateUserProfile({ updatedData, userId: userData?._id, token })
        );
        dispatchToRedux(
          notify({ type: "success", message: "Interests updated successfully" })
        );
        setIsButtonLoading2(false);
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
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: {
            xs: "95%",
            sm: "90%",
            md: 700,
          },
          maxWidth: "95vw",
        }}
      >
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
            Save Changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InterestsTab;
