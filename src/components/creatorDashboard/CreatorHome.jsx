import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  creator,
  //Podcast
  GHome,
  GLikes,
  GRating,
  GShared,
  GViews,
  //videos
  OHome,
  OLikes,
  ORating,
  OShared,
  OViews,
  //Articles
  PHome,
  PLikes,
  PRating,
  PShared,
  PViews,
  //Counsellors Dashboard Icons
  uploadIcon,
} from "../../assets/assest.js";
import UploadVideoModal from "../../models/UploadVideoModal.jsx";
import { selectToken, selectUserId } from "../../redux/slices/authSlice.js";
import { getGeneralVideoData, selectGeneralVideoData } from "../../redux/slices/creatorSlice.js";
import creatorStyle from "../../styles/CreatorVideo.module.css";
import { fonts } from "../../utility/fonts.js";
import { notify } from "../../redux/slices/alertSlice.js";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const CreatorHome = () => {
  const dispatchToRedux = useDispatch();
  const generalVideoData = useSelector(selectGeneralVideoData);
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const [openUploadModal, setOpenUploadModal] = useState(false);

  useEffect(() => {
    const fetchGeneralVideoData = async () => {
      try {
        const response = await dispatchToRedux(getGeneralVideoData({ userId, token })).unwrap();
        dispatchToRedux(
          notify({
            type: response.success ? "success" : "error",
            message: response.message || "Video data fetched successfully",
          }),
        );
      } catch (error) {
        dispatchToRedux(notify({ type: "error", message: error.message || "Failed to fetch video data" }));
      }
    };

    if (generalVideoData === null) {
      fetchGeneralVideoData();
    }
  }, []);

  const handleUpload = () => {
    setOpenUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setOpenUploadModal(false);
  };

  const Videos = {
    totalContent: generalVideoData?.totalVideos || 0,
    contentLikes: generalVideoData?.totalLikes || 0,
    contentShares: generalVideoData?.totalShares || 0,
    // contentAvgRating: generalVideoData?.overallAverageRating || 0,
    contentAvgRating: (generalVideoData?.overallAverageRating || 0).toFixed(1),
    contentViews: generalVideoData?.totalViews || 0,
  };
  const Podcast = {
    totalContent: 0,
    contentLikes: 0,
    contentShares: 0,
    contentAvgRating: 0,
    contentViews: 0,
  };
  const Articles = {
    totalContent: 0,
    contentLikes: 0,
    contentShares: 0,
    contentAvgRating: 0,
    contentViews: 0,
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: ".6rem",
          width: { xs: "100%", sm: "100%", md: "100%" },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: "800",
            padding: "1rem",
            fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
          }}
        >
          Dashboard
        </Typography>

        <Button
          onClick={handleUpload}
          sx={{
            backgroundImage: "linear-gradient(to top left, #720361, #bf2f75)",
            border: "none",
            padding: { xs: "0.3rem 0.8rem", md: "0.6rem 1rem" },
            borderRadius: "90px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "fit-content",
            fontSize: { xs: "1rem", sm: "1.2rem", md: "1.125rem" },
            gap: "0.875rem",
            color: "white",
            cursor: "pointer",
            textWrap: "nowrap",
            textTransform: "none", // optional: to keep button text case as-is
            "&:hover": {
              backgroundImage: "linear-gradient(to top left, #720361, #bf2f75)", // same on hover
            },
          }}
        >
          <img src={uploadIcon} alt="upload" style={{ width: "1.5rem" }} />
          Upload Content
        </Button>
      </Box>

      <Card
        sampleData={Videos}
        titleImage={OHome}
        img1={OLikes}
        img2={ORating}
        img3={OShared}
        img4={OViews}
        title={"Videos"}
        themeColor={"#FF8A00"}
      />
      <Card
        sampleData={Articles}
        titleImage={PHome}
        img1={PLikes}
        img2={PRating}
        img3={PShared}
        img4={PViews}
        title={"Articles"}
        themeColor={"#C028AE"}
      />
      <Card
        sampleData={Podcast}
        titleImage={GHome}
        img1={GLikes}
        img2={GRating}
        img3={GShared}
        img4={GViews}
        title={"Podcasts"}
        themeColor={"#21A9B1"}
      />

      <UploadVideoModal open={openUploadModal} handleClose={handleCloseUploadModal} />
    </>
  );
};

export default CreatorHome;

const ChildCard = ({ image = creator, name, count }) => (
  <Box
    style={{
      display: "flex",
      gap: "1.1rem",
      alignItems: "center",
      padding: "0.9rem 1.1rem",
      backgroundColor: "white",
      boxShadow: "1px 5px 10px #3e3e3e54",
      borderRadius: ".9rem",
      height: "6.0625rem",
      width: "16.125rem",
      // border: "2px solid green",
    }}
  >
    <div>
      <img src={image} alt={name} style={{ width: "4.5rem", height: "4.5rem" }} />
    </div>
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        // border: "1px solid red",
      }}
    >
      <span style={{ fontWeight: "800", fontSize: "24px" }}>{count}</span>
      <br />
      <span
        style={{ color: "#3e3e3e", fontSize: "16px", fontWeight: 400, opacity: "0.6", marginTop: "-25px" }}
      >
        {name}
      </span>
      {/* <p style={{ fontWeight: "800", fontSize: "26px" }}>{count}</p>
      <p style={{ color: "#3e3e3e", fontSize: "16px", fontWeight: 400, opacity: "0.6" }}>{name}</p> */}
    </Box>
  </Box>
);

const Card = ({ sampleData, titleImage, img1, img2, img3, img4, title, themeColor }) => (
  <div style={{ marginBottom: "1.5rem" }}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "0.2rem",
        alignItems: "center",
        marginBottom: ".5rem",
        marginLeft: "1rem",
      }}
    >
      <img src={titleImage} alt={title} style={{ width: "2.5rem" }} />
      <p style={{ color: themeColor, fontWeight: "bold", fontSize: "20px" }}>{sampleData.totalContent}</p>
      <p style={{ color: "#464545cd", fontSize: "1rem", fontWeight: "600" }}>{title}</p>
    </Box>
    <Box
      style={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: { xs: "column", sm: "column", md: "row" },
        // flexWrap: "nowrap",
        gap: "1.1rem",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ChildCard count={sampleData.contentLikes} name={"Total Likes"} image={img1} themeColor={themeColor} />
      <ChildCard
        count={sampleData.contentShares}
        name={"Total Shared"}
        themeColor={themeColor}
        image={img3}
      />
      <ChildCard
        count={sampleData.contentAvgRating}
        name={"Average Rating"}
        themeColor={themeColor}
        image={img2}
      />
      <ChildCard count={sampleData.contentViews} name={"Total Views"} themeColor={themeColor} image={img4} />
    </Box>
  </div>
);
