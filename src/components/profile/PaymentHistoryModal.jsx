import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { fonts } from "../../utility/fonts";
import { fetchInvoices } from "../../redux/slices/subscriptionSlice.js";
import { notify } from "../../redux/slices/alertSlice.js";

function formatInvoiceDate(isoDate) {
  if (!isoDate) return "—";
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(cents, currency = "USD") {
  if (cents == null) return "—";
  const symbol = currency === "USD" ? "$" : currency;
  return `${symbol}${(cents / 100).toFixed(2)}`;
}

/**
 * Payment History modal – Figma 1325-109392.
 * Lists invoices: date, description, payment method, amount, status.
 */
const PaymentHistoryModal = ({ open, onClose, token, paymentMethodLabel }) => {
  const dispatch = useDispatch();
  const [invoices, setInvoices] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastId, setLastId] = useState(null);

  useEffect(() => {
    if (!open || !token) return;
    setInvoices([]);
    setLastId(null);
    setLoading(true);
    dispatch(fetchInvoices({ token, limit: 20 }))
      .unwrap()
      .then((data) => {
        const list = data?.invoices ?? data?.data?.invoices ?? [];
        setInvoices(Array.isArray(list) ? list : []);
        setHasMore(Boolean(data?.hasMore ?? data?.data?.hasMore));
        if (list?.length) {
          const last = list[list.length - 1];
          setLastId(last?.id ?? null);
        }
      })
      .catch((err) => {
        dispatch(notify({ type: "error", message: err || "Failed to load payment history." }));
      })
      .finally(() => setLoading(false));
  }, [open, token, dispatch]);

  const loadMore = () => {
    if (!token || !lastId || loadingMore || !hasMore) return;
    setLoadingMore(true);
    dispatch(fetchInvoices({ token, limit: 20, startingAfter: lastId }))
      .unwrap()
      .then((data) => {
        const list = data?.invoices ?? data?.data?.invoices ?? [];
        const next = Array.isArray(list) ? list : [];
        setInvoices((prev) => [...prev, ...next]);
        setHasMore(Boolean(data?.hasMore ?? data?.data?.hasMore));
        if (next.length) {
          const last = next[next.length - 1];
          setLastId(last?.id ?? null);
        } else {
          setLastId(null);
        }
      })
      .catch((err) => {
        dispatch(notify({ type: "error", message: err || "Failed to load more." }));
      })
      .finally(() => setLoadingMore(false));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0px 6px 24px 0px rgba(0,0,0,0.08)",
          border: "1px solid #EAECF0",
          maxHeight: "85vh",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: "20px",
            color: "#101828",
          }}
        >
          Payment History
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "#667085" }}
          aria-label="Close"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ px: 3, py: 2, overflowY: "auto" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#720361" }} />
          </Box>
        ) : invoices.length === 0 ? (
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "14px",
              color: "#667085",
              textAlign: "center",
              py: 4,
            }}
          >
            No payment history yet.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {invoices.map((inv) => (
              <Box
                key={inv.id}
                sx={{
                  p: 2,
                  borderRadius: "8px",
                  backgroundColor: "#FAFAFA",
                  border: "1px solid #EAECF0",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Box sx={{ flex: "1 1 auto", minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#101828",
                      mb: 0.5,
                    }}
                  >
                    {formatInvoiceDate(inv.createdAt || inv.periodStart)}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "14px",
                      color: "#101828",
                      mb: 0.5,
                    }}
                  >
                    {inv.description || "Monthly Membership"}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "12px",
                      color: "#667085",
                    }}
                  >
                    {paymentMethodLabel || "Payment method on file"}
                  </Typography>
                </Box>
                 <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, flexShrink: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#101828",
                    }}
                  >
                    {formatAmount(inv.amountPaid ?? inv.amountDue, inv.currency)}
                  </Typography>
                 
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.25,
                      borderRadius: "6px",
                      bgcolor: "#16A34A",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: fonts.sans,
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#FFFFFF",
                      }}
                    >
                      {(inv.status || "paid").charAt(0).toUpperCase() + (inv.status || "paid").slice(1)}
                    </Typography>
                  </Box>
                  
                </Box>
                {(inv.hostedInvoiceUrl || inv.invoicePdf) && (
                  <Box sx={{ width: "100%", mt: 0.5, textAlign: "right" }}>
                    <Typography
                      component="a"
                      href={inv.hostedInvoiceUrl || inv.invoicePdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        fontFamily: fonts.sans,
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#720361",
                        textDecoration: "underline",
                        "&:hover": { color: "#BF2F75" },
                      }}
                    >
                      View invoice
                    </Typography>
                  </Box>
                )}
                </Box>
                
              </Box>
            ))}
            {hasMore && (
              <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
                <Typography
                  component="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#720361",
                    border: "none",
                    background: "none",
                    cursor: loadingMore ? "wait" : "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {loadingMore ? "Loading…" : "Load more"}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentHistoryModal;
