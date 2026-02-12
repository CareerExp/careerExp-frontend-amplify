import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import FetchApi from "../../client.js";
import { config } from "../../config/config";

const initialState = {
  users: [],
  creators: [],
  organizations: null,
  generalData: {},
};

export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async ({ token, search = "", page = 1, limit = 10 }) => {
    const queryParams = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
    });

    return FetchApi.fetch(`${config.api}/api/admin/all-users-data?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
);

export const getAllCreators = createAsyncThunk(
  "admin/getAllCreators",
  async ({ token, search = "", page = 1, limit = 10 }) => {
    const queryParams = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
    });

    return FetchApi.fetch(`${config.api}/api/admin/all-creators-data?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
);

export const getAllOrganizations = createAsyncThunk(
  "admin/getAllOrganizations",
  async ({ token, organizationType, search = "", page = 1, limit = 10 }) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (organizationType) queryParams.set("organizationType", organizationType);
    if (search) queryParams.set("search", search);

    return FetchApi.fetch(`${config.api}/api/admin/all-organizations?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
);

export const getGeneralUserData = createAsyncThunk("admin/getGeneralUserData", async ({ token }) => {
  return FetchApi.fetch(`${config.api}/api/admin/getgeneralinformation`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
});

export const updateActiveStatus = createAsyncThunk(
  "admin/updateActiveStatus",
  async ({ userId, status, token }) => {
    return FetchApi.fetch(`${config.api}/api/admin/updateStatus/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
  },
);

export const sendAdminSupportEmail = createAsyncThunk(
  "admin/sendAdminSupportEmail",
  async ({ firstName, lastName, email, phoneNumber, query, token }) => {
    return FetchApi.fetch(`${config.api}/api/support/sendAdminSupportEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ firstName, lastName, email, phoneNumber, query }),
    });
  },
);

export const sendTechSupportEmail = createAsyncThunk(
  "admin/sendTechSupportEmail",
  async ({ firstName, lastName, email, phoneNumber, query, token }) => {
    return FetchApi.fetch(`${config.api}/api/support/sendTechSupportEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ firstName, lastName, email, phoneNumber, query }),
    });
  },
);

export const sendStudentSupportEmail = createAsyncThunk(
  "admin/sendStudentSupportEmail",
  async ({ firstName, lastName, email, phoneNumber, query, token }) => {
    return FetchApi.fetch(`${config.api}/api/support/sendStudentSupportEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ firstName, lastName, email, phoneNumber, query }),
    });
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });
    builder.addCase(getAllCreators.fulfilled, (state, action) => {
      state.creators = action.payload;
    });
    builder.addCase(getAllOrganizations.fulfilled, (state, action) => {
      state.organizations = action.payload;
    });

    builder.addCase(getGeneralUserData.fulfilled, (state, action) => {
      state.generalData = action.payload.data;
    });

    builder.addCase(updateActiveStatus.fulfilled, (state, action) => {
      const { user } = action.payload;
      const creatorId = user._id;
      const userId = user._id;

      if (state.users && state.users.users) {
        state.users.users = state.users.users.map((userItem) => {
          if (userItem._id === userId) {
            return { ...userItem, status: user.status }; // Correctly update status
          }
          return userItem;
        });
      }

      // Ensure state.creators exists and has the `creators` array
      if (state.creators && state.creators.creators) {
        state.creators.creators = state.creators.creators.map((creator) => {
          if (creator._id === creatorId) {
            return { ...creator, status: user.status }; // Update status
          }
          return creator;
        });
      }

      if (state.organizations && state.organizations.organizations) {
        state.organizations.organizations = state.organizations.organizations.map((org) => {
          if (org.userId === userId || org.userId?._id === userId) {
            return { ...org, status: user.status };
          }
          return org;
        });
      }
    });
  },
});

export const selectUsersData = (state) => state.admin.users;
export const selectCreatorsData = (state) => state.admin.creators;
export const selectOrganizationsData = (state) => state.admin.organizations;
export const selectGeneralData = (state) => state.admin.generalData;

export default adminSlice.reducer;
