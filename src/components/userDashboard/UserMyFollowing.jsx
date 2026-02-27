import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectToken } from "../../redux/slices/authSlice.js";
import {
  getDashboardFollowing,
  selectDashboardFollowing,
} from "../../redux/slices/dashboardActivitySlice.js";
import { toggleFollow } from "../../redux/slices/followerSlice.js";
import { notify } from "../../redux/slices/alertSlice.js";
import NewMessagePanel from "../messages/NewMessagePanel.jsx";
import { fonts } from "../../utility/fonts.js";

/** Role label for display (Figma: "Career Counsellors" for counsellor, etc.) */
function getRoleLabel(role) {
  if (role === "Counsellor") return "Career Counsellors";
  return role || "User";
}

/** Profile URL: user/counsellor -> /profile/:id; org could use slug if API adds it later */
function getProfileUrl(item) {
  if (!item?.id) return null;
  if (item.slug && (item.role === "ESP" || item.role === "EI")) {
    return item.role === "EI" ? `/org-hei/${item.slug}` : `/org-esp/${item.slug}`;
  }
  return `/profile/${item.id}`;
}

/** Card styles matching Figma 891-214766 */
const cardSx = {
  borderRadius: "15px",
  boxShadow: "0px 6px 9px 0px rgba(0,0,0,0.1)",
  backgroundColor: "#fff",
  p: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "13px",
  alignItems: "stretch",
  width: "100%",
};
const avatarSx = {
  width: 80,
  height: 80,
  borderRadius: "8px",
  bgcolor: "#eee",
  fontFamily: fonts.poppins,
  fontWeight: 600,
  fontSize: "1.5rem",
};
const nameSx = {
  fontFamily: fonts.poppins,
  fontWeight: 600,
  fontSize: "16px",
  color: "#000",
  lineHeight: "normal",
};
const roleSx = {
  fontFamily: fonts.poppins,
  fontWeight: 400,
  fontSize: "12px",
  color: "rgba(0,0,0,0.5)",
  lineHeight: "normal",
};
const messageBtnSx = {
  flex: 1,
  borderRadius: "99px",
  textTransform: "none",
  fontFamily: fonts.poppins,
  fontWeight: 600,
  fontSize: "13px",
  px: 2,
  py: "10px",
  background: "linear-gradient(to bottom, #bf2f75, #720361)",
  color: "#fff",
  boxShadow: "none",
  "&:hover": {
    opacity: 0.92,
    boxShadow: "none",
    background: "linear-gradient(to bottom, #bf2f75, #720361)",
  },
};
const unfollowBtnSx = {
  flex: 1,
  borderRadius: "99px",
  textTransform: "none",
  fontFamily: fonts.poppins,
  fontWeight: 600,
  fontSize: "13px",
  px: 2,
  py: "10px",
  backgroundColor: "#fff",
  border: "1px solid #d1d5dc",
  color: "#666",
  "&:hover": {
    borderColor: "#d1d5dc",
    backgroundColor: "#f9fafb",
  },
};

const UserMyFollowing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const { items, total, loading, error } = useSelector(selectDashboardFollowing);
  const [messageItem, setMessageItem] = useState(null);
  const [unfollowLoadingId, setUnfollowLoadingId] = useState(null);

  useEffect(() => {
    if (!token) return;
    dispatch(getDashboardFollowing({ token }));
  }, [token, dispatch]);

  const handleCardClick = (item) => (e) => {
    if (e.target.closest('button')) return;
    const url = getProfileUrl(item);
    if (url) navigate(url);
  };

  const handleMessage = (e, item) => {
    e.stopPropagation();
    setMessageItem(item);
  };

  const handleMessageClose = () => {
    setMessageItem(null);
  };

  const handleUnfollow = async (e, item) => {
    e.stopPropagation();
    if (!token || unfollowLoadingId) return;
    setUnfollowLoadingId(item.id);
    const result = await dispatch(toggleFollow({ targetUserId: item.id, token }));
    setUnfollowLoadingId(null);
    if (toggleFollow.fulfilled.match(result)) {
      dispatch(notify({ message: "Unfollowed successfully", type: "success" }));
      dispatch(getDashboardFollowing({ token }));
    } else {
      dispatch(
        notify({
          message: result.payload?.error || "Failed to unfollow",
          type: "error",
        })
      );
    }
  };

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 3 } }}>
      <Typography
        variant="h5"
        sx={{
          fontFamily: fonts.poppins,
          fontWeight: 700,
          mb: 2,
          fontSize: { xs: "1.25rem", md: "1.5rem" },
        }}
      >
        My Following
      </Typography>

      <Card
        sx={{
          borderRadius: "10px",
          boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 200,
                py: 4,
              }}
            >
              <CircularProgress size={32} sx={{ color: "#BC2876" }} />
            </Box>
          ) : error ? (
            <Typography
              sx={{
                fontFamily: fonts.poppins,
                color: "#666",
                textAlign: "center",
                py: 3,
              }}
            >
              {error}
            </Typography>
          ) : items.length === 0 ? (
            <Typography
              sx={{
                fontFamily: fonts.poppins,
                color: "#666",
                fontWeight: 500,
                textAlign: "center",
                py: 4,
              }}
            >
              You are not following anyone yet.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              {items.map((item) => {
                const url = getProfileUrl(item);
                const isClickable = Boolean(url);
                const isUnfollowLoading = unfollowLoadingId === item.id;
                return (
                  <Box
                    key={item.id}
                    onClick={isClickable ? handleCardClick(item) : undefined}
                    sx={{
                      ...cardSx,
                      cursor: isClickable ? "pointer" : "default",
                      "&:hover": isClickable
                        ? { backgroundColor: "rgba(0,0,0,0.02)" }
                        : {},
                    }}
                  >
                    {/* Top row: avatar + name/role */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: "13px",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Avatar
                        src={item.profileImage}
                        sx={avatarSx}
                      >
                        {!item.profileImage && item.name
                          ? item.name.charAt(0).toUpperCase()
                          : null}
                      </Avatar>
                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={nameSx} noWrap>
                          {item.name || "—"}
                        </Typography>
                        <Typography sx={roleSx}>
                          {getRoleLabel(item.role)}
                        </Typography>
                      </Box>
                    </Box>
                    {/* Buttons row */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "flex-start",
                        width: "100%",
                      }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<MessageIcon sx={{ fontSize: 16 }} />}
                        sx={messageBtnSx}
                        onClick={(e) => handleMessage(e, item)}
                        disableElevation
                      >
                        Message
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={
                          isUnfollowLoading ? (
                            <CircularProgress size={14} color="inherit" />
                          ) : (
                            <PersonRemoveIcon sx={{ fontSize: 16 }} />
                          )
                        }
                        sx={unfollowBtnSx}
                        onClick={(e) => handleUnfollow(e, item)}
                        disabled={isUnfollowLoading}
                      >
                        Unfollow
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* New Message modal – email prefilled when backend provides item.email */}
      <Dialog
        open={Boolean(messageItem)}
        onClose={handleMessageClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}
      >
        <DialogTitle
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#101828",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #EAECF0",
            py: 2,
          }}
        >
          New message
          <IconButton
            onClick={handleMessageClose}
            size="small"
            aria-label="Close"
            sx={{ ml: 1 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <NewMessagePanel
            defaultToEmail={messageItem?.email || ""}
            defaultDisplayName={messageItem?.name}
            disableToField={Boolean(messageItem?.email)}
            onSuccess={handleMessageClose}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserMyFollowing;
