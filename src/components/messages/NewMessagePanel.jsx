import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  TextField,
  Button,
  CircularProgress,
  Autocomplete,
  Typography,
} from "@mui/material";
import { fonts } from "../../utility/fonts";
import {
  sendMessage,
  fetchRecipientSuggestions,
  selectSendLoading,
  selectRecipientSuggestions,
  selectSuggestionsLoading,
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

/**
 * Reusable New Message form panel.
 * Props:
 *   defaultToEmail?: string — pre-fill To with this email (e.g. course provider)
 *   defaultDisplayName?: string — display name for the pre-filled recipient
 *   disableToField?: boolean — when true, To field is read-only (e.g. when opened from followers)
 *   onSuccess?: () => void — called after message is sent successfully
 */
const NewMessagePanel = ({
  defaultToEmail,
  defaultDisplayName,
  disableToField = false,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const sendLoading = useSelector(selectSendLoading);
  const recipientSuggestions = useSelector(selectRecipientSuggestions);
  const suggestionsLoading = useSelector(selectSuggestionsLoading);

  const [toInputValue, setToInputValue] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [newMessageTitle, setNewMessageTitle] = useState("");
  const [newMessageBody, setNewMessageBody] = useState("");
  const [fieldError, setFieldError] = useState(null);

  useEffect(() => {
    if (defaultToEmail && defaultToEmail.trim()) {
      const email = defaultToEmail.trim();
      const displayName = defaultDisplayName?.trim() || email;
      setSelectedRecipient({ email, displayName });
      setToInputValue(`${displayName} (${email})`);
    }
  }, [defaultToEmail, defaultDisplayName]);

  useEffect(() => {
    return () => {
      dispatch(clearSendError());
      dispatch(clearRecipientSuggestions());
    };
  }, [dispatch]);

  const toEmail = selectedRecipient
    ? selectedRecipient.email
    : isValidEmail(toInputValue)
      ? toInputValue.trim()
      : "";

  const fetchSuggestions = useCallback(() => {
    if (disableToField) return;
    const q = toInputValue.trim();
    if (q.length >= 2 && token) {
      dispatch(fetchRecipientSuggestions({ token, q, limit: 10 }));
    } else {
      dispatch(clearRecipientSuggestions());
    }
  }, [dispatch, token, toInputValue, disableToField]);

  useEffect(() => {
    const timer = setTimeout(fetchSuggestions, SUGGEST_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [fetchSuggestions]);

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
      dispatch(notify({ message: "Message sent successfully.", type: "success" }));
      setToInputValue(defaultToEmail?.trim() ? `${defaultDisplayName?.trim() || defaultToEmail} (${defaultToEmail.trim()})` : "");
      setSelectedRecipient(
        defaultToEmail?.trim()
          ? { email: defaultToEmail.trim(), displayName: defaultDisplayName?.trim() || defaultToEmail.trim() }
          : null
      );
      setNewMessageTitle("");
      setNewMessageBody("");
      dispatch(clearRecipientSuggestions());
      onSuccess?.();
    } else {
      const err = result.payload?.error || result.error?.message || "Failed to send message";
      const field = result.payload?.field;
      dispatch(notify({ message: err, type: "error" }));
      if (field) setFieldError({ field, message: err });
    }
  };

  const inputSx = {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#F9FAFB",
      "& fieldset": { borderColor: "#EAECF0" },
      "&:hover fieldset": { borderColor: "#D0D5DD" },
      "&.Mui-focused fieldset": { borderColor: "#BC2876" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#BC2876" },
    "& .MuiInputBase-input": { fontFamily: fonts.sans, fontSize: "14px" },
  };

  return (
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

      {disableToField ? (
        <TextField
          fullWidth
          label="To"
          value={toInputValue}
          disabled
          sx={{ ...inputSx }}
        />
      ) : (
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
            setSelectedRecipient(v && typeof v === "object" && v.email ? v : null);
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
              sx={{ ...inputSx }}
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
      )}

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
        helperText={fieldError?.field === "title" ? fieldError.message : `${titleLen}/${TITLE_MAX}`}
        sx={{ ...inputSx }}
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
        helperText={fieldError?.field === "body" ? fieldError.message : `${bodyLen}/${BODY_MAX}`}
        sx={{ ...inputSx, mb: 3 }}
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
          background: "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
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
  );
};

export default NewMessagePanel;
