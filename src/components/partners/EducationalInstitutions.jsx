import React, { useState, useEffect, useCallback } from "react";
import { Box, Grid, Card, Typography, Button, CircularProgress } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { fonts } from "../../utility/fonts";
import { getExploreEi } from "../../api/partnersExploreApi";

const PAGE_SIZE = 10;

/** Get initials from organization name (e.g. "University of Pune" -> "UoP"), max 3 chars. */
function getInitials(name) {
  if (!name || typeof name !== "string") return "—";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "—";
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** Normalize API item to card shape: { id, name, logo } */
function toCardItem(item) {
  return {
    id: item.id ?? item.slug ?? JSON.stringify(item),
    name: item.organizationName ?? item.name ?? item.title ?? "—",
    logo: item.logo ?? item.logoUrl ?? item.image ?? null,
  };
}

const EducationalInstitutions = ({ search = "", country = "", language = "", program = "" }) => {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchPage = useCallback(
    async (pageNum, append = false) => {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);
      try {
        const res = await getExploreEi({
          search: search.trim(),
          country: country.trim(),
          language: language.trim(),
          program: program.trim(),
          page: pageNum,
          limit: PAGE_SIZE,
        });
        if (!res?.success || !res?.data) {
          setItems(append ? items : []);
          setHasMore(false);
          return;
        }
        const { items: rawItems = [], hasMore: more } = res.data;
        const newCards = rawItems.map(toCardItem);
        if (append) {
          setItems((prev) => [...prev, ...newCards]);
        } else {
          setItems(newCards);
        }
        setHasMore(!!more);
        setPage(pageNum);
      } catch (err) {
        setError(err?.message || "Failed to load.");
        if (!append) setItems([]);
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [search, country, language, program]
  );

  useEffect(() => {
    fetchPage(1, false);
  }, [fetchPage]);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    fetchPage(page + 1, true);
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
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
                borderRadius: "15px",
                boxShadow: "0px 6px 9px 0px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
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
                {partner.logo ? (
                  <Box
                    component="img"
                    src={typeof partner.logo === "string" ? partner.logo : partner.logo?.url}
                    alt={partner.name}
                    sx={{
                      maxWidth: "90%",
                      maxHeight: "90%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      fontFamily: fonts.poppins,
                      fontWeight: 600,
                      fontSize: "28px",
                      color: "#545454",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {getInitials(partner.name)}
                  </Typography>
                )}
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
