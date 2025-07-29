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

const Skills = ({ formData, handleInputChange, handleAddSkill, handleRemoveSkill }) => {
  return (
    <Grid container spacing={2}>
      {["technical", "soft"].map((type) => (
        <React.Fragment key={type}>
          {formData.skills[type].map((skill, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <TextField
                variant="filled"
                label={`${type.charAt(0).toUpperCase() + type.slice(1)} Skill`}
                fullWidth
                value={skill}
                onChange={(e) => handleInputChange("skills", type, e, index)}
                sx={inputBoxStyle}
              />
              <IconButton
                color="secondary"
                onClick={() => handleRemoveSkill(type, index)}
                disabled={formData.skills[type].length === 1}
              >
                <Remove />
              </IconButton>
            </Grid>
          ))}
          <Grid item xs={12}>
            <button className={commonStyle.navButton} onClick={() => handleAddSkill(type)}>
              + Add {type.charAt(0).toUpperCase() + type.slice(1)} Skill
            </button>
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
};

export default Skills;
