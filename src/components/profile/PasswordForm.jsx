import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { fonts } from "../../utility/fonts.js"; // Assuming you have a fonts utility

const PasswordForm = ({ formData, handleInputChange, handleSubmit, isButtonLoading }) => {
  const [showPasswords, setShowPasswords] = useState({
    prevPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleTogglePassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

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
    "& .MuiInputLabel-root": {
      fontSize: "inherit",
      "&.Mui-focused": {
        color: "#999999",
      },
    },
  };
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3} sx={{ width: { xs: "100%", sm: "100%", md: "60%" }, margin: "auto" }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            // label="Current Password"
            variant="outlined"
            name="prevPassword"
            placeholder="Enter your current password"
            type={showPasswords.prevPassword ? "text" : "password"}
            value={formData.prevPassword}
            onChange={handleInputChange}
            sx={textFieldStyle}
            InputLabelProps={{
              shrink: true,
              style: { marginTop: "-8px" },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle previous password visibility"
                    onClick={() => handleTogglePassword("prevPassword")}
                    edge="end"
                  >
                    {showPasswords.prevPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            // label="New Password"
            variant="outlined"
            name="newPassword"
            placeholder="Enter your new password"
            type={showPasswords.newPassword ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleInputChange}
            sx={textFieldStyle}
            InputLabelProps={{
              shrink: true,
              style: { marginTop: "-8px" },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle new password visibility"
                    onClick={() => handleTogglePassword("newPassword")}
                    edge="end"
                  >
                    {showPasswords.newPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            // label="Confirm New Password"
            variant="outlined"
            name="confirmPassword"
            placeholder="Re-enter your new password"
            type={showPasswords.confirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            sx={textFieldStyle}
            InputLabelProps={{
              shrink: true,
              style: { marginTop: "-8px" },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => handleTogglePassword("confirmPassword")}
                    edge="end"
                  >
                    {showPasswords.confirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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

export default PasswordForm;
