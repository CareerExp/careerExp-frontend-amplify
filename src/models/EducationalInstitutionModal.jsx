import React, { useState } from "react";
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
  Grid,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  ExpandMore,
  Close,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { countryList } from "../utility/countryList";
import { fonts } from "../utility/fonts";
import { uploadDocument, upload2, link2 } from "../assets/assest";
import { notify } from "../redux/slices/alertSlice.js";
import { signup } from "../redux/slices/authSlice.js";
import {
  checkPassStrength,
  isValidEmail,
  isValidMobileNumber,
} from "../utility/validate.js";
import { State } from "country-state-city";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OrgRegistrationSuccessModal from "./OrgRegistrationSuccessModal";

const EducationalInstitutionModal = ({ open, onClose }) => {
  const dispatchToRedux = useDispatch();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    countryCode: "+1",
    // New fields
    corporateName: "",
    registeredAddress: "",
    state: "",
    country: "",
    registrationNo: "",
    telephone: "",
    website: "",
  });

  const [availableStates, setAvailableStates] = useState([]);
  const [documents, setDocuments] = useState([
    {
      id: Date.now(),
      type: "FILE",
      name: "",
      value: null,
    },
  ]); // Array of { id, type: 'FILE' | 'LINK', name: '', value: null | '' }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const addDocument = (type) => {
    if (documents.length >= 3) {
      dispatchToRedux(
        notify({ type: "warning", message: "Maximum 3 documents allowed" }),
      );
      return;
    }

    const lastDoc = documents[documents.length - 1];
    if (lastDoc && (!lastDoc.name || !lastDoc.value)) {
      dispatchToRedux(
        notify({
          type: "warning",
          message: "Please fill the current document card first",
        }),
      );
      return;
    }

    setDocuments([
      ...documents,
      {
        id: Date.now(),
        type,
        name: "",
        value: type === "FILE" ? null : "",
      },
    ]);
  };

  const updateDocument = (id, field, value) => {
    const updatedDocs = documents.map((doc) =>
      doc.id === id ? { ...doc, [field]: value } : doc,
    );
    setDocuments(updatedDocs);

    // Auto-add next document if current one is filled and it's the last one
    const currentDoc = updatedDocs.find((d) => d.id === id);
    const isLast = updatedDocs[updatedDocs.length - 1].id === id;

    if (
      isLast &&
      updatedDocs.length < 3 &&
      currentDoc.name.trim() !== "" &&
      currentDoc.value !== null &&
      currentDoc.value !== ""
    ) {
      setDocuments([
        ...updatedDocs,
        {
          id: Date.now() + 1, // Ensure unique ID even if called rapidly
          type: "FILE",
          name: "",
          value: null,
        },
      ]);
    }
  };

  const removeDocument = (id) => {
    const newDocs = documents.filter((doc) => doc.id !== id);
    if (newDocs.length === 0) {
      setDocuments([
        {
          id: Date.now(),
          type: "FILE",
          name: "",
          value: null,
        },
      ]);
    } else {
      setDocuments(newDocs);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      const selectedCountry = countryList.find((c) => c.name === value);
      setFormData({
        ...formData,
        country: value,
        state: "", // Reset state when country changes
      });

      if (selectedCountry) {
        setAvailableStates(State.getStatesOfCountry(selectedCountry.code));
      } else {
        setAvailableStates([]);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSignUp = async () => {
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
      dispatchToRedux(
        notify({
          type: "warning",
          message: "Please fill all the required fields",
        }),
      );
      return;
    }

    if (!isValidEmail(formData.email)) {
      dispatchToRedux(
        notify({
          type: "warning",
          message: "Please enter a valid email address",
        }),
      );
      return;
    }

    if (!isValidMobileNumber(formData.mobile)) {
      dispatchToRedux(
        notify({
          type: "warning",
          message: "Please enter a valid mobile number.",
        }),
      );
      return;
    }

    if (!checkPassStrength(formData.password)) {
      dispatchToRedux(
        notify({
          type: "warning",
          message:
            "Password must contain at least one uppercase letter, one number, one special character, and minimum 8 characters",
        }),
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      dispatchToRedux(
        notify({
          type: "warning",
          message: "Passwords do not match",
        }),
      );
      return;
    }

    const fullMobile = `${formData.countryCode} ${formData.mobile}`;

    // Construct payload using FormData to support file uploads
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

    // Filter documents to include only those with values
    const validDocs = documents.filter((doc) => doc.value);

    // Add documents/links to payload
    validDocs.forEach((doc) => {
      if (doc.type === "FILE") {
        data.append("documents", doc.value);
        // If API supports document names separately, append them too
        data.append("documentNames", doc.name);
      } else if (doc.type === "LINK") {
        data.append("links", doc.value);
        data.append("documentNames", doc.name);
      }
    });

    try {
      setIsButtonLoading(true);
      const resultAction = await dispatchToRedux(signup(data));
      setIsButtonLoading(false);

      if (signup.fulfilled.match(resultAction)) {
        setFormData({
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
        setAvailableStates([]);
        setDocuments([
          { id: Date.now(), type: "FILE", name: "", value: null },
        ]);
        setShowPassword(false);
        setShowConfirmPassword(false);
        setShowSuccessModal(true);
      } else if (signup.rejected.match(resultAction)) {
        const error = resultAction.payload || resultAction.error;
        dispatchToRedux(
          notify({
            type: "error",
            message: error.message || "Registration failed",
          }),
        );
      }
    } catch (error) {
      setIsButtonLoading(false);
      dispatchToRedux(
        notify({
          type: "error",
          message: error.message || "An unexpected error occurred",
        }),
      );
    }
  };

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
      "&::placeholder": {
        color: "#999",
        opacity: 1,
      },
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

  const emailInputStyle = {
    ...inputStyle,
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f6f6f6",
      borderRadius: "10px",
      border: "1px solid #bf2f75",
      "& fieldset": {
        border: "none",
      },
    },
    "& .MuiInputBase-input": {
      ...inputStyle["& .MuiInputBase-input"],
      color: "#212121",
      fontWeight: 500,
    },
  };

  return (
    <>
      <OrgRegistrationSuccessModal
        open={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
      />
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "29px",
            width: "100%",
            maxWidth: "896px",
            p: { xs: 2, md: "42px 46px" },
            boxShadow: "0px 14px 44px 0px rgba(0,0,0,0.1)",
            position: "relative",
          },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: "15px",
            top: "15px",
            color: "#000",
          }}
        >
          <Close />
        </IconButton>

        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: 700,
              fontSize: { xs: "22px", sm: "28px", md: "35px" },
              color: "black",
              mb: 0.5,
            }}
          >
            Educational Institution Registration
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontSize: { xs: "14px", md: "16px" },
              color: "#787878",
              letterSpacing: "0.32px",
            }}
          >
            Complete your registration to create your Institution profile
          </Typography>
        </Box>

        <Stack spacing={2.5}>
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: 600,
              fontSize: { xs: "16px", md: "20px" },
              color: "#bc2876", // 👈 updated color
              mb: -1,
            }}
          >
            Contact Person Information
          </Typography>

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
                placeholder="First Name"
                inputProps={{ maxLength: 50 }}
                error={formData.firstName.length === 50}
                helperText={formData.firstName.length === 50 ? "Cannot add more than 50 characters" : ""}
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
                placeholder="Last Name"
                inputProps={{ maxLength: 50 }}
                error={formData.lastName.length === 50}
                helperText={formData.lastName.length === 50 ? "Cannot add more than 50 characters" : ""}
                sx={inputStyle}
              />
            </Box>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{ ...inputStyle["& .MuiFormLabel-root"], color: "#720361" }}
              >
                Email <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Liampayne@gmail.com"
                sx={emailInputStyle}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
                Mobile No <span style={{ color: "red" }}>*</span>
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  backgroundColor: "#f6f6f6",
                  borderRadius: "10px",
                  height: "50px",
                  alignItems: "center",
                  px: 2,
                  gap: 1,
                }}
              >
                <Autocomplete
                  sx={{
                    width: "80px", // Reduced width slightly
                  }}
                  options={countryList}
                  autoHighlight
                  getOptionLabel={(option) => option.dial_code || ""}
                  value={
                    countryList.find(
                      (c) => c.dial_code === formData.countryCode,
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      countryCode: newValue ? newValue.dial_code : "",
                    });
                  }}
                  slotProps={{
                    popper: {
                      sx: {
                        width: "200px !important", // 👈 dropdown width
                        "& .MuiPaper-root": {
                          borderRadius: "12px",
                          boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
                          marginLeft: "30px",
                          marginTop: "11px",
                        },
                      },
                    },
                  }}
                  filterOptions={(options, { inputValue }) => {
                    return options.filter(
                      (item) =>
                        item.name
                          .toLowerCase()
                          .includes(inputValue.toLowerCase()) ||
                        item.dial_code.includes(inputValue),
                    );
                  }}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      width={"200px"}
                      {...props}
                      sx={{
                        fontFamily: fonts.poppins,
                        fontSize: "14px",
                        px: 1,
                        py: 1,
                      }}
                    >
                      {option.dial_code} ({option.name})
                    </Box>
                  )}
                  PopperProps={{
                    sx: {
                      "& .MuiPaper-root": {
                        width: "400px",
                        borderRadius: "10px",
                        mt: 1,
                        boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                      },
                    },
                  }}
                  ListboxProps={{
                    sx: {
                      maxHeight: "300px",
                      "&::-webkit-scrollbar": { width: "6px" },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#ddd",
                        borderRadius: "10px",
                      },
                    },
                  }}
                  popupIcon={
                    <ExpandMore sx={{ fontSize: "20px", color: "#101010" }} />
                  }
                  forcePopupIcon={true}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      placeholder="+1"
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          p: 0,
                          display: "flex",
                          alignItems: "center",
                        },
                        "& .MuiInputBase-input": {
                          fontFamily: fonts.poppins,
                          fontSize: "16px",
                          color: "#101010",
                          p: 0,
                          width: "90px !important",
                        },
                      }}
                    />
                  )}
                />
                <Box
                  sx={{
                    width: "1px",
                    height: "24px",
                    bgcolor: "#E0E0E0",
                    flexShrink: 0,
                  }}
                />
                <TextField
                  fullWidth
                  variant="standard"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  InputProps={{
                    disableUnderline: true,
                    inputProps: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    },
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontFamily: fonts.poppins,
                      fontSize: "16px",
                      color: "#212121",
                      p: 0,
                    },
                  }}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
              </Box>
            </Box>
          </Stack>

          <Box>
            <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
              Create Password <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              sx={inputStyle}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
              Confirm Password <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter Password"
              sx={inputStyle}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: 600,
              fontSize: { xs: "16px", md: "20px" },
              color: "#bc2876", // 👈 updated color
              mt: 2,
              mb: -1,
            }}
          >
            Business Entity Information
          </Typography>

          <Box>
            <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
              Corporate Name <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="corporateName"
              value={formData.corporateName}
              onChange={handleChange}
              placeholder="Enter corporate/company name"
              sx={inputStyle}
            />
          </Box>

          <Box>
            <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
              Registered Address
            </Typography>
            <TextField
              fullWidth
              name="registeredAddress"
              value={formData.registeredAddress}
              onChange={handleChange}
              placeholder="Enter location"
              sx={inputStyle}
            />
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
                Select Country <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                select
                fullWidth
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Select Country"
                sx={inputStyle}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">Select Country</MenuItem>
                {countryList.map((c) => (
                  <MenuItem key={c.code} value={c.name}>
                    <Box
                      component="img"
                      src={c.image}
                      sx={{ width: 20, height: 15, mr: 1, objectFit: "cover" }}
                    />
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
                Select State <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                select
                fullWidth
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={!formData.country}
                placeholder="Select State/City"
                sx={{
                  ...inputStyle,
                  "& .MuiOutlinedInput-root": {
                    ...inputStyle["& .MuiOutlinedInput-root"],
                    backgroundColor: !formData.country ? "#e0e0e0" : "#f6f6f6",
                  },
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">Select State/City</MenuItem>
                {availableStates.map((s) => (
                  <MenuItem key={s.name} value={s.name}>
                    {s.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
                Company Registration No <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleChange}
                placeholder="Enter registration number"
                sx={inputStyle}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
                Telephone No <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="Enter telephone number"
                sx={inputStyle}
              />
            </Box>
          </Stack>

          <Box>
            <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
              Website
            </Typography>
            <TextField
              fullWidth
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              sx={inputStyle}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontFamily: fonts.poppins,
                  fontWeight: 600,
                  fontSize: { xs: "16px", md: "20px" },
                  color: "#bc2876",
                }}
              >
                Required Documents
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="contained"
                  onClick={() => addDocument("FILE")}
                  disabled={documents.length >= 3}
                  startIcon={
                    <Box component="img" src={upload2} alt="" sx={{ width: 16, height: 16 }} />
                  }
                  sx={{
                    borderRadius: "8px",
                    background: "#bc2876",
                    color: "#fff",
                    textTransform: "none",
                    fontFamily: fonts.poppins,
                    fontWeight: 600,
                    fontSize: "14px",
                    height: "40px",
                    boxShadow: "none",
                    "&:hover": { background: "#720361", boxShadow: "none" },
                    "&.Mui-disabled": {
                      background: "#e0e0e0",
                      color: "#9e9e9e",
                    },
                  }}
                >
                  Upload File
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => addDocument("LINK")}
                  disabled={documents.length >= 3}
                  startIcon={
                    <Box component="img" src={link2} alt="" sx={{ width: 16, height: 16 }} />
                  }
                  sx={{
                    borderRadius: "8px",
                    borderColor: "#bc2876",
                    color: "#bc2876",
                    textTransform: "none",
                    fontFamily: fonts.poppins,
                    fontWeight: 600,
                    fontSize: "14px",
                    height: "40px",
                    "&:hover": {
                      borderColor: "#720361",
                      backgroundColor: "rgba(188, 40, 118, 0.04)",
                    },
                    "&.Mui-disabled": {
                      borderColor: "#e0e0e0",
                      color: "#9e9e9e",
                    },
                  }}
                >
                  Add Link
                </Button>
              </Stack>
            </Box>

            <Stack spacing={2}>
              {documents.map((doc) => (
                <Box
                  key={doc.id}
                  sx={{
                    p: 2,
                    border: "1px solid #EAECF0",
                    borderRadius: "12px",
                    position: "relative",
                    backgroundColor: "#fff",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => removeDocument(doc.id)}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      color: "#667085",
                    }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: "20px" }} />
                  </IconButton>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        sx={{
                          fontFamily: fonts.poppins,
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#333",
                          mb: 0.5,
                        }}
                      >
                        Document Name
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="e.g., Accreditation Certificate"
                        variant="standard"
                        value={doc.name}
                        onChange={(e) =>
                          updateDocument(doc.id, "name", e.target.value)
                        }
                        InputProps={{
                          disableUnderline: true,
                          sx: {
                            backgroundColor: "#fff",
                            border: "1px solid #d1d5dc",
                            borderRadius: "90px",
                            px: 2,
                            py: 0.5,
                            fontFamily: fonts.poppins,
                            fontSize: "14px",
                          },
                        }}
                      />
                    </Grid>

                    {doc.type === "FILE" ? (
                      <Grid item xs={12}>
                        <Box
                          onClick={() =>
                            document.getElementById(`file-${doc.id}`).click()
                          }
                          sx={{
                            border: "1px solid #d1d5dc",
                            borderRadius: "90px",
                            py: 1.2,
                            px: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            cursor: "pointer",
                            backgroundColor: "#fff",
                          }}
                        >
                          <Box
                            component="img"
                            src={uploadDocument}
                            sx={{ width: 16, height: 16 }}
                          />
                          <Typography
                            sx={{
                              fontFamily: fonts.poppins,
                              fontSize: "13px",
                              color: doc.value ? "#333" : "#666",
                              fontWeight: doc.value ? 500 : 400,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {doc.value
                              ? doc.value.name
                              : "Click to upload file"}
                          </Typography>
                          <input
                            type="file"
                            id={`file-${doc.id}`}
                            hidden
                            onChange={(e) =>
                              updateDocument(doc.id, "value", e.target.files[0])
                            }
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                        </Box>
                      </Grid>
                    ) : (
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            fontFamily: fonts.poppins,
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#333",
                            mb: 0.5,
                          }}
                        >
                          Document URL
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="https://example.com/document"
                          variant="standard"
                          value={doc.value}
                          onChange={(e) =>
                            updateDocument(doc.id, "value", e.target.value)
                          }
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              backgroundColor: "#fff",
                              border: "1px solid #d1d5dc",
                              borderRadius: "90px",
                              px: 2,
                              py: 0.5,
                              fontFamily: fonts.poppins,
                              fontSize: "14px",
                            },
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
            <Button
              variant="contained"
              onClick={handleSignUp}
              disabled={isButtonLoading}
              sx={{
                width: "350px",
                height: "48px",
                borderRadius: "58px",
                background:
                  "linear-gradient(161.01deg, #BF2F75 3.87%, #720361 63.8%)",
                boxShadow: "0px 6px 18px 0px rgba(191, 47, 117, 0.4)",
                fontFamily: fonts.poppins,
                fontWeight: 700,
                fontSize: { xs: "14px", md: "16px" },
                color: "white",
                textTransform: "none",
                letterSpacing: "0.32px",
                "&:hover": {
                  background:
                    "linear-gradient(161.01deg, #BF2F75 3.87%, #720361 63.8%)",
                  opacity: 0.9,
                },
              }}
            >
              {isButtonLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Continue registration"
              )}
            </Button>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <Typography
              sx={{
                fontFamily: fonts.poppins,
                fontSize: { xs: "14px", md: "16px" },
                color: "#0d1833",
                opacity: 0.5,
              }}
            >
              Already have an account?
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: 600,
                fontSize: { xs: "14px", md: "16px" },
                color: "#ff8a00",
                cursor: "pointer",
              }}
            >
              Sign In
            </Typography>
          </Box>
        </Stack>
      </Dialog>
    </>
  );
};

export default EducationalInstitutionModal;
