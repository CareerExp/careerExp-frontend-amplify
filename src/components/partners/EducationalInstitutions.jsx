import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Card, Chip, Typography, Button, CircularProgress } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { fonts } from "../../utility/fonts";
import { getExploreEi, listUniversities } from "../../api/partnersExploreApi";
import { UniversityCardLogo } from "./UniversityDirectoryList";

const PAGE_SIZE = 10;

function toOnboardedCard(item) {
  const slug = item.slug ?? null;
  return {
    id: `org-${slug ?? item._id ?? item.id}`,
    slug,
    name: item.organizationName ?? item.name ?? "—",
    logo: item.logo ?? item.logoUrl ?? item.image ?? null,
    path: slug ? `/org-hei/${slug}` : null,
    isUnclaimed: false,
  };
}

function toDirectoryCard(item) {
  const slug = item.slug ?? null;
  return {
    id: `uni-${slug ?? item._id ?? item.id}`,
    slug,
    name: item.name ?? item.organizationName ?? "—",
    logo: item.logo ?? item.logoUrl ?? null,
    path: slug ? `/university/${slug}` : null,
    isUnclaimed: true,
  };
}

const EducationalInstitutions = ({ search = "", country = "", language = "", program = "" }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [onboardedPage, setOnboardedPage] = useState(1);
  const [univPage, setUnivPage] = useState(1);
  const [onboardedHasMore, setOnboardedHasMore] = useState(false);
  const [univHasMore, setUnivHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const queryParams = {
    search: search.trim(),
    country: country.trim(),
    language: language.trim(),
    program: program.trim(),
  };

  const fetchInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [eiRes, uniRes] = await Promise.all([
        getExploreEi({ ...queryParams, page: 1, limit: PAGE_SIZE }),
        listUniversities({ search: queryParams.search, country: queryParams.country, page: 1, limit: PAGE_SIZE }),
      ]);

      const onboarded =
        eiRes?.success && eiRes?.data?.items
          ? eiRes.data.items.map(toOnboardedCard)
          : [];
      const directory =
        uniRes?.success && uniRes?.data?.items
          ? uniRes.data.items.map(toDirectoryCard)
          : [];

      setItems([...onboarded, ...directory]);
      setOnboardedPage(1);
      setUnivPage(1);
      setOnboardedHasMore(!!eiRes?.data?.hasMore);
      setUnivHasMore(!!uniRes?.data?.hasMore);
    } catch (err) {
      setError(err?.message || "Failed to load.");
      setItems([]);
      setOnboardedHasMore(false);
      setUnivHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [queryParams.search, queryParams.country, queryParams.language, queryParams.program]);

  useEffect(() => {
    fetchInitial();
  }, [fetchInitial]);

  const hasMore = onboardedHasMore || univHasMore;

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      if (onboardedHasMore) {
        const nextPage = onboardedPage + 1;
        const eiRes = await getExploreEi({ ...queryParams, page: nextPage, limit: PAGE_SIZE });
        const newCards =
          eiRes?.success && eiRes?.data?.items
            ? eiRes.data.items.map(toOnboardedCard)
            : [];
        setItems((prev) => [...prev, ...newCards]);
        setOnboardedPage(nextPage);
        setOnboardedHasMore(!!eiRes?.data?.hasMore);
      } else if (univHasMore) {
        const nextPage = univPage + 1;
        const uniRes = await listUniversities({
          search: queryParams.search,
          country: queryParams.country,
          page: nextPage,
          limit: PAGE_SIZE,
        });
        const newCards =
          uniRes?.success && uniRes?.data?.items
            ? uniRes.data.items.map(toDirectoryCard)
            : [];
        setItems((prev) => [...prev, ...newCards]);
        setUnivPage(nextPage);
        setUnivHasMore(!!uniRes?.data?.hasMore);
      }
    } catch (err) {
      setError(err?.message || "Failed to load more.");
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading && items.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress sx={{ color: "#bf2f75" }} />
      </Box>
    );
  }

  if (error && items.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography sx={{ fontFamily: fonts.poppins, color: "text.secondary" }}>
          {error}
        </Typography>
      </Box>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Typography
          sx={{
            fontFamily: fonts.poppins,
            fontSize: "18px",
            color: "#545454",
            fontWeight: 500,
          }}
        >
          No education institutions found. Try adjusting your search or filters.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={4}>
        {items.map((partner) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={partner.id}>
            <Card
              onClick={() => partner.path && navigate(partner.path)}
              role={partner.path ? "button" : undefined}
              tabIndex={partner.path ? 0 : undefined}
              onKeyDown={(e) => {
                if (e.key === "Enter" && partner.path) {
                  navigate(partner.path);
                }
              }}
              sx={{
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
                borderRadius: "15px",
                boxShadow: "0px 6px 9px 0px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease-in-out",
                cursor: partner.path ? "pointer" : "default",
                "&:hover": {
                  transform: partner.path ? "translateY(-5px)" : "none",
                },
              }}
            >
              {partner.isUnclaimed && (
                <Chip
                  label="Unclaimed"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "#FFF3E0",
                    color: "#E65100",
                    fontFamily: fonts.poppins,
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: "20px",
                    border: "1px solid #E65100",
                    zIndex: 1,
                  }}
                />
              )}
              <Box
                sx={{
                  width: "100%",
                  height: "123px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  overflow: "hidden",
                  backgroundColor: partner.logo ? "transparent" : "#E8E8E8",
                }}
              >
                <UniversityCardLogo name={partner.name} logo={partner.logo} />
              </Box>
              <Typography
                sx={{
                  fontFamily: fonts.poppins,
                  fontWeight: 600,
                  fontSize: "16px",
                  textAlign: "center",
                  color: "#000000",
                  lineHeight: "1.2",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  height: "3.6em",
                }}
              >
                {partner.name}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loadingMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress size={28} sx={{ color: "#bf2f75" }} />
        </Box>
      )}

      {hasMore && !loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Button
            variant="contained"
            disabled={loadingMore}
            endIcon={<KeyboardArrowDownIcon />}
            onClick={handleLoadMore}
            sx={{
              background: "linear-gradient(156.46deg, #bf2f75 3.87%, #720361 63.8%)",
              borderRadius: "90px",
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontFamily: fonts.poppins,
              fontWeight: 600,
              fontSize: "16px",
              "&:hover": {
                background: "linear-gradient(156.46deg, #bf2f75 3.87%, #720361 63.8%)",
                opacity: 0.9,
              },
            }}
          >
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default EducationalInstitutions;
