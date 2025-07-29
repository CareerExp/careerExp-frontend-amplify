import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Grid, MenuItem, TextField } from "@mui/material";
import { countryList } from "../../utility/countryList.js"; // Assuming you have a country list utility
import { fonts } from "../../utility/fonts.js"; // Assuming you have a fonts utility
import { useDispatch } from "react-redux";
import { notify } from "../../redux/slices/alertSlice.js";
import { isValidMobileNumber } from "../../utility/validate.js";
const PersonalInfoForm = ({ formData, handleInputChange, handleSubmit, isButtonLoading2, userData }) => {
  const dispatchToRedux = useDispatch();
  const [mobileCountryCode, setMobileCountryCode] = useState("+1");
  const [mobileNumber, setMobileNumber] = useState("");
  const [whatsappCountryCode, setWhatsappCountryCode] = useState("+1");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  // Initialize mobile and whatsapp numbers from formData
  useEffect(() => {
    if (formData.mobile) {
      const mobileParts = formData.mobile.split(" ");
      if (mobileParts.length === 2) {
        setMobileCountryCode(mobileParts[0]);
        setMobileNumber(mobileParts[1]);
      }
    }

    if (formData.telephone) {
      const whatsappParts = formData.telephone.split(" ");
      if (whatsappParts.length === 2) {
        setWhatsappCountryCode(whatsappParts[0]);
        setWhatsappNumber(whatsappParts[1]);
      }
    }
  }, [formData.mobile, formData.telephone]);

  const handleMobileCountryCodeChange = (e) => {
    const value = e.target.value;
    setMobileCountryCode(value);
    // Update the formData with combined value
    handleInputChange({
      target: {
        name: "mobile",
        value: `${value} ${mobileNumber}`.trim(),
      },
    });
  };

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    setMobileNumber(value);

    // Update the formData with combined value
    handleInputChange({
      target: {
        name: "mobile",
        value: `${mobileCountryCode} ${value}`.trim(),
      },
    });
  };

  const handleWhatsappCountryCodeChange = (e) => {
    const value = e.target.value;
    setWhatsappCountryCode(value);
    // Update the formData with combined value
    handleInputChange({
      target: {
        name: "telephone",
        value: `${value} ${whatsappNumber}`.trim(),
      },
    });
  };

  const handleWhatsappNumberChange = (e) => {
    const value = e.target.value;
    setWhatsappNumber(value);
    // Update the formData with combined value
    handleInputChange({
      target: {
        name: "telephone",
        value: `${whatsappCountryCode} ${value}`.trim(),
      },
    });
  };

  const textFieldStyle = {
    borderRadius: "90px",
    backgroundColor: "#f3f3f3",
    fontFamily: fonts.poppins,
    "& .MuiOutlinedInput-root": {
      borderRadius: "90px",
      "& fieldset": {
        border: "none",
      },
      fontSize: "inherit",
      "&.Mui-focused fieldset": {
        borderColor: "#999999",
        borderWidth: "2px",
      },
      "& input": {
        "&::placeholder": {
          paddingLeft: "8px",
        },
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "inherit",
      "&.Mui-focused": {
        color: "#999999",
      },
      transform: "translate(14px, -12px) scale(0.75)",
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            sx={textFieldStyle}
            InputLabelProps={{
              shrink: true,
              style: { marginTop: "-8px" },
            }}
          />
        </Grid>
        {userData?.activeDashboard !== "creator" && (
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Middle Name"
              variant="outlined"
              name="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
              sx={textFieldStyle}
              InputLabelProps={{
                shrink: true,
                style: { marginTop: "-8px" },
              }}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            sx={textFieldStyle}
            InputLabelProps={{
              shrink: true,
              style: { marginTop: "-8px" },
            }}
          />
        </Grid>
        {userData?.activeDashboard !== "creator" && (
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              sx={textFieldStyle}
              InputLabelProps={{
                shrink: true,
                style: { marginTop: "-8px" },
              }}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={4}>
          <TextField
            select
            fullWidth
            label="Gender"
            variant="outlined"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            sx={textFieldStyle}
            InputLabelProps={{
              shrink: true,
              style: { marginTop: "-8px" },
            }}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Grid>
        {userData?.activeDashboard !== "creator" && (
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Date of Birth"
              variant="outlined"
              name="dateOfBirth"
              type="date"
              sx={textFieldStyle}
              InputLabelProps={{
                shrink: true,
                style: { marginTop: "-8px" },
              }}
              value={formData?.dateOfBirth}
              onChange={handleInputChange}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Location"
            variant="outlined"
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
            sx={textFieldStyle}
            InputLabelProps={{
              shrink: true,
              style: { marginTop: "-8px" },
            }}
          >
            {countryList.map(({ name: country }) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled
            sx={textFieldStyle}
            InputLabelProps={{
              shrink: true,
              style: { marginTop: "-8px" },
            }}
          />
        </Grid>

        {/* <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mobile Number"
            variant="outlined"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            sx={textFieldStyle}
          />
        </Grid> */}
        <Grid item xs={12} sm={6}>
          <Grid container spacing={0}>
            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                label="Country Code"
                variant="outlined"
                value={mobileCountryCode}
                onChange={handleMobileCountryCodeChange}
                sx={{ ...textFieldStyle, borderRadius: "90px 0 0 90px" }}
                InputLabelProps={{
                  shrink: true,
                  style: { marginTop: "-8px" },
                }}
              >
                {countryList.map((country) => (
                  <MenuItem key={country.code} value={country.dial_code}>
                    {/* {country.dial_code} */}
                    {` ${country.dial_code} (${country.name})`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="Mobile Number"
                variant="outlined"
                value={mobileNumber}
                onChange={handleMobileNumberChange}
                sx={{ ...textFieldStyle, borderRadius: "0 90px 90px 0" }}
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
                InputLabelProps={{
                  shrink: true,
                  style: { marginTop: "-8px" },
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Whatsapp Number"
            variant="outlined"
            name="telephone"
            value={formData.telephone}
            onChange={handleInputChange}
            sx={textFieldStyle}
          />
        </Grid> */}

        {/* WhatsApp Number with Country Code */}
        <Grid item xs={12} sm={6}>
          <Grid container spacing={0}>
            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                label="Country Code"
                variant="outlined"
                value={whatsappCountryCode}
                onChange={handleWhatsappCountryCodeChange}
                sx={{ ...textFieldStyle, borderRadius: "90px 0 0 90px" }}
                InputLabelProps={{
                  shrink: true,
                  style: { marginTop: "-8px" },
                }}
              >
                {countryList.map((country) => (
                  <MenuItem key={country.code} value={country.dial_code}>
                    {` ${country.dial_code} (${country.name})`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="WhatsApp Number"
                variant="outlined"
                value={whatsappNumber}
                onChange={handleWhatsappNumberChange}
                sx={{ ...textFieldStyle, borderRadius: "0 90px 90px 0" }}
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
                InputLabelProps={{
                  shrink: true,
                  style: { marginTop: "-8px" },
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        {userData?.activeDashboard === "creator" && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Specialization"
                variant="outlined"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                sx={textFieldStyle}
                InputLabelProps={{
                  shrink: true,
                  style: { marginTop: "-8px" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Years Of Experience"
                variant="outlined"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                sx={textFieldStyle}
                InputLabelProps={{
                  shrink: true,
                  style: { marginTop: "-8px" },
                }}
              />
            </Grid>
          </>
        )}

        {userData?.activeDashboard !== "creator" && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Personal Website"
              variant="outlined"
              name="personalWebsite"
              value={formData.personalWebsite}
              onChange={handleInputChange}
              sx={textFieldStyle}
              InputLabelProps={{
                shrink: true,
                style: { marginTop: "-8px" },
              }}
            />
          </Grid>
        )}

        {userData?.activeDashboard === "creator" && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Short Description"
              variant="outlined"
              name="introBio"
              value={formData.introBio}
              onChange={handleInputChange}
              sx={textFieldStyle}
              InputLabelProps={{
                shrink: true,
                style: { marginTop: "-8px" },
              }}
            />
          </Grid>
        )}
      </Grid>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          sx={{
            mt: 3,
            mb: 2,
            py: 1,
            fontWeight: "bold",
            textTransform: "none",
            backgroundImage: "linear-gradient(to top left, #720361, #BF2F75)",
            borderRadius: "2rem",
            color: "white",
            width: { xs: "100%", sm: "50%", md: "30%", lg: "15%" },
          }}
          type="submit"
          disabled={isButtonLoading2}
        >
          {isButtonLoading2 ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </Box>
    </form>
  );
};

export default PersonalInfoForm;
