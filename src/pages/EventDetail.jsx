import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import EventDetailContent from "../components/EventDetailContent.jsx";

/**
 * Event detail page (e.g. when clicking event card on Explore events tab).
 * Rendered inside Layout so header and footer are shown.
 */
const EventDetail = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  return (
    <EventDetailContent
      eventId={eventId}
      onBack={() => navigate("/explore?tab=events")}
    />
  );
};

export default EventDetail;
