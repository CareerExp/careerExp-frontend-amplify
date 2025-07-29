import React from "react";
import { Grid, TextField, MenuItem, InputAdornment } from "@mui/material";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { countryList } from "../../../utility/countryList.js";

const inputBoxStyle = {
  "& .MuiFilledInput-root": {
    borderRadius: "25px",
  },
  "& .MuiFilledInput-underline:before": {
    borderBottom: "none",
  },
  "& .MuiFilledInput-underline:hover:not(.Mui-disabled):before": {
    borderBottom: "none",
  },
  "& .MuiFilledInput-underline:after": {
    borderBottom: "none",
  },
};

const PersonalInformation = ({ formData, handleInputChange }) => {
  return (
    <Grid container spacing={2}>
      {/* first name */}
      <Grid item xs={12} sm={6} lg={4}>
        <TextField
          variant="filled"
          label="First Name"
          fullWidth
          value={formData.personalInfo.firstName}
          onChange={(e) => handleInputChange("personalInfo", "firstName", e)}
          sx={inputBoxStyle}
        />
      </Grid>

      {/* middle name */}
      <Grid item xs={12} sm={6} lg={4}>
        <TextField
          variant="filled"
          label="Middle Name"
          fullWidth
          value={formData.personalInfo.middleName}
          onChange={(e) => handleInputChange("personalInfo", "middleName", e)}
          sx={inputBoxStyle}
        />
      </Grid>
      {/* last name */}
      <Grid item xs={12} sm={6} lg={4}>
        <TextField
          variant="filled"
          label="Last Name"
          fullWidth
          value={formData.personalInfo.lastName}
          onChange={(e) => handleInputChange("personalInfo", "lastName", e)}
          sx={inputBoxStyle}
        />
      </Grid>
      {/* user name */}
      <Grid item xs={12} sm={6} lg={4}>
        <TextField
          variant="filled"
          label="User Name"
          fullWidth
          value={formData.personalInfo.userName}
          onChange={(e) => handleInputChange("personalInfo", "userName", e)}
          sx={inputBoxStyle}
        />
      </Grid>
      {/* gender */}
      <Grid item xs={12} sm={6} lg={4}>
        <TextField
          variant="filled"
          label="Gender"
          select
          fullWidth
          value={formData.personalInfo.gender}
          onChange={(e) => handleInputChange("personalInfo", "gender", e)}
          sx={inputBoxStyle}
        >
          {/* Define the options */}
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>
      </Grid>
      {/* Birthdate */}
      <Grid item xs={12} sm={6} lg={4}>
        <TextField
          variant="filled"
          label="Birthdate"
          type="date"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={formData.personalInfo.birthdate}
          onChange={(e) => handleInputChange("personalInfo", "birthdate", e)}
          sx={inputBoxStyle}
        />
      </Grid>
      {/* Nationality*/}
      <Grid item xs={12} sm={6}>
        <TextField
          variant="filled"
          label="Nationality"
          select
          fullWidth
          value={formData.personalInfo.nationality}
          onChange={(e) => handleInputChange("personalInfo", "nationality", e)}
          sx={inputBoxStyle}
        >
          {countryList.map((country) => (
            <MenuItem key={country.name} value={country.name}>
              {country.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      {/* email */}
      <Grid item xs={12} sm={6}>
        <TextField
          variant="filled"
          label="Email"
          fullWidth
          value={formData.personalInfo.email}
          onChange={(e) => handleInputChange("personalInfo", "email", e)}
          sx={inputBoxStyle}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <MailOutlineOutlinedIcon sx={{ color: "black", fontSize: "20px" }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      {/* mobile */}
      <Grid item xs={12} sm={6}>
        <TextField
          variant="filled"
          label="Mobile"
          fullWidth
          value={formData.personalInfo.mobile}
          onChange={(e) => handleInputChange("personalInfo", "mobile", e)}
          sx={inputBoxStyle}
        />
      </Grid>
      {/* tele */}
      <Grid item xs={12} sm={6}>
        <TextField
          variant="filled"
          label="Telephone"
          fullWidth
          value={formData.personalInfo.telephone}
          onChange={(e) => handleInputChange("personalInfo", "telephone", e)}
          sx={inputBoxStyle}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="filled"
          label="Personal Website URL"
          fullWidth
          value={formData.personalInfo.website}
          onChange={(e) => handleInputChange("personalInfo", "website", e)}
          sx={inputBoxStyle}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <LanguageOutlinedIcon sx={{ color: "black", fontSize: "20px" }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="filled"
          label="Linkdin URL"
          fullWidth
          value={formData.personalInfo.linkedIn}
          onChange={(e) => handleInputChange("personalInfo", "linkedIn", e)}
          sx={inputBoxStyle}
        />
      </Grid>
    </Grid>
  );
};

export default PersonalInformation;
