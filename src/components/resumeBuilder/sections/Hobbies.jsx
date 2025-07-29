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

const Hobbies = ({ formData, handleInputChange, handleAddHobby, handleRemoveHobby }) => {
  return (
    <Grid container spacing={2}>
      {formData.hobbies.map((hobby, index) => (
        <React.Fragment key={index}>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="filled"
              label="Your Hobbies & Interests"
              fullWidth
              value={hobby}
              onChange={(e) => handleInputChange("hobbies", "hobby", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12}>
            <IconButton
              color="secondary"
              onClick={() => handleRemoveHobby(index)}
              disabled={formData.hobbies.length === 1}
            >
              <Remove />
            </IconButton>
          </Grid>
        </React.Fragment>
      ))}
      <Grid item xs={12}>
        <button className={commonStyle.navButton} onClick={handleAddHobby}>
          + Add Hobby
        </button>
      </Grid>
    </Grid>
  );
};

export default Hobbies;
