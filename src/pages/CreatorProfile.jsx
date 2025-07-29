import { Avatar, CircularProgress, Divider, Pagination, Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  creatorIconLocation,
  creatorIconMail,
  creatorIconMobile,
  creatorIconWhatsaap,
  eyeIcon,
  likeIcon,
  profileOilPaint,
  shareIcon,
  sms,
  profileOilPaintMobile,
} from "../assets/assest";
import { config } from "../config/config.js";
import SharingVideoModal from "../models/SharingVideoModal.jsx";
import { notify } from "../redux/slices/alertSlice.js";
import { selectToken, selectUserId } from "../redux/slices/authSlice.js";
import {
  checkFollowStatus,
  creatorFollowToggle,
  getCreatorProfile,
  selectCreatorProfile,
  selectFollowerCount,
  selectIsFollowing,
} from "../redux/slices/creatorSlice.js";
import { getAuthorVideos, selectAuthorVideos } from "../redux/slices/creatorSlice.js";
import creatorStyle from "../styles/CreatorProfile.module.css";
import { shouldHideDetails } from "../utility/hiddenDetailsForEmailIds.js";

const Profile = () => {
  const dispatchToRedux = useDispatch();
  const { userId } = useParams(); //targetUserId for creator profile

  const studentUserId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const creatorProfileWithFollowersCount = useSelector(selectCreatorProfile);
  const creatorVideos = useSelector(selectAuthorVideos);
  const isFollowing = useSelector(selectIsFollowing);
  // Fix: ensure isFollowing is always boolean
  const isFollowingBool = typeof isFollowing === "boolean" ? isFollowing : !!isFollowing?.isFollowing;
  const followerCount = useSelector(selectFollowerCount);

  const [activeTab, setActiveTab] = useState(1);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const creatorProfile = creatorProfileWithFollowersCount?.user;

  useEffect(() => {
    dispatchToRedux(getCreatorProfile({ userId }));
  }, []);

  useEffect(() => {
    dispatchToRedux(getAuthorVideos({ page, userId }));
  }, [page]);

  const handleShareClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFollow = async () => {
    if (!studentUserId) {
      dispatchToRedux(notify({ message: "You need to login/signup first to follow", type: "error" }));
      return;
    }

    if (studentUserId === userId) {
      dispatchToRedux(notify({ message: "You can't follow yourself", type: "error" }));
      return;
    }

    try {
      setIsButtonLoading(true);
      await dispatchToRedux(
        creatorFollowToggle({
          userId: studentUserId,
          targetUserId: userId,
          token: token,
        }),
      );
      setIsButtonLoading(false);
      dispatchToRedux(notify({ message: "Successfully performed action", type: "success" }));
    } catch (error) {
      setIsButtonLoading(false);
    }
  };

  //Already following
  useEffect(() => {
    if (studentUserId) {
      dispatchToRedux(checkFollowStatus({ userId: studentUserId, targetUserId: userId, token: token }));
    }
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value); // Update page number
  };

  const hideDetails = shouldHideDetails(creatorProfile?.email);

  return (
    <div className={creatorStyle.container}>
      {/* top */}
      <div className={creatorStyle.profileTopContainer}>
        <img src={profileOilPaint} alt="oilPaint" className={creatorStyle.profileBackgroundImage} />

        <div className={creatorStyle.avatarContainer}>
          <Avatar
            src={creatorProfile?.profilePicture || ""}
            alt="profile"
            sx={{ height: { sm: "97px", xs: "140px" }, width: { sm: "97px", xs: "140px" } }}
          />

          <div className={creatorStyle.followersContainer}>
            <p className={creatorStyle.followersText}>{followerCount} Followers</p>
            <button className={creatorStyle.navButton} style={{ marginTop: ".5rem" }} onClick={handleFollow}>
              {isButtonLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : isFollowingBool ? (
                "Following"
              ) : (
                "Follow"
              )}
            </button>
          </div>
        </div>

        <div className={creatorStyle.profileInfoContainer}>
          <div className={creatorStyle.nameContainer}>
            <div style={{ display: "flex", gap: ".5rem" }}>
              <p className={creatorStyle.nameText}>
                {creatorProfile?.firstName + " " + creatorProfile?.lastName}
              </p>
            </div>
            <div className={creatorStyle.shareContainer} onClick={() => handleShareClick()}>
              <img src={shareIcon} className={creatorStyle.shareIcon} />
              <p>Share Profile</p>
            </div>
          </div>

          {/* Hide for Career Libraries's  */}
          {!hideDetails && (
            <>
              <div className={creatorStyle.specializationContainer}>
                <p>Specialization :</p>
                <p className={creatorStyle.specializationTag}>{creatorProfile?.specialization}</p>
              </div>
              <div className={creatorStyle.experienceContainer}>
                <p>Years of experience :</p>
                <p className={creatorStyle.experienceTag}>{creatorProfile?.experience + " Years" || ""}</p>
              </div>
            </>
          )}

          <div className={creatorStyle.contactInfoContainer}>
            {!hideDetails && (
              <>
                <Information icon={creatorIconLocation} info={creatorProfile?.nationality} />
                <Dot />
                <Information icon={creatorIconMobile} info={creatorProfile?.mobile} />
                <Dot />
                <Information icon={creatorIconWhatsaap} info={creatorProfile?.telephone} />
                <Dot />
                <Information icon={creatorIconMail} info={creatorProfile?.email} />
              </>
            )}
          </div>

          <div className={creatorStyle.aboutMeContainer}>
            <p className={creatorStyle.aboutMeTitle}>About me</p>
            <Divider />
            <p className={creatorStyle.aboutMeText}>{creatorProfile?.introBio}</p>
          </div>
        </div>
      </div>

      <div className={creatorStyle.contentContainer}>
        <div className={creatorStyle.tabsContainer}>
          <p
            onClick={() => setActiveTab(1)}
            className={`${creatorStyle.tabItem} ${
              activeTab === 1 ? creatorStyle.activeTab : creatorStyle.inactiveTab
            }`}
          >
            Videos
          </p>
          <p
            onClick={() => setActiveTab(2)}
            className={`${creatorStyle.tabItem} ${
              activeTab === 2 ? creatorStyle.activeTab : creatorStyle.inactiveTab
            }`}
          >
            Articles
          </p>
          <p
            onClick={() => setActiveTab(3)}
            className={`${creatorStyle.tabItem} ${
              activeTab === 3 ? creatorStyle.activeTab : creatorStyle.inactiveTab
            }`}
          >
            Podcasts
          </p>
        </div>
        <div className={creatorStyle.videosGrid}>
          {activeTab === 1 &&
            creatorVideos?.videos?.map(
              ({
                _id,
                title,
                totalRatings,
                author,
                totalLikes,
                totalViews,
                insights,
                thumbnail,
                youtubeLink,
                youtubeVideoId,
                averageRating,
              }) => (
                <Card
                  key={_id}
                  title={title}
                  rating={totalRatings}
                  author={author}
                  likes={totalLikes}
                  views={totalViews}
                  insights={insights}
                  thumbnail={thumbnail}
                  youtubeLink={youtubeLink}
                  youtubeVideoId={youtubeVideoId}
                  averageRating={averageRating}
                  id={_id}
                  name={creatorProfile?.firstName + " " + creatorProfile?.lastName}
                />
              ),
            )}

          {activeTab === 2 && <p>Coming Soon</p>}
          {activeTab === 3 && <p>Coming Soon</p>}
        </div>
        <div className={creatorStyle.paginationContainer}>
          <Pagination count={creatorVideos?.totalPages || 1} page={page} onChange={handlePageChange} />
        </div>
      </div>
      <SharingVideoModal
        open={isModalOpen}
        handleClose={handleModalClose}
        videoUrl={`${config?.frontendDomain}/profile/${creatorProfile?._id}`}
        isProfile={true}
      />
    </div>
  );
};

export default Profile;

const Information = ({ icon = { sms }, info }) => (
  <div className={creatorStyle.infoContainer}>
    <img src={icon} alt="Profile Icon Images" width={"30px"} />
    <p>{info}</p>
  </div>
);

const Dot = () => <div className={creatorStyle.dot}></div>;

const Card = ({
  id,
  title,
  rating,
  author,
  likes,
  views,
  insights,
  thumbnail,
  youtubeLink,
  youtubeVideoId,
  averageRating,
  name,
}) => (
  <div className={creatorStyle.videoCard} onClick={() => (window.location.href = `/video/${id}`)}>
    {youtubeLink ? (
      <img
        src={`https://img.youtube.com/vi/${youtubeVideoId}/0.jpg`}
        alt="thumbnail"
        className={creatorStyle.thumbnailImage}
      />
    ) : (
      <img src={thumbnail} alt="thumbnail" className={creatorStyle.thumbnailImage} />
    )}

    <div>
      <div>
        <p className={creatorStyle.videoTitle}>{title}</p>
        <div className={creatorStyle.ratingContainer}>
          <Rating value={averageRating} readOnly />
          <p className={creatorStyle.ratingText}>{`(${rating})`}</p>
        </div>
        <p className={creatorStyle.authorText}>
          by <span className={creatorStyle.authorName}>{author || name}</span>
        </p>
      </div>

      <div className={creatorStyle.statsContainer}>
        <div className={creatorStyle.statItem}>
          <img src={likeIcon} alt="like" width="24px" />
          <p>{likes} likes</p>
        </div>
        <div className={creatorStyle.statItem}>
          <img src={eyeIcon} alt="eye" width="24px" />
          <p>{views} views</p>
        </div>
      </div>
    </div>
  </div>
);
