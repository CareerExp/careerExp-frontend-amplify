import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

import { background, leftPannelAuth, Logo } from "../assets/assest.js";
import FormField from "../components/FormField.jsx";
import { notify } from "../redux/slices/alertSlice.js";
import { setCredentials } from "../redux/slices/authSlice.js";
import {
  validateAdminInvite,
  acceptAdminInvite,
} from "../redux/slices/adminSlice.js";
import loginStyles from "../styles/Login.module.css";
import { fonts } from "../utility/fonts.js";

const INVITE_ERROR_MESSAGES = {
  TOKEN_REQUIRED: "Invalid link. No invite token provided.",
  INVALID_INVITE: "This invite link is invalid.",
  INVITE_ALREADY_USED: "This invite has already been used.",
  INVITE_EXPIRED: "This invite has expired. Please request a new one.",
  EMAIL_ALREADY_REGISTERED:
    "This email is already registered. Please log in with your existing account.",
};

function passwordMeetsRules(password) {
  return (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password)
  );
}

const AcceptAdminInvite = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [validating, setValidating] = useState(!!token);
  const [validationError, setValidationError] = useState(null);
  const [emailMasked, setEmailMasked] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!token) {
      setValidating(false);
      setValidationError({ message: INVITE_ERROR_MESSAGES.TOKEN_REQUIRED, code: "TOKEN_REQUIRED" });
      return;
    }
    let cancelled = false;
    (async () => {
      const result = await dispatch(validateAdminInvite({ token }));
      if (cancelled) return;
      setValidating(false);
      if (validateAdminInvite.fulfilled.match(result)) {
        setEmailMasked(result.payload?.data?.emailMasked || "");
        setValidationError(null);
      } else {
        const err = result.payload || result.error;
        setValidationError({
          message: err?.message || "Invalid or expired invite",
          code: err?.code,
        });
      }
    })();
    return () => { cancelled = true; };
  }, [token, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, mobile, password, confirmPassword } = formData;
    if (!firstName?.trim() || !lastName?.trim() || !mobile?.trim() || !password || !confirmPassword) {
      dispatch(notify({ type: "warning", message: "Please fill all fields" }));
      return;
    }
    if (!passwordMeetsRules(password)) {
      dispatch(
        notify({
          type: "warning",
          message: "Password must be at least 6 characters with one uppercase letter and one number.",
        }),
      );
      return;
    }
    if (password !== confirmPassword) {
      dispatch(notify({ type: "warning", message: "Passwords do not match" }));
      return;
    }
    setSubmitting(true);
    const result = await dispatch(
      acceptAdminInvite({
        token,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobile: mobile.trim(),
        password,
      }),
    );
    setSubmitting(false);
    if (acceptAdminInvite.fulfilled.match(result)) {
      const data = result.payload?.data;
      if (data?.token && data?.user?._id) {
        dispatch(setCredentials({ token: data.token, userId: data.user._id }));
        dispatch(notify({ type: "success", message: result.payload?.message || "Account created. Welcome!" }));
        navigate(`/workspace/${data.user._id}`, { replace: true });
      } else {
        dispatch(notify({ type: "error", message: "Invalid response. Please try again." }));
      }
    } else {
      const err = result.payload || result.error;
      const message = err?.code && INVITE_ERROR_MESSAGES[err.code]
        ? INVITE_ERROR_MESSAGES[err.code]
        : err?.message || "Failed to complete signup";
      dispatch(notify({ type: "error", message }));
    }
  };

  const displayError = validationError
    ? (INVITE_ERROR_MESSAGES[validationError.code] || validationError.message)
    : null;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundImage: `url(${background})`,
        }}
      >
        <Box sx={{ display: "flex", width: "100%", flex: 1 }} className={loginStyles.container}>
          <Box
            sx={{
              height: "100vh",
              width: "50%",
              marginLeft: "5rem",
              display: { xs: "none", md: "block" },
            }}
            className={loginStyles.left}
          >
            <img src={leftPannelAuth} alt="Hero" height="100%" />
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "476px" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              boxSizing: "border-box",
              marginBottom: { xs: "3rem", md: 0 },
            }}
            className={loginStyles.right}
          >
            <Link to="/">
              <Box marginBottom="1rem">
                <img src={Logo} alt="Logo" width="210px" className={loginStyles.logo} />
              </Box>
            </Link>
            <Box
              sx={{
                backgroundColor: "#ffffff",
                width: { xs: "90%", md: "476px" },
                borderRadius: "29px",
                alignItems: "center",
                boxShadow: "0px 14px 44px 0px #0000001A",
                paddingBottom: "2rem",
                paddingTop: "1rem",
              }}
            >
              {validating ? (
                <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
                  <CircularProgress sx={{ color: "#720361" }} />
                </Box>
              ) : displayError ? (
                <Box sx={{ px: 3, py: 4, textAlign: "center" }}>
                  <Typography
                    sx={{
                      fontFamily: fonts.poppins,
                      fontWeight: 600,
                      fontSize: "18px",
                      color: "#d32f2f",
                      mb: 2,
                    }}
                  >
                    {displayError}
                  </Typography>
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    <Typography sx={{ fontFamily: fonts.poppins, color: "#720361", fontWeight: 600 }}>
                      Go to Login
                    </Typography>
                  </Link>
                </Box>
              ) : (
                <>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      textAlign: "center",
                      paddingTop: "2rem",
                      fontFamily: fonts.poppins,
                    }}
                  >
                    Accept Admin Invite
                  </Typography>
                  {emailMasked && (
                    <Typography
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        textAlign: "center",
                        color: "#787878",
                        fontSize: "16px",
                        fontFamily: fonts.poppins,
                        mt: 1,
                      }}
                    >
                      Complete signup for {emailMasked}
                    </Typography>
                  )}
                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                      padding: "2rem",
                    }}
                  >
                    <FormField
                      label="First Name"
                      name="firstName"
                      type="text"
                      onChange={handleChange}
                      width="100%"
                    />
                    <FormField
                      label="Last Name"
                      name="lastName"
                      type="text"
                      onChange={handleChange}
                      width="100%"
                    />
                    <FormField
                      label="Mobile"
                      name="mobile"
                      type="tel"
                      onChange={handleChange}
                      width="100%"
                    />
                    <FormField
                      label="Password"
                      name="password"
                      type="password"
                      onChange={handleChange}
                      width="100%"
                    />
                    <FormField
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      onChange={handleChange}
                      width="100%"
                    />
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: fonts.poppins, color: "#787878", display: "block", mt: 0.5 }}
                    >
                      At least 6 characters, one uppercase letter and one number.
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                      {submitting ? (
                        <Button
                          variant="contained"
                          disabled
                          sx={{
                            background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
                            width: "50%",
                            borderRadius: "2rem",
                            padding: "10px 0px",
                            fontWeight: "bold",
                          }}
                        >
                          <CircularProgress size={25} color="inherit" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          variant="contained"
                          sx={{
                            background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
                            width: "50%",
                            "&:hover": {
                              background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
                            },
                            borderRadius: "2rem",
                            padding: "10px 0px",
                            fontWeight: "bold",
                          }}
                        >
                          Create account
                        </Button>
                      )}
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AcceptAdminInvite;
