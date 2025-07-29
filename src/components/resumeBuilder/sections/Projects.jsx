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

const Projects = ({ formData, handleInputChange, handleAddProject, handleRemoveProject }) => {
  return (
    <Grid container spacing={2}>
      {formData?.projects?.map((project, index) => (
        <React.Fragment key={index}>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="filled"
              label="Project Title"
              fullWidth
              value={project.title}
              onChange={(e) => handleInputChange("projects", "title", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="filled"
              label="Technologies"
              fullWidth
              value={project.technologies.join(", ")}
              onChange={(e) =>
                handleInputChange(
                  "projects",
                  "technologies",
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
              label="Description"
              fullWidth
              value={project.description}
              onChange={(e) => handleInputChange("projects", "description", e, index)}
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
              value={project.startDate}
              onChange={(e) => handleInputChange("projects", "startDate", e, index)}
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
              value={project.endDate}
              onChange={(e) => handleInputChange("projects", "endDate", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="filled"
              label="Project Link"
              fullWidth
              value={project.link}
              onChange={(e) => handleInputChange("projects", "link", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12}>
            <IconButton
              color="secondary"
              onClick={() => handleRemoveProject(index)}
              disabled={formData.projects.length === 1}
            >
              <Remove />
            </IconButton>
          </Grid>
        </React.Fragment>
      ))}
      <Grid item xs={12}>
        <button className={commonStyle.navButton} onClick={handleAddProject}>
          + Add Project
        </button>
      </Grid>
    </Grid>
  );
};

export default Projects;
