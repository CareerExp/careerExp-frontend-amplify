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

const Languages = ({ formData, handleInputChange, handleAddLanguage, handleRemoveLanguage }) => {
  return (
    <Grid container spacing={2}>
      {formData.languages.map((language, index) => (
        <React.Fragment key={index}>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="filled"
              label="Language"
              fullWidth
              value={language.name}
              onChange={(e) => handleInputChange("languages", "name", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="filled"
              label="Proficiency"
              fullWidth
              value={language.proficiency}
              onChange={(e) => handleInputChange("languages", "proficiency", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12}>
            <IconButton
              color="secondary"
              onClick={() => handleRemoveLanguage(index)}
              disabled={formData.languages.length === 1}
            >
              <Remove />
            </IconButton>
          </Grid>
        </React.Fragment>
      ))}
      <Grid item xs={12}>
        <button className={commonStyle.navButton} onClick={handleAddLanguage}>
          + Add Language
        </button>
      </Grid>
    </Grid>
  );
};

export default Languages;
