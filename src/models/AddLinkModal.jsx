import React, { useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { fonts } from "../utility/fonts";

const AddLinkModal = ({ open, onClose, onAdd }) => {
  const [link, setLink] = useState("");

  const handleAdd = () => {
    if (link.trim()) {
      onAdd(link.trim());
      setLink("");
      onClose();
    }
  };

  const handleClose = () => {
    setLink("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: "15px",
          width: "100%",
          maxWidth: "450px",
          p: 1,
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pr: 1 }}>
        <DialogTitle
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: 700,
            fontSize: "22px",
            color: "#000",
          }}
        >
          Add Link
        </DialogTitle>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 0 }}>
        <Typography
          sx={{
            fontFamily: fonts.poppins,
            fontSize: "14px",
            color: "#545454",
            mb: 1,
            fontWeight: 500,
          }}
        >
          Enter URL
        </Typography>
        <TextField
          fullWidth
          placeholder="https://example.com"
          variant="standard"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          autoFocus
          InputProps={{
            disableUnderline: true,
            sx: {
              backgroundColor: "#f6f6f6",
              borderRadius: "10px",
              px: 2,
              py: 1.5,
              fontFamily: fonts.poppins,
              fontSize: "16px",
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: "#787876",
            color: "white",
            borderRadius: "90px",
            px: 3,
            textTransform: "none",
            fontFamily: fonts.poppins,
            fontWeight: 600,
            "&:hover": { backgroundColor: "#60605e" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          sx={{
            background: "linear-gradient(161.01deg, #BF2F75 3.87%, #720361 63.8%)",
            color: "white",
            borderRadius: "90px",
            px: 4,
            textTransform: "none",
            fontFamily: fonts.poppins,
            fontWeight: 600,
            "&:hover": { opacity: 0.9 },
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLinkModal;
