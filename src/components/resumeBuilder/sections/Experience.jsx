import React from "react";
import { Grid, TextField, IconButton } from "@mui/material";
import { Remove } from "@mui/icons-material";
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

const Experience = ({ formData, handleInputChange, handleAddExperience, handleRemoveExperience }) => {
  return (
    <Grid container spacing={2}>
      {formData.experience.map((exp, index) => (
        <React.Fragment key={index}>
          <Grid item xs={12}>
            <TextField
              variant="filled"
              label="Job Title"
              fullWidth
              value={exp.jobTitle}
              onChange={(e) => handleInputChange("experience", "jobTitle", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="filled"
              label="Company"
              fullWidth
              value={exp.company}
              onChange={(e) => handleInputChange("experience", "company", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="filled"
              label="Location"
              fullWidth
              value={exp.location}
              onChange={(e) => handleInputChange("experience", "location", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="filled"
              label="Start Date"
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              value={exp.startDate}
              onChange={(e) => handleInputChange("experience", "startDate", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="filled"
              label="End Date"
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              value={exp.endDate}
              onChange={(e) => handleInputChange("experience", "endDate", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="filled"
              label="Responsibilities"
              fullWidth
              multiline
              rows={4}
              value={exp.responsibilities.join(", ")}
              onChange={(e) =>
                handleInputChange(
                  "experience",
                  "responsibilities",
                  { target: { value: e.target.value.split(", ") } },
                  index,
                )
              }
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="filled"
              label="Achievements"
              fullWidth
              value={exp.achievements}
              onChange={(e) => handleInputChange("experience", "achievements", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12}>
            <IconButton
              color="secondary"
              onClick={() => handleRemoveExperience(index)}
              disabled={formData.experience.length === 1}
            >
              <Remove />
            </IconButton>
          </Grid>
        </React.Fragment>
      ))}
      <Grid item xs={12}>
        <button className={commonStyle["navButton"]} onClick={handleAddExperience}>
          + Add Experience
        </button>
      </Grid>
    </Grid>
  );
};

export default Experience;
