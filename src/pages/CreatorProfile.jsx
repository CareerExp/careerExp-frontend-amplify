import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Pagination,
  Rating,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

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
  getAuthorArticles,
  getAuthorPodcasts,
  getAuthorVideos,
  selectAuthorArticles,
  selectAuthorPodcasts,
  selectAuthorVideos,
  selectCreatorProfile,
  selectFollowerCount,
  selectIsFollowing,
} from "../redux/slices/creatorSlice.js";
import ArticleCard from "../components/ArticleCard.jsx";
import PodcastCard from "../components/PodcastCard.jsx";
import creatorStyle from "../styles/CreatorProfile.module.css";
import { shouldHideDetails } from "../utility/hiddenDetailsForEmailIds.js";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  LinkedinIcon,
  YoutubeIcon,
  TelegramIcon,
  TwitterIcon,
  yellowBG,
} from "../assets/assest.js";

const Profile = () => {
  const dispatchToRedux = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams(); //targetUserId for creator profile

  const studentUserId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const creatorProfileWithFollowersCount = useSelector(selectCreatorProfile);
  const creatorVideos = useSelector(selectAuthorVideos);
  const authorArticles = useSelector(selectAuthorArticles);
  const authorPodcasts = useSelector(selectAuthorPodcasts);
  const isFollowing = useSelector(selectIsFollowing);
  // Fix: ensure isFollowing is always boolean
  const isFollowingBool =
    typeof isFollowing === "boolean" ? isFollowing : !!isFollowing?.isFollowing;
  const followerCount = useSelector(selectFollowerCount);

  const [activeTab, setActiveTab] = useState(1);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const creatorProfile = creatorProfileWithFollowersCount?.user;
  const orgProfile = creatorProfileWithFollowersCount?.organization;

  useEffect(() => {
    dispatchToRedux(getCreatorProfile({ userId }));
  }, []);

  useEffect(() => {
    if (activeTab === 1) {
      dispatchToRedux(getAuthorVideos({ page, userId }));
    }
  }, [page, activeTab, userId]);

  useEffect(() => {
    if (activeTab === 2) {
      dispatchToRedux(getAuthorArticles({ page, userId }));
    }
  }, [page, activeTab, userId]);

  useEffect(() => {
    if (activeTab === 3) {
      dispatchToRedux(getAuthorPodcasts({ page, userId }));
    }
  }, [page, activeTab, userId]);

  const handleShareClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFollow = async () => {
    if (!studentUserId) {
      dispatchToRedux(
        notify({
          message: "You need to login/signup first to follow",
          type: "error",
        }),
      );
      return;
    }

    if (studentUserId === userId) {
      dispatchToRedux(
        notify({ message: "You can't follow yourself", type: "error" }),
      );
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
      dispatchToRedux(
        notify({ message: "Successfully performed action", type: "success" }),
      );
    } catch (error) {
      setIsButtonLoading(false);
    }
  };

  //Already following
  useEffect(() => {
    if (studentUserId) {
      dispatchToRedux(
        checkFollowStatus({
          userId: studentUserId,
          targetUserId: userId,
          token: token,
        }),
      );
    }
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value); // Update page number
  };

  const hideDetails = shouldHideDetails(creatorProfile?.email);

  const formattedFollowerCount =
    followerCount >= 1000
      ? `${(followerCount / 1000).toFixed(1)}k`
      : String(followerCount ?? 0);

  const socialLinksConfig = [
    {
      key: "facebook",
      icon: FacebookIcon,
      link: creatorProfile?.facebook ?? creatorProfile?.facebook,
    },
    {
      key: "instagram",
      icon: InstagramIcon,
      link: creatorProfile?.instagram ?? creatorProfile?.instagram,
    },
    {
      key: "tiktok",
      icon: TikTokIcon,
      link: creatorProfile?.tiktok ?? creatorProfile?.tiktok,
    },
    {
      key: "linkedin",
      icon: LinkedinIcon,
      link: creatorProfile?.linkedIn ?? creatorProfile?.linkedin,
    },
    {
      key: "youtube",
      icon: YoutubeIcon,
      link: creatorProfile?.youtube ?? creatorProfile?.youtube,
    },
    {
      key: "telegram",
      icon: TelegramIcon,
      link: creatorProfile?.telegram ?? creatorProfile?.telegram,
    },
    {
      key: "twitter",
      icon: TwitterIcon,
      link: creatorProfile?.twitter ?? creatorProfile?.twitter,
    },
  ].filter((s) => s.link);

  const specTags = (() => {
    const spec = creatorProfile?.specialization;
    if (Array.isArray(spec)) return spec;
    if (typeof spec === "string")
      return spec
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    return spec ? [spec] : [];
  })();

  return (
    <div className={creatorStyle.container}>
      <Box sx={{ maxWidth: "80rem", width: "100%", mx: "auto", mb: 2 }}>
        <Typography
          component="button"
          onClick={() => navigate("/explore?tab=counsellors")}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.9375rem",
            color: "#720361",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: "1.25rem" }} />
          Back to Counsellors
        </Typography>
      </Box>
      {/* ========== NEW PROFILE TOP (Figma 763-116391) ========== */}
      <div className={creatorStyle.profileTopV2}>
        <div className={creatorStyle.profileTopV2Banner}>
          <img
            src={yellowBG}
            alt="yellow-background"
            className={creatorStyle.profileTopV2BannerImg}
          />
          <div className={creatorStyle.profileTopV2SocialTray}>
            {socialLinksConfig.map(({ key, icon, link }) => (
              <a
                key={key}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={creatorStyle.profileTopV2SocialCircle}
                aria-label={key}
              >
                <img src={icon} alt="" />
              </a>
            ))}
          </div>
        </div>

        <div
          className={creatorStyle.profileTopV2Body}
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className={creatorStyle.profileTopV2Left}>
            <div className={creatorStyle.profileTopV2AvatarWrap}>
              <Avatar
                src={creatorProfile?.profilePicture || ""}
                alt="profile"
                className={creatorStyle.profileTopV2Avatar}
                sx={{
                  height: { sm: "97px", xs: "120px" },
                  width: { sm: "97px", xs: "120px" },
                  border: "9px solid #ffffff",
                }}
              />
            </div>
            <p className={creatorStyle.profileTopV2FollowersText}>
              {formattedFollowerCount} Followers
            </p>
            <button
              className={creatorStyle.profileTopV2FollowBtn}
              onClick={handleFollow}
            >
              {isButtonLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : isFollowingBool ? (
                "Following"
              ) : (
                "Follow"
              )}
            </button>
          </div>

          <div
            className={creatorStyle.profileTopV2Right}
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className={creatorStyle.profileTopV2NameRow}>
              <div className={creatorStyle.profileTopV2NameBlock}>
                <h1 className={creatorStyle.profileTopV2Name}>
                  {creatorProfile?.firstName + " " + creatorProfile?.lastName}
                </h1>
                {creatorProfile?.subtitle && (
                  <span className={creatorStyle.profileTopV2Subtitle}>
                    ({creatorProfile.subtitle})
                  </span>
                )}
              </div>
              <button
                type="button"
                className={creatorStyle.profileTopV2ShareBtn}
                onClick={handleShareClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleShareClick();
                  }
                }}
              >
                <img
                  src={shareIcon}
                  alt=""
                  className={creatorStyle.profileTopV2ShareIcon}
                />
                <span style={{ color: "#787876", fontWeight: "400" }}>
                  Share Profile
                </span>
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "space-between",
              }}
            >
              <div>
                {!hideDetails && (
                  <>
                    <div className={creatorStyle.profileTopV2MetaRow}>
                      <span className={creatorStyle.profileTopV2MetaLabel}>
                        Specialization :
                      </span>
                      <div className={creatorStyle.profileTopV2Pills}>
                        {specTags.length ? (
                          specTags.map((tag, i) => (
                            <span
                              key={i}
                              className={creatorStyle.profileTopV2Pill}
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className={creatorStyle.profileTopV2Pill}>
                            {creatorProfile?.specialization || "—"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={creatorStyle.profileTopV2MetaRow}>
                      <span className={creatorStyle.profileTopV2MetaLabel}>
                        Years of experience :
                      </span>
                      <span className={creatorStyle.profileTopV2Pill}>
                        {creatorProfile?.experience != null
                          ? `${creatorProfile.experience} years`
                          : "—"}
                      </span>
                    </div>
                  </>
                )}

                <div className={creatorStyle.profileTopV2ContactRow}>
                  {!hideDetails && (
                    <>
                      <Information
                        icon={creatorIconLocation}
                        info={creatorProfile?.nationality}
                        height={24}
                        width={24}
                      />
                      <Dot />
                      <Information
                        icon={creatorIconMobile}
                        info={creatorProfile?.mobile}
                        height={24}
                        width={24}
                      />
                      <Dot />
                      <Information
                        icon={creatorIconWhatsaap}
                        info={creatorProfile?.telephone}
                        height={24}
                        width={24}
                      />
                      <Dot />
                      <Information
                        icon={creatorIconMail}
                        info={creatorProfile?.email}
                        height={24}
                        width={24}
                      />
                    </>
                  )}
                </div>
              </div>
              {orgProfile?.logo && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "end",
                    gap: "10px",
                    justifyContent: "flex-end",
                  }}
                >
                  <img
                    src={orgProfile?.logo}
                    alt=""
                    style={{
                      width: "80px",
                      height: "80px",
                      // borderRadius: "50%",
                    }}
                  />
                  {/* <h4>{orgProfile?.organizationName}</h4> */}
                </div>
              )}
            </div>

            <div className={creatorStyle.profileTopV2About}>
              <p className={creatorStyle.profileTopV2AboutTitle}>About me</p>
              <Divider />
              <p className={creatorStyle.profileTopV2AboutText}>
                {creatorProfile?.introBio || ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={creatorStyle.contentContainer}>
        <div className={creatorStyle.tabsContainer}>
          <p
            onClick={() => {
              setActiveTab(1);
              setPage(1);
            }}
            className={`${creatorStyle.tabItem} ${
              activeTab === 1
                ? creatorStyle.activeTab
                : creatorStyle.inactiveTab
            }`}
          >
            Videos
          </p>
          <p
            onClick={() => {
              setActiveTab(2);
              setPage(1);
            }}
            className={`${creatorStyle.tabItem} ${
              activeTab === 2
                ? creatorStyle.activeTab
                : creatorStyle.inactiveTab
            }`}
          >
            Articles
          </p>
          <p
            onClick={() => {
              setActiveTab(3);
              setPage(1);
            }}
            className={`${creatorStyle.tabItem} ${
              activeTab === 3
                ? creatorStyle.activeTab
                : creatorStyle.inactiveTab
            }`}
          >
            Podcasts
          </p>
        </div>
        <div
          className={
            activeTab === 1
              ? creatorStyle.videosGrid
              : creatorStyle.articlesPodcastsGrid
          }
        >
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
                  name={
                    creatorProfile?.firstName + " " + creatorProfile?.lastName
                  }
                />
              ),
            )}

          {activeTab === 2 &&
            (authorArticles?.articles?.length > 0 ? (
              authorArticles.articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))
            ) : (
              <p className={creatorStyle.comingSoonText}>No articles yet.</p>
            ))}

          {activeTab === 3 &&
            (authorPodcasts?.podcasts?.length > 0 ? (
              authorPodcasts.podcasts.map((podcast) => (
                <PodcastCard key={podcast._id} podcast={podcast} />
              ))
            ) : (
              <p className={creatorStyle.comingSoonText}>No podcasts yet.</p>
            ))}
        </div>
        <div className={creatorStyle.paginationContainer}>
          <Pagination
            count={
              activeTab === 1
                ? creatorVideos?.totalPages || 1
                : activeTab === 2
                  ? authorArticles?.totalPages || 1
                  : authorPodcasts?.totalPages || 1
            }
            page={page}
            onChange={handlePageChange}
          />
        </div>
      </div>
      <SharingVideoModal
        open={isModalOpen}
        handleClose={handleModalClose}
        videoUrl={`${config?.frontendDomain}/profile/${creatorProfile?._id}`}
        videoId={creatorProfile?._id}
        isProfile={true}
        shareTitle={creatorProfile ? `${creatorProfile.firstName || ""} ${creatorProfile.lastName || ""}`.trim() || "Profile" : "Profile"}
        modalTitle="Share Profile"
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
  <div
    className={creatorStyle.videoCard}
    onClick={() => (window.location.href = `/video/${id}`)}
  >
    {youtubeLink ? (
      <img
        src={`https://img.youtube.com/vi/${youtubeVideoId}/0.jpg`}
        alt="thumbnail"
        className={creatorStyle.thumbnailImage}
      />
    ) : (
      <img
        src={thumbnail}
        alt="thumbnail"
        className={creatorStyle.thumbnailImage}
      />
    )}

    <div>
      <div>
        <p className={creatorStyle.videoTitle}>{title}</p>
        <div className={creatorStyle.ratingContainer}>
          <Rating value={averageRating} readOnly precision={0.5} />
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
