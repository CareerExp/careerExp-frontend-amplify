import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LinkIcon from "@mui/icons-material/Link";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import { countryList } from "../../utility/countryList";
import { fonts } from "../../utility/fonts";

// Figma 1026-159897: section title #BC2876, labels dark grey, inputs pill-shaped
const sectionTitleSx = {
  fontFamily: fonts.sans,
  fontSize: "16px",
  fontWeight: 700,
  color: "#BC2876",
  mb: 2,
};
// Separate label above input (Figma 1026-159897) – no overlap
const labelSx = {
  fontFamily: fonts.sans,
  fontSize: "14px",
  fontWeight: 400,
  color: "#374151",
  display: "block",
  mb: 1,
};
const asteriskSx = { color: "#DC2626", ml: 0.25 };
const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "90px",
    backgroundColor: "#F3F4F6",
    fontFamily: fonts.sans,
    fontSize: "14px",
    "& fieldset": { border: "none" },
    "&.Mui-focused fieldset": { borderColor: "#BC2876", borderWidth: "1px" },
  },
};
const sectionWrapperSx = {
  pb: 3,
  mb: 3,
  borderBottom: "1px solid #EAECF0",
  "&:last-of-type": { borderBottom: "none", marginBottom: 0 },
};

/**
 * Organization Profile – Personal Information (Figma 863-152139).
 * Contact Person: uses formData/handleInputChange/handleSubmit (current integration).
 * Business Entity & Submitted Documents: integration-ready (props for future API).
 */
const OrgPersonalInfoForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  isButtonLoading2,
  userData,
  // Integration-ready: Business Entity (separate API later)
  businessEntity: controlledBusiness,
  onBusinessEntityChange,
  // Integration-ready: Submitted Documents (separate API later)
  submittedDocuments = [],
  onViewDocument,
  onDownloadDocument,
  onOpenLink,
}) => {
  const [mobileCountryCode, setMobileCountryCode] = useState("+91");
  const [mobileNumber, setMobileNumber] = useState("");

  const [businessEntity, setBusinessEntity] = useState({
    corporateName: "",
    registeredAddress: "",
    companyRegistrationNo: "",
    telephoneNo: "",
    website: "",
  });

  const [viewDocUrl, setViewDocUrl] = useState(null);
  const [viewDocTitle, setViewDocTitle] = useState("");

  useEffect(() => {
    if (formData.mobile) {
      const parts = formData.mobile.split(" ");
      if (parts.length >= 2) {
        setMobileCountryCode(parts[0]);
        setMobileNumber(parts.slice(1).join(" "));
      } else if (parts.length === 1 && parts[0]) {
        setMobileNumber(parts[0]);
      }
    }
  }, [formData.mobile]);

  useEffect(() => {
    if (controlledBusiness) {
      setBusinessEntity(controlledBusiness);
    }
  }, [controlledBusiness]);

  const handleMobileCodeChange = (e) => {
    const v = e.target.value;
    setMobileCountryCode(v);
    handleInputChange({
      target: { name: "mobile", value: `${v} ${mobileNumber}`.trim() },
    });
  };
  const handleMobileNumberChange = (e) => {
    const v = e.target.value;
    setMobileNumber(v);
    handleInputChange({
      target: { name: "mobile", value: `${mobileCountryCode} ${v}`.trim() },
    });
  };

  const handleBusinessChange = (field, value) => {
    const next = { ...businessEntity, [field]: value };
    setBusinessEntity(next);
    onBusinessEntityChange?.(next);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
    // When Business/Documents API exists, call onBusinessEntityChange / document actions here if needed
  };

  const documents = submittedDocuments;

  return (
    <form onSubmit={handleFormSubmit}>
      {/* Contact Person Information */}
      <Box sx={sectionWrapperSx}>
        <Typography sx={sectionTitleSx}>Contact Person Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography component="label" sx={labelSx} htmlFor="org-first-name">
              First Name{" "}
              <Typography component="span" sx={asteriskSx}>
                *
              </Typography>
            </Typography>
            <TextField
              id="org-first-name"
              fullWidth
              variant="outlined"
              name="firstName"
              value={formData.firstName ?? ""}
              onChange={handleInputChange}
              sx={inputSx}
              inputProps={{ "aria-label": "First Name" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="label" sx={labelSx} htmlFor="org-last-name">
              Last Name{" "}
              <Typography component="span" sx={asteriskSx}>
                *
              </Typography>
            </Typography>
            <TextField
              id="org-last-name"
              fullWidth
              variant="outlined"
              name="lastName"
              value={formData.lastName ?? ""}
              onChange={handleInputChange}
              sx={inputSx}
              inputProps={{ "aria-label": "Last Name" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="label" sx={labelSx} htmlFor="org-email">
              Email
            </Typography>
            <TextField
              id="org-email"
              fullWidth
              variant="outlined"
              name="email"
              value={formData.email ?? ""}
              onChange={handleInputChange}
              disabled
              helperText="Email cannot be changed"
              sx={inputSx}
              inputProps={{ "aria-label": "Email" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="label" sx={labelSx} htmlFor="org-mobile">
              Mobile No{" "}
              <Typography component="span" sx={asteriskSx}>
                *
              </Typography>
            </Typography>
            <TextField
              id="org-mobile"
              fullWidth
              variant="outlined"
              value={mobileNumber}
              onChange={handleMobileNumberChange}
              sx={inputSx}
              inputProps={{ "aria-label": "Mobile No" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    disablePointerEvents={false}
                    sx={{ mr: 0 }}
                  >
                    <Select
                      value={mobileCountryCode}
                      onChange={handleMobileCodeChange}
                      variant="standard"
                      disableUnderline
                      renderValue={(value) => value}
                      sx={{
                        fontFamily: fonts.sans,
                        fontSize: "14px",
                        color: "#374151",
                        "& .MuiSelect-select": { py: 0.75, pr: 3 },
                        "& .MuiSvgIcon-root": {
                          fontSize: 20,
                          color: "#6B7280",
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 320,
                            marginTop: "12px",
                            marginLeft: "150px",
                          },
                        },
                      }}
                    >
                      {countryList.map((c) => (
                        <MenuItem
                          key={c.code}
                          value={c.dial_code}
                          sx={{ fontSize: "14px", fontWeight: 400 }}
                        >
                          {c.dial_code} {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Business Entity Information – integration ready */}
      <Box sx={sectionWrapperSx}>
        <Typography sx={sectionTitleSx}>Business Entity Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              component="label"
              sx={labelSx}
              htmlFor="org-corporate-name"
            >
              Corporate Name{" "}
              <Typography component="span" sx={asteriskSx}>
                *
              </Typography>
            </Typography>
            <TextField
              id="org-corporate-name"
              fullWidth
              variant="outlined"
              value={businessEntity.corporateName}
              onChange={(e) =>
                handleBusinessChange("corporateName", e.target.value)
              }
              sx={inputSx}
              inputProps={{ "aria-label": "Corporate Name" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              component="label"
              sx={labelSx}
              htmlFor="org-registered-address"
            >
              Registered Address
            </Typography>
            <TextField
              id="org-registered-address"
              fullWidth
              variant="outlined"
              value={businessEntity.registeredAddress}
              onChange={(e) =>
                handleBusinessChange("registeredAddress", e.target.value)
              }
              sx={inputSx}
              inputProps={{ "aria-label": "Registered Address" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              component="label"
              sx={labelSx}
              htmlFor="org-company-reg-no"
            >
              Company Registration No{" "}
              <Typography component="span" sx={asteriskSx}>
                *
              </Typography>
            </Typography>
            <TextField
              id="org-company-reg-no"
              fullWidth
              variant="outlined"
              value={businessEntity.companyRegistrationNo}
              onChange={(e) =>
                handleBusinessChange("companyRegistrationNo", e.target.value)
              }
              sx={inputSx}
              inputProps={{ "aria-label": "Company Registration No" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="label" sx={labelSx} htmlFor="org-telephone">
              Telephone No{" "}
              <Typography component="span" sx={asteriskSx}>
                *
              </Typography>
            </Typography>
            <TextField
              id="org-telephone"
              fullWidth
              variant="outlined"
              value={businessEntity.telephoneNo}
              onChange={(e) =>
                handleBusinessChange("telephoneNo", e.target.value)
              }
              sx={inputSx}
              inputProps={{ "aria-label": "Telephone No" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography component="label" sx={labelSx} htmlFor="org-website">
              Website
            </Typography>
            <TextField
              id="org-website"
              fullWidth
              variant="outlined"
              value={businessEntity.website}
              onChange={(e) => handleBusinessChange("website", e.target.value)}
              sx={inputSx}
              inputProps={{ "aria-label": "Website" }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Submitted Documents – from org profile API */}
      <Box sx={sectionWrapperSx}>
        <Typography sx={sectionTitleSx}>Submitted Documents</Typography>
        <Box>
          {documents.length === 0 ? (
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: "14px",
                color: "#6B7280",
                fontStyle: "italic",
                py: 2,
              }}
            >
              No documents submitted
            </Typography>
          ) : (
          documents.map((doc) => (
            <Box
              key={doc.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                py: 1.5,
                borderBottom: "1px solid #EAECF0",
                "&:last-of-type": { borderBottom: "none" },
              }}
            >
              <Box sx={{ color: "#9CA3AF", flexShrink: 0 }}>
                {doc.type === "link" ? (
                  <LinkIcon sx={{ fontSize: 28 }} />
                ) : (
                  <DescriptionOutlinedIcon sx={{ fontSize: 28 }} />
                )}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#374151",
                  }}
                >
                  {doc.title}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "12px",
                    color: "#6B7280",
                  }}
                >
                  {doc.subtitle}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexShrink: 0,
                }}
              >
                {doc.type === "file" && (
                  <>
                    <Typography
                      component="button"
                      type="button"
                      onClick={() => {
                        const url = doc.viewUrl || doc.downloadUrl;
                        if (url) {
                          setViewDocUrl(url);
                          setViewDocTitle(doc.title || "Document");
                        } else if (onViewDocument) onViewDocument(doc);
                      }}
                      sx={{
                        fontFamily: fonts.sans,
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#720361",
                        cursor: "pointer",
                        border: "none",
                        background: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <VisibilityOutlinedIcon sx={{ fontSize: 18 }} /> View
                    </Typography>
                    <Typography
                      component="button"
                      type="button"
                      onClick={() => {
                        if (onDownloadDocument) onDownloadDocument(doc);
                        else if (doc.downloadUrl) window.open(doc.downloadUrl, "_blank", "noopener,noreferrer");
                      }}
                      sx={{
                        fontFamily: fonts.sans,
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#720361",
                        cursor: "pointer",
                        border: "none",
                        background: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <DownloadOutlinedIcon sx={{ fontSize: 18 }} /> Download
                    </Typography>
                  </>
                )}
                {doc.type === "link" && (
                  <Typography
                    component="button"
                    type="button"
                    onClick={() => {
                      if (onOpenLink) onOpenLink(doc);
                      else if (doc.linkUrl) window.open(doc.linkUrl, "_blank", "noopener,noreferrer");
                    }}
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#720361",
                      cursor: "pointer",
                      border: "none",
                      background: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <OpenInNewOutlinedIcon sx={{ fontSize: 18 }} /> Open Link
                  </Typography>
                )}
              </Box>
            </Box>
          ))
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", pt: 2, pb: 2 }}>
        <Button
          type="submit"
          disabled={isButtonLoading2}
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: "16px",
            textTransform: "none",
            borderRadius: "8px",
            background:
              "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
            color: "#fff",
            px: 4,
            py: 1.5,
            boxShadow: "none",
            "&:hover": {
              background:
                "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
              opacity: 0.92,
              boxShadow: "none",
            },
          }}
        >
          {isButtonLoading2 ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            "Save Details"
          )}
        </Button>
      </Box>

      {/* Document view popup */}
      <Dialog
        open={Boolean(viewDocUrl)}
        onClose={() => setViewDocUrl(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            overflow: "hidden",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: "18px",
            color: "#374151",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #EAECF0",
            py: 1.5,
          }}
        >
          {viewDocTitle}
          <IconButton
            aria-label="Close"
            onClick={() => setViewDocUrl(null)}
            sx={{ color: "#6B7280" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
            backgroundColor: "#f9fafb",
          }}
        >
          {viewDocUrl && (
            <>
              {/\.(jpe?g|png|gif|webp|bmp|svg)(\?|$)/i.test(viewDocUrl) ? (
                <Box
                  component="img"
                  src={viewDocUrl}
                  alt={viewDocTitle}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "75vh",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Box
                  component="iframe"
                  src={viewDocUrl}
                  title={viewDocTitle}
                  sx={{
                    width: "100%",
                    minHeight: "75vh",
                    border: "none",
                  }}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default OrgPersonalInfoForm;
