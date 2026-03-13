import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
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
} from "../../redux/slices/profileSlice";
import {
  getMyOrganizationProfile,
  updateMyOrganizationProfile,
  selectOrganizationProfile,
} from "../../redux/slices/organizationSlice";
import { convertUTCDateToLocalDate } from "../../utility/convertTimeToUTC";
import { checkPassStrength } from "../../utility/validate";
import OrgPersonalInfoForm from "./OrgPersonalInfoForm";
import PasswordForm from "../profile/PasswordForm";
import SubscriptionTab from "../profile/SubscriptionTab";
import SharedContentVisibilityTab from "../profile/SharedContentVisibilityTab";
import OrgProfileTabs from "./OrgProfileTabs";
import { fonts } from "../../utility/fonts";

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

/** Map API documents (name, url, _id) to form shape and normalize URL for view/download */
const mapOrgDocuments = (documents) => {
  if (!Array.isArray(documents) || documents.length === 0) return [];
  const normalizeUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    return url.startsWith("http") ? url : `https://${url}`;
  };
  return documents.map((d, i) => {
    const url = normalizeUrl(d.url);
    const subtitle = url ? url.split("/").pop() : (d.name || "Document");
    return {
      id: d._id || d.id || String(i),
      type: d.type === "link" ? "link" : "file",
      title: d.name || "Document",
      subtitle: subtitle || "Document",
      viewUrl: url,
      downloadUrl: url,
      linkUrl: url,
    };
  });
};

const OrgProfile = ({ isAdminInOrgView = false }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const userId = useSelector(selectUserId);
  const userData = useSelector(selectUserProfile);
  const orgProfile = useSelector(selectOrganizationProfile);
  const authenticated = useSelector(selectAuthenticated);
  const token = useSelector(selectToken);

  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (location.state?.openSubscriptionTab && !isAdminInOrgView) {
      setTabValue(0);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.openSubscriptionTab, location.pathname, navigate, isAdminInOrgView]);

  const prevIsAdminInOrgView = useRef(isAdminInOrgView);
  // When admin enters AME view, map 4-tab index to 2-tab index once.
  useEffect(() => {
    const justEnteredAME = isAdminInOrgView && !prevIsAdminInOrgView.current;
    prevIsAdminInOrgView.current = isAdminInOrgView;
    if (!justEnteredAME) return;
    setTabValue((prev) => (prev === 2 ? 1 : 0));
  }, [isAdminInOrgView]);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isButtonLoading2, setIsButtonLoading2] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const isPersonalInfoTab = tabValue === 2 || (isAdminInOrgView && tabValue === 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPersonalInfoTab) {
      const {
        password,
        newPassword,
        prevPassword,
        confirmPassword,
        email,
        ...updatedData
      } = formData;
      setIsButtonLoading2(true);
      // 1. Contact person: user profile API
      dispatch(
        updateUserProfile({ updatedData, userId: userData?._id, token })
      )
        .then(() => {
          // 2. Organization profile: PUT /api/organization/profile/me (with X-Acting-As-Organization-Id in AME)
          const orgPayload = businessEntityToOrgPayload(businessEntity, orgProfile);
          return dispatch(updateMyOrganizationProfile({ updateData: orgPayload, token }));
        })
        .then((result) => {
          if (updateMyOrganizationProfile.fulfilled.match(result)) {
            dispatch(notify({ type: "success", message: "Profile updated successfully" }));
            dispatch(getMyOrganizationProfile({ token }));
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

  const submittedDocuments = mapOrgDocuments(orgProfile?.documents);

  const handleViewDocument = (doc) => {
    const url = doc.viewUrl || doc.downloadUrl;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadDocument = (doc) => {
    const url = doc.downloadUrl || doc.viewUrl;
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.subtitle || true;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.click();
    }
  };

  const handleOpenDocumentLink = (doc) => {
    const url = doc.linkUrl || doc.viewUrl || doc.downloadUrl;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const renderTabContent = () => {
    if (isAdminInOrgView) {
      switch (tabValue) {
        case 0:
          return <SharedContentVisibilityTab />;
        case 1:
          return (
            <OrgPersonalInfoForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isButtonLoading2={isButtonLoading2}
              userData={userData}
              businessEntity={businessEntity}
              onBusinessEntityChange={setBusinessEntity}
              submittedDocuments={submittedDocuments}
              onViewDocument={handleViewDocument}
              onDownloadDocument={handleDownloadDocument}
              onOpenLink={handleOpenDocumentLink}
            />
          );
        default:
          return null;
      }
    }
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
            submittedDocuments={submittedDocuments}
            onViewDocument={handleViewDocument}
            onDownloadDocument={handleDownloadDocument}
            onOpenLink={handleOpenDocumentLink}
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
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: "100%", width: "100%", maxWidth: "100%" }}>
      {/* Internal header and avatar outside the white box – same style as My Announcements */}
      <Typography
        component="h1"
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: "26px",
          color: "#000",
          mb: 2,
        }}
      >
        Profile
      </Typography>

      {/* White box only for tabs section (tabs + tab content) – same card style as Announcements */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0px 6px 24px 0px rgba(0,0,0,0.05)",
          border: "1px solid #EAECF0",
          overflow: "hidden",
          mt: 3,
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 2 } }}>
          <OrgProfileTabs tabValue={tabValue} onChange={setTabValue} hideSubscriptionAndChangePassword={isAdminInOrgView} />
        </Box>
        <Box sx={{ px: { xs: 2, sm: 3 }, py: 3, pt: 2 }}>
          {renderTabContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default OrgProfile;
