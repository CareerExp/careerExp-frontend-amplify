import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
import { fonts } from "../utility/fonts.js";
const drawerWidth = 280;

const Workspace = (props) => {
  const { window } = props;
  const navigate = useNavigate();
  const dispatchToRedux = useDispatch();
  const userData = useSelector(selectUserProfile);
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const authenticate = useSelector(selectAuthenticated);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);

  // GET REQUEST
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

      {userData && (
        <Sidebar
          userRole={userData?.activeDashboard}
          handleMenuItemClick={handleMenuItemClick}
          currentPage={currentPage}
        />
      )}
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f9fafb" }}>
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
                  {userData?.activeDashboard === "creator"
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
                    to="/"
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

            {userData && renderCurrentPage(currentPage, userData)}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Workspace;
