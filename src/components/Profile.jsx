import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../redux/slices/alertSlice.js";
import {
  selectAuthenticated,
  selectToken,
  selectUserId,
} from "../redux/slices/authSlice.js";
import {
  getUserProfile,
  selectUserProfile,
  updatePassword,
  updateUserProfile,
  uploadProfilePicture,
} from "../redux/slices/profileSlice.js";
import { convertUTCDateToLocalDate } from "../utility/convertTimeToUTC.js";
import ProfileAvatar from "./profile/ProfileAvatar.jsx";
import ProfileTabs from "./profile/ProfileTabs.jsx";
import { Container, Box } from "@mui/material";
import ProfileTabContent from "./profile/ProfileTabContent.jsx";
import { checkPassStrength } from "../utility/validate.js";

const Profile = () => {
  const dispatchToRedux = useDispatch();
  const userId = useSelector(selectUserId);
  const userData = useSelector(selectUserProfile);
  const authenticated = useSelector(selectAuthenticated);
  const token = useSelector(selectToken);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isButtonLoading2, setIsButtonLoading2] = useState(false);
  const [file, setFile] = useState(null);
  const [imageUploadingLoader, setImageUploadingLoader] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    country: "",
    phoneExtension: "",
    mobile: "",
    telephone: "",
    introBio: "",
    personalWebsite: "",
    prevPassword: "",
    newPassword: "",
    confirmPassword: "",
    linkedIn: "",
    facebook: "",
    instagram: "",
    telegram: "",
    otherUrl: "",
    school: "",
    schoolWebsite: "",
  });

  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (authenticated && !userData) {
      dispatchToRedux(getUserProfile({ userId, token }));
    }
  }, [authenticated, userData, userId, token, dispatchToRedux]);

  useEffect(() => {
    setFormData({
      ...formData,
      firstName: userData?.firstName,
      middleName: userData?.middleName,
      lastName: userData?.lastName,
      username: userData?.username,
      mobile: userData?.mobile,
      phoneExtension: userData?.phoneExtension,
      phoneNumber: userData?.phoneNumber,
      telephone: userData?.telephone,
      email: userData?.email,
      gender: userData?.gender,
      nationality: userData?.nationality,
      country: userData?.country,
      introBio: userData?.introBio,
      personalWebsite: userData?.personalWebsite,
      experience: userData?.experience,
      specialization: userData?.specialization,
      dateOfBirth: convertUTCDateToLocalDate(userData?.dateOfBirth),
      linkedIn: userData?.linkedIn || "",
      facebook: userData?.facebook || "",
      instagram: userData?.instagram || "",
      telegram: userData?.telegram || "",
      otherUrl: userData?.otherUrl || "",
      school: userData?.school || "",
      schoolWebsite: userData?.schoolWebsite || "",
    });
  }, [userData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tabValue === 0) {
      const {
        password,
        newPassword,
        prevPassword,
        confirmPassword,
        ...updatedData
      } = formData;
      try {
        setIsButtonLoading2(true);
        dispatchToRedux(
          updateUserProfile({ updatedData, userId: userData?._id, token })
        );
        dispatchToRedux(
          notify({
            type: "success",
            message: "Profile updated successfully",
          })
        );
        setIsButtonLoading2(false);
      } catch (error) {
        dispatchToRedux(
          notify({
            type: "error",
            message: "Something went wrong, please try again",
          })
        );
        setIsButtonLoading2(false);
      }
    } else if (tabValue === 1) {
      handlePasswordUpdate();
    } else if (tabValue === 2) {
      handlePasswordUpdate();
    } else if (tabValue === 3) {
      handleSocialAccountsUpdate();
    } else if (tabValue === 4) {
      handleEducationUpdate();
    }
  };

  const handlePasswordUpdate = async () => {
    if (
      !formData.prevPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      dispatchToRedux(
        notify({
          type: "warning",
          message: "Please fill all the required fields",
        })
      );
      return;
    }

    if (!checkPassStrength(formData.newPassword)) {
      dispatchToRedux(
        notify({
          type: "warning",
          message:
            "Weak password. Use at least 6 characters, including a number, an uppercase letter, and a special character.",
        })
      );
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      dispatchToRedux(
        notify({
          type: "error",
          message: "New Passwords and Confirm Password do not match",
        })
      );
      return;
    }

    // try {
    //   setIsButtonLoading(true);
    //   const response = dispatchToRedux(updatePassword({ formData, userId, token }));
    //   setIsButtonLoading(false);
    //   if (response) {
    //     dispatchToRedux(
    //       notify({
    //         type: "success",
    //         message: "Password Updated Successfully",
    //       }),
    //     );
    //   }
    // } catch (error) {
    //   setIsButtonLoading(false);
    //   dispatchToRedux(
    //     notify({
    //       type: "error",
    //       message: "Something went wrong, Please Try Again",
    //     }),
    //   );
    // }
    try {
      setIsButtonLoading(true);
      const resultAction = await dispatchToRedux(
        updatePassword({
          formData,
          userId,
          token,
        })
      );

      if (updatePassword.fulfilled.match(resultAction)) {
        dispatchToRedux(
          notify({
            type: "success",
            message: "Password updated successfully",
          })
        );
        // Clear form after success if needed
        setFormData((prev) => ({
          ...prev,
          prevPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else if (updatePassword.rejected.match(resultAction)) {
        const error = resultAction.payload || resultAction.error;
        dispatchToRedux(
          notify({
            type: "error",
            message: error.message || "Failed to update password",
            field: error.field, // Optional: highlight specific field
          })
        );
      }
    } catch (error) {
      dispatchToRedux(
        notify({
          type: "error",
          message: error.message || "Something went wrong",
        })
      );
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleSocialAccountsUpdate = () => {
    try {
      setIsButtonLoading(true);
      const {
        password,
        newPassword,
        prevPassword,
        confirmPassword,
        ...updatedData
      } = formData;
      dispatchToRedux(
        updateUserProfile({ updatedData, userId: userData?._id, token })
      );
      dispatchToRedux(
        notify({
          type: "success",
          message: "Social accounts updated successfully",
        })
      );
      setIsButtonLoading(false);
    } catch (error) {
      dispatchToRedux(
        notify({
          type: "error",
          message: "Something went wrong, please try again",
        })
      );
      setIsButtonLoading(false);
    }
  };

  const handleEducationUpdate = () => {
    try {
      setIsButtonLoading(true);
      const {
        password,
        newPassword,
        prevPassword,
        confirmPassword,
        ...updatedData
      } = formData;
      dispatchToRedux(
        updateUserProfile({ updatedData, userId: userData?._id, token })
      );
      dispatchToRedux(
        notify({
          type: "success",
          message: "Education information updated successfully",
        })
      );
      setIsButtonLoading(false);
    } catch (error) {
      dispatchToRedux(
        notify({
          type: "error",
          message: "Something went wrong, please try again",
        })
      );
      setIsButtonLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUploadingLoader(true);

      const formData = new FormData();
      formData.append("file", selectedFile);
      dispatchToRedux(
        uploadProfilePicture({
          formData,
          userId: userData?._id,
          token,
        })
      )
        .then(() => {
          dispatchToRedux(
            notify({
              type: "success",
              message: "Profile picture uploaded successfully",
            })
          );
          setImageUploadingLoader(false);
        })
        .catch(() => {
          dispatchToRedux(
            notify({
              type: "error",
              message: "Failed to upload profile picture",
            })
          );
          setImageUploadingLoader(false);
        });
    }
  };

  useEffect(() => {
    if (userData?.activeDashboard === "creator" && tabValue > 1) {
      setTabValue(0);
    }
  }, [userData?.activeDashboard, tabValue]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "1rem",
      }}
    >
      <ProfileAvatar
        userData={userData}
        imageUploadingLoader={imageUploadingLoader}
        handleFileChange={handleFileChange}
      />

      <ProfileTabs
        tabValue={tabValue}
        setTabValue={setTabValue}
        userData={userData}
      />

      <Box mt={4} flex={1}>
        <ProfileTabContent
          tabValue={tabValue}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isButtonLoading={isButtonLoading}
          isButtonLoading2={isButtonLoading2}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          userData={userData}
        />
      </Box>
    </Container>
  );
};

export default Profile;
