import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { fonts } from "../../utility/fonts";
import {
  fetchReceivedMessages,
  fetchSentMessages,
  selectReceivedMessages,
  selectSentMessages,
  selectReceivedLoading,
  selectSentLoading,
  selectReceivedError,
  selectSentError,
} from "../../redux/slices/messageSlice";
import { selectToken } from "../../redux/slices/authSlice";
import NewMessagePanel from "./NewMessagePanel";

const BODY_SNIPPET_LEN = 120;

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const MessageCard = ({ message, tab }) => {
  const isSent = tab === "sent";
  const fromValue = message.fromDisplayName ?? "—";
  const toValue = message.toDisplayName ?? "—";
  const bodySnippet =
    message.bodySnippet ??
    (message.body ? String(message.body).slice(0, BODY_SNIPPET_LEN) : "");

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: "12px",
        backgroundColor: "#fff",
        boxShadow: "5px 6px 6px 0px rgba(0,0,0,0.10)",
        border: "1px solid #EAECF0",
        mb: 2,
        cursor: "pointer",
        "&:hover": {
          borderColor: "#BC2876",
          boxShadow: "0px 6px 24px 0px rgba(188, 39, 118, 0.08)",
        },
      }}
    >
      <Typography
        sx={{
          fontFamily: fonts.poppins,
          fontWeight: 600,
          fontSize: "16px",
          color: "#101828",
          mb: 1,
        }}
      >
        {message.title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 0.5,
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0, 0, 0, 0.11)",
          borderTop: "1px solid rgba(0, 0, 0, 0.11)",
        }}
      >
        {tab === "received" && (
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontSize: "14px",
              color: "#667085",
            }}
          >
            From:{" "}
            <span
              style={{
                fontWeight: 600,
                color: "#101828",
                fontFamily: fonts.poppins,
              }}
            >
              {fromValue}
            </span>
          </Typography>
        )}
        {tab === "sent" && (
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontSize: "14px",
              color: "#667085",
            }}
          >
            To:{" "}
            <span
              style={{
                fontWeight: 600,
                color: "#545454",
                fontFamily: fonts.poppins,
              }}
            >
              {toValue}
            </span>
          </Typography>
        )}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1, my: 2 }}
        >
          <CalendarTodayIcon sx={{ fontSize: 16, color: "#BC2876" }} />
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontSize: "14px",
              color: "#667085",
            }}
          >
            {formatDate(message.createdAt)}
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{
          fontFamily: fonts.poppins,
          fontSize: "14px",
          color: "#777777",
          lineHeight: 1.5,
          mt: 2,
          //   display: "-webkit-box",
          //   WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          //   overflow: "hidden",
        }}
      >
        {message.body}
      </Typography>
    </Paper>
  );
};

const MyMessages = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const receivedMessages = useSelector(selectReceivedMessages);
  const sentMessages = useSelector(selectSentMessages);
  const receivedLoading = useSelector(selectReceivedLoading);
  const sentLoading = useSelector(selectSentLoading);
  const receivedError = useSelector(selectReceivedError);
  const sentError = useSelector(selectSentError);

  const [tab, setTab] = useState("sent");

  useEffect(() => {
    if (!token) return;
    if (tab === "received") {
      dispatch(fetchReceivedMessages({ token, page: 1, limit: 20 }));
    } else {
      dispatch(fetchSentMessages({ token, page: 1, limit: 20 }));
    }
  }, [dispatch, token, tab]);

  const handleTabChange = (event, newTab) => {
    if (newTab !== null) setTab(newTab);
  };

  const handleMessageSent = () => {
    setTab("sent");
    if (token) dispatch(fetchSentMessages({ token, page: 1, limit: 20 }));
  };

  const listLoading = tab === "received" ? receivedLoading : sentLoading;
  const listError = tab === "received" ? receivedError : sentError;
  const rawList = tab === "received" ? receivedMessages : sentMessages;
  const messageList = rawList.map((m) => ({
    ...m,
    id: m._id,
    fromDisplayName: tab === "received" ? (m.fromDisplayName ?? "—") : "You",
    toDisplayName: tab === "sent" ? (m.toDisplayName ?? "—") : "You",
    bodySnippet: m.body ? String(m.body).slice(0, BODY_SNIPPET_LEN) : "",
  }));

  return (
    <Box sx={{ p: 4, minHeight: "100%" }}>
      {/* Header: title + toggle */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: "26px",
            color: "#000",
          }}
        >
          Messages
        </Typography>

        <ToggleButtonGroup
          value={tab}
          exclusive
          onChange={handleTabChange}
          aria-label="message tabs"
          sx={{
            backgroundColor: "#F0F0F0",
            borderRadius: "90px",
            padding: "4px",
            border: "1px solid rgba(255,255,255,0.8)",
            boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.06)",
            gap: 0,
            "& .MuiToggleButtonGroup-grouped": {
              border: "none",
              margin: 0,
              padding: 0,
              borderRadius: 0,
              px: 3,
              py: 1.25,
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: "14px",
              textTransform: "uppercase",
              minHeight: 44,
              "&:not(:first-of-type)": {
                marginLeft: 0,
              },
            },
            "& .MuiToggleButton-root": {
              backgroundColor: "#fff",
              color: "#333333",
              border: "1px solid #E0E0E0",
              margin: 0,
              "&:first-of-type": {
                borderTopLeftRadius: "90px",
                borderBottomLeftRadius: "90px",
                borderRight: "none",
                marginRight: 0,
              },
              "&:last-of-type": {
                borderTopRightRadius: "90px",
                borderBottomRightRadius: "90px",
                borderLeft: "none",
                marginLeft: 0,
              },
              "&:hover": {
                backgroundColor: "#fff",
              },
              "&.Mui-selected": {
                backgroundColor: "#FF9900",
                color: "#fff",
                borderColor: "#FF9900",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.12)",
                "&:hover": {
                  backgroundColor: "#E68A00",
                  borderColor: "#E68A00",
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.12)",
                },
              },
            },
          }}
        >
          <ToggleButton value="sent">Sent</ToggleButton>
          <ToggleButton value="received">Received</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Two-column layout: message list (left) + New Message panel (right) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 380px" },
          gap: 4,
          alignItems: "start",
        }}
      >
        {/* Message list */}
        <Box
          sx={{
            minHeight: 400,
            overflowY: "auto",
            pr: { md: 1 },
          }}
        >
          {listLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress sx={{ color: "#BC2876" }} />
            </Box>
          ) : listError ? (
            <Typography
              sx={{
                fontFamily: fonts.sans,
                color: "#667085",
                py: 4,
                textAlign: "center",
              }}
            >
              {listError}
            </Typography>
          ) : messageList.length === 0 ? (
            <Typography
              sx={{
                fontFamily: fonts.sans,
                color: "#667085",
                py: 4,
                textAlign: "center",
              }}
            >
              {tab === "sent"
                ? "No sent messages yet."
                : "No received messages."}
            </Typography>
          ) : (
            messageList.map((msg) => (
              <MessageCard key={msg.id || msg._id} message={msg} tab={tab} />
            ))
          )}
        </Box>

        {/* New Message panel */}
        <NewMessagePanel onSuccess={handleMessageSent} />
      </Box>
    </Box>
  );
};

export default MyMessages;
