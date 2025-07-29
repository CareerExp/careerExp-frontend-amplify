import { Box, Button, CircularProgress, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

function SaveNotesModal({ open, onClose, videoId, initialNotes, onSave }) {
  const [currentNotes, setCurrentNotes] = useState(initialNotes);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    setCurrentNotes(initialNotes);
  }, [initialNotes]);

  const handleSave = async () => {
    setIsButtonLoading(true);
    if (onSave) {
      await onSave(videoId, currentNotes);
    }
    setIsButtonLoading(false);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: {
            xs: "70%", // mobile
            sm: "80%", // small
            md: 600, // medium and above
          },
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "10px",
          p: 3,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            marginBottom: "1rem",
            fontFamily: "Poppins, sans-serif",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: {
              xs: "1.1rem",
              sm: "1.25rem",
            },
          }}
        >
          Edit Your Notes
        </Typography>

        <TextField
          label="My Notes"
          multiline
          rows={4}
          fullWidth
          value={currentNotes}
          onChange={(e) => setCurrentNotes(e.target.value)}
          sx={{
            marginBottom: "1.5rem",
            fontFamily: "Poppins, sans-serif",
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column", // stack on mobile
              sm: "row", // side-by-side on sm+
            },
            gap: 2,
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            onClick={handleCancel}
            sx={{
              fontFamily: "Poppins, sans-serif",
              borderColor: "#720361",
              color: "#720361",
              padding: "0.5rem 1.5rem",
              borderRadius: "90px",
              "&:hover": {
                borderColor: "#bf2f75",
                color: "#bf2f75",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSave}
            sx={{
              fontFamily: "Poppins, sans-serif",
              background: "linear-gradient(to right, #720361, #bf2f75)",
              color: "white",
              padding: "0.5rem 1.5rem",
              borderRadius: "90px",
              "&:hover": {
                background: "linear-gradient(to right, #720361, #bf2f75)",
              },
            }}
          >
            {isButtonLoading ? <CircularProgress color="inherit" size={24} /> : "Save Notes"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default SaveNotesModal;
