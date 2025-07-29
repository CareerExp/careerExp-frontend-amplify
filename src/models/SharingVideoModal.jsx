import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FacebookIcon,
  InstagramIcon,
  lineMedia,
  LinkedinIcon,
  snapchat,
  TelegramIcon,
  TwitterIcon,
  wechat,
  WhatsappIcon,
} from "../assets/assest.js";
import { selectAuthenticated, selectToken, selectUserId } from "../redux/slices/authSlice.js";
import { saveSharingDetails } from "../redux/slices/userHistory.js";
import { fonts } from "../utility/fonts";

const SharingVideoModal = ({ open, handleClose, videoUrl, videoId, isProfile }) => {
  const dispatchToRedux = useDispatch();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const authenticated = useSelector(selectAuthenticated);

  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
    } catch (err) {
      console.error("Unable to copy:", err);
    }
  };

  const sharingPlatform = [
    {
      icon: FacebookIcon,
      name: "Facebook",
      url: (link) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      supported: true,
    },
    {
      icon: InstagramIcon,
      name: "Instagram",
      supported: false,
    },
    {
      icon: LinkedinIcon,
      name: "Linkedin",
      url: (link) => `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(link)}`,
      supported: true,
    },
    {
      icon: TelegramIcon,
      name: "Telegram",
      url: (link) => `https://telegram.me/share/url?url=${encodeURIComponent(link)}`,
      supported: true,
    },
    {
      icon: TwitterIcon,
      name: "Twitter",
      url: (link) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`,
      supported: true,
    },
    {
      icon: WhatsappIcon,
      name: "WhatsApp",
      url: (link) => `https://wa.me/?text=${encodeURIComponent(link)}`,
      supported: true,
    },
    {
      icon: snapchat,
      name: "Snapchat",
      supported: false,
    },
    {
      icon: lineMedia,
      name: "Line",
      url: (link) => `https://line.me/R/msg/text/?${encodeURIComponent(link)}`,
      supported: true,
    },
    {
      icon: wechat,
      name: "WeChat",
      supported: false,
    },
  ];

  const shareOnSocialMedia = (platformName) => {
    const platform = sharingPlatform.find((item) => item.name === platformName);
    if (!platform) return;
    if (!platform.supported) {
      alert("Sharing is not supported via web for this platform.");
      return;
    }
    if (authenticated && userId) {
      dispatchToRedux(saveSharingDetails({ userId, videoId, token }));
    }
    const shareUrl = platform.url(videoUrl);
    window.open(shareUrl, "_blank");
  };

  const handleCopy = () => {
    copyToClipboard(videoUrl);
    if (authenticated && userId) {
      dispatchToRedux(saveSharingDetails({ userId, videoId, token }));
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: { xs: "10px", sm: "15px", md: "20px" },
          borderRadius: "8px",
          width: {
            xs: "90%",
            sm: "80%",
            md: "70%",
            lg: "50%",
            xl: "40%",
          },
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 600,
            marginBottom: "1rem",
            textAlign: "center",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
          }}
        >
          {isProfile ? "Share Profile" : " Share Video"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: { xs: 1, sm: 0 },
            marginBottom: "1rem",
          }}
        >
          <TextField
            fullWidth
            label="Video Link"
            value={videoUrl}
            InputProps={{
              readOnly: true,
              sx: {
                height: "45px",
              },
            }}
            sx={{
              width: { xs: "100%", sm: "calc(100% - 120px)" },
            }}
          />
          <Button
            sx={{
              fontFamily: "Poppins, sans-serif",
              background: "linear-gradient(to right, #720361, #bf2f75)",
              color: "white",
              padding: "0.5rem 1.5rem",
              borderRadius: "0.5rem",
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                background: "linear-gradient(to right, #720361, #bf2f75)",
              },
            }}
            onClick={handleCopy}
          >
            {copySuccess ? "Copied!" : "Copy"}
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: { xs: "4px", sm: "8px" },
            marginBottom: "1rem",
          }}
        >
          {sharingPlatform.map((platform, index) => (
            <Button
              key={index}
              onClick={() => shareOnSocialMedia(platform.name)}
              sx={{
                minWidth: "auto",
                padding: { xs: "4px", sm: "5px" },
                cursor: "pointer",
              }}
            >
              <img
                src={platform.icon}
                alt={platform.name}
                width={35}
                height={35}
                style={{
                  width: { xs: "30px", sm: "35px" },
                  height: { xs: "30px", sm: "35px" },
                }}
              />
            </Button>
          ))}
        </Box>
        <Box sx={{ textAlign: "right", cursor: "pointer" }}>
          <Button
            onClick={handleClose}
            sx={{
              fontFamily: "Poppins, sans-serif",
              background: "linear-gradient(to right, #720361, #bf2f75)",
              color: "white",
              padding: "0.5rem 1.5rem",
              borderRadius: "0.5rem",
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                background: "linear-gradient(to right, #720361, #bf2f75)",
              },
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SharingVideoModal;
