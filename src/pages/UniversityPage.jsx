import React, { useEffect, useReducer } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import UniversityPublicHero from "../components/university/UniversityPublicHero";
import UnclaimedUniversityInfo from "../components/university/UnclaimedUniversityInfo";
import universityDirectoryReducer, {
  resetUniversityDirectory,
  fetchUniversityBySlug,
  selectUniversity,
  selectUniversityLoading,
  selectUniversityErrorCode,
  selectUniversityError,
  setUniversityClaimStatus,
  initialUniversityDirectoryState,
} from "../redux/slices/universityDirectorySlice";

const UniversityPage = () => {
  const { slug } = useParams();
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
      fetchUniversityBySlug(slug, dispatch);
    }
    return () => {
      dispatch(resetUniversityDirectory());
    };
  }, [slug]);

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
          This university has been claimed. Visit their profile.
        </Typography>
        {claimedSlug ? (
          <Button component={Link} to={`/org-hei/${claimedSlug}`} variant="contained" sx={{ backgroundColor: "#BC2876" }}>
            Open institution profile
          </Button>
        ) : null}
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
          onClaimStatusPending={() => dispatch(setUniversityClaimStatus("pending"))}
        />
        <UnclaimedUniversityInfo university={university} />
      </Box>
    </Box>
  );
};

export default UniversityPage;
