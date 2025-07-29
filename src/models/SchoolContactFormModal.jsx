import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Logo } from "../assets/assest.js";
import { notify } from "../redux/slices/alertSlice.js";
import { selectAuthenticated, selectToken, selectUserId } from "../redux/slices/authSlice.js";
import { saveschoolcontactform } from "../redux/slices/schoolContactSlice.js";
import { buttonStyle } from "../utility/commonStyle.js";
import { countryList } from "../utility/countryList.js";
import { fonts } from "../utility/fonts.js";
import { isValidEmail, isValidMobileNumber } from "../utility/validate.js";

// Define a common style for TextField
const textFieldStyles = {
  width: "30%",
  backgroundColor: "#F6F6F6",
  fontFamily: fonts.poppins,
  borderRadius: "90px",
  border: "none",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
    },
  },
  "& label.Mui-focused": {
    color: "#A0AAB4",
  },
  InputLabelProps: {
    sx: { marginLeft: "15px" },
  },
  InputProps: {
    disableUnderline: true,
    sx: {
      fontFamily: fonts.poppins,
      "&::placeholder": {
        fontFamily: fonts.poppins,
      },
    },
    inputProps: {
      style: {
        paddingLeft: "20px",
      },
    },
  },
};

const SchoolContactFormModal = ({ open, onClose }) => {
  const dispatchToRedux = useDispatch();
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const isAuthenticated = useSelector(selectAuthenticated);
  const navigate = useNavigate();
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    contactPerson1: {
      firstName: "",
      middleName: "",
      lastName: "",
      position: "",
      email: "",
      phoneNumber: "",
      countryCode: "",
    },
    contactPerson2: {
      firstName: "",
      middleName: "",
      lastName: "",
      position: "",
      email: "",
      phoneNumber: "",
      countryCode: "",
    },
    schoolDetails: {
      schoolName: "",
      website: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  // Handle change in text fields
  const handleChange = (e, section, field) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: e.target.value,
      },
    }));
  };

  const handleSubmit = async () => {
    const mobileNumber1 = `${formData.contactPerson1.countryCode}${formData.contactPerson1.phoneNumber}`;
    const mobileNumber2 = `${formData.contactPerson2.countryCode}${formData.contactPerson2.phoneNumber}`;

    const newData = {
      ...formData,
      contactPerson1: {
        ...formData.contactPerson1,
        phoneNumber: mobileNumber1,
      },
      contactPerson2: {
        ...formData.contactPerson2,
        phoneNumber: mobileNumber2,
      },
    };

    if (!isAuthenticated) {
      dispatchToRedux(
        notify({
          message: "Please login to submit the form",
          type: "error",
        }),
      );
      navigate("/login");
      return;
    }

    if (
      !newData.contactPerson1.firstName ||
      !newData.contactPerson1.email ||
      !newData.contactPerson1.phoneNumber
    ) {
      dispatchToRedux(
        notify({
          message: "At least one contact person should be filled",
          type: "error",
        }),
      );
      return;
    }

    if (
      !newData.schoolDetails.schoolName ||
      !newData.schoolDetails.website ||
      !newData.schoolDetails.addressLine1 ||
      !newData.schoolDetails.city ||
      !newData.schoolDetails.postalCode ||
      !newData.schoolDetails.country
    ) {
      dispatchToRedux(
        notify({
          message: "All school details are mandatory",
          type: "error",
        }),
      );
      return;
    }

    try {
      setIsButtonLoading(true);
      await dispatchToRedux(saveschoolcontactform({ token, userId, formData: newData }));

      dispatchToRedux(
        notify({
          message: "Contact form submitted successfully",
          type: "success",
        }),
      );

      setIsButtonLoading(false);
      setOpenSuccessModal(true);
      setFormData({
        contactPerson1: {
          firstName: "",
          middleName: "",
          lastName: "",
          position: "",
          email: "",
          phoneNumber: "",
          countryCode: "",
        },
        contactPerson2: {
          firstName: "",
          middleName: "",
          lastName: "",
          position: "",
          email: "",
          phoneNumber: "",
          countryCode: "",
        },
        schoolDetails: {
          schoolName: "",
          website: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          postalCode: "",
          country: "",
        },
      });
    } catch (error) {
      setIsButtonLoading(false);
      dispatchToRedux(
        notify({
          message: "Something went wrong, please try again",
          type: "error",
        }),
      );
    }
  };

  // Close the success modal
  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        backdropFilter: "blur(8px) !important",
        backgroundColor: "rgba(0, 0, 0, 0.3) !important",
        paddingBottom: "1rem",
      }}
      fullWidth={true}
      maxWidth="md"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <img src={Logo} alt="Career Explorer Logo" height={"38.88px"} width={"112.23px"} />
        <Typography
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: "700",
            fontSize: "26px",
            textAlign: "center",
          }}
        >
          School Contact Form
        </Typography>
      </Box>

      <Box
        sx={{
          //   height: "943.86px",
          margin: "1rem",
          border: "1px solid #C5C6C7",
          p: "1rem",
          borderRadius: "12px",
        }}
      >
        <Box sx={{ border: "1px solid #C5C6C7", borderRadius: "12px", my: "1rem", py: "1rem" }}>
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: "600",
              fontSize: "16px",
              textAlign: "center",
              color: "#BC2876",
              paddingBottom: "1rem",
            }}
          >
            Contact Person 1
          </Typography>

          <Box
            sx={{
              display: { xs: "grid", md: "flex" },
              flexDirection: { xs: "column", md: "row" },

              gap: "1rem",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              size="small"
              label="First Name"
              sx={{ ...textFieldStyles, width: { xs: "100%", md: "30%" } }}
              value={formData.contactPerson1.firstName}
              onChange={(e) => handleChange(e, "contactPerson1", "firstName")}
            />
            <TextField
              size="small"
              label="Middle Name"
              sx={{ ...textFieldStyles, width: { xs: "100%", md: "30%" } }}
              value={formData.contactPerson1.middleName}
              onChange={(e) => handleChange(e, "contactPerson1", "middleName")}
            />
            <TextField
              size="small"
              label="Last Name"
              sx={{ ...textFieldStyles, width: { xs: "100%", md: "30%" } }}
              value={formData.contactPerson1.lastName}
              onChange={(e) => handleChange(e, "contactPerson1", "lastName")}
            />
          </Box>

          <Box
            sx={{
              display: { xs: "grid", md: "flex" },
              flexDirection: { xs: "column", md: "row" },
              gap: "1rem",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <TextField
              label="Position"
              size="small"
              sx={{ ...textFieldStyles, width: { xs: "100%", md: "30%" } }}
              value={formData.contactPerson1.position}
              onChange={(e) => handleChange(e, "contactPerson1", "position")}
            />
            <TextField
              label="Email Address"
              size="small"
              sx={{ ...textFieldStyles, width: { xs: "100%", md: "30%" } }}
              value={formData.contactPerson1.email}
              onChange={(e) => handleChange(e, "contactPerson1", "email")}
            />

            <TextField
              select
              //   label="Country Code"
              size="small"
              SelectProps={{
                displayEmpty: true,
                MenuProps: {
                  PaperProps: {
                    style: {
                      borderRadius: "10px",
                      backgroundColor: "#F6F6F6",
                    },
                  },
                },
              }}
              sx={{
                width: { xs: "100%", md: "10%" },

                backgroundColor: "#F6F6F6",
                fontFamily: fonts.poppins,
                borderRadius: "90px 0px 0px 90px",
                border: "none",
                marginRight: "-1.5rem",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                },
                "& label.Mui-focused": {
                  color: "#A0AAB4",
                },
                InputLabelProps: {
                  sx: { marginLeft: "15px" },
                },

                InputProps: {
                  disableUnderline: true,
                  sx: {
                    fontFamily: fonts.poppins,
                    "&::placeholder": {
                      fontFamily: fonts.poppins,
                    },
                  },
                  inputProps: {
                    style: {
                      paddingLeft: "20px",
                    },
                  },
                },
              }}
              value={formData.contactPerson1.countryCode}
              onChange={(e) => handleChange(e, "contactPerson1", "countryCode")}
            >
              <MenuItem value="" disabled>
                +1
              </MenuItem>
              {countryList.map((code) => (
                <MenuItem
                  key={code.name}
                  value={code.dial_code}
                  sx={{ fontFamily: fonts.poppins, backgroundColor: "#fff" }}
                >
                  {`${code.name} (${code.dial_code})`}
                </MenuItem>
              ))}
            </TextField>
            {/* sx={{ ...textFieldStyles, width: { xs: "100%", md: "30%" } }} */}
            <TextField
              label="Mobile Number"
              size="small"
              sx={{ ...textFieldStyles, width: { xs: "100%", md: "21%" }, borderRadius: "0px 90px 90px 0px" }}
              inputlabelprops={{
                shrink: false,
              }}
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontFamily: fonts.poppins,
                  "&::placeholder": {
                    fontFamily: fonts.poppins,
                  },
                },
                inputProps: {
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                },
              }}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                  dispatchToRedux(
                    notify({
                      type: "warning",
                      message: "Only numeric values are allowed in the mobile number field.",
                    }),
                  );
                }
              }}
              value={formData.contactPerson1.phoneNumber}
              onChange={(e) => handleChange(e, "contactPerson1", "phoneNumber")}
            />
          </Box>
        </Box>

        {/* conatct person 2  */}
        <Box sx={{ border: "1px solid #C5C6C7", borderRadius: "12px", my: "1rem", py: "1rem" }}>
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: "600",
              fontSize: "16px",
              textAlign: "center",
              color: "#BC2876",
              paddingBottom: "1rem",
            }}
          >
            Contact Person 2
          </Typography>

          <Box
            sx={{
              display: { xs: "grid", md: "flex" },
              flexDirection: { xs: "column", md: "row" },
              gap: "1rem",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              size="small"
              label="First Name"
              sx={{ ...textFieldStyles, width: { xs: "100%", md: "30%" } }}
              value={formData.contactPerson2.firstName}
              onChange={(e) => handleChange(e, "contactPerson2", "firstName")}
            />
            <TextField
              size="small"
              label="Middle Name"
              sx={{ ...textFieldStyles, width: { xs: "100%", md: "30%" } }}
              value={formData.contactPerson2.middleName}
              onChange={(e) => handleChange(e, "contactPerson2", "middleName")}
            />
            <TextField
              size="small"
              label="Last Name"
              sx={{ ...textFieldStyles, width: { xs: "100%", md: "30%" } }}
              value={formData.contactPerson2.lastName}
              onChange={(e) => handleChange(e, "contactPerson2", "lastName")}
            />
          </Box>

          <Box
            sx={{
              display: { xs: "grid", md: "flex" },
              flexDirection: { xs: "column", md: "row" },
              gap: "1rem",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <TextField
              label="Position"
              size="small"
              sx={{ ...textFieldStyles, width: { xs: "100%", md: "30%" } }}
              value={formData.contactPerson2.position}
              onChange={(e) => handleChange(e, "contactPerson2", "position")}
            />
            <TextField
              label="Email Address"
              size="small"
              sx={{ ...textFieldStyles, width: { xs: "100%", md: "30%" } }}
              value={formData.contactPerson2.email}
              onChange={(e) => handleChange(e, "contactPerson2", "email")}
            />
            <TextField
              select
              //   label="Country Code"
              size="small"
              SelectProps={{
                displayEmpty: true,
                MenuProps: {
                  PaperProps: {
                    style: {
                      borderRadius: "10px",
                      backgroundColor: "#F6F6F6",
                    },
                  },
                },
              }}
              sx={{
                width: { xs: "100%", md: "10%" },
                backgroundColor: "#F6F6F6",
                fontFamily: fonts.poppins,
                borderRadius: "90px 0px 0px 90px",
                border: "none",
                marginRight: "-1.5rem",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                },
                "& label.Mui-focused": {
                  color: "#A0AAB4",
                },
                InputLabelProps: {
                  sx: { marginLeft: "15px" },
                },
                InputProps: {
                  disableUnderline: true,
                  sx: {
                    fontFamily: fonts.poppins,
                    "&::placeholder": {
                      fontFamily: fonts.poppins,
                    },
                  },
                  inputProps: {
                    style: {
                      paddingLeft: "20px",
                    },
                  },
                },
              }}
              value={formData.contactPerson2.countryCode}
              onChange={(e) => handleChange(e, "contactPerson2", "countryCode")}
            >
              <MenuItem value="" disabled>
                +1
              </MenuItem>
              {countryList.map((code) => (
                <MenuItem
                  key={code.name}
                  value={code.dial_code}
                  sx={{ fontFamily: fonts.poppins, backgroundColor: "#fff" }}
                >
                  {`${code.name} (${code.dial_code})`}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Mobile Number"
              size="small"
              sx={{ ...textFieldStyles, width: { xs: "100%", md: "21%" }, borderRadius: "0px 90px 90px 0px" }}
              value={formData.contactPerson2.phoneNumber}
              onChange={(e) => handleChange(e, "contactPerson2", "phoneNumber")}
              inputlabelprops={{
                shrink: false,
              }}
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontFamily: fonts.poppins,
                  "&::placeholder": {
                    fontFamily: fonts.poppins,
                  },
                },
                inputProps: {
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                },
              }}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                  dispatchToRedux(
                    notify({
                      type: "warning",
                      message: "Only numeric values are allowed in the mobile number field.",
                    }),
                  );
                }
              }}
            />
          </Box>
        </Box>
        {/* Schoool Details  */}
        <Box sx={{ border: "1px solid #C5C6C7", borderRadius: "12px", px: "2rem", my: "1rem", py: "1rem" }}>
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: "600",
              fontSize: "16px",
              textAlign: "center",
              color: "#BC2876",
              //   paddingBottom: "1rem",
            }}
          >
            School Details
          </Typography>

          <TextField
            label="School Name"
            size="small"
            margin="normal"
            sx={{
              width: "100%",
              backgroundColor: "#F6F6F6",
              fontFamily: fonts.poppins,
              borderRadius: "90px",
              border: "none",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
              },
              "& label.Mui-focused": {
                color: "#A0AAB4",
              },
              InputLabelProps: {
                sx: { marginLeft: "15px" },
              },
              InputProps: {
                disableUnderline: true,
                sx: {
                  fontFamily: fonts.poppins,
                  "&::placeholder": {
                    fontFamily: fonts.poppins,
                  },
                },
                inputProps: {
                  style: {
                    paddingLeft: "20px",
                  },
                },
              },
            }}
            value={formData.schoolDetails.schoolName}
            onChange={(e) => handleChange(e, "schoolDetails", "schoolName")}
          />
          <TextField
            fullWidth
            label="Website URL of school/education institution"
            size="small"
            sx={{
              width: "100%",
              backgroundColor: "#F6F6F6",
              fontFamily: fonts.poppins,
              borderRadius: "90px",
              border: "none",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
              },
              "& label.Mui-focused": {
                color: "#A0AAB4",
              },
              InputLabelProps: {
                sx: { marginLeft: "15px" },
              },
              InputProps: {
                disableUnderline: true,
                sx: {
                  fontFamily: fonts.poppins,
                  "&::placeholder": {
                    fontFamily: fonts.poppins,
                  },
                },
                inputProps: {
                  style: {
                    paddingLeft: "20px",
                  },
                },
              },
            }}
            value={formData.schoolDetails.website}
            onChange={(e) => handleChange(e, "schoolDetails", "website")}
          />

          <Box
            sx={{
              display: { xs: "grid", md: "flex" },
              flexDirection: { xs: "column", md: "row" },
              gap: "1rem",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              size="small"
              label="Address Line 1"
              sx={{ ...textFieldStyles, marginTop: "1rem", width: { xs: "100%", md: "50%" } }}
              value={formData.schoolDetails.addressLine1}
              onChange={(e) => handleChange(e, "schoolDetails", "addressLine1")}
            />
            <TextField
              size="small"
              label="Address Line 2"
              sx={{ ...textFieldStyles, marginTop: "1rem", width: { xs: "100%", md: "50%" } }}
              value={formData.schoolDetails.addressLine2}
              onChange={(e) => handleChange(e, "schoolDetails", "addressLine2")}
            />
          </Box>

          <Box
            sx={{
              display: { xs: "grid", md: "flex" },
              flexDirection: { xs: "column", md: "row" },
              gap: "1rem",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <TextField
              label="City"
              size="small"
              sx={{ ...textFieldStyles, width: { xs: "100%", md: "33%" } }}
              value={formData.schoolDetails.city}
              onChange={(e) => handleChange(e, "schoolDetails", "city")}
            />
            <TextField
              label="Postal Code"
              size="small"
              sx={{ ...textFieldStyles, width: { xs: "100%", md: "33%" } }}
              value={formData.schoolDetails.postalCode}
              onChange={(e) => handleChange(e, "schoolDetails", "postalCode")}
            />

            <TextField
              select
              label="Country"
              size="small"
              sx={{ ...textFieldStyles, width: { xs: "100%", md: "33%" } }}
              value={formData.schoolDetails.country}
              onChange={(e) => handleChange(e, "schoolDetails", "country")}
            >
              {countryList.map((code) => (
                <MenuItem
                  key={code.name}
                  value={code.name}
                  sx={{ fontFamily: fonts.poppins, backgroundColor: "#fff" }}
                >
                  {`${code.name}`}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
      </Box>
      {/* Button  */}
      <Box
        sx={{
          width: "50%",
          margin: "auto",
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "2rem",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#787876",
            borderRadius: "90px",
            width: "30%",
            "&:hover": {
              background: "#787876",
            },
          }}
          onClick={() => onClose()}
        >
          Close
        </Button>
        {isButtonLoading ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled
            sx={{
              background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
              // width: "50%",
              "&.Mui-disabled": {
                color: "#fff", // Adjust text/icon color if needed
                opacity: 1, // Add slight opacity to indicate disabled state
              },
              "&:hover": {
                background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
              },
              borderRadius: "90px",
              width: "30%",
            }}
          >
            <CircularProgress color="inherit" size={25} />
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
              // width: "50%",
              "&:hover": {
                background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
              },
              borderRadius: "90px",
              width: "30%",
            }}
          >
            Submit
          </Button>
        )}
      </Box>

      <Dialog
        open={openSuccessModal}
        onClose={handleCloseSuccessModal}
        sx={{
          "& .MuiDialogPaper-root": {
            borderRadius: "90px", // Set the border radius to 90px
          },
        }}
      >
        <DialogTitle>Thank You!</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Thank you for completing the School Contact form We will get straight onto it! Please do also let
            your School know that we will be getting in touch.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessModal} sx={{ ...buttonStyle, width: "15%" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default SchoolContactFormModal;
