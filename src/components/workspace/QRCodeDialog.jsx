import React, { useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { QRCodeCanvas } from "qrcode.react";
import { fonts } from "../../utility/fonts.js";

const HEADER_GRADIENT = "linear-gradient(to right, #4caf50, #2e7d32)";
const GREEN_BUTTON_GRADIENT = "linear-gradient(to bottom, #4caf50, #2e7d32)";

const QRCodeDialog = ({
  open,
  onClose,
  profileUrl,
  displayName,
  profileTypeLabel,
  onCopyUrl,
}) => {
  const qrRef = useRef(null);

  const handleCopyUrl = () => {
    if (profileUrl && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(profileUrl);
      onCopyUrl?.();
    }
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;
    const png = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `qr-code-${(displayName || "profile").replace(/\s+/g, "-")}.png`;
    link.href = png;
    link.click();
  };

  if (!profileUrl) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0px 8px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: HEADER_GRADIENT,
          color: "white",
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: "1.25rem",
          py: 2,
          px: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <QrCode2Icon sx={{ fontSize: 28 }} />
          <Box>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: "1.25rem",
              }}
            >
              Profile QR Code
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 400,
                fontSize: "0.875rem",
                opacity: 0.95,
              }}
            >
              {profileTypeLabel}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          aria-label="Close"
          sx={{
            color: "white",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 2.5, py: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2.5,
          }}
        >
          <Box
            ref={qrRef}
            sx={{
              p: 2,
              backgroundColor: "white",
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
              mt: 2,
            }}
          >
            <QRCodeCanvas value={profileUrl} size={180} level="M" />
          </Box>
          <Typography
            sx={{
              mt: 1.5,
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: "1.125rem",
              color: "#333",
            }}
          >
            {displayName || "Profile"}
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "0.875rem",
              color: "#666",
            }}
          >
            {profileTypeLabel}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontSize: "0.875rem",
            color: "#545454",
            mb: 0.75,
          }}
        >
          Profile URL
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={profileUrl}
          readOnly
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleCopyUrl}
                  size="small"
                  aria-label="Copy URL"
                >
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              fontFamily: fonts.sans,
              fontSize: "0.875rem",
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
            },
          }}
          sx={{ mb: 2 }}
        />

        <Box
          sx={{
            backgroundColor: "#ffebee",
            borderRadius: 1.5,
            p: 1.5,
            border: "1px solid #ffcdd2",
          }}
        >
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "#c62828",
              mb: 0.5,
            }}
          >
            How to use:
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "0.8125rem",
              color: "#555",
              lineHeight: 1.5,
            }}
          >
            Share this QR code with others so they can quickly access your
            profile. They can scan it with their phone camera or any QR code
            reader app.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          px: 2.5,
          py: 2,
          gap: 1.5,
          borderTop: "1px solid #eee",
        }}
      >
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadQR}
          sx={{
            background: GREEN_BUTTON_GRADIENT,
            color: "white",
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: "0.9375rem",
            textTransform: "none",
            borderRadius: "8px",
            px: 2,
            boxShadow: "0 2px 8px rgba(46, 125, 50, 0.35)",
            "&:hover": {
              background: "linear-gradient(to bottom, #43a047, #2e7d32)",
              boxShadow: "0 3px 12px rgba(46, 125, 50, 0.4)",
            },
          }}
        >
          Download QR Code
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: "0.9375rem",
            textTransform: "none",
            borderRadius: "8px",
            borderColor: "#ccc",
            color: "#555",
            "&:hover": {
              borderColor: "#999",
              backgroundColor: "rgba(0,0,0,0.04)",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QRCodeDialog;
