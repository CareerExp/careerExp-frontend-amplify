import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material";
import { fonts } from "../../utility/fonts.js";

const EducationForm = ({ formData, handleInputChange, handleSubmit, isButtonLoading }) => {
  const textFieldStyle = {
    borderRadius: "90px",
    backgroundColor: "#f3f3f3",
    fontFamily: fonts.poppins,
    "& .MuiOutlinedInput-root": {
      borderRadius: "90px",
      "& fieldset": {
        border: "none",
      },
      fontSize: "inherit",
      "&.Mui-focused fieldset": {
        borderColor: "#999999",
        borderWidth: "2px",
      },
    },
    "& input": {
      "&::placeholder": {
        paddingLeft: "8px",
      },
    },

    "& .MuiInputLabel-root": {
      fontSize: "inherit",
      "&.Mui-focused": {
        color: "#999999",
      },
    },
  };
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} sx={{ width: "80%", margin: "auto" }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            // label="Current School / Educational Institution"
            placeholder="Your current school / educational institution"
            variant="outlined"
            name="school"
            value={formData.school}
            onChange={handleInputChange}
            sx={textFieldStyle}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            // label="Website URL of School / Educational Institution"
            placeholder="Website URL of school / educational institution"
            variant="outlined"
            name="schoolWebsite"
            value={formData.schoolWebsite}
            onChange={handleInputChange}
            sx={textFieldStyle}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          sx={{
            mt: 3,
            mb: 2,
            py: 1,
            fontWeight: "bold",
            textTransform: "none",
            backgroundImage: "linear-gradient(to top left, #720361, #BF2F75)",
            borderRadius: "2rem",
            color: "white",
            width: { xs: "53%", sm: "53%", md: "30%", lg: "15%" },
          }}
          type="submit"
          disabled={isButtonLoading}
        >
          {isButtonLoading ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </Box>
    </form>
  );
};

export default EducationForm;
