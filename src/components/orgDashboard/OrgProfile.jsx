import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Box } from "@mui/material";
import { notify } from "../../redux/slices/alertSlice";
import {
  selectAuthenticated,
  selectToken,
  selectUserId,
} from "../../redux/slices/authSlice";
import {
  getUserProfile,
  selectUserProfile,
  updatePassword,
  updateUserProfile,
  uploadProfilePicture,
} from "../../redux/slices/profileSlice";
import {
  getMyOrganizationProfile,
  updateMyOrganizationProfile,
  selectOrganizationProfile,
} from "../../redux/slices/organizationSlice";
import { convertUTCDateToLocalDate } from "../../utility/convertTimeToUTC";
import { checkPassStrength } from "../../utility/validate";
import ProfileAvatar from "../profile/ProfileAvatar";
import OrgPersonalInfoForm from "./OrgPersonalInfoForm";
import PasswordForm from "../profile/PasswordForm";
import SubscriptionTab from "../profile/SubscriptionTab";
import SharedContentVisibilityTab from "../profile/SharedContentVisibilityTab";
import OrgProfileTabs from "./OrgProfileTabs";

// Map organization profile API ↔ Business Entity form fields
const orgProfileToBusinessEntity = (profile) => {
  if (!profile) return { corporateName: "", registeredAddress: "", companyRegistrationNo: "", telephoneNo: "", website: "" };
  return {
    corporateName: profile.organizationName ?? "",
    registeredAddress: profile.address ?? "",
    companyRegistrationNo: profile.registrationNo ?? "",
    telephoneNo: profile.telephone ?? "",
    website: profile.website ?? "",
  };
};

const businessEntityToOrgPayload = (businessEntity, existingProfile) => {
  const base = existingProfile ? { ...existingProfile } : {};
  return {
    ...base,
    organizationName: businessEntity.corporateName || base.organizationName,
    address: businessEntity.registeredAddress || base.address,
    telephone: businessEntity.telephoneNo || base.telephone,
    website: businessEntity.website || base.website,
    ...(businessEntity.companyRegistrationNo != null && businessEntity.companyRegistrationNo !== "" && { registrationNo: businessEntity.companyRegistrationNo }),
  };
};

const OrgProfile = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const userData = useSelector(selectUserProfile);
  const orgProfile = useSelector(selectOrganizationProfile);
  const authenticated = useSelector(selectAuthenticated);
  const token = useSelector(selectToken);

  const [tabValue, setTabValue] = useState(0);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isButtonLoading2, setIsButtonLoading2] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const [businessEntity, setBusinessEntity] = useState({
    corporateName: "",
    registeredAddress: "",
    companyRegistrationNo: "",
    telephoneNo: "",
    website: "",
  });

  useEffect(() => {
    if (authenticated && !userData) {
      dispatch(getUserProfile({ userId, token }));
    }
  }, [authenticated, userData, userId, token, dispatch]);

  useEffect(() => {
    if (authenticated && token) {
      dispatch(getMyOrganizationProfile({ token }));
    }
  }, [authenticated, token, dispatch]);

  useEffect(() => {
    if (orgProfile) {
      setBusinessEntity(orgProfileToBusinessEntity(orgProfile));
    }
  }, [orgProfile]);

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        firstName: userData.firstName ?? "",
        middleName: userData.middleName ?? "",
        lastName: userData.lastName ?? "",
        username: userData.username ?? "",
        mobile: userData.mobile ?? "",
        phoneExtension: userData.phoneExtension ?? "",
        phoneNumber: userData.phoneNumber ?? "",
        telephone: userData.telephone ?? "",
        email: userData.email ?? "",
        gender: userData.gender ?? "",
        nationality: userData.nationality ?? "",
        country: userData.country ?? "",
        introBio: userData.introBio ?? "",
        personalWebsite: userData.personalWebsite ?? "",
        experience: userData.experience ?? "",
        specialization: userData.specialization ?? "",
        dateOfBirth: convertUTCDateToLocalDate(userData.dateOfBirth) ?? "",
        linkedIn: userData.linkedIn ?? "",
        facebook: userData.facebook ?? "",
        instagram: userData.instagram ?? "",
        telegram: userData.telegram ?? "",
        otherUrl: userData.otherUrl ?? "",
        school: userData.school ?? "",
        schoolWebsite: userData.schoolWebsite ?? "",
      }));
    }
  }, [userData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tabValue === 2) {
      const {
        password,
        newPassword,
        prevPassword,
        confirmPassword,
        ...updatedData
      } = formData;
      setIsButtonLoading2(true);
      // 1. Contact person: existing user profile API (unchanged)
      dispatch(
        updateUserProfile({ updatedData, userId: userData?._id, token })
      )
        .then(() => {
          // 2. Organization profile: PUT /api/organization/profile/me (Business Entity fields)
          const orgPayload = businessEntityToOrgPayload(businessEntity, orgProfile);
          return dispatch(updateMyOrganizationProfile({ updateData: orgPayload, token }));
        })
        .then((result) => {
          if (updateMyOrganizationProfile.fulfilled.match(result)) {
            dispatch(notify({ type: "success", message: "Profile updated successfully" }));
          }
        })
        .catch(() => {
          dispatch(notify({ type: "error", message: "Something went wrong, please try again" }));
        })
        .finally(() => setIsButtonLoading2(false));
    } else if (tabValue === 3) {
      handlePasswordUpdate();
    }
  };

  const handlePasswordUpdate = async () => {
    if (
      !formData.prevPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      dispatch(notify({ type: "warning", message: "Please fill all the required fields" }));
      return;
    }
    if (!checkPassStrength(formData.newPassword)) {
      dispatch(
        notify({
          type: "warning",
          message:
            "Weak password. Use at least 6 characters, including a number, an uppercase letter, and a special character.",
        })
      );
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      dispatch(notify({ type: "error", message: "New Passwords and Confirm Password do not match" }));
      return;
    }
    try {
      setIsButtonLoading(true);
      const resultAction = await dispatch(
        updatePassword({ formData, userId, token })
      );
      if (updatePassword.fulfilled.match(resultAction)) {
        dispatch(notify({ type: "success", message: "Password updated successfully" }));
        setFormData((prev) => ({
          ...prev,
          prevPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else if (updatePassword.rejected.match(resultAction)) {
        const error = resultAction.payload || resultAction.error;
        dispatch(notify({ type: "error", message: error?.message || "Failed to update password" }));
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error?.message || "Something went wrong" }));
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setImageUploadingLoader(true);
    const data = new FormData();
    data.append("file", selectedFile);
    dispatch(
      uploadProfilePicture({ formData: data, userId: userData?._id, token })
    )
      .then(() => {
        dispatch(notify({ type: "success", message: "Profile picture uploaded successfully" }));
      })
      .catch(() => {
        dispatch(notify({ type: "error", message: "Failed to upload profile picture" }));
      })
      .finally(() => setImageUploadingLoader(false));
  };

  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return <SubscriptionTab />;
      case 1:
        return <SharedContentVisibilityTab />;
      case 2:
        return (
          <OrgPersonalInfoForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isButtonLoading2={isButtonLoading2}
            userData={userData}
            businessEntity={businessEntity}
            onBusinessEntityChange={setBusinessEntity}
          />
        );
      case 3:
        return (
          <PasswordForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isButtonLoading={isButtonLoading}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />
        );
      default:
        return null;
    }
  };

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

      <OrgProfileTabs tabValue={tabValue} onChange={setTabValue} />

      <Box mt={4} flex={1}>
        {renderTabContent()}
      </Box>
    </Container>
  );
};

export default OrgProfile;
