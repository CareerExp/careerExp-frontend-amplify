import React, { useEffect, useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  InputAdornment,
  MenuItem,
  CircularProgress,
  Autocomplete,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff, ExpandMore, Close } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { countryList } from "../../utility/countryList";
import { fonts } from "../../utility/fonts";
import { notify } from "../../redux/slices/alertSlice.js";
import {
  checkPassStrength,
  isValidEmail,
  isValidMobileNumber,
} from "../../utility/validate.js";
import { State } from "country-state-city";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f6f6f6",
    borderRadius: "10px",
    "& fieldset": {
      border: "none",
    },
  },
  "& .MuiInputBase-input": {
    fontFamily: fonts.poppins,
    fontSize: { xs: "14px", md: "16px" },
    padding: "13px 20px",
  },
  "& .MuiFormLabel-root": {
    fontFamily: fonts.poppins,
    fontSize: { xs: "14px", md: "16px" },
    fontWeight: 500,
    color: "#545454",
    mb: 1,
    position: "relative",
    transform: "none",
  },
};

const ClaimRegistrationModal = ({ open, onClose, university, onSuccess }) => {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [availableStates, setAvailableStates] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    countryCode: "+1",
    corporateName: "",
    registeredAddress: "",
    state: "",
    country: "",
    registrationNo: "",
    telephone: "",
    website: "",
  });

  useEffect(() => {
    if (open && university) {
      setFormData((prev) => ({
        ...prev,
        corporateName: university.name || "",
        website: university.website || "",
        country: university.country || "",
      }));
      if (university.country) {
        const selectedCountry = countryList.find((c) => c.name === university.country);
        if (selectedCountry) {
          setAvailableStates(State.getStatesOfCountry(selectedCountry.code));
        }
      }
      setErrorMessage("");
    }
  }, [open, university]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      const selectedCountry = countryList.find((c) => c.name === value);
      setFormData({
        ...formData,
        country: value,
        state: "",
      });
      if (selectedCountry) {
        setAvailableStates(State.getStatesOfCountry(selectedCountry.code));
      } else {
        setAvailableStates([]);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.mobile ||
      !formData.password ||
      !formData.countryCode ||
      !formData.corporateName ||
      !formData.registrationNo ||
      !formData.telephone
    ) {
      setErrorMessage("Please fill all the required fields");
      return;
    }
    if (!isValidEmail(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    if (!isValidMobileNumber(formData.mobile)) {
      setErrorMessage("Please enter a valid mobile number.");
      return;
    }
    if (!checkPassStrength(formData.password)) {
      setErrorMessage(
        "Password must contain at least one uppercase letter, one number, one special character, and minimum 8 characters",
      );
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const fullMobile = `${formData.countryCode} ${formData.mobile}`;
    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);
    data.append("mobile", fullMobile);
    data.append("password", formData.password);
    data.append("role", "organization");
    data.append("organizationType", "HEI");
    data.append("organizationName", formData.corporateName);
    data.append("registrationNo", formData.registrationNo);
    data.append("telephone", formData.telephone);
    data.append("website", formData.website);
    data.append("address", formData.registeredAddress);
    data.append("state", formData.state);
    data.append("country", formData.country);
    if (university?.slug) {
      data.append("claimUniversitySlug", university.slug);
    }

    try {
      setSubmitting(true);
      const res = await FetchApi.fetch(`${config.api}/api/auth/signup`, {
        method: "POST",
        headers: {},
        body: data,
      });
      setSubmitting(false);
      if (res?.success) {
        dispatch(
          notify({
            type: "success",
            message: "Registration submitted! Check your email for next steps.",
          }),
        );
        onSuccess?.();
        onClose?.();
      } else {
        setErrorMessage(res?.message || "Registration failed");
      }
    } catch (err) {
      setSubmitting(false);
      setErrorMessage(err?.message || "Registration failed");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "29px",
          maxWidth: "896px",
          p: { xs: 2, md: "42px 46px" },
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", right: "15px", top: "15px", color: "#000" }}
        aria-label="Close"
      >
        <Close />
      </IconButton>
      <Typography
        sx={{
          fontFamily: fonts.poppins,
          fontWeight: 700,
          fontSize: { xs: "22px", md: "30px" },
          color: "#000",
          textAlign: "center",
          mb: 1,
        }}
      >
        Claim university page
      </Typography>
      <Typography
        sx={{
          fontFamily: fonts.poppins,
          fontSize: "14px",
          color: "#787878",
          textAlign: "center",
          mb: 2,
        }}
      >
        Register your institution to complete the claim for{" "}
        <strong>{university?.name}</strong>
      </Typography>
      {errorMessage ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      ) : null}
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
              First Name <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              sx={inputStyle}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
              Last Name <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              sx={inputStyle}
            />
          </Box>
        </Stack>
        <Box>
          <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
            Email <span style={{ color: "red" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            sx={inputStyle}
          />
        </Box>
        <Box>
          <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
            Mobile <span style={{ color: "red" }}>*</span>
          </Typography>
          <Box
            sx={{
              display: "flex",
              backgroundColor: "#f6f6f6",
              borderRadius: "10px",
              alignItems: "center",
              px: 2,
              gap: 1,
            }}
          >
            <Autocomplete
              sx={{ width: "110px" }}
              options={countryList}
              autoHighlight
              getOptionLabel={(option) => option.dial_code || ""}
              value={
                countryList.find((c) => c.dial_code === formData.countryCode) ||
                null
              }
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  countryCode: newValue ? newValue.dial_code : "",
                });
              }}
              popupIcon={<ExpandMore sx={{ fontSize: "20px" }} />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  InputProps={{ ...params.InputProps, disableUnderline: true }}
                />
              )}
            />
            <TextField
              variant="standard"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile number"
              InputProps={{ disableUnderline: true }}
              sx={{ flex: 1 }}
            />
          </Box>
        </Box>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
              Password <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              sx={inputStyle}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((v) => !v)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
              Confirm Password <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={inputStyle}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword((v) => !v)}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Stack>
        <Box>
          <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
            Institution name <span style={{ color: "red" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="corporateName"
            value={formData.corporateName}
            InputProps={{ readOnly: true }}
            sx={inputStyle}
          />
        </Box>
        <Box>
          <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
            Registered address
          </Typography>
          <TextField
            fullWidth
            name="registeredAddress"
            value={formData.registeredAddress}
            onChange={handleChange}
            sx={inputStyle}
          />
        </Box>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
              Country
            </Typography>
            <TextField
              select
              fullWidth
              name="country"
              value={formData.country}
              onChange={handleChange}
              sx={inputStyle}
            >
              {countryList.map((c) => (
                <MenuItem key={c.code} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={inputStyle["& .MuiFormLabel-root"]}>State</Typography>
            <TextField
              select
              fullWidth
              name="state"
              value={formData.state}
              onChange={handleChange}
              sx={inputStyle}
            >
              {availableStates.map((s) => (
                <MenuItem key={s.isoCode} value={s.name}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Stack>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
              Registration No. <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
              sx={inputStyle}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
              Telephone <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              sx={inputStyle}
            />
          </Box>
        </Stack>
        <Box>
          <Typography sx={inputStyle["& .MuiFormLabel-root"]}>Website</Typography>
          <TextField
            fullWidth
            name="website"
            value={formData.website}
            onChange={handleChange}
            sx={inputStyle}
          />
        </Box>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{
            mt: 1,
            py: 1.5,
            borderRadius: "90px",
            textTransform: "none",
            fontFamily: fonts.poppins,
            fontWeight: 600,
            background: "linear-gradient(180deg, #BF2F75 0%, #720361 100%)",
          }}
        >
          {submitting ? <CircularProgress size={24} color="inherit" /> : "Submit registration"}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default ClaimRegistrationModal;
