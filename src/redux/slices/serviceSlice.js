import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";
import { getActingAsHeader } from "../../utility/getActingAsHeader.js";

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
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const queryParams = new URLSearchParams();
      if (status) queryParams.append("status", status);
      if (search) queryParams.append("search", search);

      const url = `${config.api}/api/services/me${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

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

export const createService = createAsyncThunk(
  "service/create",
  async ({ formData, token }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const response = await FetchApi.fetch(`${config.api}/api/services/`, {
        method: "POST",
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

export const updateService = createAsyncThunk(
  "service/update",
  async ({ id, formData, token }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const response = await FetchApi.fetch(`${config.api}/api/services/${id}`, {
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

export const deleteService = createAsyncThunk(
  "service/delete",
  async ({ id, token }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const response = await FetchApi.fetch(`${config.api}/api/services/${id}`, {
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

/** Public: get service by id for detail page. GET /api/services/:id. No auth. */
export const getServiceById = createAsyncThunk(
  "service/getById",
  async (id) => {
    const response = await FetchApi.fetch(`${config.api}/api/services/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch service");
    }
    return response;
  }
);

/** Register service CTA. POST /api/services/:id/cta. Auth required. */
export const registerServiceCta = createAsyncThunk(
  "service/registerCta",
  async ({ id, actionType = "CLICK", token }, thunkAPI) => {
    const response = await FetchApi.fetch(
      `${config.api}/api/services/${id}/cta`,
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
      return thunkAPI.rejectWithValue({
        error: response.message || "Failed to record CTA",
      });
    }
    return response;
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
      })
      .addCase(getServiceById.fulfilled, () => {})
      .addCase(getServiceById.rejected, () => {})
      .addCase(registerServiceCta.fulfilled, () => {})
      .addCase(registerServiceCta.rejected, () => {});
  },
});

export const selectMyServices = (state) => state.service.myServices;
export const selectServiceLoading = (state) => state.service.loading;
export const selectServiceError = (state) => state.service.error;

export default serviceSlice.reducer;
