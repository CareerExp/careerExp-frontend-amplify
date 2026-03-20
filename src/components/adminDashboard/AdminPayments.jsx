import React, { useEffect, useState } from "react";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getPaymentTransactions,
  selectPaymentTransactionsData,
  syncSubscriptionPayments,
} from "../../redux/slices/adminSlice.js";
import { notify } from "../../redux/slices/alertSlice.js";
import { selectToken } from "../../redux/slices/authSlice.js";
import {
  buttonStyle,
  inputFieldStyle,
  tableBodyStyle,
  tableHeadStyle,
} from "../../utility/commonStyle.js";
import { fonts } from "../../utility/fonts.js";

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Completed", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
];

const accentColor = "#BC2876";
const accentColorInactive = "#999999";
const searchButtonGradient =
  "linear-gradient(180deg, #BF2F75 0%, #720361 100%)";
const placeholderColor = "#BDBDBD";
const inputBorderColor = "#E0E0E0";

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatAmount = (amount, currency = "USD") => {
  if (amount == null) return "-";
  const symbol = currency === "USD" ? "$" : currency;
  return `${symbol}${Number(amount).toLocaleString()}`;
};

const getStatusDisplay = (paymentStatus) => {
  switch (paymentStatus) {
    case "paid":
      return "Completed";
    case "pending":
      return "pending";
    case "failed":
      return "Failed";
    default:
      return paymentStatus || "-";
  }
};

const getStatusColor = (paymentStatus) => {
  switch (paymentStatus) {
    case "paid":
      return "#22c55e";
    case "pending":
      return "#f97316";
    case "failed":
      return "#ef4444";
    default:
      return "#717f8c";
  }
};

const AdminPayments = () => {
  const dispatchToRedux = useDispatch();
  const token = useSelector(selectToken);
  const paymentData = useSelector(selectPaymentTransactionsData);

  const [activeTab, setActiveTab] = useState("Transaction History");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [syncing, setSyncing] = useState(false);

  const transactions = paymentData?.transactions ?? [];
  const totalCount = paymentData?.totalCount ?? 0;
  const totalPages = paymentData?.totalPages ?? 0;

  useEffect(() => {
    dispatchToRedux(
      getPaymentTransactions({
        token,
        page: page + 1,
        limit: rowsPerPage,
        search: appliedSearch,
        status: statusFilter,
      }),
    );
  }, [token, page, rowsPerPage, statusFilter, appliedSearch]);

  const handleSearchClick = () => {
    setAppliedSearch(searchQuery.trim());
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewTransaction = (id) => {
    // Placeholder: could open a detail modal or navigate to transaction detail
    dispatchToRedux(
      notify({
        type: "info",
        message: "Transaction detail view can be added here.",
      }),
    );
  };

  const handleSyncSubscriptionPayments = async () => {
    setSyncing(true);
    try {
      const result = await dispatchToRedux(
        syncSubscriptionPayments({ token }),
      ).unwrap();
      const count = result?.synced ?? result?.data?.synced ?? result?.count;
      dispatchToRedux(
        notify({
          type: "success",
          message:
            count != null
              ? `Synced ${count} payment(s) from Stripe.`
              : "Subscription payments synced successfully.",
        }),
      );
      dispatchToRedux(
        getPaymentTransactions({
          token,
          page: page + 1,
          limit: rowsPerPage,
          search: appliedSearch,
          status: statusFilter,
        }),
      );
    } catch (err) {
      dispatchToRedux(
        notify({
          type: "error",
          message: err?.message || "Failed to sync subscription payments.",
        }),
      );
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      <Box>
        <Box sx={{ ml: 2, mt: 2 }}>
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ fontFamily: fonts.poppins }}
          >
            Payments
          </Typography>
        </Box>

        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mt: 2,
            // ml: 2,
            backgroundColor: "white",
            borderRadius: "10px 10px 0px 0px",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            centered
            textColor="inherit"
            sx={{
              px: 2,
              pt: 1,
              minHeight: 48,
              "& .MuiTab-root": {
                fontFamily: fonts.poppins,
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
                color: accentColorInactive,
                minHeight: 48,
                px: 3,
              },
              "& .MuiTab-root.Mui-selected": {
                color: accentColor,
                fontWeight: 700,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: accentColor,
                height: 3,
              },
              "& .MuiTabs-flexContainer": {
                gap: "24px",
                justifyContent: "center",
              },
            }}
          >
            <Tab label="Payment Setup" value="Payment Setup" />
            <Tab label="Transaction History" value="Transaction History" />
          </Tabs>
        </Box>

        {activeTab === "Transaction History" && (
          <>
            <Box
              sx={{
                p: 2,
                // mt: 2,
                backgroundColor: "white",
                borderRadius: "0px 0px 10px 10px",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 2,
              }}
            >
              <TextField
                placeholder="Search"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
                sx={{
                  flex: 1,
                  fontFamily: fonts.poppins,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    "& fieldset": {
                      border: `1px solid ${inputBorderColor}`,
                    },
                    "&:hover fieldset": {
                      borderColor: "#bdbdbd",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: accentColor,
                      borderWidth: "1px",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: placeholderColor,
                    opacity: 1,
                  },
                }}
              />
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {STATUS_FILTERS.map(({ label, value }) => (
                  <Button
                    key={value || "all"}
                    onClick={() => {
                      setStatusFilter(value);
                      setPage(0);
                    }}
                    sx={{
                      fontFamily: fonts.poppins,
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: "10px",
                      px: 2,
                      py: 1,
                      backgroundColor:
                        statusFilter === value
                          ? "linear-gradient(180deg, #BF2F75 0%, #720361 100%)"
                          : "#fff",
                      background:
                        statusFilter === value
                          ? "linear-gradient(180deg, #BF2F75 0%, #720361 100%)"
                          : "#fff",
                      color: statusFilter === value ? "#fff" : "#717f8c",
                      border: "1px solid #e5e7eb",
                      "&:hover": {
                        background:
                          statusFilter === value
                            ? "linear-gradient(180deg, #BF2F75 0%, #720361 100%)"
                            : "#f6f6f6",
                        border: "1px solid #e5e7eb",
                      },
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </Box>
              <Button
                sx={{
                  ...buttonStyle,
                  width: "auto",
                  px: 3,
                  borderRadius: "10px",
                  background: searchButtonGradient,
                }}
                onClick={handleSearchClick}
              >
                SEARCH
              </Button>
              <Button
                sx={{
                  ...buttonStyle,
                  width: "auto",
                  px: 3,
                  borderRadius: "10px",
                  background: "linear-gradient(180deg, #5a6268 0%, #343a40 100%)",
                  "&:disabled": { opacity: 0.7 },
                }}
                onClick={handleSyncSubscriptionPayments}
                disabled={syncing}
              >
                {syncing ? "Syncing…" : "Sync from Stripe"}
              </Button>
            </Box>

            <TableContainer
              sx={{
                mt: 0,
                borderRadius: "0px 0px 10px 10px",
                backgroundColor: "white",
              }}
            >
              <Table size="medium" aria-label="payment transactions">
                <TableHead sx={{ backgroundColor: "#f9fafb" }}>
                  <TableRow>
                    <TableCell sx={tableHeadStyle}>Transaction ID</TableCell>
                    <TableCell sx={tableHeadStyle}>User</TableCell>
                    <TableCell sx={tableHeadStyle}>User Type</TableCell>
                    <TableCell sx={tableHeadStyle}>Plan Type</TableCell>
                    <TableCell sx={tableHeadStyle}>Amount</TableCell>
                    <TableCell sx={tableHeadStyle}>Date</TableCell>
                    <TableCell sx={tableHeadStyle}>Status</TableCell>
                    {/* <TableCell sx={tableHeadStyle}>Actions</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(transactions) && transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <TableRow
                        key={tx.id}
                        sx={{
                          backgroundColor: "white",
                          "&:hover": { backgroundColor: "#f9fafb" },
                        }}
                      >
                        <TableCell sx={tableBodyStyle}>
                          {tx.transactionID || "-"}
                        </TableCell>
                        <TableCell sx={tableBodyStyle}>
                          {tx.user?.fullName ?? "-"}
                        </TableCell>
                        <TableCell sx={tableBodyStyle}>
                          <span
                            style={{
                              backgroundColor: "#E3F2FD",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontWeight: 600,
                              fontSize: "11px",
                              color: "#2196F3",
                            }}
                          >
                            {tx.organizationType || "-"}
                          </span>
                        </TableCell>
                        <TableCell sx={tableBodyStyle}>
                          {tx.type || "-"}
                        </TableCell>
                        <TableCell sx={{ ...tableBodyStyle, fontWeight: 600 }}>
                          {formatAmount(tx.amount, tx.currency)}
                        </TableCell>
                        <TableCell sx={tableBodyStyle}>
                          {formatDate(tx.createdAt)}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: fonts.poppins,
                            fontWeight: 600,
                            color: getStatusColor(tx.paymentStatus),
                            fontSize: "0.875rem",
                          }}
                        >
                          {getStatusDisplay(tx.paymentStatus)}
                        </TableCell>
                        {/* <TableCell>
                          <Typography
                            component="button"
                            onClick={() => handleViewTransaction(tx.id)}
                            sx={{
                              fontFamily: fonts.poppins,
                              fontWeight: 600,
                              color: "#720361",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              textDecoration: "underline",
                              "&:hover": { color: "#BF2F75" },
                            }}
                          >
                            View
                          </Typography>
                        </TableCell> */}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography
                          variant="body1"
                          sx={{ fontFamily: fonts.poppins, fontWeight: "600" }}
                        >
                          No transactions found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {totalCount > 0 && (
              <TablePagination
                rowsPerPageOptions={[10, 20, 50, 100]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ fontFamily: fonts.poppins, backgroundColor: "white" }}
              />
            )}
          </>
        )}

        {activeTab === "Payment Setup" && (
          <Box
            sx={{
              p: 3,
              backgroundColor: "white",
              borderRadius: "10px",
              mt: 2,
              ml: 2,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                mb: 4,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CreditCardIcon
                  sx={{
                    color: "#BF2F75",
                    fontSize: 28,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: fonts.poppins,
                    fontWeight: 600,
                    fontSize: "1.125rem",
                    color: "#1f2937",
                  }}
                >
                  Stripe
                </Typography>
              </Box>
              <Button
                component="a"
                href="https://dashboard.stripe.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  ...buttonStyle,
                  background:
                    " linear-gradient(125deg, #BF2F75 -3.87%, #720361 63.8%)",
                  width: "auto",
                  px: 3,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  fontFamily: fonts.poppins,
                }}
              >
                Update payment methods
              </Button>
            </Box>
            <Typography
              sx={{
                fontFamily: fonts.poppins,
                fontSize: "14px",
                color: "#6A7282",
                lineHeight: 1.6,
              }}
            >
              Your Stripe account is successfully connected and fully
              operational. All subscription payments, recurring billing,
              invoices, and payment methods are securely processed through
              Stripe. Your platform is now ready to accept and manage payments
              without interruption.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default AdminPayments;
