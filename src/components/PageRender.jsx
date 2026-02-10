import CreatorAnalytics from "../components/creatorDashboard/CreatorAnalytics.jsx";
import CreatorHome from "../components/creatorDashboard/CreatorHome.jsx";
import CreatorSocialMedia from "../components/creatorDashboard/CreatorSocialMedia.jsx";
import CreatorVideos from "../components/creatorDashboard/CreatorVideos.jsx";
import CounsellorFollowers from "../components/creatorDashboard/CounsellorFollowers.jsx";
// import UserHistory from "../components/userDashboard/UserHistory.jsx";
import UserHome from "../components/userDashboard/UserHome.jsx";
import UserMyAssessment from "../components/userDashboard/UserMyAssessment.jsx";
import UserMyLikes from "../components/userDashboard/UserMyLikes.jsx";
import UserPlaylist from "../components/userDashboard/UserPlaylist.jsx";
import PendingStatePopup from "../models/PendingStatePopup.jsx";
import AdminHome from "./adminDashboard/AdminHome.jsx";
import CollaboratorsData from "./adminDashboard/CollaboratorsData.jsx";
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
import OrgFollowers from "./orgDashboard/OrgFollowers.jsx";
import OrgProfile from "./orgDashboard/OrgProfile.jsx";
import OrgESPHome from "./orgDashboard/OrgESPHome.jsx";
import OrgHEIHome from "./orgDashboard/OrgHEIHome.jsx";
import MyCompany from "./creatorDashboard/MyCompany.jsx";

const renderCurrentPage = (currentPage, userData, orgProfile) => {
  console.log(orgProfile);
  if (userData.activeDashboard === "admin") {
    switch (currentPage) {
      case "Dashboard":
        return <AdminHome />;
      case "Users":
        return <UsersData />;
      case "Counsellors":
        return <CollaboratorsData />;
      case "Records":
        return <UnifiedRecord />;
      case "School Directory":
        return <SchoolDirectory />;
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
      case "Profile":
        return <Profile />;
      default:
        return null;
    }
  }

  if (userData.activeDashboard === "organization") {
    if (userData.status === "pending") {
      return <PendingStatePopup message={"Your Organization Account is in Pending State."} />;
    }
    if (userData?.status === "blocked") {
      return <PendingStatePopup message={"Your Organization Account has been blocked. Please contact support for further assistance."} />;
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
      case "My Followers":
        return <OrgFollowers />;
      case "Profile":
        return <OrgProfile />;
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
      case "My Likes":
        return <UserMyLikes />;
      case "My Playlist":
        return <UserPlaylist />;
      case "My Assessments":
        return <UserMyAssessment />;
      case "My Resume":
        return <UserResume />;
      case "Career Planning":
        return <CareerPlanning />;
      case "Profile":
        return <Profile />;
      default:
        return null;
    }
  }
};

export default renderCurrentPage;
