import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";
import { getActingAsHeader } from "../../utility/getActingAsHeader.js";

const initialState = {
  profile: null,
  counsellors: [],
  dashboard: null,
  dashboardLoading: false,
  dashboardError: null,
  loading: false,
  error: null,
};

export const getMyOrganizationProfile = createAsyncThunk(
  "organization/getMyOrganizationProfile",
  async ({ token }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      return await FetchApi.fetch(
        `${config.api}/api/organization/profile/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...actingAs,
          },
        }
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.message,
      });
    }
  }
);

export const updateMyOrganizationProfile = createAsyncThunk(
  "organization/updateMyOrganizationProfile",
  async ({ updateData, token }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const response = await FetchApi.fetch(
        `${config.api}/api/organization/profile/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...actingAs,
          },
          body: updateData,
        }
      );

      if (!response.success) {
        return thunkAPI.rejectWithValue({
          error: response.message,
        });
      }

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.message,
      });
    }
  }
);

/** PUT /api/organization/profile/me with multipart/form-data (logo and/or bannerImage files). */
export const uploadOrganizationMedia = createAsyncThunk(
  "organization/uploadOrganizationMedia",
  async ({ formData, token }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const response = await FetchApi.fetch(
        `${config.api}/api/organization/profile/me`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            ...actingAs,
          },
          body: formData,
        }
      );

      if (!response.success) {
        return thunkAPI.rejectWithValue({
          error: response.message,
        });
      }

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.message,
      });
    }
  }
);

export const sendInvitation = createAsyncThunk(
  "organization/sendInvitation",
  async ({ inviteData, token }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const response = await FetchApi.fetch(
        `${config.api}/api/organization/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...actingAs,
          },
          body: inviteData,
        }
      );

      if (!response.success) {
        return thunkAPI.rejectWithValue({
          error: response.message,
        });
      }

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.message,
      });
    }
  }
);

export const getOrganizationProfileById = createAsyncThunk(
  "organization/getOrganizationProfileById",
  async ({ organizationId, token }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const response = await FetchApi.fetch(
        `${config.api}/api/organization/profile/v/${organizationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...actingAs,
          },
        }
      );
      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

/** GET /api/organization/me/dashboard – stats for ESP/HEI dashboard. Auth + X-Acting-As-Organization-Id when admin. */
export const getOrganizationDashboard = createAsyncThunk(
  "organization/getDashboard",
  async ({ token }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const response = await FetchApi.fetch(
        `${config.api}/api/organization/me/dashboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...actingAs,
          },
        }
      );
      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message || "Failed to load dashboard" });
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const getOrganizationCounsellors = createAsyncThunk(
  "organization/getOrganizationCounsellors",
  async ({ token, search = "" }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const url = search 
        ? `${config.api}/api/organization/members?search=${encodeURIComponent(search)}`
        : `${config.api}/api/organization/members`;

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

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    resetOrganizationState: (state) => {
      state.profile = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyOrganizationProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrganizationProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.profile = payload.data;
      })
      .addCase(getMyOrganizationProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to load organization profile";
      })
      .addCase(updateMyOrganizationProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMyOrganizationProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        // Preserve existing profile if API doesn't return data; otherwise merge so we keep all fields
        state.profile = payload.data
          ? { ...state.profile, ...payload.data }
          : state.profile;
      })
      .addCase(updateMyOrganizationProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to update organization profile";
      })
      .addCase(uploadOrganizationMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadOrganizationMedia.fulfilled, (state, { payload }) => {
        state.loading = false;
        const updated =
          payload.data ??
          payload.profile ??
          payload.organization ??
          (payload.logo != null || payload.bannerImage != null ? payload : null);
        if (updated) {
          state.profile = { ...state.profile, ...updated };
        }
      })
      .addCase(uploadOrganizationMedia.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to upload logo/banner";
      })
      .addCase(sendInvitation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendInvitation.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(sendInvitation.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to send invitation";
      })
      .addCase(getOrganizationProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrganizationProfileById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.profile = payload.data;
      })
      .addCase(getOrganizationProfileById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to fetch organization profile";
      })
      .addCase(getOrganizationCounsellors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrganizationCounsellors.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.counsellors = payload.data || [];
      })
      .addCase(getOrganizationCounsellors.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to fetch counsellors";
      })
      .addCase(getOrganizationDashboard.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(getOrganizationDashboard.fulfilled, (state, { payload }) => {
        state.dashboardLoading = false;
        state.dashboard = payload.data ?? payload;
        state.dashboardError = null;
      })
      .addCase(getOrganizationDashboard.rejected, (state, { payload }) => {
        state.dashboardLoading = false;
        state.dashboardError = payload?.error || "Failed to load dashboard";
      });
  },
});

export const { resetOrganizationState } = organizationSlice.actions;

export const selectOrganizationProfile = (state) => state.organization.profile;
export const selectOrganizationCounsellors = (state) => state.organization.counsellors;
export const selectOrganizationDashboard = (state) => state.organization.dashboard;
export const selectOrganizationDashboardLoading = (state) => state.organization.dashboardLoading;
export const selectOrganizationDashboardError = (state) => state.organization.dashboardError;
export const selectOrganizationLoading = (state) => state.organization.loading;
export const selectOrganizationError = (state) => state.organization.error;

export default organizationSlice.reducer;
