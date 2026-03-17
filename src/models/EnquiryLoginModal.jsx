import { Box, Button, Dialog, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { buttonStyle } from "../utility/commonStyle.js";
import { fonts } from "../utility/fonts.js";

const EnquiryLoginModal = ({ open, onClose }) => {
    const navigate = useNavigate();

    const handleSignup = () => {
        navigate("/login");
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
                borderRadius: "24px",
            }}
            fullWidth={true}
            maxWidth="xs"
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
                    Login Required
                </Typography>
            </Box>

            <Box
                sx={{
                    mx: { xs: "0.5rem", sm: "0.75rem", md: "1rem" },
                    marginBottom: { xs: "0.5rem", sm: "0.75rem", md: "1rem" },
                    //   border: "1px solid #C5C6C7",
                    // p: { xs: "0.5rem", sm: "0.75rem", md: "1rem" },
                    // borderRadius: "12px",
                }}
            >
                <Typography
                    sx={{
                        fontFamily: fonts?.sans,
                        padding: { xs: "10px", sm: "15px", md: "20px" },
                        textAlign: "center",
                    }}
                >
                    You need to log in to enquire.
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: { xs: "0 10px 10px", sm: "0 15px", md: "0 20px" },
                    }}
                >
                    <Button
                        onClick={handleSignup}
                        sx={{
                            ...buttonStyle,
                            width: { xs: "100%", sm: "40%", md: "30%" },
                        }}
                    >
                        Login
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default EnquiryLoginModal;
