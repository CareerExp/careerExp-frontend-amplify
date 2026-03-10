import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";
import { getActingAsHeader } from "../../utility/getActingAsHeader.js";

const BASE = `${config.api}/api/organization/public`;

function pathFor(identifier, idType) {
  if (idType === "slug") return `${BASE}/s/${encodeURIComponent(identifier)}`;
  return `${BASE}/v/${encodeURIComponent(identifier)}`;
}

/** Headers for public org API: Bearer token when logged in, and X-Acting-As-Organization-Id when admin is in AME context (same as profile/me). */
function getPublicHeaders(thunkAPI) {
  const state = thunkAPI.getState();
  const token = state?.auth?.token;
  const actingAs = getActingAsHeader(() => state);
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  Object.assign(headers, actingAs);
  return headers;
}

const initialState = {
  profile: null,
  profileError: null,
  profileErrorCode: null,
  profileLoading: false,
  announcements: [],
  totalAnnouncements: 0,
  announcementsPage: 1,
  totalAnnouncementsPages: 0,
  announcementsLoading: false,
  services: [],
  totalServices: 0,
  servicesPage: 1,
  totalServicesPages: 0,
  servicesLoading: false,
  events: [],
  totalEvents: 0,
  eventsPage: 1,
  totalEventsPages: 0,
  eventsLoading: false,
  videos: [],
  totalVideos: 0,
  videosPage: 1,
  totalVideosPages: 0,
  videosLoading: false,
  counsellors: [],
  totalCounsellors: 0,
  counsellorsPage: 1,
  totalCounsellorsPages: 0,
  counsellorsLoading: false,
};

/** GET organization public profile by slug or userId. Sends token when available so org users can view their public page. */
export const getPublicOrgProfile = createAsyncThunk(
  "orgPublic/getProfile",
  async ({ identifier, idType }, thunkAPI) => {
    try {
      const url = pathFor(identifier, idType);
      const response = await FetchApi.fetch(url, {
        method: "GET",
        headers: getPublicHeaders(thunkAPI),
      });
      if (!response.success) {
        return thunkAPI.rejectWithValue({
          error: response.message || "Failed to load",
          code: response.code,
        });
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.message || "Organization not found",
        code: error.apiCode || null,
      });
    }
  }
);

/** GET public announcements. Query: page, limit, sortBy (recent|popular). */
export const getPublicAnnouncements = createAsyncThunk(
  "orgPublic/getAnnouncements",
  async ({ identifier, idType, page = 1, limit = 12, sortBy = "recent" }, thunkAPI) => {
    const base = pathFor(identifier, idType);
    const query = new URLSearchParams({ page, limit, sortBy });
    const response = await FetchApi.fetch(`${base}/announcements?${query}`, {
      method: "GET",
      headers: getPublicHeaders(thunkAPI),
    });
    if (response.success === false) throw new Error(response.message || "Failed to fetch announcements");
    return response.data != null ? response.data : response;
  }
);

/** GET public services. Query: page, limit, sortBy. */
export const getPublicServices = createAsyncThunk(
  "orgPublic/getServices",
  async ({ identifier, idType, page = 1, limit = 12, sortBy = "recent" }, thunkAPI) => {
    const base = pathFor(identifier, idType);
    const query = new URLSearchParams({ page, limit, sortBy });
    const response = await FetchApi.fetch(`${base}/services?${query}`, {
      method: "GET",
      headers: getPublicHeaders(thunkAPI),
    });
    if (response.success === false) throw new Error(response.message || "Failed to fetch services");
    return response.data != null ? response.data : response;
  }
);

/** GET public events. Query: page, limit, sortBy. */
export const getPublicEvents = createAsyncThunk(
  "orgPublic/getEvents",
  async ({ identifier, idType, page = 1, limit = 12, sortBy = "recent" }, thunkAPI) => {
    const base = pathFor(identifier, idType);
    const query = new URLSearchParams({ page, limit, sortBy });
    const response = await FetchApi.fetch(`${base}/events?${query}`, {
      method: "GET",
      headers: getPublicHeaders(thunkAPI),
    });
    if (response.success === false) throw new Error(response.message || "Failed to fetch events");
    return response.data != null ? response.data : response;
  }
);

/** GET public videos (shared content). Query: page, limit. */
export const getPublicVideos = createAsyncThunk(
  "orgPublic/getVideos",
  async ({ identifier, idType, page = 1, limit = 12 }, thunkAPI) => {
    const base = pathFor(identifier, idType);
    const query = new URLSearchParams({ page, limit });
    const response = await FetchApi.fetch(`${base}/videos?${query}`, {
      method: "GET",
      headers: getPublicHeaders(thunkAPI),
    });
    if (response.success === false) throw new Error(response.message || "Failed to fetch videos");
    return response.data != null ? response.data : response;
  }
);

/** GET public counsellors (active org members). Query: page, limit (default 24). */
export const getPublicCounsellors = createAsyncThunk(
  "orgPublic/getCounsellors",
  async ({ identifier, idType, page = 1, limit = 24 }, thunkAPI) => {
    const base = pathFor(identifier, idType);
    const query = new URLSearchParams({ page, limit });
    const response = await FetchApi.fetch(`${base}/counsellors?${query}`, {
      method: "GET",
      headers: getPublicHeaders(thunkAPI),
    });
    if (response.success === false) throw new Error(response.message || "Failed to fetch counsellors");
    return response.data != null ? response.data : response;
  }
);

const orgPublicSlice = createSlice({
  name: "orgPublic",
  initialState,
  reducers: {
    clearOrgPublicProfile: (state) => {
      state.profile = null;
      state.profileError = null;
      state.profileErrorCode = null;
      state.profileLoading = false;
    },
    resetOrgPublic: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPublicOrgProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(getPublicOrgProfile.fulfilled, (state, { payload }) => {
        state.profileLoading = false;
        state.profile = payload.data;
        state.profileError = null;
        state.profileErrorCode = null;
      })
      .addCase(getPublicOrgProfile.rejected, (state, { payload }) => {
        state.profileLoading = false;
        state.profile = null;
        state.profileError = payload?.error || "Failed to load";
        state.profileErrorCode = payload?.code || null;
      })
      .addCase(getPublicAnnouncements.pending, (state) => {
        state.announcementsLoading = true;
      })
      .addCase(getPublicAnnouncements.fulfilled, (state, { payload }) => {
        state.announcementsLoading = false;
        const list = payload?.announcements ?? payload?.data?.announcements;
        state.announcements = Array.isArray(list) ? list : [];
        state.totalAnnouncements = payload?.totalAnnouncements ?? payload?.data?.totalAnnouncements ?? 0;
        state.announcementsPage = payload?.currentPage ?? payload?.data?.currentPage ?? 1;
        state.totalAnnouncementsPages = payload?.totalPages ?? payload?.data?.totalPages ?? 0;
      })
      .addCase(getPublicAnnouncements.rejected, (state) => {
        state.announcementsLoading = false;
      })
      .addCase(getPublicServices.pending, (state) => {
        state.servicesLoading = true;
      })
      .addCase(getPublicServices.fulfilled, (state, { payload }) => {
        state.servicesLoading = false;
        const list = payload?.services ?? payload?.data?.services;
        state.services = Array.isArray(list) ? list : [];
        state.totalServices = payload?.totalServices ?? payload?.data?.totalServices ?? 0;
        state.servicesPage = payload?.currentPage ?? payload?.data?.currentPage ?? 1;
        state.totalServicesPages = payload?.totalPages ?? payload?.data?.totalPages ?? 0;
      })
      .addCase(getPublicServices.rejected, (state) => {
        state.servicesLoading = false;
      })
      .addCase(getPublicEvents.pending, (state) => {
        state.eventsLoading = true;
      })
      .addCase(getPublicEvents.fulfilled, (state, { payload }) => {
        state.eventsLoading = false;
        const list = payload?.events ?? payload?.data?.events;
        state.events = Array.isArray(list) ? list : [];
        state.totalEvents = payload?.totalEvents ?? payload?.data?.totalEvents ?? 0;
        state.eventsPage = payload?.currentPage ?? payload?.data?.currentPage ?? 1;
        state.totalEventsPages = payload?.totalPages ?? payload?.data?.totalPages ?? 0;
      })
      .addCase(getPublicEvents.rejected, (state) => {
        state.eventsLoading = false;
      })
      .addCase(getPublicVideos.pending, (state) => {
        state.videosLoading = true;
      })
      .addCase(getPublicVideos.fulfilled, (state, { payload }) => {
        state.videosLoading = false;
        const list = payload?.videos ?? payload?.data?.videos;
        state.videos = Array.isArray(list) ? list : [];
        state.totalVideos = payload?.totalVideos ?? payload?.data?.totalVideos ?? 0;
        state.videosPage = payload?.currentPage ?? payload?.data?.currentPage ?? 1;
        state.totalVideosPages = payload?.totalPages ?? payload?.data?.totalPages ?? 0;
      })
      .addCase(getPublicVideos.rejected, (state) => {
        state.videosLoading = false;
      })
      .addCase(getPublicCounsellors.pending, (state) => {
        state.counsellorsLoading = true;
      })
      .addCase(getPublicCounsellors.fulfilled, (state, { payload }) => {
        state.counsellorsLoading = false;
        const list = payload?.counsellors ?? payload?.data?.counsellors;
        state.counsellors = Array.isArray(list) ? list : [];
        state.totalCounsellors = payload?.totalCounsellors ?? payload?.data?.totalCounsellors ?? 0;
        state.counsellorsPage = payload?.currentPage ?? payload?.data?.currentPage ?? 1;
        state.totalCounsellorsPages = payload?.totalPages ?? payload?.data?.totalPages ?? 0;
      })
      .addCase(getPublicCounsellors.rejected, (state) => {
        state.counsellorsLoading = false;
      });
  },
});

export const { clearOrgPublicProfile, resetOrgPublic } = orgPublicSlice.actions;

export const selectOrgPublicProfile = (state) => state.orgPublic.profile;
export const selectOrgPublicProfileError = (state) => state.orgPublic.profileError;
export const selectOrgPublicProfileErrorCode = (state) => state.orgPublic.profileErrorCode;
export const selectOrgPublicProfileLoading = (state) => state.orgPublic.profileLoading;
export const selectOrgPublicAnnouncements = (state) => state.orgPublic.announcements;
export const selectOrgPublicServices = (state) => state.orgPublic.services;
export const selectOrgPublicEvents = (state) => state.orgPublic.events;
export const selectOrgPublicVideos = (state) => state.orgPublic.videos;
export const selectOrgPublicAnnouncementsLoading = (state) => state.orgPublic.announcementsLoading;
export const selectOrgPublicServicesLoading = (state) => state.orgPublic.servicesLoading;
export const selectOrgPublicEventsLoading = (state) => state.orgPublic.eventsLoading;
export const selectOrgPublicVideosLoading = (state) => state.orgPublic.videosLoading;
export const selectOrgPublicCounsellors = (state) => state.orgPublic.counsellors;
export const selectOrgPublicCounsellorsLoading = (state) => state.orgPublic.counsellorsLoading;

export default orgPublicSlice.reducer;
