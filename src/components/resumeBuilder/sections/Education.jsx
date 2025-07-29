import React from "react";
import { Grid, TextField, IconButton, InputAdornment } from "@mui/material";
import { Remove } from "@mui/icons-material";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import commonStyle from "../../../styles/Common.module.css";

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

const Education = ({ formData, handleInputChange, handleAddEducation, handleRemoveEducation }) => {
  return (
    <Grid container spacing={2}>
      {formData.education.map((edu, index) => (
        <React.Fragment key={index}>
          <Grid item xs={12}>
            <TextField
              variant="filled"
              label="Degree"
              fullWidth
              value={edu.degree}
              onChange={(e) => handleInputChange("education", "degree", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="filled"
              label="Your current school/educational institution"
              fullWidth
              value={edu.institution}
              onChange={(e) => handleInputChange("education", "institution", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="filled"
              label="Grade"
              fullWidth
              value={edu.grade}
              onChange={(e) => handleInputChange("education", "grade", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          {/* start year and end year */}
          <Grid container spacing={2} item xs={12}>
            <Grid item xs={6}>
              <TextField
                variant="filled"
                label="Start Date"
                type="date"
                fullWidth
                value={edu.startDate}
                onChange={(e) => handleInputChange("education", "startDate", e, index)}
                sx={inputBoxStyle}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="filled"
                label="End Date"
                fullWidth
                value={edu.endDate}
                onChange={(e) => handleInputChange("education", "endDate", e, index)}
                sx={inputBoxStyle}
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="filled"
              label="Website URL of school/education institution "
              fullWidth
              value={edu.website}
              onChange={(e) => handleInputChange("education", "website", e, index)}
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
            <IconButton
              color="secondary"
              onClick={() => handleRemoveEducation(index)}
              disabled={formData.education.length === 1} // Fixed typo here
            >
              <Remove />
            </IconButton>
          </Grid>
        </React.Fragment>
      ))}
      <Grid item xs={12}>
        <button className={commonStyle["navButton"]} onClick={handleAddEducation}>
          + Add Education
        </button>
      </Grid>
    </Grid>
  );
};

export default Education;
