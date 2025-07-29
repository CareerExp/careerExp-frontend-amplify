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

const Certifications = ({
  formData,
  handleInputChange,
  handleAddCertification,
  handleRemoveCertification,
}) => {
  return (
    <Grid container spacing={2}>
      {formData.certifications.map((cert, index) => (
        <React.Fragment key={index}>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="filled"
              label="Certification Name"
              fullWidth
              value={cert.name}
              onChange={(e) => handleInputChange("certifications", "name", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="filled"
              label="Institution"
              fullWidth
              value={cert.institution}
              onChange={(e) => handleInputChange("certifications", "institution", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="filled"
              label="Link"
              fullWidth
              value={cert.link}
              onChange={(e) => handleInputChange("certifications", "link", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="filled"
              label="Issue Date"
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              value={cert.issueDate}
              onChange={(e) => handleInputChange("certifications", "issueDate", e, index)}
              sx={inputBoxStyle}
            />
          </Grid>
          <Grid item xs={12}>
            <IconButton
              color="secondary"
              onClick={() => handleRemoveCertification(index)}
              disabled={formData.certifications.length === 1}
            >
              <Remove />
            </IconButton>
          </Grid>
        </React.Fragment>
      ))}
      <Grid item xs={12}>
        <button className={commonStyle.navButton} onClick={handleAddCertification}>
          + Add Certification
        </button>
      </Grid>
    </Grid>
  );
};

export default Certifications;
