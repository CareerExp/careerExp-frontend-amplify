import React, { useEffect, useReducer } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { selectToken } from "../redux/slices/authSlice";
import UniversityPublicHero from "../components/university/UniversityPublicHero";
import UnclaimedUniversityInfo from "../components/university/UnclaimedUniversityInfo";
import UniversityDirectoryEspPlaceholderSections from "../components/university/UniversityDirectoryEspPlaceholderSections";
import universityDirectoryReducer, {
  resetUniversityDirectory,
  fetchUniversityBySlug,
  selectUniversity,
  selectUniversityLoading,
  selectUniversityErrorCode,
  selectUniversityError,
  setUniversityPendingClaimForViewer,
  initialUniversityDirectoryState,
} from "../redux/slices/universityDirectorySlice";

const UniversityPage = () => {
  const { slug } = useParams();
  const token = useSelector(selectToken);
  const [state, dispatch] = useReducer(
    universityDirectoryReducer,
    initialUniversityDirectoryState,
  );

  const university = selectUniversity(state);
  const loading = selectUniversityLoading(state);
  const errorCode = selectUniversityErrorCode(state);
  const loadError = selectUniversityError(state);

  useEffect(() => {
    dispatch(resetUniversityDirectory());
    if (slug) {
      fetchUniversityBySlug(slug, dispatch, token);
    }
    return () => {
      dispatch(resetUniversityDirectory());
    };
  }, [slug, token]);

  if (loading && !university) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          pt: "10rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#BC2876" }} />
      </Box>
    );
  }

  if (errorCode === "UNIVERSITY_NOT_FOUND") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          pt: "10rem",
          px: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          University not found.
        </Typography>
        <Button component={Link} to="/explore" variant="contained" sx={{ backgroundColor: "#BC2876" }}>
          Back to Explore
        </Button>
      </Box>
    );
  }

  if (!loading && !university && errorCode !== "UNIVERSITY_NOT_FOUND") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          pt: "10rem",
          px: 2,
          textAlign: "center",
        }}
      >
        <Typography sx={{ mb: 2 }}>{loadError || "Something went wrong."}</Typography>
        <Button component={Link} to="/explore" variant="contained" sx={{ backgroundColor: "#BC2876" }}>
          Back to Explore
        </Button>
      </Box>
    );
  }

  if (!university) {
    return null;
  }

  if (university.claimStatus === "claimed") {
    const claimedSlug = university.claimedOrgSlug || university.claimedOrgProfileSlug;
    const orgType = String(university.claimedOrganizationType || "HEI").toUpperCase();
    const orgBase = orgType === "ESP" ? "/org-esp" : "/org-hei";
    if (claimedSlug) {
      return <Navigate to={`${orgBase}/${encodeURIComponent(claimedSlug)}`} replace />;
    }
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          pt: "10rem",
          pb: 8,
          px: { xs: "1rem", md: "5rem" },
        }}
      >
        <Typography sx={{ mb: 2 }}>
          This university has been claimed. Visit their profile when a public link is available.
        </Typography>
        <Button component={Link} to="/explore" variant="contained" sx={{ backgroundColor: "#BC2876" }}>
          Back to Explore
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        pt: "10rem",
        pb: 8,
        px: { xs: "1rem", md: "5rem" },
      }}
    >
      <Box sx={{ width: "100%", mx: "auto" }}>
        <UniversityPublicHero
          university={university}
          onClaimStatusPending={() => dispatch(setUniversityPendingClaimForViewer())}
        />
        <UnclaimedUniversityInfo university={university} />
        <UniversityDirectoryEspPlaceholderSections />
      </Box>
    </Box>
  );
};

export default UniversityPage;
