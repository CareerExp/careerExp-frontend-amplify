import React, { useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { State } from "country-state-city";
import { countryList } from "../utility/countryList";
import { fonts } from "../utility/fonts";
import AddLinkModal from "./AddLinkModal";
import { createAME } from "../redux/slices/adminSlice.js";
import { notify } from "../redux/slices/alertSlice.js";
import { selectToken } from "../redux/slices/authSlice.js";

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
    fontSize: "16px",
    padding: "13px 20px",
    "&::placeholder": {
      color: "#999",
      opacity: 1,
    },
  },
  "& .MuiFormLabel-root": {
    fontFamily: fonts.poppins,
    fontSize: "16px",
    fontWeight: 500,
    color: "#545454",
    mb: 1,
    position: "relative",
    transform: "none",
  },
};

const AddEducationServiceProviderModal = ({ open, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  const [formData, setFormData] = useState({
    corporateName: "",
    registeredAddress: "",
    state: "",
    country: "",
    registrationNo: "",
    telephone: "",
    website: "",
  });
  const [availableStates, setAvailableStates] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [addedLinks, setAddedLinks] = useState([]);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      const selectedCountry = countryList.find((c) => c.name === value);
      setFormData({
        ...formData,
        country: value,
        state: "",
      });
      setAvailableStates(
        selectedCountry ? State.getStatesOfCountry(selectedCountry.code) : []
      );
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length) {
      setUploadedFiles((prev) => [...prev, ...files]);
    }
    e.target.value = "";
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    if (files.length) setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const resetForm = () => {
    setFormData({
      corporateName: "",
      registeredAddress: "",
      state: "",
      country: "",
      registrationNo: "",
      telephone: "",
      website: "",
    });
    setAvailableStates([]);
    setUploadedFiles([]);
    setAddedLinks([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const buildFormData = () => {
    const data = new FormData();
    data.append("organizationName", formData.corporateName.trim());
    data.append("registrationNo", formData.registrationNo.trim());
    data.append("telephone", formData.telephone.trim());
    if (formData.registeredAddress?.trim()) {
      data.append("address", formData.registeredAddress.trim());
    }
    if (formData.state) data.append("state", formData.state);
    if (formData.country) data.append("country", formData.country);
    if (formData.website?.trim()) {
      data.append("website", formData.website.trim());
    }
    addedLinks.forEach((link) => data.append("links", link));
    uploadedFiles.forEach((file) => data.append("documents", file));
    return data;
  };

  const handleSubmit = () => {
    if (
      !formData.corporateName?.trim() ||
      !formData.registrationNo?.trim() ||
      !formData.telephone?.trim()
    ) {
      dispatch(
        notify({
          type: "warning",
          message: "Please fill all required fields (Corporate Name, Company Registration No, Telephone No)",
        })
      );
      return;
    }
    setPendingFormData(buildFormData());
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setPendingFormData(null);
  };

  const handleConfirmAddAME = async () => {
    if (!pendingFormData) return;
    try {
      setIsButtonLoading(true);
      const resultAction = await dispatch(createAME({ formData: pendingFormData, token }));
      setIsButtonLoading(false);

      if (createAME.fulfilled.match(resultAction)) {
        dispatch(
          notify({
            type: "success",
            message: resultAction.payload?.message || "Admin Managed ESP created successfully",
          })
        );
        handleCloseConfirmModal();
        resetForm();
        handleClose();
        onSuccess?.();
      } else if (createAME.rejected.match(resultAction)) {
        const payload = resultAction.payload;
        dispatch(
          notify({
            type: "error",
            message: payload?.message || "Failed to create Education Service Provider",
          })
        );
      }
    } catch (error) {
      setIsButtonLoading(false);
      dispatch(
        notify({
          type: "error",
          message: error?.message || "An unexpected error occurred",
        })
      );
    }
  };

  const hasDocuments = uploadedFiles.length > 0 || addedLinks.length > 0;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
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
          onClick={handleClose}
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
              fontSize: "35px",
              color: "black",
              mb: 0.5,
            }}
          >
            Education Service Provider Registration
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontSize: "16px",
              color: "#787878",
              letterSpacing: "0.32px",
            }}
          >
            Complete your registration to create your service provider profile
          </Typography>
        </Box>

        <Stack spacing={2.5}>
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: 600,
              fontSize: "20px",
              color: "#bc2876",
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
                Select State
              </Typography>
              <TextField
                select
                fullWidth
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Select State/City"
                sx={{
                  ...inputStyle,
                  "& .MuiOutlinedInput-root": {
                    ...inputStyle["& .MuiOutlinedInput-root"],
                    backgroundColor: !formData.country ? "#e0e0e0" : "#f6f6f6",
                  },
                }}
                disabled={!formData.country}
                SelectProps={{
                  MenuProps: {
                    PaperProps: { sx: { maxHeight: 300 } },
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
            <Box sx={{ flex: 1 }}>
              <Typography sx={inputStyle["& .MuiFormLabel-root"]}>
                Select Country
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
                    PaperProps: { sx: { maxHeight: 300 } },
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
            <Typography sx={inputStyle["& .MuiFormLabel-root"]}>Website</Typography>
            <TextField
              fullWidth
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              sx={inputStyle}
            />
          </Box>

          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: 600,
              fontSize: "20px",
              color: "#bc2876",
              mt: 2,
              mb: -1,
            }}
          >
            Required Documents
          </Typography>

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
                  fontSize: "18px",
                  color: "#545454",
                }}
              >
                Upload Verification Documents
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        border: "2px solid #fff",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      +
                    </Box>
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
                  }}
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setIsAddLinkModalOpen(true)}
                  startIcon={
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        border: "2px solid #bc2876",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#bc2876",
                      }}
                    >
                      +
                    </Box>
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
                  }}
                >
                  Add Link
                </Button>
              </Stack>
            </Box>

            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              sx={{
                backgroundColor: "#f9fafb",
                border: "1px dashed #EAECF0",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px",
                minHeight: "111px",
                textAlign: "center",
                gap: 2,
              }}
            >
              {!hasDocuments ? (
                <>
                  <Typography
                    sx={{
                      fontFamily: fonts.poppins,
                      fontSize: "14px",
                      color: "#667085",
                      mb: 1,
                    }}
                  >
                    No documents added yet. Click "Upload File" or "Add Link" to add
                    documents.
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fonts.poppins,
                      fontSize: "12px",
                      color: "#98A2B3",
                    }}
                  >
                    Examples: Accreditation certificates, licenses, registration
                    documents, etc.
                  </Typography>
                </>
              ) : (
                <Stack spacing={1} width="100%">
                  {uploadedFiles.map((file, idx) => (
                    <Box
                      key={`file-${idx}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#fff",
                        p: 1.5,
                        borderRadius: "8px",
                        border: "1px solid #EAECF0",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: fonts.poppins,
                          fontSize: "14px",
                          color: "#101828",
                          fontWeight: 500,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        📄 {file.name}
                      </Typography>
                      <IconButton size="small" onClick={() => removeFile(idx)}>
                        <Close sx={{ fontSize: "18px", color: "#bc2876" }} />
                      </IconButton>
                    </Box>
                  ))}
                  {addedLinks.map((link, idx) => (
                    <Box
                      key={`link-${idx}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#fff",
                        p: 1.5,
                        borderRadius: "8px",
                        border: "1px solid #EAECF0",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: fonts.poppins,
                          fontSize: "14px",
                          color: "#bc2876",
                          fontWeight: 500,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          textDecoration: "underline",
                        }}
                      >
                        🔗 {link}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setAddedLinks(addedLinks.filter((_, i) => i !== idx))
                        }
                      >
                        <Close sx={{ fontSize: "18px", color: "#bc2876" }} />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isButtonLoading}
              sx={{
                width: "350px",
                height: "48px",
                borderRadius: "58px",
                background: "linear-gradient(161.01deg, #BF2F75 3.87%, #720361 63.8%)",
                boxShadow: "0px 6px 18px 0px rgba(191, 47, 117, 0.4)",
                fontFamily: fonts.poppins,
                fontWeight: 700,
                fontSize: "16px",
                color: "white",
                textTransform: "uppercase",
                letterSpacing: "0.32px",
                "&:hover": {
                  background:
                    "linear-gradient(161.01deg, #BF2F75 3.87%, #720361 63.8%)",
                  opacity: 0.9,
                },
              }}
            >
              Continue registration
            </Button>
          </Box>
        </Stack>
      </Dialog>

      <AddLinkModal
        open={isAddLinkModalOpen}
        onClose={() => setIsAddLinkModalOpen(false)}
        onAdd={(link) => setAddedLinks((prev) => [...prev, link])}
      />

      {/* Publish Profile? confirmation – Figma 1125-141281 */}
      <Dialog
        open={showConfirmModal}
        onClose={handleCloseConfirmModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            p: 3,
            boxShadow: "0px 14px 44px 0px rgba(0,0,0,0.1)",
          },
        }}
      >
        <IconButton
          onClick={handleCloseConfirmModal}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "#000",
          }}
        >
          <Close />
        </IconButton>
        <Typography
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: 700,
            fontSize: "22px",
            color: "#000",
            mb: 2,
            textAlign: "center",
          }}
        >
          Publish Profile?
        </Typography>
        <Typography
          sx={{
            fontFamily: fonts.poppins,
            fontSize: "16px",
            color: "#545454",
            lineHeight: 1.5,
            mb: 3,
            textAlign: "center",
          }}
        >
          You're about to publish this profile and make it live on the platform.
          Once published, the profile will be visible to students and can start
          receiving engagement.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            onClick={handleCloseConfirmModal}
            disabled={isButtonLoading}
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: 600,
              fontSize: "15px",
              textTransform: "none",
              color: "#545454",
              backgroundColor: "#E0E0E0",
              borderRadius: "25px",
              px: 2.5,
              py: 1.25,
              "&:hover": {
                backgroundColor: "#d0d0d0",
              },
              width: "50%",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmAddAME}
            disabled={isButtonLoading}
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: 600,
              fontSize: "15px",
              textTransform: "none",
              background: "linear-gradient(161.01deg, #BF2F75 3.87%, #720361 63.8%)",
              borderRadius: "25px",
              px: 2.5,
              py: 1.25,
              boxShadow: "none",
              "&:hover": {
                background: "linear-gradient(161.01deg, #BF2F75 3.87%, #720361 63.8%)",
                opacity: 0.9,
              },
              width: "50%",
            }}
          >
            {isButtonLoading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Add New Institution"
            )}
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default AddEducationServiceProviderModal;
