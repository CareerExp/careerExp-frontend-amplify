import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { fonts } from "../../utility/fonts";
import { counsellorsDataEsp } from "../../utility/counsellorDataEsp";
import InviteCounsellorModal from "../../models/InviteCounsellorModal";
import {
  sendInvitation,
  getOrganizationCounsellors,
  selectOrganizationCounsellors,
  selectOrganizationLoading,
} from "../../redux/slices/organizationSlice";
import { selectToken } from "../../redux/slices/authSlice";
import { notify } from "../../redux/slices/alertSlice";
import { CircularProgress } from "@mui/material";
import CounsellorDetail from "./CounsellorDetail";

const InvitedCard = ({ counsellor, onClick }) => {
  const creator = counsellor.creatorUserId || {};
  const name = creator.firstName
    ? `${creator.firstName} ${creator.lastName}`
    : counsellor.name || creator.email || "Unknown Counselor";
  const invitedDate = counsellor.invitedAt
    ? new Date(counsellor.invitedAt).toLocaleDateString()
    : counsellor.invitation?.invitedOn || "N/A";

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: "15px",
        borderRadius: "15px",
        backgroundColor: "#fff",
        boxShadow: "0px 6px 9px 0px rgba(0,0,0,0.1)",
        display: "flex",
        gap: "13px",
        width: "100%",
        maxWidth: "518px",
        minHeight: "190px",
        cursor: "pointer",
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          width: "160px",
          height: "160px",
          borderRadius: "8px",
          border: "2px solid rgba(191, 47, 117, 0.3)",
          background:
            "linear-gradient(135deg, rgba(191, 47, 117, 0.1) 0%, rgba(114, 3, 97, 0.1) 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PersonAddIcon sx={{ color: "#BF2F75", fontSize: "24px" }} />
        </Box>
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 500,
            fontSize: "12px",
            color: "#BF2F75",
            textAlign: "center",
          }}
        >
          Invitation Sent
        </Typography>
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: "16px",
                color: "#000",
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "200px",
              }}
            >
              {name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  backgroundColor: "rgba(255, 138, 0, 0.1)",
                  borderRadius: "90px",
                  px: 1.5,
                  py: 0.3,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "12px",
                    color: "#ff8a00",
                  }}
                >
                  Invited
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: "#D9D9D9",
                }}
              />
              <Box
                sx={{
                  backgroundColor: "#fff4e6",
                  borderRadius: "90px",
                  px: 1.2,
                  py: 0.3,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <AccessTimeIcon sx={{ color: "#ff8a00", fontSize: "12px" }} />
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 500,
                    fontSize: "11px",
                    color: "#ff8a00",
                  }}
                >
                  Pending
                </Typography>
              </Box>
            </Box>
          </Box>
          <IconButton size="small" sx={{ mt: -0.5, mr: -0.5 }}>
            <MoreVertIcon sx={{ color: "rgba(0,0,0,0.5)" }} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MailOutlineIcon sx={{ color: "#bc2876", fontSize: "16px" }} />
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "13px",
              fontWeight: 500,
              color: "#bc2876",
            }}
          >
            Invited on:{" "}
            <span style={{ fontWeight: 400, color: "rgba(0,0,0,0.5)" }}>
              {invitedDate}
            </span>
          </Typography>
        </Box>

        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontSize: "13px",
            color: "rgba(0,0,0,0.5)",
            lineHeight: 1.4,
          }}
        >
          {counsellor.message || "Invitation message pending..."}
        </Typography>
      </Box>
    </Paper>
  );
};

const AcceptedCard = ({ counsellor, onClick }) => {
  const creator = counsellor.creatorUserId || {};
  const name = creator.firstName
    ? `${creator.firstName} ${creator.lastName}`
    : counsellor.name || "Active Counselor";
  const joinedDate = counsellor.joinedAt
    ? new Date(counsellor.joinedAt).toLocaleDateString()
    : counsellor.joinedOn || "N/A";

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: "15px",
        borderRadius: "15px",
        backgroundColor: "#fff",
        boxShadow: "0px 6px 9px 0px rgba(0,0,0,0.1)",
        display: "flex",
        gap: "13px",
        width: "100%",
        maxWidth: "518px",
        alignItems: "flex-start",
        minHeight: "190px",
        cursor: "pointer",
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          width: "159px",
          height: "160px",
          borderRadius: "8px",
          backgroundColor: "#f0f0f0",
          flexShrink: 0,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {creator.profilePicture ? (
          <Box
            component="img"
            src={creator.profilePicture}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Typography sx={{ color: "#999", fontSize: "12px" }}>
            No Image
          </Typography>
        )}
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: "16px",
                color: "#000",
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "200px",
              }}
            >
              {name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: "12px",
                  color: "#9e9e9e",
                }}
              >
                {creator.specialization || counsellor.role || "Counsellor"}
              </Typography>
              {counsellor.isAdmin && (
                <>
                  <Box
                    sx={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      backgroundColor: "#D9D9D9",
                    }}
                  />
                  <Box
                    sx={{
                      backgroundColor: "rgba(188, 40, 118, 0.1)",
                      borderRadius: "90px",
                      px: 1,
                      py: 0.3,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: fonts.sans,
                        fontSize: "12px",
                        color: "#bc2876",
                      }}
                    >
                      Admin
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>
          {/* <IconButton size="small" sx={{ mt: -0.5, mr: -0.5 }}>
                        <MoreVertIcon sx={{ color: 'rgba(0,0,0,0.5)' }} />
                    </IconButton> */}
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <LocationOnIcon
            sx={{ color: "rgba(0,0,0,0.5)", fontSize: "18px", mt: 0.2 }}
          />
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "13px",
              color: "rgba(0,0,0,0.5)",
              lineHeight: 1.3,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {creator.country ||
              creator.address ||
              counsellor.address ||
              "Location not provided"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "13px",
              color: "rgba(0,0,0,0.5)",
            }}
          >
            <span style={{ fontWeight: 500, color: "#bc2876" }}>Joined :</span>{" "}
            {joinedDate}
          </Typography>
        </Box>

        {/* Stats Section */}
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "space-between",
            px: 1,
            py: 1,
            border: "1px solid rgba(255,255,255,0.1)",
            width: "100%",
          }}
        >
          {[
            { label: "Videos", value: counsellor.stats?.videos || 0 },
            { label: "Podcasts", value: counsellor.stats?.podcasts || 0 },
            { label: "Articles", value: counsellor.stats?.articles || 0 },
            { label: "Followers", value: counsellor.stats?.followers || 0 },
          ].map((stat, idx) => (
            <React.Fragment key={stat.label}>
              <Box sx={{ textAlign: "center", flexGrow: 1 }}>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 600,
                    fontSize: "18px",
                    color: "#bc2876",
                    lineHeight: 1,
                  }}
                >
                  {String(stat.value).padStart(2, "0")}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 500,
                    fontSize: "11px",
                    color: "#9e9e9e",
                    mt: 0.5,
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
              {idx < 3 && (
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    borderColor: "rgba(0,0,0,0.1)",
                    height: "40px",
                    alignSelf: "center",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

const OrgMyCounsellors = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const counsellors = useSelector(selectOrganizationCounsellors);
  const isLoading = useSelector(selectOrganizationLoading);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        dispatch(getOrganizationCounsellors({ token, search: searchQuery }));
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [dispatch, token, searchQuery]);

  const handleOpenInviteModal = () => setIsInviteModalOpen(true);
  const handleCloseInviteModal = () => setIsInviteModalOpen(false);

  const handleInviteCounsellor = async (formData) => {
    if (!token) {
      dispatch(
        notify({
          message: "You must be logged in to send invitations",
          type: "error",
        }),
      );
      return;
    }

    try {
      const resultAction = await dispatch(
        sendInvitation({ inviteData: formData, token }),
      );
      if (sendInvitation.fulfilled.match(resultAction)) {
        dispatch(
          notify({ message: "Invitation sent successfully!", type: "success" }),
        );
        // Refresh the list to show the newly invited counselor
        dispatch(getOrganizationCounsellors({ token }));
        handleCloseInviteModal();
      } else {
        const errorMsg =
          resultAction.payload?.error || "Failed to send invitation";
        dispatch(notify({ message: errorMsg, type: "error" }));
        throw new Error(errorMsg); // Propagate to modal's catch
      }
    } catch (error) {
      console.error("Invite Error:", error);
      throw error; // Rethrow so modal can handle loading state
    }
  };

  if (selectedCounsellor) {
    return (
      <CounsellorDetail
        counsellor={selectedCounsellor}
        onBack={() => setSelectedCounsellor(null)}
      />
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: "26px",
            color: "#000",
            flexGrow: 1,
          }}
        >
          My Counsellors
        </Typography>

        <TextField
          placeholder="Search Counsellors"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: "379px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "90px",
              backgroundColor: "#fff",
              px: 2,
              boxShadow: "0px 7px 6px 0px rgba(0,0,0,0.03)",
              "& fieldset": { borderColor: "rgba(0,0,0,0.16)" },
            },
            "& .MuiInputBase-input": {
              fontFamily: fonts.sans,
              fontSize: "16px",
              color: "#787876",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {searchQuery && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery("")}
                    sx={{ mr: 0.5, color: "rgba(0,0,0,0.4)", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
                    aria-label="Clear search"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
                <SearchIcon sx={{ color: "rgba(0,0,0,0.4)" }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenInviteModal}
          sx={{
            height: "48px",
            borderRadius: "90px",
            px: 3,
            background:
              "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: "16px",
            textTransform: "none",
            "&:hover": { opacity: 0.9 },
          }}
        >
          Add Counsellors
        </Button>
      </Box>

      {/* Cards Grid */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#BC2876" }} />
        </Box>
      ) : counsellors.length > 0 ? (
        <Grid container spacing={2.25}>
          {counsellors.map((counsellor) => (
            <Grid
              item
              key={counsellor._id || counsellor.id}
              xs={12}
              lg={6}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {counsellor.status === "INVITED" ||
              counsellor.inviteStatus === "sent" ? (
                <InvitedCard
                  counsellor={counsellor}
                  onClick={() => setSelectedCounsellor(counsellor)}
                />
              ) : (
                <AcceptedCard
                  counsellor={counsellor}
                  onClick={() => setSelectedCounsellor(counsellor)}
                />
              )}
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography
            sx={{ fontFamily: fonts.sans, fontSize: "18px", color: "#787876" }}
          >
            No counsellor available
          </Typography>
        </Box>
      )}

      {/* Invite Modal */}
      <InviteCounsellorModal
        open={isInviteModalOpen}
        onClose={handleCloseInviteModal}
        onInvite={handleInviteCounsellor}
      />
    </Box>
  );
};

export default OrgMyCounsellors;
