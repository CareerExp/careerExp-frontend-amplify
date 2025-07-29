import { Box, Button, CircularProgress, Container, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { notify } from "../redux/slices/alertSlice.js";
import { createPlaylist } from "../redux/slices/playlistSlice.js";
import { fonts } from "../utility/fonts.js";

const CreatePlaylistModal = ({ open, onClose, userId, token }) => {
  const dispatchToRedux = useDispatch();
  const [playlistName, setPlaylistName] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const handleCreatePlaylist = async () => {
    if (!playlistName) {
      dispatchToRedux(notify({ type: "error", message: "Playlist name is required" }));
      return;
    }

    try {
      setIsButtonLoading(true);
      await dispatchToRedux(createPlaylist({ playlistName, userId, token }));

      setIsButtonLoading(false);
      setPlaylistName("");
      onClose();
      dispatchToRedux(notify({ type: "success", message: "Playlist created successfully" }));
    } catch (error) {
      setIsButtonLoading(false);
      setPlaylistName("");
      console.error("Error creating playlist:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400, md: 500 }, // More responsive width
          maxWidth: "95vw", // Ensure it doesn't touch screen edges
          bgcolor: "#F9FAFB",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "20px",
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            padding: { xs: "1rem", sm: "1.5rem", md: "2rem" },
            backgroundColor: "white",
            borderRadius: "20px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBottom: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
              fontFamily: fonts.sans,
              fontWeight: "bold",
              textAlign: "center",
              color: "#333",
              fontSize: { xs: "1.3rem", sm: "1.25rem", md: "1.5rem" }, // Responsive font size
            }}
          >
            CREATE PLAYLIST
          </Typography>
          <TextField
            label="Playlist Name"
            variant="outlined"
            fullWidth
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            sx={{
              marginBottom: { xs: "1.5rem", sm: "1.2rem", md: "1.5rem" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#bf2f75",
                },
                "&:hover fieldset": {
                  borderColor: "#720361",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#720361",
                },
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" }, // Column on mobile, row on larger screens
              justifyContent: "space-between",
              alignItems: "center",
              gap: { xs: "1rem", sm: "0" }, // Add gap between buttons in column mode
              marginTop: { xs: "0.5rem", sm: "1.2rem", md: "1.5rem" },
            }}
          >
            {isButtonLoading ? (
              <Button
                fullWidth={true}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  backgroundColor: "#720361",
                  color: "white",
                  padding: { xs: "0.7rem", sm: "0.6rem 1.2rem", md: "0.7rem 1.5rem" },
                  borderRadius: "20px",
                  "&:hover": {
                    backgroundColor: "#bf2f75",
                  },
                  width: { xs: "100%", sm: "auto" }, // Full width on mobile
                }}
              >
                <CircularProgress color="inherit" size={25} />
              </Button>
            ) : (
              <Button
                onClick={handleCreatePlaylist}
                fullWidth={true}
                sx={{
                  background: "linear-gradient(to right, #720361, #bf2f75)",
                  color: "white",
                  padding: { xs: "0.7rem", sm: "0.6rem 1.8rem", md: "0.7rem 2rem" },
                  borderRadius: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: { xs: "0.9rem", sm: "0.9rem", md: "1rem" },
                  "&:hover": {
                    background: "linear-gradient(to right, #bf2f75, #720361)",
                  },
                  width: { xs: "100%", sm: "auto" }, // Full width on mobile
                }}
              >
                Create
              </Button>
            )}
            <Button
              onClick={onClose}
              fullWidth={true}
              sx={{
                background: "linear-gradient(to right, #720361, #bf2f75)",
                color: "white",
                padding: { xs: "0.7rem", sm: "0.6rem 1.8rem", md: "0.7rem 2rem" },
                borderRadius: "20px",
                fontWeight: "bold",
                fontSize: { xs: "0.9rem", sm: "0.9rem", md: "1rem" },
                "&:hover": {
                  background: "linear-gradient(to right, #bf2f75, #720361)",
                },
                width: { xs: "100%", sm: "auto" }, // Full width on mobile
              }}
            >
              Close
            </Button>
          </Box>
        </Container>
      </Box>
    </Modal>
  );
};

export default CreatePlaylistModal;
