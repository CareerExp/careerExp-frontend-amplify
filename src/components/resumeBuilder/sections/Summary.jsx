import React from "react";
import { Grid } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Summary = ({ formData, handleInputChange }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ReactQuill
          style={{
            backgroundColor: "#F2F2F2",
            borderRadius: "4px",
            minHeight: "180px",
            height: "180px",
            marginBottom: "32px", // Add margin to prevent overlap
            overflow: "auto",
          }}
          theme="snow"
          value={formData.summary}
          onChange={(value) => handleInputChange("summary", null, { target: { value } })}
        />
      </Grid>
    </Grid>
  );
};

export default Summary;
