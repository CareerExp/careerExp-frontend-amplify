import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";
import { getActingAsHeader } from "../../utility/getActingAsHeader.js";

const initialState = {
  myAnnouncements: [],
  feed: [],
  loading: false,
  error: null,
};

export const createAnnouncement = createAsyncThunk(
  "announcement/create",
  async ({ formData, token }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const response = await FetchApi.fetch(`${config.api}/api/announcements/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          ...actingAs,
        },
        body: formData, // Sending FormData directly for multipart
      });

      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const updateAnnouncement = createAsyncThunk(
  "announcement/update",
  async ({ id, formData, token }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const response = await FetchApi.fetch(`${config.api}/api/announcements/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          ...actingAs,
        },
        body: formData,
      });

      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const fetchMyAnnouncements = createAsyncThunk(
  "announcement/fetchMyList",
  async ({ token, status, search }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const queryParams = new URLSearchParams();
      if (status) queryParams.append("status", status);
      if (search) queryParams.append("search", search);

      const url = `${config.api}/api/announcements/me/list${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

      const response = await FetchApi.fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...actingAs,
        },
      });

      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const deleteAnnouncement = createAsyncThunk(
  "announcement/delete",
  async ({ id, token }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const response = await FetchApi.fetch(`${config.api}/api/announcements/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...actingAs,
        },
      });

      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return { id, ...response };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

/** Get announcement by id. GET /api/announcements/:id. With token (org workspace), returns ctaResponses. */
export const getAnnouncementById = createAsyncThunk(
  "announcement/getById",
  async (payload, thunkAPI) => {
    const id = typeof payload === "object" && payload?.id != null ? payload.id : payload;
    const token = typeof payload === "object" ? payload.token : undefined;
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      Object.assign(headers, getActingAsHeader(thunkAPI.getState));
    }
    const response = await FetchApi.fetch(`${config.api}/api/announcements/${id}`, {
      method: "GET",
      headers,
    });
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch announcement");
    }
    return response;
  }
);

/** Register CTA click/submission. POST /api/announcements/:id/cta. Auth required. */
export const registerAnnouncementCta = createAsyncThunk(
  "announcement/registerCta",
  async ({ id, actionType = "CLICK", token }, thunkAPI) => {
    const response = await FetchApi.fetch(
      `${config.api}/api/announcements/${id}/cta`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ actionType }),
      }
    );
    if (!response.success) {
      return thunkAPI.rejectWithValue({ error: response.message || "Failed to record CTA" });
    }
    return response;
  }
);

const announcementSlice = createSlice({
  name: "announcement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAnnouncements.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myAnnouncements = payload.data;
      })
      .addCase(fetchMyAnnouncements.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to fetch announcements";
      })
      .addCase(createAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAnnouncement.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAnnouncement.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to create announcement";
      })
      .addCase(updateAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAnnouncement.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateAnnouncement.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to update announcement";
      })
      .addCase(deleteAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myAnnouncements = state.myAnnouncements.filter(
          (ann) => ann._id !== payload.id
        );
      })
      .addCase(deleteAnnouncement.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to delete announcement";
      })
      .addCase(getAnnouncementById.fulfilled, () => {})
      .addCase(getAnnouncementById.rejected, () => {})
      .addCase(registerAnnouncementCta.fulfilled, () => {})
      .addCase(registerAnnouncementCta.rejected, () => {});
  },
});

export const selectMyAnnouncements = (state) => state.announcement.myAnnouncements;
export const selectAnnouncementLoading = (state) => state.announcement.loading;
export const selectAnnouncementError = (state) => state.announcement.error;

export default announcementSlice.reducer;
