import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import PodcastDetailContent from "../components/creatorDashboard/PodcastDetailContent.jsx";

/**
 * Podcast detail page (e.g. when opening shared link /podcast/:podcastId).
 * Rendered inside Layout so header and footer are shown.
 * Playback happens on our site via embedded audio player (no redirect to Spotify).
 */
const PodcastDetail = () => {
  const navigate = useNavigate();
  const { podcastId } = useParams();

  return (
    <PodcastDetailContent
      podcastId={podcastId}
      onBack={() => navigate("/explore?tab=podcasts")}
      embedded={false}
    />
  );
};

export default PodcastDetail;
