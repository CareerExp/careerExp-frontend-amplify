import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  myEvents: [],
  feed: [],
  loading: false,
  error: null,
};

export const fetchMyEvents = createAsyncThunk(
  "event/fetchMyEvents",
  async ({ token, status, search }, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();
      if (status) queryParams.append("status", status);
      if (search) queryParams.append("search", search);

      const url = `${config.api}/api/events/me${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

      const response = await FetchApi.fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

export const createEvent = createAsyncThunk(
  "event/create",
  async ({ formData, token }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(`${config.api}/api/events/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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

export const updateEvent = createAsyncThunk(
  "event/update",
  async ({ id, formData, token }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(`${config.api}/api/events/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
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

export const deleteEvent = createAsyncThunk(
  "event/delete",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(`${config.api}/api/events/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyEvents.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myEvents = payload.data;
      })
      .addCase(fetchMyEvents.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to fetch events";
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createEvent.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to create event";
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateEvent.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to update event";
      })
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myEvents = state.myEvents.filter(
          (evt) => evt._id !== payload.id
        );
      })
      .addCase(deleteEvent.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to delete event";
      });
  },
});

export const selectMyEvents = (state) => state.event.myEvents;
export const selectEventLoading = (state) => state.event.loading;
export const selectEventError = (state) => state.event.error;

export default eventSlice.reducer;
