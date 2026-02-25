import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, CircularProgress } from "@mui/material";
import { fonts } from "../../utility/fonts";
import ESPSlider from "./ESPSlider";
import {
  getPublicAnnouncements,
  getPublicEvents,
  selectOrgPublicAnnouncements,
  selectOrgPublicEvents,
  selectOrgPublicAnnouncementsLoading,
  selectOrgPublicEventsLoading,
} from "../../redux/slices/orgPublicSlice";
import { OrgPublicAnnouncementCard } from "./OrgPublicAnnouncements";
import { OrgPublicEventCard } from "./OrgPublicEvents";

/**
 * Combined "Announcements and Events" section: fetches both and displays in one slider.
 * Items are merged and ordered by date (most recent first).
 */
const OrgPublicAnnouncementsAndEvents = ({ identifier, idType }) => {
  const dispatch = useDispatch();
  const announcements = useSelector(selectOrgPublicAnnouncements);
  const events = useSelector(selectOrgPublicEvents);
  const loadingAnn = useSelector(selectOrgPublicAnnouncementsLoading);
  const loadingEvt = useSelector(selectOrgPublicEventsLoading);

  useEffect(() => {
    if (!identifier || !idType) return;
    dispatch(getPublicAnnouncements({ identifier, idType, limit: 12, sortBy: "recent" }));
    dispatch(getPublicEvents({ identifier, idType, limit: 12, sortBy: "recent" }));
  }, [dispatch, identifier, idType]);

  if (!identifier) return null;

  const loading = loadingAnn || loadingEvt;
  const items = [
    ...announcements.map((a) => ({ type: "announcement", ...a, _sortDate: a.createdAt || a.liveStartDate || a.updatedAt })),
    ...events.map((e) => ({ type: "event", ...e, _sortDate: e.liveStartDate || e.eventDate || e.createdAt || e.updatedAt })),
  ].sort((a, b) => {
    const da = a._sortDate ? new Date(a._sortDate).getTime() : 0;
    const db = b._sortDate ? new Date(b._sortDate).getTime() : 0;
    return db - da;
  });

  if (loading && items.length === 0) {
    return (
      <Box sx={{ my: 6, display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress sx={{ color: "#BC2876" }} />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ my: 6 }}>
        <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: "32px", color: "#000", mb: 3 }}>
          Announcements and Events
        </Typography>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: "16px", color: "#666" }}>
          No announcements or events yet.
        </Typography>
      </Box>
    );
  }

  return (
    <ESPSlider title="Announcements and Events">
      {items.map((item) =>
        item.type === "event" ? (
          <OrgPublicEventCard key={`event-${item._id}`} event={item} />
        ) : (
          <OrgPublicAnnouncementCard key={`announcement-${item._id}`} announcement={item} />
        )
      )}
    </ESPSlider>
  );
};

export default OrgPublicAnnouncementsAndEvents;
