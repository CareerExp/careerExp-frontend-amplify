import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  InputAdornment,
  Tooltip,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LinkIcon from "@mui/icons-material/Link";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { fonts } from "../../utility/fonts";
import { uploadDocument } from "../../assets/assest";
import {
  createService,
  updateService,
  selectServiceLoading,
} from "../../redux/slices/serviceSlice";
import { selectToken } from "../../redux/slices/authSlice";
import { notify } from "../../redux/slices/alertSlice";

const MAX_DESCRIPTION_CHARS = 3000;
const MAX_LIST_CHARS = 3000; // for What's included & What you will learn (total)

const AddService = ({ onBack, serviceToEdit }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const isLoading = useSelector(selectServiceLoading);

  const [formData, setFormData] = useState({
    title: serviceToEdit?.title || "",
    description: serviceToEdit?.description || "",
    category: serviceToEdit?.category || "Academic Programs",
    priceType: serviceToEdit?.priceType || "PAID",
    price: serviceToEdit?.price || "",
    currency: serviceToEdit?.currency || "INR",
    referenceNumber: serviceToEdit?.referenceNumber || "",
    durationValue: serviceToEdit?.duration?.value || "",
    durationUnit: serviceToEdit?.duration?.unit || "weeks",
    serviceMode: serviceToEdit?.serviceMode || "ONLINE",
    ctaType: serviceToEdit?.cta?.type || "LINK",
    ctaValue: serviceToEdit?.cta?.value || "",
    ctaLabel: serviceToEdit?.cta?.label || "Book Slot",
    coverImage: null,
  });

  const [whatsIncluded, setWhatsIncluded] = useState(
    serviceToEdit?.whatsIncluded || [],
  );
  const [newItemIncluded, setNewItemIncluded] = useState("");

  const [whatYouWillLearn, setWhatYouWillLearn] = useState(
    serviceToEdit?.whatYouWillLearn || [],
  );
  const [newItemLearn, setNewItemLearn] = useState("");

  const [imagePreview, setImagePreview] = useState(
    serviceToEdit?.coverImage || null,
  );
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      const num = Number(value);
      if (value !== "" && (Number.isNaN(num) || num < 0)) return; // disallow negative or invalid price
    }
    if (name === "durationValue" && value !== "") {
      const num = Number(value);
      if (Number.isNaN(num) || num < 1) return; // minimum 1
    }
    if (name === "description" && value.length > MAX_DESCRIPTION_CHARS) {
      setFormData((prev) => ({
        ...prev,
        [name]: value.slice(0, MAX_DESCRIPTION_CHARS),
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleCTATypeChange = (type) => {
    setFormData((prev) => ({ ...prev, ctaType: type }));
  };

  const addItem = (list, setList, item, setItem, maxTotalChars) => {
    const trimmed = item.trim();
    if (!trimmed) return;
    if (maxTotalChars != null) {
      const currentTotal = list.reduce((sum, x) => sum + x.length, 0);
      if (currentTotal + trimmed.length > maxTotalChars) {
        dispatch(
          notify({
            message: `Total characters cannot exceed ${maxTotalChars}. Current: ${currentTotal}, adding: ${trimmed.length}.`,
            type: "error",
          }),
        );
        return;
      }
    }
    setList([...list, trimmed]);
    setItem("");
  };

  const removeItem = (list, setList, index) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.ctaValue
    ) {
      dispatch(
        notify({ message: "Please fill all required fields", type: "error" }),
      );
      return;
    }

    if (formData.description.length > MAX_DESCRIPTION_CHARS) {
      dispatch(
        notify({
          message: `Description cannot exceed ${MAX_DESCRIPTION_CHARS} characters`,
          type: "error",
        }),
      );
      return;
    }

    const whatsIncludedTotal = whatsIncluded.reduce((s, x) => s + x.length, 0);
    if (whatsIncludedTotal > MAX_LIST_CHARS) {
      dispatch(
        notify({
          message: `What's included cannot exceed ${MAX_LIST_CHARS} characters in total`,
          type: "error",
        }),
      );
      return;
    }

    const whatYouWillLearnTotal = whatYouWillLearn.reduce(
      (s, x) => s + x.length,
      0,
    );
    if (whatYouWillLearnTotal > MAX_LIST_CHARS) {
      dispatch(
        notify({
          message: `What you will learn cannot exceed ${MAX_LIST_CHARS} characters in total`,
          type: "error",
        }),
      );
      return;
    }

    if (!formData.priceType) {
      dispatch(
        notify({ message: "Please select Price Type", type: "error" }),
      );
      return;
    }

    const durationNum = Number(formData.durationValue);
    if (
      formData.durationValue === "" ||
      formData.durationValue == null ||
      Number.isNaN(durationNum) ||
      durationNum < 1
    ) {
      dispatch(
        notify({
          message: "Duration is required and must be at least 1",
          type: "error",
        }),
      );
      return;
    }

    if (!formData.durationUnit) {
      dispatch(
        notify({ message: "Please select Duration Unit", type: "error" }),
      );
      return;
    }

    if (!formData.serviceMode) {
      dispatch(
        notify({ message: "Please select Service Mode", type: "error" }),
      );
      return;
    }

    if (formData.priceType === "PAID" && !formData.price) {
      dispatch(
        notify({
          message: "Please enter the price for paid service",
          type: "error",
        }),
      );
      return;
    }
    if (formData.priceType === "PAID" && Number(formData.price) < 0) {
      dispatch(notify({ message: "Price cannot be negative", type: "error" }));
      return;
    }

    if (!token) {
      dispatch(
        notify({
          message: "You must be logged in to create services",
          type: "error",
        }),
      );
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("priceType", formData.priceType);
      if (formData.priceType === "PAID") {
        data.append("price", formData.price);
        data.append("currency", formData.currency);
      }
      data.append("referenceNumber", formData.referenceNumber || "");

      data.append(
        "duration",
        JSON.stringify({
          value: formData.durationValue,
          unit: formData.durationUnit,
        }),
      );

      data.append("serviceMode", formData.serviceMode);
      data.append("whatsIncluded", JSON.stringify(whatsIncluded));
      data.append("whatYouWillLearn", JSON.stringify(whatYouWillLearn));
      data.append("status", "PUBLISHED");

      data.append(
        "cta",
        JSON.stringify({
          type: formData.ctaType,
          value: formData.ctaValue,
          label: formData.ctaLabel || "Book Slot",
        }),
      );

      if (formData.coverImage) {
        data.append("file", formData.coverImage);
      }

      if (serviceToEdit) {
        const updateAction = await dispatch(
          updateService({ id: serviceToEdit._id, formData: data, token }),
        );
        if (updateService.fulfilled.match(updateAction)) {
          dispatch(
            notify({
              message: "Service updated successfully!",
              type: "success",
            }),
          );
          onBack();
        } else {
          dispatch(
            notify({
              message:
                updateAction.payload?.error || "Failed to update service",
              type: "error",
            }),
          );
        }
      } else {
        const createAction = await dispatch(
          createService({ formData: data, token }),
        );
        if (createService.fulfilled.match(createAction)) {
          dispatch(
            notify({
              message: "Service created successfully!",
              type: "success",
            }),
          );
          onBack();
        } else {
          dispatch(
            notify({
              message:
                createAction.payload?.error || "Failed to create service",
              type: "error",
            }),
          );
        }
      }
    } catch (error) {
      console.error("Service creation error:", error);
      dispatch(
        notify({ message: "An unexpected error occurred", type: "error" }),
      );
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: "100%" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <IconButton onClick={onBack} sx={{ p: 0 }}>
          <Box
            sx={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              border: "1px solid #EAECF0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
            }}
          >
            <ArrowBackIcon sx={{ color: "#000" }} />
          </Box>
        </IconButton>
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: "26px",
            color: "#000",
          }}
        >
          {serviceToEdit ? "Edit Service" : "Add Service"}
        </Typography>
      </Box>

      {/* Form Container */}
      <Box sx={{ maxWidth: "881px", mx: "auto", mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3.5}>
            {/* Image Upload Section */}
            <Grid item xs={12}>
              <Box
                onClick={handleUploadClick}
                sx={{
                  height: "194px",
                  borderRadius: "12px",
                  border: "1px dashed #BC2876",
                  backgroundColor: "#f2f2f2",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {imagePreview ? (
                  <Box
                    component="img"
                    src={imagePreview}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <>
                    <Box
                      component="img"
                      src={uploadDocument}
                      sx={{ width: "140px", height: "140px", mb: -2 }}
                    />
                    <Typography
                      sx={{
                        fontFamily: fonts.sans,
                        fontSize: "14px",
                        color: "rgba(0,0,0,0.5)",
                      }}
                    >
                      Upload Service Picture
                    </Typography>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  accept="image/*"
                />
              </Box>
            </Grid>

            {/* Title */}
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#545454",
                  mb: 1,
                }}
              >
                Service title <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>
              </Typography>
              <TextField
                fullWidth
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter Service title"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "90px",
                    backgroundColor: "#f2f2f2",
                    height: "54px",
                    "& fieldset": { border: "none" },
                    px: 2,
                  },
                  "& .MuiInputBase-input": {
                    fontFamily: fonts.sans,
                    fontSize: "16px",
                    color: "#000",
                    "&::placeholder": { color: "rgba(0,0,0,0.5)", opacity: 1 },
                  },
                }}
              />
            </Grid>

            {/* Category & Reference Number */}
            <Grid item xs={12} sm={6}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#545454",
                  mb: 1,
                }}
              >
                Category <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  MenuProps={{
                    PaperProps: {
                      sx: { maxHeight: 400 },
                    },
                  }}
                  sx={{
                    borderRadius: "90px",
                    backgroundColor: "#f2f2f2",
                    height: "54px",
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    fontFamily: fonts.sans,
                    fontSize: "16px",
                    color: "#000",
                    px: 1,
                  }}
                >
                  <MenuItem value="Academic Programs">
                    Academic Programs
                  </MenuItem>
                  <MenuItem value="Career Counselling & Guidance">
                    Career Counselling & Guidance
                  </MenuItem>
                  <MenuItem value="Mentoring & Coaching">
                    Mentoring & Coaching
                  </MenuItem>
                  <MenuItem value="Admissions Support">
                    Admissions Support
                  </MenuItem>
                  <MenuItem value="Test Preparation">Test Preparation</MenuItem>
                  <MenuItem value="Study Abroad Support">
                    Study Abroad Support
                  </MenuItem>
                  <MenuItem value="Scholarship & Financial Aid Guidance">
                    Scholarship & Financial Aid Guidance
                  </MenuItem>
                  <MenuItem value="Skill Development & Training">
                    Skill Development & Training
                  </MenuItem>
                  <MenuItem value="Professional Certification Programs">
                    Professional Certification Programs
                  </MenuItem>
                  <MenuItem value="Language Training">
                    Language Training
                  </MenuItem>
                  <MenuItem value="Internship & Placement Support">
                    Internship & Placement Support
                  </MenuItem>
                  <MenuItem value="Research & Innovation Opportunities">
                    Research & Innovation Opportunities
                  </MenuItem>
                  <MenuItem value="Industry Training & Corporate Programs">
                    Industry Training & Corporate Programs
                  </MenuItem>
                  <MenuItem value="Workshops, Seminars & Events">
                    Workshops, Seminars & Events
                  </MenuItem>
                  <MenuItem value="Student Support Services">
                    Student Support Services
                  </MenuItem>
                  <MenuItem value="Networking & Community Programs">
                    Networking & Community Programs
                  </MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#545454",
                  mb: 1,
                }}
              >
                Reference Number (Optional)
              </Typography>
              <TextField
                fullWidth
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleChange}
                placeholder="Ref no"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "90px",
                    backgroundColor: "#f2f2f2",
                    height: "54px",
                    "& fieldset": { border: "none" },
                    px: 2,
                  },
                  "& .MuiInputBase-input": {
                    fontFamily: fonts.sans,
                    fontSize: "16px",
                    color: "#000",
                    "&::placeholder": { color: "rgba(0,0,0,0.5)", opacity: 1 },
                  },
                }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#545454",
                  mb: 1,
                }}
              >
                Description <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Service Description"
                inputProps={{ maxLength: MAX_DESCRIPTION_CHARS }}
                helperText={`${(formData.description || "").length}/${MAX_DESCRIPTION_CHARS} characters`}
                FormHelperTextProps={{
                  sx: { fontFamily: fonts.sans },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "24px",
                    backgroundColor: "#f2f2f2",
                    "& fieldset": { border: "none" },
                    p: 2,
                  },
                  "& .MuiInputBase-input": {
                    fontFamily: fonts.sans,
                    fontSize: "16px",
                    color: "#000",
                    "&::placeholder": { color: "rgba(0,0,0,0.5)", opacity: 1 },
                  },
                }}
              />
            </Grid>

            {/* Price Type & Price */}
            <Grid item xs={12} sm={4}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#545454",
                  mb: 1,
                }}
              >
                Price Type <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="priceType"
                  value={formData.priceType}
                  onChange={handleChange}
                  sx={{
                    borderRadius: "90px",
                    backgroundColor: "#f2f2f2",
                    height: "54px",
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    fontFamily: fonts.sans,
                    fontSize: "16px",
                    color: "#000",
                    px: 1,
                  }}
                >
                  <MenuItem value="FREE">Free</MenuItem>
                  <MenuItem value="PAID">Paid</MenuItem>
                  <MenuItem value="CUSTOM">Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {formData.priceType === "PAID" && (
              <>
                <Grid item xs={12} sm={4}>
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#545454",
                      mb: 1,
                    }}
                  >
                    Price
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    inputProps={{ min: 0, step: "any" }}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "90px",
                        backgroundColor: "#f2f2f2",
                        height: "54px",
                        "& fieldset": { border: "none" },
                        px: 2,
                      },
                      "& .MuiInputBase-input": {
                        fontFamily: fonts.sans,
                        fontSize: "16px",
                        color: "#000",
                        "&::placeholder": {
                          color: "rgba(0,0,0,0.5)",
                          opacity: 1,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#545454",
                      mb: 1,
                    }}
                  >
                    Currency
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      sx={{
                        borderRadius: "90px",
                        backgroundColor: "#f2f2f2",
                        height: "54px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        fontFamily: fonts.sans,
                        fontSize: "16px",
                        color: "#000",
                        px: 1,
                      }}
                    >
                      <MenuItem value="INR">INR</MenuItem>
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="AED">AED</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            {/* Duration */}
            <Grid item xs={12} sm={4}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#545454",
                  mb: 1,
                }}
              >
                Duration Value <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>
              </Typography>
              <TextField
                fullWidth
                type="number"
                name="durationValue"
                value={formData.durationValue}
                onChange={handleChange}
                placeholder="Value"
                inputProps={{ min: 1 }}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "90px",
                    backgroundColor: "#f2f2f2",
                    height: "54px",
                    "& fieldset": { border: "none" },
                    px: 2,
                  },
                  "& .MuiInputBase-input": {
                    fontFamily: fonts.sans,
                    fontSize: "16px",
                    color: "#000",
                    "&::placeholder": { color: "rgba(0,0,0,0.5)", opacity: 1 },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#545454",
                  mb: 1,
                }}
              >
                Unit <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="durationUnit"
                  value={formData.durationUnit}
                  onChange={handleChange}
                  sx={{
                    borderRadius: "90px",
                    backgroundColor: "#f2f2f2",
                    height: "54px",
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    fontFamily: fonts.sans,
                    fontSize: "16px",
                    color: "#000",
                    px: 1,
                  }}
                >
                  <MenuItem value="minutes">Minutes</MenuItem>
                  <MenuItem value="hours">Hours</MenuItem>
                  <MenuItem value="days">Days</MenuItem>
                  <MenuItem value="weeks">Weeks</MenuItem>
                  <MenuItem value="months">Months</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#545454",
                  mb: 1,
                }}
              >
                Service Mode <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="serviceMode"
                  value={formData.serviceMode}
                  onChange={handleChange}
                  sx={{
                    borderRadius: "90px",
                    backgroundColor: "#f2f2f2",
                    height: "54px",
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    fontFamily: fonts.sans,
                    fontSize: "16px",
                    color: "#000",
                    px: 1,
                  }}
                >
                  <MenuItem value="ONLINE">Online</MenuItem>
                  <MenuItem value="OFFLINE">In-Person</MenuItem>
                  <MenuItem value="HYBRID">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* What's Included */}
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#545454",
                  mb: 1,
                }}
              >
                What's Included
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: fonts.sans,
                  color: "#545454",
                  display: "block",
                  mb: 0.5,
                }}
              >
                {whatsIncluded.reduce((s, x) => s + x.length, 0) +
                  newItemIncluded.length}
                /{MAX_LIST_CHARS} characters max
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
                <TextField
                  fullWidth
                  value={newItemIncluded}
                  onChange={(e) => {
                    const total = whatsIncluded.reduce(
                      (s, x) => s + x.length,
                      0,
                    );
                    const maxNew = MAX_LIST_CHARS - total;
                    setNewItemIncluded(e.target.value.slice(0, maxNew));
                  }}
                  placeholder="Add items included in this service"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "90px",
                      backgroundColor: "#f2f2f2",
                      height: "54px",
                      "& fieldset": { border: "none" },
                      px: 2,
                    },
                    "& .MuiInputBase-input": {
                      fontFamily: fonts.sans,
                      fontSize: "16px",
                    },
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addItem(
                        whatsIncluded,
                        setWhatsIncluded,
                        newItemIncluded,
                        setNewItemIncluded,
                        MAX_LIST_CHARS,
                      );
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() =>
                    addItem(
                      whatsIncluded,
                      setWhatsIncluded,
                      newItemIncluded,
                      setNewItemIncluded,
                      MAX_LIST_CHARS,
                    )
                  }
                  sx={{
                    borderRadius: "90px",
                    minWidth: "100px",
                    background:
                      "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
                  }}
                >
                  <AddIcon />
                </Button>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {whatsIncluded.map((item, index) => (
                  <Chip
                    key={index}
                    label={item}
                    onDelete={() =>
                      removeItem(whatsIncluded, setWhatsIncluded, index)
                    }
                    deleteIcon={
                      <DeleteOutlineIcon style={{ color: "#bc2876" }} />
                    }
                    sx={{
                      fontFamily: fonts.sans,
                      backgroundColor: "#f2f2f2",
                      color: "#545454",
                      fontWeight: 500,
                      borderRadius: "8px",
                      "& .MuiChip-deleteIcon": {
                        color: "#bc2876",
                        "&:hover": { color: "#720361" },
                      },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* What you will learn */}
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#545454",
                  mb: 1,
                }}
              >
                What you will learn
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: fonts.sans,
                  color: "#545454",
                  display: "block",
                  mb: 0.5,
                }}
              >
                {whatYouWillLearn.reduce((s, x) => s + x.length, 0) +
                  newItemLearn.length}
                /{MAX_LIST_CHARS} characters max
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
                <TextField
                  fullWidth
                  value={newItemLearn}
                  onChange={(e) => {
                    const total = whatYouWillLearn.reduce(
                      (s, x) => s + x.length,
                      0,
                    );
                    const maxNew = MAX_LIST_CHARS - total;
                    setNewItemLearn(e.target.value.slice(0, maxNew));
                  }}
                  placeholder="Add what the user will learn"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "90px",
                      backgroundColor: "#f2f2f2",
                      height: "54px",
                      "& fieldset": { border: "none" },
                      px: 2,
                    },
                    "& .MuiInputBase-input": {
                      fontFamily: fonts.sans,
                      fontSize: "16px",
                    },
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addItem(
                        whatYouWillLearn,
                        setWhatYouWillLearn,
                        newItemLearn,
                        setNewItemLearn,
                        MAX_LIST_CHARS,
                      );
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() =>
                    addItem(
                      whatYouWillLearn,
                      setWhatYouWillLearn,
                      newItemLearn,
                      setNewItemLearn,
                      MAX_LIST_CHARS,
                    )
                  }
                  sx={{
                    borderRadius: "90px",
                    minWidth: "100px",
                    background:
                      "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
                  }}
                >
                  <AddIcon />
                </Button>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {whatYouWillLearn.map((item, index) => (
                  <Chip
                    key={index}
                    label={item}
                    onDelete={() =>
                      removeItem(whatYouWillLearn, setWhatYouWillLearn, index)
                    }
                    deleteIcon={
                      <DeleteOutlineIcon style={{ color: "#bc2876" }} />
                    }
                    sx={{
                      fontFamily: fonts.sans,
                      backgroundColor: "#f2f2f2",
                      color: "#545454",
                      fontWeight: 500,
                      borderRadius: "8px",
                      "& .MuiChip-deleteIcon": {
                        color: "#bc2876",
                        "&:hover": { color: "#720361" },
                      },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* CTA Section */}
            <Grid item xs={12}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 500,
                    fontSize: "16px",
                    color: "#545454",
                  }}
                >
                  Add link or email
                </Typography>
                <Tooltip title="Enter the URL or email where users should be directed when they click the service CTA.">
                  <InfoOutlinedIcon
                    sx={{
                      fontSize: "20px",
                      color: "#545454",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </Box>

              <Box sx={{ display: "flex", gap: 1.5 }}>
                <TextField
                  fullWidth
                  name="ctaValue"
                  value={formData.ctaValue}
                  onChange={handleChange}
                  placeholder="Call to Action"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "90px",
                      backgroundColor: "#f2f2f2",
                      height: "54px",
                      "& fieldset": { border: "none" },
                      px: 2,
                    },
                    "& .MuiInputBase-input": {
                      fontFamily: fonts.sans,
                      fontSize: "16px",
                      color: "#000",
                      "&::placeholder": {
                        color: "rgba(0,0,0,0.5)",
                        opacity: 1,
                      },
                    },
                  }}
                />
                <Box
                  sx={{
                    backgroundColor: "#f2f2f2",
                    borderRadius: "90px",
                    display: "flex",
                    alignItems: "center",
                    px: "7px",
                    height: "54px",
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={() => handleCTATypeChange("LINK")}
                    sx={{
                      width: "44px",
                      height: "44px",
                      backgroundColor:
                        formData.ctaType === "LINK" ? "#bc2876" : "transparent",
                      "&:hover": {
                        backgroundColor:
                          formData.ctaType === "LINK"
                            ? "#bc2876"
                            : "rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <LinkIcon
                      sx={{
                        color:
                          formData.ctaType === "LINK"
                            ? "#fff"
                            : "rgba(0,0,0,0.3)",
                      }}
                    />
                  </IconButton>
                  <IconButton
                    onClick={() => handleCTATypeChange("EMAIL")}
                    sx={{
                      width: "44px",
                      height: "44px",
                      backgroundColor:
                        formData.ctaType === "EMAIL"
                          ? "#bc2876"
                          : "transparent",
                      "&:hover": {
                        backgroundColor:
                          formData.ctaType === "EMAIL"
                            ? "#bc2876"
                            : "rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <MailOutlineIcon
                      sx={{
                        color:
                          formData.ctaType === "EMAIL"
                            ? "#fff"
                            : "rgba(0,0,0,0.3)",
                      }}
                    />
                  </IconButton>
                </Box>
              </Box>
            </Grid>

            {/* Submit Button */}
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center", mt: 2 }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{
                  width: "243px",
                  height: "48px",
                  borderRadius: "90px",
                  background:
                    "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
                  fontFamily: fonts.sans,
                  fontWeight: 600,
                  fontSize: "16px",
                  textTransform: "none",
                  textWrap: "nowrap",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : serviceToEdit ? (
                  "Save Changes"
                ) : (
                  "Add New Service"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default AddService;
