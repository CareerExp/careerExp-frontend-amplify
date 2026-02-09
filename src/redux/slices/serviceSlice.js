import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  myServices: [],
  feed: [],
  loading: false,
  error: null,
};

export const fetchMyServices = createAsyncThunk(
  "service/fetchMyServices",
  async ({ token, status, search }, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();
      if (status) queryParams.append("status", status);
      if (search) queryParams.append("search", search);

      const url = `${config.api}/api/services/me${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

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

export const createService = createAsyncThunk(
  "service/create",
  async ({ formData, token }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(`${config.api}/api/services/`, {
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

export const updateService = createAsyncThunk(
  "service/update",
  async ({ id, formData, token }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(`${config.api}/api/services/${id}`, {
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

export const deleteService = createAsyncThunk(
  "service/delete",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(`${config.api}/api/services/${id}`, {
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

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyServices.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myServices = payload.data;
      })
      .addCase(fetchMyServices.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to fetch services";
      })
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createService.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to create service";
      })
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateService.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to update service";
      })
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myServices = state.myServices.filter(
          (srv) => srv._id !== payload.id
        );
      })
      .addCase(deleteService.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to delete service";
      });
  },
});

export const selectMyServices = (state) => state.service.myServices;
export const selectServiceLoading = (state) => state.service.loading;
export const selectServiceError = (state) => state.service.error;

export default serviceSlice.reducer;
