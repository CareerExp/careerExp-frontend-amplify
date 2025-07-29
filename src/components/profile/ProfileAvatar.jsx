import { Avatar, Box, IconButton, CircularProgress, Typography } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { fonts } from "../../utility/fonts";

const ProfileAvatar = ({ userData, imageUploadingLoader, handleFileChange }) => {
  return (
    <Box textAlign="center" mt={0} mb={2}>
      <label htmlFor="profile-image-upload">
        <input
          id="profile-image-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: { xs: 100, sm: 120, md: 160 },
            height: { xs: 100, sm: 120, md: 160 },
            borderRadius: "50%",
            backgroundColor: "#f3f3f3",
            position: "relative",
            cursor: "pointer",
            boxShadow: 1,
            mx: "auto",
          }}
        >
          {imageUploadingLoader ? (
            <CircularProgress color="inherit" />
          ) : userData?.profilePicture ? (
            <Avatar
              src={userData.profilePicture}
              sx={{
                width: "100%",
                height: "100%",
                fontSize: { xs: 36, sm: 48, md: 64 },
              }}
            />
          ) : (
            <AddPhotoAlternateOutlinedIcon sx={{ fontSize: { xs: 30, sm: 40, md: 50 }, color: "#c49ab6" }} />
          )}
        </Box>
      </label>
      <Typography
        sx={{ mt: 1, fontSize: { xs: 12, sm: 14, md: 16 }, fontFamily: fonts.poppins, fontWeight: "bold" }}
      >
        Change Photo
      </Typography>
    </Box>
  );
};

export default ProfileAvatar;
