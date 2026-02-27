import { Box, Typography } from "@mui/material";
import CreatorAnalytics from "../components/creatorDashboard/CreatorAnalytics.jsx";
import CreatorHome from "../components/creatorDashboard/CreatorHome.jsx";
import CreatorSocialMedia from "../components/creatorDashboard/CreatorSocialMedia.jsx";
import CreatorVideos from "../components/creatorDashboard/CreatorVideos.jsx";
import CounsellorFollowers from "../components/creatorDashboard/CounsellorFollowers.jsx";
// import UserHistory from "../components/userDashboard/UserHistory.jsx";
import UserHome from "../components/userDashboard/UserHome.jsx";
import UserMyAssessment from "../components/userDashboard/UserMyAssessment.jsx";
import UserMyActivities from "../components/userDashboard/UserMyActivities.jsx";
import UserMyFollowing from "../components/userDashboard/UserMyFollowing.jsx";
import UserMyLikes from "../components/userDashboard/UserMyLikes.jsx";
import UserPlaylist from "../components/userDashboard/UserPlaylist.jsx";
import PendingStatePopup from "../models/PendingStatePopup.jsx";
import OrgUnderReviewScreen from "../models/OrgUnderReviewScreen.jsx";
import OrgSubscriptionRequiredScreen from "../models/OrgSubscriptionRequiredScreen.jsx";
import AdminGovernmentOrgs from "./adminDashboard/AdminGovernmentOrgs.jsx";
import AdminHome from "./adminDashboard/AdminHome.jsx";
import AdminManagedESPsData from "./adminDashboard/AdminManagedESPsData.jsx";
import AdminPayments from "./adminDashboard/AdminPayments.jsx";
import CollaboratorsData from "./adminDashboard/CollaboratorsData.jsx";
import EspEiUsersData from "./adminDashboard/EspEiUsersData.jsx";
import AdminManageAdmins from "./adminDashboard/AdminManageAdmins.jsx";
import SchoolDirectory from "./adminDashboard/SchoolDirectory.jsx";
import UnifiedRecord from "./adminDashboard/UnifiedRecord.jsx";
import UsersData from "./adminDashboard/UsersData.jsx";
import Profile from "./Profile.jsx";
import CareerPlanning from "./userDashboard/CareerPlanning.jsx";
import UserResume from "./userDashboard/UserResume.jsx";
import OrgHome from "./orgDashboard/OrgHome.jsx";
import OrgAboutUs from "./orgDashboard/OrgAboutUs.jsx";
import OrgMyCounsellors from "./orgDashboard/OrgMyCounsellors.jsx";
import OrgMyAnnouncements from "./orgDashboard/OrgMyAnnouncements.jsx";
import OrgMyEvents from "./orgDashboard/OrgMyEvents.jsx";
import OrgMyServices from "./orgDashboard/OrgMyServices.jsx";
import OrgMyCourses from "./orgDashboard/OrgMyCourses.jsx";
import OrgFollowers from "./orgDashboard/OrgFollowers.jsx";
import OrgProfile from "./orgDashboard/OrgProfile.jsx";
import OrgESPHome from "./orgDashboard/OrgESPHome.jsx";
import OrgHEIHome from "./orgDashboard/OrgHEIHome.jsx";
import MyCompany from "./creatorDashboard/MyCompany.jsx";
import MyMessages from "./messages/MyMessages.jsx";

const renderCurrentPage = (currentPage, userData, orgProfile, options = {}) => {
  console.log(orgProfile);
  if (userData.activeDashboard === "admin") {
    switch (currentPage) {
      case "Dashboard":
        return <AdminHome />;
      case "Users":
        return <UsersData />;
      case "Counsellors":
        return <CollaboratorsData />;
      case "ESP & EI User":
        return <EspEiUsersData />;
      case "Government Organizations":
        return <AdminGovernmentOrgs />;
      case "Admin managed ESPs":
        return <AdminManagedESPsData />;
      case "Records":
        return <UnifiedRecord />;
      case "School Directory":
        return <SchoolDirectory />;
      case "Payments":
        return <AdminPayments />;
      case "Manage Admins":
        return userData?.isMainAdmin === true ? (
          <AdminManageAdmins />
        ) : (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">You don&apos;t have permission to view this page.</Typography>
          </Box>
        );
      case "Profile":
        return <Profile />;
      default:
        return null;
    }
  }

  if (userData.activeDashboard === "creator") {
    if (userData.status === "pending") {
      return <PendingStatePopup message={"Your Creator Account is in Pending State."} />;
    }
    if (userData?.status === "blocked") {
      return (
        <PendingStatePopup
          message={"Your Counsellor Account has been blocked. Please contact support for further assistance."}
        />
      );
    }

    switch (currentPage) {
      case "Dashboard":
        return <CreatorHome />;
      case "My Content":
        return <CreatorVideos />;
      case "Analytics":
        return <CreatorAnalytics />;
      case "Social Media":
        return <CreatorSocialMedia />;
      case "My Followers":
        return <CounsellorFollowers />;
      case "My Company":
        return <MyCompany />;
      case "My Messages":
        return <MyMessages />;
      case "Profile":
        return <Profile />;
      default:
        return null;
    }
  }

  // Organization dashboard: real org users and admin acting as (Option 1). View driven by activeDashboard only.
  const isOrgDashboard = userData.activeDashboard === "organization";
  if (isOrgDashboard) {
    const orgStatus = orgProfile?.status ?? userData.status;
    const isOrgActive = orgStatus === "active";
    const subscriptionStatus = orgProfile?.subscription?.status;
    const hasActiveSubscription = subscriptionStatus === "active" || subscriptionStatus === "trialing";
    const skipSubscriptionGate = options.isAdminInOrgView === true;

    if (!skipSubscriptionGate && !isOrgActive && orgStatus === "blocked") {
      return <PendingStatePopup message={"Your Organization Account has been blocked. Please contact support for further assistance."} />;
    }
    if (!skipSubscriptionGate && !isOrgActive) {
      return <OrgUnderReviewScreen />;
    }
    if (!skipSubscriptionGate && isOrgActive && orgProfile != null && !hasActiveSubscription) {
      return (
        <OrgSubscriptionRequiredScreen
          onProceedToPayment={options.onProceedToSubscription}
        />
      );
    }
    switch (currentPage) {
      case "Dashboard":
        if (orgProfile?.organizationType === "ESP") {
          return <OrgESPHome />;
        }
        if (orgProfile?.organizationType === "HEI") {
          return <OrgHEIHome />;
        }
        return null;
      case "About Us":
        return <OrgAboutUs />;
      case "My Counsellors":
        return <OrgMyCounsellors />;
      case "My Announcements":
        return <OrgMyAnnouncements />;
      case "My Events":
        return <OrgMyEvents />;
      case "My Services":
        return <OrgMyServices />;
      case "My Courses":
        return <OrgMyCourses />;
      case "My Followers":
        return <OrgFollowers />;
      case "My Messages":
        return <MyMessages />;
      case "Profile":
        return <OrgProfile isAdminInOrgView={options.isAdminInOrgView} />;
      default:
        return null;
    }
  }

  if (userData.activeDashboard === "user") {
    switch (currentPage) {
      case "Dashboard":
        return <UserHome />;
      // case "History":
      // return <UserHistory />;
      case "My Activities":
        return <UserMyActivities />;
      case "My Following":
        return <UserMyFollowing />;
      case "My Playlist":
        return <UserPlaylist />;
      case "My Assessments":
        return <UserMyAssessment />;
      case "My Resume":
        return <UserResume />;
      case "Career Planning":
        return <CareerPlanning />;
      case "My Messages":
        return <MyMessages />;
      case "Profile":
        return <Profile />;
      default:
        return null;
    }
  }
};

export default renderCurrentPage;
