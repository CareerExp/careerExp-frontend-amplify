import Rating from "@mui/material/Rating";
import React from "react";
import { useNavigate } from "react-router-dom";
import { fonts } from "../utility/fonts.js";

const PodcastCard = ({ podcast }) => {
  const navigate = useNavigate();

  const title = podcast?.title || "";
  // Use Spotify thumbnail from API when available, else fall back to thumbnail/image
  const imageUrl =
    podcast?.spotifyThumbnailUrl || podcast?.thumbnail || podcast?.image || "https://via.placeholder.com/400x225?text=Podcast";
  const averageRating = podcast?.averageRating ?? 0;
  const totalRatings = podcast?.totalRatings ?? 0;
  const totalViews = podcast?.totalViews ?? 0;
  const authorName = podcast?.creatorId
    ? `${podcast.creatorId.firstName || ""} ${podcast.creatorId.lastName || ""}`.trim()
    : "Unknown";
  const creatorId = podcast?.creatorId?._id;

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
      onClick={() => podcast?._id && navigate(`/podcast/${podcast._id}`)}
    >
      {/* Image: blurred same image as background, sharp image contained on top */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#e8e8e8",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-30px",
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(14px)",
            transform: "scale(1.15)",
          }}
          aria-hidden
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.12)",
            pointerEvents: "none",
          }}
          aria-hidden
        />
        <img
          src={imageUrl}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
        }}
      >
        <div>
          <p
            style={{
              marginTop: "0.5rem",
              fontFamily: fonts.sans,
              fontSize: "1rem",
            }}
          >
            {title?.length > 17 ? title.slice(0, 17) + "..." : title}
          </p>
          <div
            style={{
              marginTop: "0.2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Rating value={averageRating} readOnly size="small" />
            <p style={{ color: "#898989", fontFamily: fonts.sans, marginLeft: 4 }}>
              ({totalRatings || "0"})
            </p>
          </div>
          <p
            style={{
              marginTop: "0.3rem",
              color: "#898989",
              fontFamily: fonts.sans,
              fontSize: "0.875rem",
            }}
          >
            by{" "}
            <span
              style={{ color: "#BC2876", cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                if (creatorId) navigate(`/profile/${creatorId}`);
              }}
            >
              {authorName}
            </span>
          </p>
        </div>
        <div>
          <p
            style={{
              textWrap: "nowrap",
              color: "#737373",
              fontFamily: fonts.sans,
              fontSize: "0.875rem",
            }}
          >
            {totalViews} views
          </p>
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;
