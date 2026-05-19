import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { fonts } from "../../utility/fonts.js";

const headerGradient = "linear-gradient(180deg, #BF2F75 0%, #720361 100%)";

/**
 * Custom confirmation for university claim approve / reject / delete actions.
 */
const ClaimActionConfirmDialog = ({
  open,
  type,
  universityName,
  loading,
  onConfirm,
  onCancel,
}) => {
  const isApprove = type === "approve";
  const isReject = type === "reject";
  const isDelete = type === "delete";

  if (!isApprove && !isReject && !isDelete) return null;

  const title = isApprove
    ? "Approve claim request?"
    : isReject
      ? "Reject claim request?"
      : "Remove claim request?";

  const confirmLabel = isApprove
    ? "Confirm approve"
    : isReject
      ? "Confirm reject"
      : "Confirm remove";

  const confirmBg = isReject || isDelete ? "#dc2626" : headerGradient;

  return (
    <Dialog open={open} onClose={loading ? undefined : onCancel} maxWidth="xs" fullWidth>
      <Box
        sx={{
          background: headerGradient,
          color: "#fff",
          px: 2.5,
          py: 2,
        }}
      >
        <Typography sx={{ fontFamily: fonts.poppins, fontWeight: 700, fontSize: "1.125rem" }}>
          {title}
        </Typography>
      </Box>
      <DialogContent sx={{ pt: 2.5, pb: 1 }}>
        <Typography sx={{ fontFamily: fonts.poppins, fontSize: "0.9375rem", color: "#374151", mb: 1.5 }}>
          {isApprove ? (
            <>
              You are about to approve the claim for{" "}
              <strong>{universityName || "this university"}</strong>. The applicant account will be
              activated and the institution will appear under Education Institutions with a Claim
              Flow tag.
            </>
          ) : isReject ? (
            <>
              You are about to reject the claim for{" "}
              <strong>{universityName || "this university"}</strong>. The applicant account will be
              blocked.
            </>
          ) : (
            <>
              Remove this claim request for{" "}
              <strong>{universityName || "this university"}</strong>
            </>
          )}
        </Typography>
        {isReject ? (
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontSize: "0.875rem",
              color: "#B45309",
              backgroundColor: "#FFF8E1",
              border: "1px solid #FFE082",
              borderRadius: "8px",
              p: 1.5,
            }}
          >
            Once rejected, this request cannot be changed. No further approve or reject actions
            will be allowed for this request.
          </Typography>
        ) : isDelete ? (
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontSize: "0.875rem",
              color: "#B45309",
              backgroundColor: "#FFF8E1",
              border: "1px solid #FFE082",
              borderRadius: "8px",
              p: 1.5,
            }}
          >
            This only removes the pending claim from the queue.
          </Typography>
        ) : (
          <Typography sx={{ fontFamily: fonts.poppins, fontSize: "0.875rem", color: "#6B7280" }}>
            After approval, this request will be removed from University claim requests and moved
            to Education Institutions. No further actions will be allowed on this request.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 2.5, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onCancel}
          disabled={loading}
          sx={{ fontFamily: fonts.poppins, textTransform: "none", color: "#6B7280" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: 600,
            textTransform: "none",
            background: confirmBg,
            "&:hover": { opacity: 0.92 },
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClaimActionConfirmDialog;
