import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import AnnouncementDetailContent from "../components/AnnouncementDetailContent.jsx";

/**
 * Announcement detail page (e.g. when clicking "Tell me more" from Explore announcements).
 * Rendered inside Layout so header and footer are shown.
 */
const AnnouncementDetail = () => {
  const navigate = useNavigate();
  const { announcementId } = useParams();

  return (
    <AnnouncementDetailContent
      announcementId={announcementId}
      onBack={() => navigate("/explore")}
    />
  );
};

export default AnnouncementDetail;
