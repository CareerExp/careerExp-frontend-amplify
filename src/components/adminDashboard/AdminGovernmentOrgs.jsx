import "react-quill/dist/quill.snow.css";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import uploadDocumentSvg from "../../assets/uploadDocument.svg";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ReactQuill from "react-quill";
import {
  createGovernmentOrganization,
  deleteGovernmentOrganization,
  getGovernmentOrganizations,
  selectGovernmentOrganizationsData,
  updateGovernmentOrganization,
} from "../../redux/slices/adminSlice.js";
import { notify } from "../../redux/slices/alertSlice.js";
import { selectToken } from "../../redux/slices/authSlice.js";
import {
  buttonStyle,
  tableBodyStyle,
  tableHeadStyle,
} from "../../utility/commonStyle.js";
import { fonts } from "../../utility/fonts.js";

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
};

const accentColor = "#BC2876";
const accentColorInactive = "#999999";
const searchButtonGradient =
  "linear-gradient(180deg, #BF2F75 0%, #720361 100%)";
const placeholderColor = "#BDBDBD";
const inputBorderColor = "#E0E0E0";

// Fallback when description is empty
const DEFAULT_HOW_WE_WORK =
  "No description available.";

const AdminGovernmentOrgs = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const govOrgsData = useSelector(selectGovernmentOrganizationsData);

  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [editingOrg, setEditingOrg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  const logoInputRef = React.useRef(null);

  const isEditMode = Boolean(editingOrg);

  const organizations = govOrgsData?.organizations ?? [];
  const totalOrganizations = govOrgsData?.totalOrganizations ?? 0;

  useEffect(() => {
    if (!token) return;
    setListLoading(true);
    dispatch(
      getGovernmentOrganizations({
        token,
        page: page + 1,
        limit: rowsPerPage,
        search: appliedSearch,
      }),
    )
      .finally(() => setListLoading(false));
  }, [dispatch, token, page, rowsPerPage, appliedSearch]);

  const handleSearchClick = () => {
    setAppliedSearch(searchQuery.trim());
    setPage(0);
  };

  const handleAddOrganization = () => {
    setEditingOrg(null);
    setFormTitle("");
    setFormContent("");
    setLogoFile(null);
    setLogoPreview(null);
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setEditingOrg(null);
    setFormTitle("");
    setFormContent("");
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleAddOrgSubmit = async () => {
    const name = formTitle?.trim();
    const description = formContent?.trim();
    if (!name) {
      dispatch(notify({ type: "error", message: "Title is required" }));
      return;
    }
    if (!description) {
      dispatch(notify({ type: "error", message: "Description is required" }));
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await dispatch(
          updateGovernmentOrganization({
            token,
            id: editingOrg._id,
            name,
            description,
            file: logoFile || undefined,
            image: !logoFile && typeof logoPreview === "string" ? logoPreview : undefined,
          }),
        ).unwrap();
        dispatch(notify({ type: "success", message: "Organization updated successfully" }));
      } else {
        await dispatch(
          createGovernmentOrganization({
            token,
            name,
            description,
            file: logoFile || undefined,
            image: !logoFile && typeof logoPreview === "string" ? logoPreview : undefined,
          }),
        ).unwrap();
        dispatch(notify({ type: "success", message: "Organization created successfully" }));
      }
      handleCloseAddModal();
      dispatch(
        getGovernmentOrganizations({
          token,
          page: page + 1,
          limit: rowsPerPage,
          search: appliedSearch,
        }),
      );
    } catch (err) {
      dispatch(
        notify({
          type: "error",
          message: err?.message || (isEditMode ? "Failed to update organization" : "Failed to create organization"),
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (org) => {
    if (!window.confirm(`Delete "${org.name}"?`)) return;
    try {
      await dispatch(
        deleteGovernmentOrganization({ token, id: org._id }),
      ).unwrap();
      dispatch(notify({ type: "success", message: "Organization deleted successfully" }));
      dispatch(
        getGovernmentOrganizations({
          token,
          page: page + 1,
          limit: rowsPerPage,
          search: appliedSearch,
        }),
      );
    } catch (err) {
      dispatch(
        notify({
          type: "error",
          message: err?.message || "Failed to delete organization",
        }),
      );
    }
  };

  const handleEdit = (org) => {
    setEditingOrg(org);
    setFormTitle(org.name ?? "");
    setFormContent(org.description ?? "");
    setLogoPreview(org.image ?? null);
    setLogoFile(null);
    setAddModalOpen(true);
  };

  const handleView = (org) => {
    setSelectedOrg(org);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedOrg(null);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          ml: 2,
          mt: 2,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="700"
          sx={{
            fontFamily: fonts.poppins,
            color: "#1f2937",
            fontSize: "1.5rem",
          }}
        >
          Government and Community Organizations
        </Typography>
        <Button
          onClick={handleAddOrganization}
          sx={{
            ...buttonStyle,
            width: "auto",
            px: 3,
            py: 1,
            textTransform: "none",
            fontSize: "15px",
            fontFamily: fonts.poppins,
            fontWeight: 600,
          }}
        >
          Add Organizations
        </Button>
      </Box>

      <Box
        sx={{
          p: 2,
          mt: 2,
          backgroundColor: "white",
          borderRadius: "10px 10px 0px 0px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
          boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
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
            py: 0,
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
        <Button
          sx={{ ...buttonStyle, width: "auto", px: 3, borderRadius: "10px" }}
          onClick={handleSearchClick}
        >
          SEARCH
        </Button>
      </Box>

      <TableContainer
        sx={{
          backgroundColor: "white",
          borderRadius: "0px 0px 10px 10px",
          boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
          borderTop: "1px solid #f3f4f6",
        }}
      >
        <Table size="medium" aria-label="government organizations">
          <TableHead sx={{ backgroundColor: "#f9fafb" }}>
            <TableRow>
              <TableCell sx={tableHeadStyle}>Name</TableCell>
              <TableCell sx={tableHeadStyle} align="right">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listLoading ? (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={32} sx={{ color: accentColor }} />
                </TableCell>
              </TableRow>
            ) : organizations.length > 0 ? (
              organizations.map((org) => (
                <TableRow
                  key={org._id}
                  sx={{
                    "&:hover": { backgroundColor: "#f9fafb" },
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <TableCell sx={{ ...tableBodyStyle, py: 2 }} scope="row">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          overflow: "hidden",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          ...(org.image
                            ? {}
                            : {
                                background:
                                  "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
                              }),
                        }}
                      >
                        {org.image ? (
                          <Box
                            component="img"
                            src={org.image}
                            alt=""
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <AccountBalanceIcon
                            sx={{ color: "white", fontSize: 22 }}
                          />
                        )}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: fonts.poppins,
                          color: "#545454",
                          fontSize: "0.875rem",
                        }}
                      >
                        {org.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Typography
                        component="button"
                        onClick={() => handleEdit(org)}
                        sx={{
                          fontFamily: fonts.poppins,
                          fontWeight: 600,
                          color: "#720361",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textDecoration: "underline",
                          fontSize: "0.875rem",
                          "&:hover": { color: "#BF2F75" },
                        }}
                      >
                        Edit
                      </Typography>
                      <Typography
                        component="button"
                        onClick={() => handleView(org)}
                        sx={{
                          fontFamily: fonts.poppins,
                          fontWeight: 600,
                          color: "#720361",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textDecoration: "underline",
                          fontSize: "0.875rem",
                          "&:hover": { color: "#BF2F75" },
                        }}
                      >
                        View
                      </Typography>
                      <Typography
                        component="button"
                        onClick={() => handleDelete(org)}
                        sx={{
                          fontFamily: fonts.poppins,
                          fontWeight: 600,
                          color: "#dc2626",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textDecoration: "underline",
                          fontSize: "0.875rem",
                          "&:hover": { color: "#b91c1c" },
                        }}
                      >
                        Delete
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: fonts.poppins,
                      fontWeight: "600",
                      color: "#717f8c",
                    }}
                  >
                    No organizations found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalOrganizations > 0 && !listLoading && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalOrganizations}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ fontFamily: fonts.poppins, backgroundColor: "white" }}
        />
      )}

      <Dialog
        open={addModalOpen}
        onClose={handleCloseAddModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            pt: 3,
            pb: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: 700,
              fontSize: "2rem",
              textAlign: "center",
              color: "#1f2937",
            }}
          >
            {isEditMode
              ? "Edit Government and Community Organizations"
              : "Add Government and Community Organizations"}
          </Typography>
          <IconButton
            onClick={handleCloseAddModal}
            size="small"
            sx={{
              color: "#717f8c",
              "&:hover": { backgroundColor: "#f3f4f6" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3, pt: 0, pb: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box>
              <Typography
                sx={{
                  fontFamily: fonts.poppins,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#374151",
                  mb: 0.75,
                }}
              >
                Title
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter organization title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#F6F6F6",
                    fontFamily: fonts.poppins,
                    "& fieldset": { borderColor: "#E0E0E0" },
                    "&:hover fieldset": { borderColor: "#bdbdbd" },
                    "&.Mui-focused fieldset": {
                      borderColor: accentColor,
                      borderWidth: "1px",
                    },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: fonts.poppins,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#374151",
                  mb: 0.75,
                }}
              >
                Upload Logo
              </Typography>
              <Box
                onClick={() => logoInputRef.current?.click()}
                sx={{
                  border: "2px dashed #BC2876",
                  borderRadius: "10px",
                  backgroundColor: "#F6F6F6",
                  minHeight: 140,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f3f4f6" },
                }}
              >
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{ display: "none" }}
                />
                {logoPreview ? (
                  <>
                    <Box
                      component="img"
                      src={logoPreview}
                      alt="Logo preview"
                      sx={{
                        maxHeight: 120,
                        maxWidth: "100%",
                        objectFit: "contain",
                        borderRadius: "8px",
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: fonts.poppins,
                        fontSize: "0.875rem",
                        color: "#9ca3af",
                        mt: 0.5,
                      }}
                    >
                      Change Logo
                    </Typography>
                  </>
                ) : (
                  <>
                    <Box
                      component="img"
                      src={uploadDocumentSvg}
                      alt=""
                      sx={{
                        width: 79,
                        height: 80,
                        mb: 1,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: fonts.poppins,
                        fontSize: "0.875rem",
                        color: "#9ca3af",
                      }}
                    >
                      Upload Logo
                    </Typography>
                  </>
                )}
              </Box>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: fonts.poppins,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#374151",
                  mb: 0.75,
                }}
              >
                Add Content for How we work together*
              </Typography>
              <Box
                sx={{
                  "& .quill": { fontFamily: fonts.poppins },
                  "& .ql-container": {
                    borderRadius: "0 0 8px 8px",
                    borderColor: "#E0E0E0",
                  },
                  "& .ql-toolbar": {
                    borderRadius: "8px 8px 0 0",
                    borderColor: "#E0E0E0",
                    backgroundColor: "#F6F6F6",
                  },
                  "& .ql-editor": {
                    minHeight: 120,
                  },
                }}
              >
                <ReactQuill
                  theme="snow"
                  value={formContent}
                  onChange={setFormContent}
                  modules={quillModules}
                  style={{ backgroundColor: "#F6F6F6" }}
                  placeholder="Enter organization content/description"
                />
              </Box>
            </Box>

            <Button
              onClick={handleAddOrgSubmit}
              disabled={isSubmitting}
              fullWidth
              sx={{
                ...buttonStyle,
                width: "100%",
                py: 1.5,
                mt: 1,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                fontFamily: fonts.poppins,
                borderRadius: "25px",
                maxWidth: "216px",
                margin: "auto",
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : isEditMode ? (
                "UPDATE ORGANIZATION"
              ) : (
                "ADD ORGANIZATION"
              )}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* View Organization modal */}
      <Dialog
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            px: 3,
            pt: 3,
            pb: 0,
          }}
        >
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "#1f2937",
              flex: 1,
              pr: 1,
            }}
          >
            {selectedOrg?.name ?? ""}
          </Typography>
          <IconButton
            onClick={handleCloseViewModal}
            size="small"
            sx={{
              color: "#717f8c",
              "&:hover": { backgroundColor: "#f3f4f6" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3, pt: 2, pb: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2.5,
            }}
          >
            {/* Organization logo - circular; no blue background when logo exists */}
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...(selectedOrg?.image
                  ? {}
                  : {
                      backgroundColor: "#E3F2FD",
                      border: "2px solid #BBDEFB",
                    }),
              }}
            >
              {selectedOrg?.image ? (
                <Box
                  component="img"
                  src={selectedOrg.image}
                  alt=""
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <AccountBalanceIcon
                  sx={{ color: "#2196F3", fontSize: 56 }}
                />
              )}
            </Box>

            {/* How we work together - render HTML from rich text editor */}
            <Box sx={{ width: "100%", textAlign: "left" }}>
              <Typography
                sx={{
                  fontFamily: fonts.poppins,
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  color: "#1f2937",
                  mb: 1.5,
                }}
              >
                How we work together
              </Typography>
              {selectedOrg?.description ? (
                <Box
                  sx={{
                    fontFamily: fonts.poppins,
                    fontSize: "0.9375rem",
                    color: "#374151",
                    lineHeight: 1.6,
                    "& p": { margin: "0 0 0.75em", fontFamily: fonts.poppins },
                    "& p:last-child": { marginBottom: 0 },
                    "& strong": { fontWeight: 700 },
                    "& .ql-align-justify": { textAlign: "justify" },
                    "& .ql-align-center": { textAlign: "center" },
                    "& .ql-align-right": { textAlign: "right" },
                    "& ul, & ol": { paddingLeft: "1.5em", margin: "0.5em 0" },
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedOrg.description }}
                />
              ) : (
                <Typography
                  sx={{
                    fontFamily: fonts.poppins,
                    fontSize: "0.9375rem",
                    color: "#374151",
                    lineHeight: 1.6,
                  }}
                >
                  {DEFAULT_HOW_WE_WORK}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminGovernmentOrgs;
