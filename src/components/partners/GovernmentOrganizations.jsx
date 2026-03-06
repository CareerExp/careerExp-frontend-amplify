import React, { useState, useEffect, useCallback } from "react";
import { Box, Card, Typography, Button, Stack, CircularProgress } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { fonts } from "../../utility/fonts";
import { getExploreGovernmentOrganizations } from "../../api/partnersExploreApi";

const PAGE_SIZE = 10;

/** Strip HTML tags and decode entities so description shows as plain text. */
function htmlToPlainText(html) {
  if (html == null || typeof html !== "string") return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").trim().replace(/\s+/g, " ");
}

/** Normalize API item to card shape: { id, name, logo, collaboration? } */
function toCardItem(item) {
  const coll = item.collaboration ?? item.description;
  const strip = (v) => htmlToPlainText(v == null ? "" : typeof v === "string" ? v : String(v));
  return {
    id: item.id ?? item.slug ?? JSON.stringify(item),
    name: htmlToPlainText(item.organizationName ?? item.name ?? item.title ?? "—"),
    logo: item.logo ?? item.logoUrl ?? item.image ?? null,
    collaboration: Array.isArray(coll)
      ? {
          title: "How we work together",
          points: coll.map((p, i) => ({
            id: i + 1,
            heading: strip(typeof p === "string" ? p : p?.heading),
            description: strip(typeof p === "string" ? p : p?.description),
          })),
        }
      : typeof coll === "string"
        ? { title: "How we work together", html: coll }
        : coll && typeof coll === "object" && (coll.points || coll.title)
          ? coll.html != null
            ? { title: htmlToPlainText(coll.title) || "How we work together", html: coll.html }
            : {
                title: htmlToPlainText(coll.title) || "How we work together",
                points: (coll.points ?? []).map((p, i) => ({
                  id: p.id ?? i + 1,
                  heading: strip(p.heading),
                  description: strip(p.description),
                })),
              }
          : null,
  };
}

const GovernmentOrganizations = ({ search = "" }) => {
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
        const res = await getExploreGovernmentOrganizations({
          search: search.trim(),
          page: pageNum,
          limit: PAGE_SIZE,
        });
        if (!res?.success || !res?.data) {
          if (!append) setItems([]);
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
    [search]
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
          No government organizations found. Try adjusting your search or filters.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 8 }}>
      <Stack spacing={4}>
        {items.map((partner) => (
          <Card
            key={partner.id}
            sx={{
              p: 2,
              borderRadius: "15px",
              boxShadow: "0px 6px 9px 0px rgba(0,0,0,0.1)",
              position: "relative",
              overflow: "visible",
            }}
          >
            {/* Ribbon Header */}
            <Box
              sx={{
                position: "relative",
                left: -16,
                top: 0,
                mb: 3,
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  bgcolor: "#bc2876",
                  color: "white",
                  px: 2,
                  py: 1,
                  fontSize: "20px",
                  fontWeight: 600,
                  fontFamily: fonts.poppins,
                  boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                {partner.name}
              </Box>
              {/* Decorative Ribbon Fold */}
              <Box
                sx={{
                  width: 0,
                  height: 0,
                  borderTop: "42px solid #bc2876",
                  borderRight: "30px solid transparent",
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                alignItems: "flex-start",
              }}
            >
              {/* Partner Logo */}
              <Box
                sx={{
                  width: { xs: "100%", md: "131px" },
                  height: "123px",
                  backgroundColor: "#F6F6F6",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
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
                  <Typography sx={{ fontFamily: fonts.poppins, fontSize: "14px", color: "#999" }}>
                    No logo
                  </Typography>
                )}
              </Box>

              {/* Collaboration Info – rich HTML from editor or structured points */}
              {partner.collaboration && (
                <Box
                  sx={{
                    flex: 1,
                    border: "1px solid #dddddd",
                    borderRadius: "10px",
                    p: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: fonts.poppins,
                      fontWeight: "bold",
                      fontSize: "16px",
                      mb: 2,
                      color: "#000000",
                    }}
                  >
                    {partner.collaboration.title}
                  </Typography>
                  {partner.collaboration.html ? (
                    <Box
                      sx={{
                        fontFamily: fonts.poppins,
                        fontSize: "14px",
                        color: "#545454",
                        lineHeight: 1.6,
                        "& p": { margin: "0 0 0.75em", fontFamily: fonts.poppins },
                        "& p:last-child": { marginBottom: 0 },
                        "& strong": { fontWeight: 700 },
                        "& ol, & ul": { paddingLeft: "1.5em", margin: "0.5em 0" },
                        "& li": { marginBottom: "0.5em" },
                        "& li p": { margin: "0 0 0.25em" },
                        // Quill alignment – same as article detail / admin gov orgs
                        "& .ql-align-left": { textAlign: "left" },
                        "& .ql-align-center": { textAlign: "center" },
                        "& .ql-align-right": { textAlign: "right" },
                        "& .ql-align-justify": { textAlign: "justify" },
                        "& .ql-align-right ul, & .ql-align-right ol, & ul.ql-align-right, & ol.ql-align-right": {
                          direction: "rtl",
                          paddingRight: "1.5em",
                          paddingLeft: 0,
                          listStylePosition: "outside",
                        },
                        "& .ql-align-right li, & ul.ql-align-right li, & ol.ql-align-right li": { direction: "ltr", textAlign: "right" },
                        "& .ql-align-center ul, & .ql-align-center ol, & ul.ql-align-center, & ol.ql-align-center": {
                          listStylePosition: "inside",
                          paddingLeft: 0,
                          textAlign: "center",
                        },
                      }}
                      dangerouslySetInnerHTML={{ __html: partner.collaboration.html }}
                    />
                  ) : partner.collaboration.points?.length > 0 ? (
                    <Stack spacing={2}>
                      {partner.collaboration.points.map((point, index) => (
                        <Box key={point.id ?? index} sx={{ display: "flex", gap: 1.5 }}>
                          <Typography
                            sx={{
                              fontFamily: fonts.poppins,
                              fontWeight: 600,
                              fontSize: "16px",
                              color: "#000000",
                              minWidth: "20px",
                              textAlign: "right",
                            }}
                          >
                            {index + 1}.
                          </Typography>
                          <Box>
                            {point.heading && (
                              <Typography
                                sx={{
                                  fontFamily: fonts.poppins,
                                  fontWeight: 600,
                                  fontSize: "16px",
                                  color: "#000000",
                                  mb: 0.5,
                                }}
                              >
                                {point.heading}
                              </Typography>
                            )}
                            <Typography
                              sx={{
                                fontFamily: fonts.poppins,
                                fontWeight: 400,
                                fontSize: "14px",
                                color: "#545454",
                                lineHeight: "1.5",
                              }}
                            >
                              {point.description}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  ) : null}
                </Box>
              )}
            </Box>
          </Card>
        ))}
      </Stack>

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

export default GovernmentOrganizations;
