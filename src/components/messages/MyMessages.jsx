import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { fonts } from "../../utility/fonts";
import {
  sendMessage,
  fetchRecipientSuggestions,
  fetchReceivedMessages,
  fetchSentMessages,
  selectSendLoading,
  selectRecipientSuggestions,
  selectSuggestionsLoading,
  selectReceivedMessages,
  selectSentMessages,
  selectReceivedLoading,
  selectSentLoading,
  selectReceivedError,
  selectSentError,
  clearSendError,
  clearRecipientSuggestions,
} from "../../redux/slices/messageSlice";
import { selectToken } from "../../redux/slices/authSlice";
import { notify } from "../../redux/slices/alertSlice";

const TITLE_MAX = 200;
const BODY_MAX = 4000;
const SUGGEST_DEBOUNCE_MS = 300;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value) {
  return typeof value === "string" && EMAIL_REGEX.test(value.trim());
}

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
        {/* <Box sx={{ display: "flex", gap: 5 }}> */}
        {/* <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontSize: "14px",
              color: "#667085",
            }}
          >
            From: <br />
            <span
              style={{
                fontWeight: 600,
                color: "#101828",
                fontFamily: fonts.poppins,
              }}
            >
              {fromValue}
            </span>
          </Typography> */}
        <Typography
          sx={{
            fontFamily: fonts.poppins,
            fontSize: "14px",
            color: "#667085",
          }}
        >
          To:
          <span
            style={{
              fontWeight: 600,
              color: "#545454",
              fontFamily: fonts.poppins,
            }}
          >
            {" "}
            {toValue}
          </span>
        </Typography>
        {/* </Box> */}
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
  const sendLoading = useSelector(selectSendLoading);
  const recipientSuggestions = useSelector(selectRecipientSuggestions);
  const suggestionsLoading = useSelector(selectSuggestionsLoading);
  const receivedMessages = useSelector(selectReceivedMessages);
  const sentMessages = useSelector(selectSentMessages);
  const receivedLoading = useSelector(selectReceivedLoading);
  const sentLoading = useSelector(selectSentLoading);
  const receivedError = useSelector(selectReceivedError);
  const sentError = useSelector(selectSentError);

  const [tab, setTab] = useState("sent");
  const [toInputValue, setToInputValue] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [newMessageTitle, setNewMessageTitle] = useState("");
  const [newMessageBody, setNewMessageBody] = useState("");
  const [fieldError, setFieldError] = useState(null);

  const toEmail = selectedRecipient
    ? selectedRecipient.email
    : isValidEmail(toInputValue)
      ? toInputValue.trim()
      : "";

  useEffect(() => {
    return () => {
      dispatch(clearSendError());
      dispatch(clearRecipientSuggestions());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!token) return;
    if (tab === "received") {
      dispatch(fetchReceivedMessages({ token, page: 1, limit: 20 }));
    } else {
      dispatch(fetchSentMessages({ token, page: 1, limit: 20 }));
    }
  }, [dispatch, token, tab]);

  const fetchSuggestions = useCallback(() => {
    const q = toInputValue.trim();
    if (q.length >= 2 && token) {
      dispatch(fetchRecipientSuggestions({ token, q, limit: 10 }));
    } else {
      dispatch(clearRecipientSuggestions());
    }
  }, [dispatch, token, toInputValue]);

  useEffect(() => {
    const timer = setTimeout(fetchSuggestions, SUGGEST_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [fetchSuggestions]);

  const handleTabChange = (event, newTab) => {
    if (newTab !== null) setTab(newTab);
  };

  const titleLen = newMessageTitle.length;
  const bodyLen = newMessageBody.length;
  const titleValid = newMessageTitle.trim().length > 0 && titleLen <= TITLE_MAX;
  const bodyValid = newMessageBody.trim().length > 0 && bodyLen <= BODY_MAX;
  const formValid = !!toEmail && titleValid && bodyValid;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setFieldError(null);
    if (!token || !formValid || !toEmail) return;

    const payload = {
      token,
      toEmail,
      title: newMessageTitle.trim(),
      body: newMessageBody.trim(),
    };

    const result = await dispatch(sendMessage(payload));
    if (sendMessage.fulfilled.match(result)) {
      dispatch(
        notify({ message: "Message sent successfully.", type: "success" }),
      );
      setToInputValue("");
      setSelectedRecipient(null);
      setNewMessageTitle("");
      setNewMessageBody("");
      dispatch(clearRecipientSuggestions());
      setTab("sent");
      if (token) dispatch(fetchSentMessages({ token, page: 1, limit: 20 }));
    } else {
      const err =
        result.payload?.error ||
        result.error?.message ||
        "Failed to send message";
      const field = result.payload?.field;
      dispatch(notify({ message: err, type: "error" }));
      if (field) setFieldError({ field, message: err });
    }
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
        <Paper
          component="form"
          onSubmit={handleSendMessage}
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "20px",
            backgroundColor: "#fff",
            boxShadow: "0px 6px 24px 0px rgba(0,0,0,0.05)",
            border: "1px solid #EAECF0",
            position: { md: "sticky" },
            top: 24,
          }}
        >
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: "20px",
              color: "#101828",
              mb: 3,
            }}
          >
            New Message
          </Typography>

          <Autocomplete
            freeSolo
            options={recipientSuggestions}
            value={selectedRecipient}
            inputValue={toInputValue}
            onInputChange={(e, v, reason) => {
              setToInputValue(v);
              if (reason === "input") setSelectedRecipient(null);
              setFieldError(null);
            }}
            onChange={(e, v) => {
              setSelectedRecipient(
                v && typeof v === "object" && v.email ? v : null,
              );
              setFieldError(null);
            }}
            getOptionLabel={(option) =>
              option && typeof option === "object" && option.displayName != null
                ? `${option.displayName} (${option.email})`
                : String(option || "")
            }
            loading={suggestionsLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="To"
                placeholder="Type name or email (min 2 characters)"
                error={fieldError?.field === "toEmail"}
                helperText={
                  fieldError?.field === "toEmail"
                    ? fieldError.message
                    : "Search by name or email; select a suggestion or enter a valid email"
                }
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#F9FAFB",
                    "& fieldset": { borderColor: "#EAECF0" },
                    "&:hover fieldset": { borderColor: "#D0D5DD" },
                    "&.Mui-focused fieldset": { borderColor: "#BC2876" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#BC2876" },
                  "& .MuiInputBase-input": {
                    fontFamily: fonts.sans,
                    fontSize: "14px",
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.email}>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: "14px" }}>
                  {option.displayName} ({option.email})
                </Typography>
              </li>
            )}
          />

          <TextField
            fullWidth
            label="Title"
            placeholder="Message title (max 200 characters)"
            value={newMessageTitle}
            onChange={(e) => {
              setNewMessageTitle(e.target.value.slice(0, TITLE_MAX));
              setFieldError(null);
            }}
            error={fieldError?.field === "title" || titleLen > TITLE_MAX}
            helperText={
              fieldError?.field === "title"
                ? fieldError.message
                : `${titleLen}/${TITLE_MAX}`
            }
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#F9FAFB",
                "& fieldset": { borderColor: "#EAECF0" },
                "&:hover fieldset": { borderColor: "#D0D5DD" },
                "&.Mui-focused fieldset": { borderColor: "#BC2876" },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#BC2876" },
              "& .MuiInputBase-input": {
                fontFamily: fonts.sans,
                fontSize: "14px",
              },
            }}
          />

          <TextField
            fullWidth
            label="Message"
            placeholder="Type your message here... (max 4000 characters)"
            multiline
            rows={5}
            value={newMessageBody}
            onChange={(e) => {
              setNewMessageBody(e.target.value.slice(0, BODY_MAX));
              setFieldError(null);
            }}
            error={fieldError?.field === "body" || bodyLen > BODY_MAX}
            helperText={
              fieldError?.field === "body"
                ? fieldError.message
                : `${bodyLen}/${BODY_MAX}`
            }
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#F9FAFB",
                "& fieldset": { borderColor: "#EAECF0" },
                "&:hover fieldset": { borderColor: "#D0D5DD" },
                "&.Mui-focused fieldset": { borderColor: "#BC2876" },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#BC2876" },
              "& .MuiInputBase-input": {
                fontFamily: fonts.sans,
                fontSize: "14px",
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!formValid || sendLoading}
            sx={{
              borderRadius: "12px",
              py: 1.5,
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: "16px",
              textTransform: "none",
              background:
                "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
              "&:hover": { opacity: 0.9 },
              "&.Mui-disabled": {
                background: "#EAECF0",
                color: "#98A2B3",
              },
            }}
          >
            {sendLoading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Send Message"
            )}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default MyMessages;
