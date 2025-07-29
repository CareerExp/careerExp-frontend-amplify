import { Facebook, Google, Instagram, Twitter } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assessmentHeaderImg } from "../../assets/assest.js";
import { sendAdminSupportEmail } from "../../redux/slices/adminSlice.js";
import { notify } from "../../redux/slices/alertSlice.js";
import { selectToken } from "../../redux/slices/authSlice.js";
import resumeBuilderStyles from "../../styles/ResumeBuilder.module.css";
import { buttonStyle, inputFieldStyle } from "../../utility/commonStyle.js";
import { fonts } from "../../utility/fonts.js";
import Footer from "../Footer.jsx";
import Headers from "../Headers.jsx";
import { isValidEmail, isValidMobileNumber } from "../../utility/validate.js";

const ContactUs = () => {
  const dispatchToRedux = useDispatch();
  const token = useSelector(selectToken);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    query: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber" && /[^0-9]/.test(value)) {
      dispatchToRedux(
        notify({
          message: "Phone number can only contain numbers.",
          type: "error",
        }),
      );
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all form fields are filled
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.query
    ) {
      // Notify the user that all fields are required
      dispatchToRedux(
        notify({
          message: "All fields are required",
          type: "error",
        }),
      );
      return; // Exit early if validation fails
    }

    // Validate email
    if (!isValidEmail(formData.email)) {
      dispatchToRedux(
        notify({
          message: "Please enter a valid email address",
          type: "error",
        }),
      );
      return;
    }

    // Validate phone number
    if (!isValidMobileNumber(formData.phoneNumber)) {
      dispatchToRedux(
        notify({
          message: "Please enter a valid phone number (numbers only)",
          type: "error",
        }),
      );
      return;
    }

    try {
      // Dispatch the sendAdminSupportEmail action
      await dispatchToRedux(
        sendAdminSupportEmail({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          query: formData.query,
          token,
        }),
      );

      // Notify the user of successful form submission
      dispatchToRedux(
        notify({
          message: "Form submitted successfully",
          type: "success",
        }),
      );

      // Reset the form data
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        query: "",
      });
    } catch (error) {
      // Handle any errors that occur during the form submission
      console.error("Error during form submission:", error);

      // Notify the user of the error
      dispatchToRedux(
        notify({
          message: "Failed to submit the form. Please try again later.",
          type: "error",
        }),
      );
    }
  };

  return (
    <div>
      <section
        className={resumeBuilderStyles["header"]}
        style={{ backgroundImage: `url(${assessmentHeaderImg})` }}
      >
        <Headers />
        <h2>Get in Touch</h2>
      </section>
      <Box
        sx={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          maxWidth: "800px",
          margin: "auto",
          mt: 4,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ textAlign: "center", color: "gray", mb: 4, fontFamily: fonts.poppins }}
        >
          Fill out the form below to get in touch with Admin
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                sx={{
                  ...inputFieldStyle,
                  width: "100%",
                  "& .MuiInputBase-input::placeholder": {
                    textAlign: "left",
                    paddingLeft: "8px",
                  },
                }}
                placeholder="Please enter first name..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                sx={{
                  ...inputFieldStyle,
                  width: "100%",
                  "& .MuiInputBase-input::placeholder": {
                    textAlign: "left",
                    paddingLeft: "8px",
                  },
                }}
                placeholder="Please enter last name..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                fullWidth
                sx={{
                  ...inputFieldStyle,
                  width: "100%",
                  "& .MuiInputBase-input::placeholder": {
                    textAlign: "left",
                    paddingLeft: "8px",
                  },
                }}
                placeholder="Please enter email..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                type="tel"
                fullWidth
                sx={{
                  ...inputFieldStyle,
                  width: "100%",
                  "& .MuiInputBase-input::placeholder": {
                    textAlign: "left",
                    paddingLeft: "8px",
                  },
                }}
                placeholder="Please enter phone number..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="What do you have in mind?"
                name="query"
                value={formData.query}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                sx={{
                  ...inputFieldStyle,
                  width: "100%",
                  "& .MuiInputBase-input::placeholder": {
                    textAlign: "left",
                    paddingLeft: "8px",
                  },
                  "& .MuiInputBase-input": {
                    fontFamily: fonts.poppins,
                  },
                }}
                placeholder="Please enter query..."
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                ...buttonStyle,
                fontFamily: fonts.poppins,
                mt: 2,
                fontWeight: "bold",
                padding: "0.8rem",
                width: "50%",
              }}
            >
              Submit
            </Button>
          </Box>
        </form>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 3,
          }}
        >
          <IconButton>
            <Twitter color="primary" />
          </IconButton>
          <IconButton>
            <Facebook color="primary" />
          </IconButton>
          <IconButton>
            <Google color="error" />
          </IconButton>
          <IconButton>
            <Instagram color="secondary" />
          </IconButton>
        </Box>
      </Box>
      <Footer />
    </div>
  );
};

export default ContactUs;
