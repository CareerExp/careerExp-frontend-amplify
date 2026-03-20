import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

/** Activity types for user dashboard – GET /api/dashboard/activity/:type */
const ACTIVITY_TYPES = ["videos", "articles", "podcasts", "announcements", "events", "services"];

/**
 * Backend may return `podcastId` / nested `podcast` / `spotifyThumbnailUrl` while the UI expects
 * `id`, `thumbnail`, `title` (same idea for other types).
 */
function normalizeDashboardActivityItem(raw, listType) {
  if (!raw || typeof raw !== "object") return raw;
  const nestedKey =
    listType === "podcasts"
      ? "podcast"
      : listType === "videos"
        ? "video"
        : listType === "articles"
          ? "article"
          : null;
  const nested =
    nestedKey && raw[nestedKey] && typeof raw[nestedKey] === "object"
      ? raw[nestedKey]
      : null;
  const item = nested ? { ...nested, ...raw } : raw;

  const id =
    item.id ??
    item._id ??
    (listType === "podcasts" ? item.podcastId : null) ??
    (listType === "videos" ? item.videoId : null) ??
    (listType === "articles" ? item.articleId : null) ??
    (listType === "announcements" ? item.announcementId : null) ??
    (listType === "events" ? item.eventId : null) ??
    (listType === "services" ? item.serviceId : null);

  const thumbnail =
    item.thumbnail ??
    item.coverImage ??
    item.thumbNail ??
    item.spotifyThumbnailUrl ??
    item.imageUrl ??
    item.image;

  const title = item.title ?? item.name ?? "";
  const rating = item.rating ?? item.userRating ?? item.myRating;
  const shared = item.shared ?? item.shares ?? item.shareCount;
  const notes = item.notes ?? item.userNotes;

  return {
    ...item,
    ...(id != null && id !== "" ? { id: String(id) } : {}),
    ...(thumbnail ? { thumbnail: String(thumbnail) } : {}),
    ...(title !== undefined ? { title } : {}),
    ...(rating != null ? { rating: Number(rating) || rating } : {}),
    ...(shared != null ? { shared: Number(shared) || 0 } : {}),
    ...(notes != null ? { notes } : {}),
  };
}

function activityItemMatchesContentId(item, contentId) {
  if (!item || contentId == null) return false;
  const cid = String(contentId);
  return (
    String(item.id) === cid ||
    String(item._id) === cid ||
    String(item.podcastId) === cid ||
    String(item.videoId) === cid ||
    String(item.articleId) === cid
  );
}

const initialState = {
  /** Per-type state: { items, total, currentPage, totalPages, loading, error } */
  byType: {},
  /** Last fetched type for single thunk usage */
  lastType: null,
  /** GET /api/dashboard/activity/following – list of who the user follows */
  following: { items: [], total: 0, loading: false, error: null },
};

/**
 * GET /api/dashboard/activity/:type – Paginated user activity (role user only).
 * Uses JWT; no userId in URL.
 * @param {{ type: string, page?: number, limit?: number, token: string }} payload
 */
export const getDashboardActivity = createAsyncThunk(
  "dashboardActivity/getDashboardActivity",
  async ({ type, page = 1, limit = 20, token }, { rejectWithValue }) => {
    const normalizedType = (type || "").toLowerCase();
    if (!ACTIVITY_TYPES.includes(normalizedType)) {
      return rejectWithValue({ message: `Invalid activity type: ${type}` });
    }
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(Math.min(limit, 100)));
      const response = await FetchApi.fetch(
        `${config.api}/api/dashboard/activity/${normalizedType}?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.success) {
        return rejectWithValue({ message: response.message || "Failed to load activity" });
      }
      const data = response.data || response;
      const rawItems = data.items ?? [];
      const items = rawItems.map((row) =>
        normalizeDashboardActivityItem(row, normalizedType),
      );
      return {
        type: normalizedType,
        items,
        total: data.total ?? 0,
        currentPage: data.currentPage ?? page,
        totalPages: data.totalPages ?? 1,
      };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to load activity",
      });
    }
  },
);

/**
 * GET /api/dashboard/activity/following – List everyone the current user follows (counsellors, orgs ESP/EI, users). Role user only.
 */
export const getDashboardFollowing = createAsyncThunk(
  "dashboardActivity/getDashboardFollowing",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/dashboard/activity/following`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.success) {
        return rejectWithValue({ message: response.message || "Failed to load following" });
      }
      const data = response.data || response;
      return {
        items: data.items ?? [],
        total: data.total ?? 0,
      };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to load following",
      });
    }
  },
);

/**
 * PATCH /api/dashboard/activity/notes – Update user notes for an activity item.
 * Body: { contentType, contentId, notes }. contentType: "video"|"article"|"podcast"|"announcement"|"event"|"service"
 */
export const updateActivityNotes = createAsyncThunk(
  "dashboardActivity/updateActivityNotes",
  async ({ contentType, contentId, notes, token }, { rejectWithValue }) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/dashboard/activity/notes`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            contentType,
            contentId,
            notes: notes ?? "",
          }),
        },
      );
      if (!response.success) {
        return rejectWithValue({ message: response.message || "Failed to update notes" });
      }
      return { contentType, contentId, notes: notes ?? "" };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to update notes",
      });
    }
  },
);

const dashboardActivitySlice = createSlice({
  name: "dashboardActivity",
  initialState,
  reducers: {
    clearActivityByType: (state, action) => {
      const type = action.payload;
      if (type) state.byType[type] = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardActivity.pending, (state, action) => {
        const type = action.meta.arg?.type?.toLowerCase();
        if (type) {
          if (!state.byType[type]) state.byType[type] = {};
          state.byType[type].loading = true;
          state.byType[type].error = null;
        }
      })
      .addCase(getDashboardActivity.fulfilled, (state, action) => {
        const { type, items, total, currentPage, totalPages } = action.payload;
        state.lastType = type;
        if (!state.byType[type]) state.byType[type] = {};
        state.byType[type].items = items;
        state.byType[type].total = total;
        state.byType[type].currentPage = currentPage;
        state.byType[type].totalPages = totalPages;
        state.byType[type].loading = false;
        state.byType[type].error = null;
      })
      .addCase(getDashboardActivity.rejected, (state, action) => {
        const type = action.meta.arg?.type?.toLowerCase();
        if (type) {
          if (!state.byType[type]) state.byType[type] = {};
          state.byType[type].loading = false;
          state.byType[type].error = action.payload?.message || "Failed to load";
        }
      })
      .addCase(updateActivityNotes.fulfilled, (state, action) => {
        const { contentType, contentId, notes } = action.payload;
        const type = contentType === "video" ? "videos" : contentType === "article" ? "articles" : contentType === "podcast" ? "podcasts" : contentType === "announcement" ? "announcements" : contentType === "event" ? "events" : contentType === "service" ? "services" : null;
        if (type && state.byType[type]?.items) {
          const idx = state.byType[type].items.findIndex((i) =>
            activityItemMatchesContentId(i, contentId),
          );
          if (idx !== -1)
            state.byType[type].items[idx] = {
              ...state.byType[type].items[idx],
              notes: notes ?? "",
            };
        }
      })
      .addCase(getDashboardFollowing.pending, (state) => {
        state.following.loading = true;
        state.following.error = null;
      })
      .addCase(getDashboardFollowing.fulfilled, (state, action) => {
        state.following.items = action.payload.items ?? [];
        state.following.total = action.payload.total ?? 0;
        state.following.loading = false;
        state.following.error = null;
      })
      .addCase(getDashboardFollowing.rejected, (state, action) => {
        state.following.loading = false;
        state.following.error = action.payload?.message ?? "Failed to load";
      });
  },
});

export const { clearActivityByType } = dashboardActivitySlice.actions;
export const selectDashboardActivityByType = (state, type) =>
  state.dashboardActivity?.byType?.[type] ?? {};
export const selectDashboardActivityLoading = (state, type) =>
  state.dashboardActivity?.byType?.[type]?.loading ?? false;
export const selectDashboardFollowing = (state) => state.dashboardActivity?.following ?? { items: [], total: 0, loading: false, error: null };
export default dashboardActivitySlice.reducer;
