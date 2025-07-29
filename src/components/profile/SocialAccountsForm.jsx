import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material";
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Language as WebsiteIcon,
  LinkedIn as LinkedInIcon,
  Telegram as TelegramIcon,
} from "@mui/icons-material";
import { fonts } from "../../utility/fonts.js"; // Assuming you have a fonts utility

const SocialAccountsForm = ({ formData, handleInputChange, handleSubmit, isButtonLoading }) => {
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
      "& input": {
        "&::placeholder": {
          paddingLeft: "8px",
        },
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
      <Grid container spacing={2} sx={{ width: { xs: "100%", sm: "100%", md: "60%" }, margin: "auto" }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            // label="LinkedIn"
            placeholder="LinkedIn URL"
            variant="outlined"
            name="linkedIn"
            value={formData.linkedIn}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: <LinkedInIcon sx={{ marginRight: 1, color: "#0077B5" }} />, // LinkedIn blue
            }}
            sx={textFieldStyle}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            // label="Facebook"
            placeholder="Facebook URL"
            variant="outlined"
            name="facebook"
            value={formData.facebook}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: <FacebookIcon sx={{ marginRight: 1, color: "#1877F3" }} />, // Facebook blue
            }}
            sx={textFieldStyle}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            // label="Instagram"
            placeholder="Instagram URL"
            variant="outlined"
            name="instagram"
            value={formData.instagram}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: <InstagramIcon sx={{ marginRight: 1, color: "#E4405F" }} />, // Instagram pink
            }}
            sx={textFieldStyle}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            // label="Telegram"
            placeholder="Telegram URL"
            variant="outlined"
            name="telegram"
            value={formData.telegram}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: <TelegramIcon sx={{ marginRight: 1, color: "#229ED9" }} />, // Telegram blue
            }}
            sx={textFieldStyle}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            // label="Other URL"
            placeholder="Other URL"
            variant="outlined"
            name="otherUrl"
            value={formData.otherUrl}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: <WebsiteIcon sx={{ marginRight: 1, color: "#43A047" }} />, // Website green
            }}
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

export default SocialAccountsForm;
