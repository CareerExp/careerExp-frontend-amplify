import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Logo } from "../assets/assest.js";
import renderCurrentPage from "../components/PageRender.jsx";
import Sidebar from "../components/workspace/Sidebar.jsx";
import InitialLoaders from "../loaders/InitialLoaders.jsx";
import {
  logout,
  selectAuthenticated,
  selectToken,
  selectUserId,
} from "../redux/slices/authSlice.js";
import {
  getUserProfile,
  selectUserProfile,
} from "../redux/slices/profileSlice.js";
import {
  selectOrganizationProfile,
  getMyOrganizationProfile,
  resetOrganizationState,
} from "../redux/slices/organizationSlice.js";
import { exitAMEContext } from "../redux/slices/adminSlice.js";
import { config } from "../config/config.js";
import { fonts } from "../utility/fonts.js";

const drawerWidth = 280;

const getQrPropsForWorkspace = (
  userData,
  orgProfile,
  effectiveRole,
  effectiveOrgType,
) => {
  const baseUrl = (config?.frontendDomain || (typeof window !== "undefined" ? window.location.origin : "") || "").replace(/\/$/, "");

  if (effectiveRole === "creator") {
    const id = userData?._id;
    if (!id || !baseUrl)
      return {
        showQrButton: false,
        qrProfileUrl: "",
        qrDisplayName: "",
        qrProfileTypeLabel: "",
      };
    const name =
      [userData?.firstName, userData?.lastName].filter(Boolean).join(" ") ||
      "Counsellor";
    return {
      showQrButton: true,
      qrProfileUrl: `${baseUrl}/profile/${id}`,
      qrDisplayName: name,
      qrProfileTypeLabel: "Counsellor Profile",
    };
  }

  const orgType = (effectiveOrgType || orgProfile?.organizationType || "").toString().toUpperCase();
  const isOrgWithQr =
    effectiveRole === "organization" && (orgType === "HEI" || orgType === "ESP");

  if (isOrgWithQr) {
    const slug = orgProfile?.slug;
    if (!slug || !baseUrl)
      return {
        showQrButton: false,
        qrProfileUrl: "",
        qrDisplayName: "",
        qrProfileTypeLabel: "",
      };
    const path = orgType === "HEI" ? `/org-hei/${slug}` : `/org-esp/${slug}`;
    const name =
      orgProfile?.organizationName || (orgType === "HEI" ? "HEI" : "ESP");
    return {
      showQrButton: true,
      qrProfileUrl: `${baseUrl}${path}`,
      qrDisplayName: name,
      qrProfileTypeLabel: orgType === "HEI" ? "HEI Profile" : "ESP Profile",
    };
  }

  return {
    showQrButton: false,
    qrProfileUrl: "",
    qrDisplayName: "",
    qrProfileTypeLabel: "",
  };
};

const Workspace = (props) => {
  const { window } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const dispatchToRedux = useDispatch();
  const userData = useSelector(selectUserProfile);
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const authenticate = useSelector(selectAuthenticated);
  const orgProfile = useSelector(selectOrganizationProfile);
  const organizationProfileId = params.organizationProfileId;

  // Option 1: view driven only by activeDashboard. Admin "acting as" = admin in org view (no separate route).
  const effectiveRole = userData?.activeDashboard;
  const effectiveOrgType =
    userData?.organization?.organizationType ?? orgProfile?.organizationType;
  const isAdminInOrgView =
    userData?.activeDashboard === "organization" &&
    userData?.role?.includes("admin");

  console.log(orgProfile);
  console.log(effectiveOrgType);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [showActingAsPopup, setShowActingAsPopup] = useState(false);
  const [isExitingContext, setIsExitingContext] = useState(false);

  // Redirect old admin-manage URL to single workspace route so existing links still work
  useEffect(() => {
    if (organizationProfileId && userId) {
      navigate(`/workspace/${userId}`, { replace: true });
    }
  }, [organizationProfileId, userId, navigate]);

  // GET REQUEST – user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      if (authenticate) {
        await dispatchToRedux(getUserProfile({ userId, token }));
        setIsLoading(false);
      } else {
        navigate("/");
      }
    };

    fetchUserProfile();
  }, [authenticate, userId, dispatchToRedux, token, navigate]);

  // When navigating with state.goToDashboard (e.g. from CounsellorDetail "Company Page"), show Dashboard
  useEffect(() => {
    if (location.state?.goToDashboard) {
      setCurrentPage("Dashboard");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.goToDashboard, location.pathname, navigate]);

  // Fetch org profile whenever user is in organization dashboard (real org users + admin acting as; backend resolves context)
  useEffect(() => {
    if (userData?.activeDashboard !== "organization" || !token) return;
    dispatchToRedux(getMyOrganizationProfile({ token }));
  }, [userData?.activeDashboard, token, dispatchToRedux]);

  const hasShownActingAsPopupRef = useRef(false);
  // Show "You are inside ESP dashboard" popup once when admin enters org view
  useEffect(() => {
    if (!isAdminInOrgView) {
      hasShownActingAsPopupRef.current = false;
      return;
    }
    if (hasShownActingAsPopupRef.current) return;
    if (
      orgProfile?.organizationName != null ||
      (orgProfile !== null && orgProfile !== undefined)
    ) {
      hasShownActingAsPopupRef.current = true;
      setShowActingAsPopup(true);
    }
  }, [isAdminInOrgView, orgProfile?.organizationName, orgProfile]);

  const handleBackToAdmin = async () => {
    if (!token || isExitingContext) return;
    setIsExitingContext(true);
    try {
      await dispatchToRedux(exitAMEContext({ token })).unwrap();
      dispatchToRedux(resetOrganizationState());
      navigate(`/workspace/${userId}`);
    } finally {
      setIsExitingContext(false);
    }
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (pageName) => {
    setCurrentPage(pageName);
    handleDrawerClose();
  };

  const handleLogout = () => {
    try {
      dispatchToRedux(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const drawer = (
    <div>
      <Box
        sx={{
          height: "10vh",
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          margin: "1rem",
        }}
      >
        <img
          src={Logo}
          alt="Career Explorer"
          width={"60%"}
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />
      </Box>
      <Divider />

      {userData && (() => {
        const qrProps = getQrPropsForWorkspace(
          userData,
          orgProfile,
          effectiveRole,
          effectiveOrgType,
        );
        return (
          <Sidebar
            userRole={effectiveRole}
            handleMenuItemClick={handleMenuItemClick}
            currentPage={currentPage}
            organizationType={effectiveOrgType}
            isActingAsAME={isAdminInOrgView}
            isMainAdmin={userData?.isMainAdmin === true}
            showQrButton={qrProps.showQrButton}
            qrProfileUrl={qrProps.qrProfileUrl}
            qrDisplayName={qrProps.qrDisplayName}
            qrProfileTypeLabel={qrProps.qrProfileTypeLabel}
          />
        );
      })()}
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#f9fafb", minHeight: "95vh" }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          <InitialLoaders />
        </Box>
      ) : (
        <>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
              backgroundColor: "white",
              boxShadow: "none",
            }}
          >
            <Toolbar
              sx={{
                height: "10vh",
                boxShadow: "none",
                backgroundColor: "#BC2876",
              }}
            >
              <Box sx={{ mr: { xs: "0px", md: "100px" } }}>
                <Typography
                  variant="h7"
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    display: { xs: "none", md: "block" },
                  }}
                >
                  {"Hi " + userData?.firstName + "," || "Hi User,"}
                </Typography>
                <Typography
                  variant="h7"
                  sx={{
                    fontFamily: fonts.sans,
                    whiteSpace: "nowrap",
                    fontWeight: "700",
                    fontSize: "1.2rem",
                    display: { xs: "none", md: "block" },
                  }}
                >
                  {isAdminInOrgView
                    ? "Managing ESP"
                    : userData?.activeDashboard === "creator"
                      ? "Counsellor Hub"
                      : userData?.activeDashboard === "admin"
                        ? "Admin Panel"
                        : "Welcome Back"}
                </Typography>
              </Box>
              <IconButton
                color="black"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  mr: 2,
                  display: { sm: "none" },
                  backgroundColor: "white",
                  borderRadius: "0",
                  padding: "0.5rem",
                }}
              >
                <MenuIcon sx={{ color: "#BC2876" }} />
              </IconButton>

              <Box sx={{ flexGrow: 1 }} />
              {isAdminInOrgView && (
                <Button
                  onClick={handleBackToAdmin}
                  disabled={isExitingContext}
                  sx={{
                    borderRadius: "9999px",
                    backgroundColor: "#ffffff",
                    color: "#545454",
                    textTransform: "none",
                    fontFamily: fonts.sans,
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    px: 2,
                    py: 1,
                    mr: 2,
                    "&:hover": {
                      backgroundColor: "rgba(245, 244, 244, 0.99)",
                    },
                  }}
                >
                  Go to Admin Panel
                </Button>
              )}
              {!isAdminInOrgView && (
                <>
                  <IconButton
                    size="large"
                    aria-label="show new messages"
                    color="gray"
                  ></IconButton>
                  <IconButton
                    size="large"
                    aria-label="show new notifications"
                    color="gray"
                    sx={{ mr: 3 }}
                  ></IconButton>
                  <Box>
                    <Box
                      sx={{
                        backgroundColor: "white",
                        height: "3.25rem",
                        width: "content-fit",
                        display: "flex",
                        fontSize: "1rem",
                        padding: ".4rem",
                        borderRadius: "2rem",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                      onClick={handleOpenUserMenu}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box>
                          <Avatar
                            alt={userData?.name}
                            src={userData?.profilePicture}
                            sx={{
                              width: 40,
                              height: 40,
                              marginRight: { xs: "0rem", md: "1rem" },
                            }}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "600",
                              color: "#696969",
                              fontSize: "1.1rem",
                              display: { xs: "none", md: "block" },
                            }}
                          >
                            {userData?.firstName + " " + userData?.lastName ||
                              "User Name"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          // display: "flex",
                          alignItems: "center",
                          marginLeft: { xs: "0rem", md: "1rem" },
                          display: { xs: "none", md: "block" },
                        }}
                      >
                        <KeyboardArrowDownIcon
                          sx={{
                            paddingRight: ".4rem",
                            pr: "1",
                            color: "black",
                            cursor: "pointer",
                          }}
                        />
                      </Box>
                    </Box>
                    {/* </IconButton> */}
                  </Box>
                </>
              )}

              {!isAdminInOrgView && (
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography
                        textAlign="center"
                        sx={{
                          marginTop: "-0.5rem",
                          fontFamily: fonts.sans,
                          fontSize: "0.9rem",
                          color: "gray",
                          fontWeight: "500",
                        }}
                      >
                        {userData?.email}
                      </Typography>
                      <Divider />
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Box
                      component={Link}
                      to={
                        effectiveRole === "organization" && effectiveOrgType
                          ? (() => {
                              const slugOrId =
                                orgProfile?.slug || orgProfile?.userId;
                              const base =
                                effectiveOrgType === "ESP" ? "/org-esp" : "/org-hei";
                              return slugOrId ? `${base}/${slugOrId}` : base;
                            })()
                          : "/"
                      }
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        textDecoration: "none",
                        width: "100%",
                      }}
                    >
                      <Typography
                        textAlign="left"
                        sx={{ fontFamily: fonts.sans, color: "black" }}
                      >
                        Home
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Box
                      component={Link}
                      to="/"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        textDecoration: "none",
                        width: "100%",
                      }}
                      onClick={handleLogout}
                    >
                      <Typography
                        textAlign="left"
                        sx={{ fontFamily: fonts.sans, color: "red" }}
                      >
                        Logout
                      </Typography>
                    </Box>
                  </MenuItem>
                </Menu>
              )}
            </Toolbar>
          </AppBar>

          {/* Side bar */}
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
          >
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onTransitionEnd={handleDrawerTransitionEnd}
              onClose={handleDrawerClose}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: "none", sm: "block" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                  backgroundColor: "#f9fafb",
                },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>
          {/* Pages */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
          >
            <Toolbar />

            {userData &&
              renderCurrentPage(currentPage, userData, orgProfile, {
                isAdminInOrgView,
                onProceedToSubscription: () => {
                  setCurrentPage("Profile");
                  navigate(".", {
                    state: { openSubscriptionTab: true },
                    replace: true,
                  });
                },
              })}
          </Box>

          {/* Acting-as AME: popup on first load */}
          <Dialog
            open={showActingAsPopup && isAdminInOrgView}
            onClose={() => setShowActingAsPopup(false)}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: { borderRadius: "16px", p: 0.5 },
            }}
          >
            <DialogContent>
              <Typography
                sx={{
                  fontFamily: fonts.poppins,
                  fontSize: "24px",
                  color: "#333",
                  fontWeight: 700,
                  lineHeight: 1.5,
                  textAlign: "center",
                }}
              >
                You are inside ESP dashboard now.
              </Typography>
              <Typography
                sx={{
                  fontFamily: fonts.poppins,
                  fontSize: "16px",
                  color: "#666666",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  textAlign: "center",
                }}
              >
                Managing:{" "}
                <strong>{orgProfile?.organizationName || "this ESP"}</strong>
              </Typography>
            </DialogContent>
            {/* <DialogActions sx={{ px: 2.5, pb: 2 }}>
              <Button
                onClick={() => setShowActingAsPopup(false)}
                variant="contained"
                sx={{
                  fontFamily: fonts.poppins,
                  fontWeight: 600,
                  background: "linear-gradient(161.01deg, #BF2F75 3.87%, #720361 63.8%)",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                OK
              </Button>
            </DialogActions> */}
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default Workspace;
