import Rating from "@mui/material/Rating";
import * as React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ExploreVideoPlayPopup from "../models/ExploreVideoPlayPopup.jsx";
import { selectUserId } from "../redux/slices/authSlice.js";
import videoCardStyles from "../styles/VideoCard.module.css";

const VideoCard = ({ video, isAuthenticated }) => {
  const userId = useSelector(selectUserId);
  const navigate = useNavigate();
  const [videoPlayPopup, setVideoPlayPopup] = React.useState(false);
  const [videoId, setVideoId] = React.useState("");

  const handleVideoClick = (videoId) => {
    if (!isAuthenticated && !userId) {
      setVideoPlayPopup(true);
      setVideoId(videoId);
    } else {
      navigate(`/video/${videoId}`);
    }
  };

  const handleClosePopup = () => {
    setVideoPlayPopup(false);
    setVideoId("");
  };

  return (
    <div
      style={{
        borderRadius: "15px",
        padding: "15px",
        border: "1px solid #cecece",
        height: "14.125rem",
        minHeight: "fit-content",
        backgroundColor: "white",
        cursor: "pointer",
        boxShadow: "2px 2px 10px #a7a7a764",
      }}
      className={videoCardStyles["card"]}
    >
      {video?.youtubeLink ? (
        <>
          <img
            src={`https://img.youtube.com/vi/${video?.youtubeVideoId}/0.jpg`}
            alt="thumbnail"
            style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "8px" }}
            onClick={() => handleVideoClick(video._id)}
          />
        </>
      ) : (
        <>
          <img
            src={video?.thumbnail}
            alt="thumbnail"
            style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "8px" }}
            onClick={() => handleVideoClick(video._id)}
          />
        </>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <p style={{ marginTop: ".5rem" }}>
            {video?.title?.length > 17 ? video.title.slice(0, 17) + "..." : video.title}
          </p>
          <div style={{ marginTop: ".2rem", display: "flex", alignItems: "center" }}>
            <Rating value={video?.averageRating} readOnly size="small" />
            <p style={{ color: "#898989" }}>{`(${video?.totalRatings || "0"})`}</p>
          </div>
          <p style={{ marginTop: ".3rem", color: "#898989" }}>
            by{" "}
            <span style={{ color: "#BC2876" }} onClick={() => navigate(`/profile/${video.creatorId._id}`)}>
              {video?.creatorId?.firstName + " " + video?.creatorId?.lastName}
            </span>
          </p>
        </div>
        <div>
          <p style={{ textWrap: "nowrap", color: "#737373" }}>{video?.totalViews || 0} views</p>
        </div>
      </div>
      {/* <div style={{ backgroundColor: "#F2F2F2", display: "flex", marginTop: "1rem", padding: "15px 23px", flexWrap: "nowrap", alignItems: "center", borderRadius: "90px" }}>
      <p style={{textWrap: "nowrap", fontSize: "1.2rem"}}>Insights :</p>
      <p style={{textWrap: "nowrap", fontSize: "1.2rem", color: "#888888"}}> &nbsp; {insights.length > 47 ? insights.slice(0, 48)+ "..." : insights} &nbsp;</p>
      <img src={infoCircleIcon} alt=""  width={"24px"} height={"24px"}/>
    </div> */}
      <ExploreVideoPlayPopup open={videoPlayPopup} onClose={handleClosePopup} videoId={videoId} />
    </div>
  );
};

export default VideoCard;
