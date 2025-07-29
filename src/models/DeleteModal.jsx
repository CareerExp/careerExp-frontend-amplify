import { Box, Button, CircularProgress, Dialog, Typography } from "@mui/material";
import React from "react";
import { buttonStyle } from "../utility/commonStyle.js";

const DeleteModal = ({ open, onClose, onDelete, title, text, fonts, isButtonLoading }) => {
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        backdropFilter: "blur(8px) !important",
        backgroundColor: "rgba(0, 0, 0, 0.3) !important",
        paddingBottom: "1rem",
      }}
      fullWidth={true}
      maxWidth="sm"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: { xs: "0.5rem", sm: "0.75rem", md: "1rem" },
        }}
      >
        <Typography
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: "700",
            fontSize: { xs: "20px", sm: "22px", md: "26px" },
            textAlign: "center",
            px: { xs: "0.5rem", sm: "1rem", md: "1.5rem" },
          }}
        >
          {title}
        </Typography>
      </Box>

      <Box
        sx={{
          margin: { xs: "0.5rem", sm: "0.75rem", md: "1rem" },
          border: "1px solid #C5C6C7",
          p: { xs: "0.5rem", sm: "0.75rem", md: "1rem" },
          borderRadius: "12px",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "14px", sm: "16px", md: "18px" },
            fontFamily: fonts?.sans,
            padding: { xs: "10px", sm: "15px", md: "20px" },
            textAlign: "center",
          }}
        >
          {text}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: "1rem",
            justifyContent: { xs: "center", sm: "flex-end" },
            padding: { xs: "0 10px 10px", sm: "0 15px", md: "0 20px" },
          }}
        >
          {isButtonLoading ? (
            <>
              <Button
                variant="contained"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  backgroundColor: "black",
                  color: "white",
                  padding: { xs: "0.3rem 1rem", sm: "0.4rem 1.25rem", md: "0.5rem 1.5rem" },
                  borderRadius: "0.5rem",
                  width: { xs: "100%", sm: "auto", md: "auto" },
                  "&:hover": {
                    backgroundColor: "black",
                  },
                }}
              >
                <CircularProgress size={25} color="inherit" />
              </Button>
            </>
          ) : (
            <Button
              onClick={handleDelete}
              sx={{
                ...buttonStyle,
                width: { xs: "100%", sm: "30%", md: "20%" },
              }}
            >
              Delete
            </Button>
          )}

          <Button
            onClick={onClose}
            sx={{
              ...buttonStyle,
              width: { xs: "100%", sm: "30%", md: "20%" },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default DeleteModal;
