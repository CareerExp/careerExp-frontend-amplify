import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Card, Chip, Typography, Button, CircularProgress } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { fonts } from "../../utility/fonts";
import { listUniversities } from "../../api/partnersExploreApi";

const PAGE_SIZE = 10;

export function getInitials(name) {
  if (!name || typeof name !== "string") return "—";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "—";
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function toCardItem(item) {
  return {
    id: item.slug ?? item._id ?? item.id,
    slug: item.slug,
    name: item.name ?? item.organizationName ?? "—",
    logo: item.logo ?? item.logoUrl ?? null,
  };
}

/** External hosts (e.g. topuniversities.com) block hotlinking unless referer is stripped. */
export function UniversityCardLogo({ name, logo }) {
  const [failed, setFailed] = useState(false);
  const src = typeof logo === "string" ? logo : logo?.url;

  if (!src || failed) {
    return (
      <Typography
        sx={{
          fontFamily: fonts.poppins,
          fontWeight: 600,
          fontSize: "28px",
          color: "#545454",
          letterSpacing: "0.02em",
        }}
      >
        {getInitials(name)}
      </Typography>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={name}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      sx={{
        maxWidth: "90%",
        maxHeight: "90%",
        objectFit: "contain",
      }}
    />
  );
}

const UniversityDirectoryList = ({ search = "", country = "" }) => {
  const navigate = useNavigate();
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
        const res = await listUniversities({
          search: search.trim(),
          country: country.trim(),
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
    [search, country],
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
          No universities found. Try adjusting your search or filters.
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
              onClick={() => partner.slug && navigate(`/university/${partner.slug}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" && partner.slug) {
                  navigate(`/university/${partner.slug}`);
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
                cursor: partner.slug ? "pointer" : "default",
                "&:hover": {
                  transform: partner.slug ? "translateY(-5px)" : "none",
                },
              }}
            >
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

export default UniversityDirectoryList;
