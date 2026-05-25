import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import FetchApi from "../../client.js";
import { config } from "../../config/config";

const initialState = {
  users: [],
  creators: [],
  organizations: null,
  ameOrganizations: null,
  generalData: {},
  paymentTransactions: null,
  governmentOrganizations: null,
  admins: null, // { admins: [], pagination?: { page, limit, total, totalPages } }
  activityLog: null, // { logs: [], pagination?: { page, limit, total } }
  claimRequests: [],
  claimRequestsTotal: 0,
  claimRequestsPendingCount: 0,
  claimRequestsLoading: false,
  claimRequestsError: null,
  claimRequestsPage: 1,
  claimRequestsTotalPages: 1,
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

/** GET /api/admin/ame – Admin only. Same response shape as all-organizations. */
export const getAMEOrganizations = createAsyncThunk(
  "admin/getAMEOrganizations",
  async ({ token, search = "", page = 1, limit = 10 }) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) queryParams.set("search", search);

    return FetchApi.fetch(`${config.api}/api/admin/ame?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
);

/** POST /api/admin/ame/enter-context – Admin only. Switch to AME dashboard (Option 1). Returns updated user profile. */
export const enterAMEContext = createAsyncThunk(
  "admin/enterAMEContext",
  async ({ actingAsOrganizationId, token }, thunkAPI) => {
    const response = await FetchApi.fetch(`${config.api}/api/admin/ame/enter-context`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ actingAsOrganizationId }),
    });
    const user = response?.user ?? response;
    if (!user?.activeDashboard) {
      return thunkAPI.rejectWithValue({ message: response?.message || "Failed to enter AME context" });
    }
    return user;
  },
);

/** POST /api/admin/ame/exit-context – Admin only. Leave AME dashboard (Option 1). Returns updated user profile. */
export const exitAMEContext = createAsyncThunk(
  "admin/exitAMEContext",
  async ({ token }, thunkAPI) => {
    const response = await FetchApi.fetch(`${config.api}/api/admin/ame/exit-context`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    const user = response?.user ?? response;
    if (!user?.activeDashboard) {
      return thunkAPI.rejectWithValue({ message: response?.message || "Failed to exit AME context" });
    }
    return user;
  },
);

/** POST /api/admin/ame – Admin only. multipart/form-data (FormData). Do not set Content-Type. */
export const createAME = createAsyncThunk(
  "admin/createAME",
  async ({ formData, token }, thunkAPI) => {
    const response = await FetchApi.fetch(`${config.api}/api/admin/ame`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.success) {
      return thunkAPI.rejectWithValue({
        message: response.message || "Failed to create AME",
        field: response.field,
      });
    }
    return response;
  },
);

/** GET /api/admin/government-organizations – List with pagination and search */
export const getGovernmentOrganizations = createAsyncThunk(
  "admin/getGovernmentOrganizations",
  async ({ token, page = 1, limit = 10, search = "" }) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) queryParams.set("search", search);
    return FetchApi.fetch(
      `${config.api}/api/admin/government-organizations?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },
);

/** GET /api/admin/government-organizations/:id – Get one */
export const getGovernmentOrganization = createAsyncThunk(
  "admin/getGovernmentOrganization",
  async ({ token, id }) => {
    return FetchApi.fetch(
      `${config.api}/api/admin/government-organizations/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },
);

/** POST /api/admin/government-organizations – Create (JSON or multipart with file) */
export const createGovernmentOrganization = createAsyncThunk(
  "admin/createGovernmentOrganization",
  async ({ token, name, description, image, file }) => {
    if (file) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("file", file);
      return FetchApi.fetch(`${config.api}/api/admin/government-organizations`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    }
    return FetchApi.fetch(`${config.api}/api/admin/government-organizations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, ...(image && { image }) }),
    });
  },
);

/** PUT /api/admin/government-organizations/:id – Update (JSON or multipart with file) */
export const updateGovernmentOrganization = createAsyncThunk(
  "admin/updateGovernmentOrganization",
  async ({ token, id, name, description, image, file }) => {
    if (file) {
      const formData = new FormData();
      if (name !== undefined) formData.append("name", name);
      if (description !== undefined) formData.append("description", description);
      formData.append("file", file);
      return FetchApi.fetch(
        `${config.api}/api/admin/government-organizations/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );
    }
    const body = {};
    if (name !== undefined) body.name = name;
    if (description !== undefined) body.description = description;
    if (image !== undefined) body.image = image;
    return FetchApi.fetch(
      `${config.api}/api/admin/government-organizations/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    );
  },
);

/** DELETE /api/admin/government-organizations/:id */
export const deleteGovernmentOrganization = createAsyncThunk(
  "admin/deleteGovernmentOrganization",
  async ({ token, id }) => {
    return FetchApi.fetch(
      `${config.api}/api/admin/government-organizations/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },
);

export const getPaymentTransactions = createAsyncThunk(
  "admin/getPaymentTransactions",
  async ({ token, page = 1, limit = 20, search = "", status = "" }) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) queryParams.set("search", search);
    if (status) queryParams.set("status", status);

    return FetchApi.fetch(`${config.api}/api/admin/payment-transactions?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
);

/** POST /api/admin/sync-subscription-payments – Admin only. Backfill payment transactions from Stripe. */
export const syncSubscriptionPayments = createAsyncThunk(
  "admin/syncSubscriptionPayments",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/admin/sync-subscription-payments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response?.success && response?.message) {
        return rejectWithValue({ message: response.message });
      }
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to sync subscription payments",
      });
    }
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

/** POST /api/admin/admins – Main admin only. Invite sub-admin by email. Body: { email, message? }. */
export const addAdmin = createAsyncThunk(
  "admin/addAdmin",
  async ({ token, email, message }, { rejectWithValue }) => {
    try {
      const body = { email: email.trim() };
      if (message != null && String(message).trim() !== "") {
        body.message = String(message).trim();
      }
      const response = await FetchApi.fetch(`${config.api}/api/admin/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!response.success) {
        return rejectWithValue({
          message: response.message || "Failed to invite sub-admin",
          field: response.field,
        });
      }
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to invite sub-admin",
        field: error?.field,
        code: error?.apiCode || error?.code,
      });
    }
  },
);

/** GET /api/admin/activity-log – Main admin only. Paginated activity log. */
export const getActivityLog = createAsyncThunk(
  "admin/getActivityLog",
  async (
    { token, page = 1, limit = 10, search = "", actionFilter = "", actorId = "" },
    { rejectWithValue },
  ) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search.trim()) params.set("search", search.trim());
      if (actionFilter) params.set("action", actionFilter);
      if (actorId) params.set("actorId", actorId);
      const response = await FetchApi.fetch(
        `${config.api}/api/admin/activity-log?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.success) {
        return rejectWithValue({
          message: response.message || "Failed to load activity log",
          code: response.code,
        });
      }
      const data = response.data ?? response;
      return {
        logs: data.logs ?? [],
        pagination: data.pagination ?? { page: 1, limit: 10, total: 0 },
      };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to load activity log",
        code: error?.apiCode || error?.code,
      });
    }
  },
);

/** GET /api/admin/admins – Main admin only. List admins (optional search, page, limit). */
export const getAdmins = createAsyncThunk(
  "admin/getAdmins",
  async ({ token, search = "", page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search.trim()) params.set("search", search.trim());
      const response = await FetchApi.fetch(
        `${config.api}/api/admin/admins?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.success) {
        return rejectWithValue({
          message: response.message || "Failed to load admins",
        });
      }
      return response.data ?? { admins: [], pagination: {} };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to load admins",
      });
    }
  },
);

/** PATCH /api/admin/admins/:userId – Main admin only. Enable/disable admin. Body: { enabled: true|false }. */
export const updateAdminStatus = createAsyncThunk(
  "admin/updateAdminStatus",
  async ({ token, userId, enabled }, { rejectWithValue }) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/admin/admins/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ enabled }),
        },
      );
      if (!response.success) {
        return rejectWithValue({
          message: response.message || "Failed to update admin status",
        });
      }
      return { userId, enabled, user: response.data?.user ?? response.user };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to update admin status",
      });
    }
  },
);

/** GET /api/admin/invites/validate?token=xxx — no auth. Validates invite token. */
export const validateAdminInvite = createAsyncThunk(
  "admin/validateAdminInvite",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/admin/invites/validate?token=${encodeURIComponent(token)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.success) {
        return rejectWithValue({
          message: response.message || "Invalid invite",
          code: response.code,
        });
      }
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Invalid or expired invite",
        code: error?.apiCode || error?.code,
      });
    }
  },
);

/** POST /api/admin/invites/accept — no auth. Accept invite and create admin account. */
export const acceptAdminInvite = createAsyncThunk(
  "admin/acceptAdminInvite",
  async ({ token, firstName, lastName, mobile, password }, { rejectWithValue }) => {
    try {
      const response = await FetchApi.fetch(`${config.api}/api/admin/invites/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          mobile: mobile.trim(),
          password,
        }),
      });
      if (!response.success) {
        return rejectWithValue({
          message: response.message || "Failed to accept invite",
          code: response.code,
          field: response.field,
        });
      }
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to accept invite",
        code: error?.apiCode || error?.code,
        field: error?.field,
      });
    }
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

/** GET /api/admin/university-claim-requests — Pending university directory claims (admin). */
export const getUniversityClaimRequests = createAsyncThunk(
  "admin/getUniversityClaimRequests",
  async (
    { token, page = 1, limit = 10, search = "", status = "", badgeOnly = false },
    { rejectWithValue },
  ) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search.trim()) params.set("search", search.trim());
      if (status === "pending" || status === "rejected") params.set("status", status);
      const response = await FetchApi.fetch(
        `${config.api}/api/admin/university-claim-requests?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.success) {
        return rejectWithValue({
          message: response.message || "Failed to load university claim requests",
        });
      }
      return response.data ?? {
        items: [],
        total: 0,
        pendingCount: 0,
        currentPage: 1,
        totalPages: 1,
      };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to load university claim requests",
      });
    }
  },
);

/** DELETE /api/admin/university-claim-requests/:id — Remove pending/rejected claim request (admin). */
export const deleteUniversityClaimRequest = createAsyncThunk(
  "admin/deleteUniversityClaimRequest",
  async ({ token, directoryId }, { rejectWithValue }) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/admin/university-claim-requests/${encodeURIComponent(directoryId)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response?.success) {
        return { directoryId: response.directoryId || directoryId };
      }
      return rejectWithValue({
        message: response?.message || "Failed to delete university claim request",
      });
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to delete university claim request",
      });
    }
  },
);

/** PATCH /api/admin/university-claim-requests/:id/approve — Approve pending university claim (admin). */
export const approveUniversityClaim = createAsyncThunk(
  "admin/approveUniversityClaim",
  async ({ token, directoryId }, { rejectWithValue }) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/admin/university-claim-requests/${encodeURIComponent(directoryId)}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        },
      );
      if (response?.user) {
        return { directoryId, user: response.user };
      }
      return rejectWithValue({
        message: response?.message || "Failed to approve university claim",
      });
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to approve university claim",
      });
    }
  },
);

/** PATCH /api/admin/university-claim-requests/:id/reject — Reject pending university claim (admin). */
export const rejectUniversityClaim = createAsyncThunk(
  "admin/rejectUniversityClaim",
  async ({ token, directoryId, reason = "" }, { rejectWithValue }) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/admin/university-claim-requests/${encodeURIComponent(directoryId)}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        },
      );
      if (response?.success !== false && response?.user) {
        return { directoryId: response.directoryId || directoryId, user: response.user };
      }
      return rejectWithValue({
        message: response?.message || "Failed to reject university claim",
      });
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to reject university claim",
      });
    }
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
    builder.addCase(getAMEOrganizations.fulfilled, (state, action) => {
      state.ameOrganizations = action.payload;
    });

    builder.addCase(getPaymentTransactions.fulfilled, (state, action) => {
      state.paymentTransactions = action.payload?.data ?? null;
    });
    builder.addCase(getGovernmentOrganizations.fulfilled, (state, action) => {
      state.governmentOrganizations = action.payload?.data ?? null;
    });
    builder.addCase(getActivityLog.fulfilled, (state, action) => {
      state.activityLog = action.payload;
    });
    builder.addCase(getAdmins.fulfilled, (state, action) => {
      const payload = action.payload;
      state.admins = Array.isArray(payload)
        ? { admins: payload, pagination: {} }
        : { admins: payload?.admins ?? [], pagination: payload?.pagination ?? {} };
    });
    builder.addCase(updateAdminStatus.fulfilled, (state, action) => {
      const { userId, enabled } = action.payload;
      const status = enabled ? "active" : "disabled";
      if (state.admins?.admins) {
        state.admins.admins = state.admins.admins.map((a) =>
          a._id === userId ? { ...a, status, enabled } : a,
        );
      }
    });
    builder.addCase(getGeneralUserData.fulfilled, (state, action) => {
      state.generalData = action.payload.data;
    });

    builder.addCase(getUniversityClaimRequests.pending, (state, action) => {
      if (!action.meta?.arg?.badgeOnly) {
        state.claimRequestsLoading = true;
        state.claimRequestsError = null;
      }
    });
    builder.addCase(getUniversityClaimRequests.fulfilled, (state, action) => {
      const data = action.payload ?? {};
      const badgeOnly = Boolean(action.meta?.arg?.badgeOnly);

      if (badgeOnly) {
        state.claimRequestsPendingCount = data.pendingCount ?? 0;
        return;
      }

      state.claimRequestsLoading = false;
      state.claimRequests = data.items ?? [];
      state.claimRequestsTotal = data.total ?? 0;
      state.claimRequestsPendingCount = data.pendingCount ?? 0;
      state.claimRequestsPage = data.currentPage ?? 1;
      state.claimRequestsTotalPages = data.totalPages ?? 1;
    });
    builder.addCase(getUniversityClaimRequests.rejected, (state, action) => {
      if (action.meta?.arg?.badgeOnly) return;
      state.claimRequestsLoading = false;
      state.claimRequestsError = action.payload?.message ?? "Failed to load";
    });

    const removeClaimRequestByDirectoryId = (state, directoryId) => {
      if (!directoryId || !Array.isArray(state.claimRequests)) return;
      const idStr = String(directoryId);
      const prevLen = state.claimRequests.length;
      state.claimRequests = state.claimRequests.filter(
        (row) => String(row?._id) !== idStr,
      );
      const removed = prevLen - state.claimRequests.length;
      if (removed > 0) {
        state.claimRequestsTotal = Math.max(0, (state.claimRequestsTotal ?? 0) - removed);
      }
    };

    builder.addCase(approveUniversityClaim.fulfilled, (state, action) => {
      removeClaimRequestByDirectoryId(state, action.payload?.directoryId);
      if (state.claimRequestsPendingCount > 0) {
        state.claimRequestsPendingCount -= 1;
      }
    });
    builder.addCase(rejectUniversityClaim.fulfilled, (state, action) => {
      removeClaimRequestByDirectoryId(state, action.payload?.directoryId);
      if (state.claimRequestsPendingCount > 0) {
        state.claimRequestsPendingCount -= 1;
      }
    });
    builder.addCase(deleteUniversityClaimRequest.fulfilled, (state, action) => {
      const directoryId = action.payload?.directoryId;
      const removedRow = state.claimRequests?.find(
        (row) => String(row?._id) === String(directoryId),
      );
      removeClaimRequestByDirectoryId(state, directoryId);
      if (removedRow?.claimStatus === "pending" && state.claimRequestsPendingCount > 0) {
        state.claimRequestsPendingCount -= 1;
      }
    });

    builder.addCase(updateActiveStatus.fulfilled, (state, action) => {
      const { user } = action.payload;
      const creatorId = user._id;
      const userId = user._id;

      // Claim-flow org approved/rejected from HEI tab: remove from pending claims list
      if (
        user?.role?.includes?.("organization") &&
        ["active", "blocked"].includes(user.status) &&
        Array.isArray(state.claimRequests) &&
        state.claimRequests.length > 0
      ) {
        const email = String(user.email || "").toLowerCase();
        if (email) {
          const prevLen = state.claimRequests.length;
          state.claimRequests = state.claimRequests.filter(
            (row) => String(row?.claimant?.email || "").toLowerCase() !== email,
          );
          const removed = prevLen - state.claimRequests.length;
          if (removed > 0) {
            state.claimRequestsTotal = Math.max(0, (state.claimRequestsTotal ?? 0) - removed);
            if (state.claimRequestsPendingCount > 0) {
              state.claimRequestsPendingCount -= 1;
            }
          }
        }
      }

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
export const selectAMEOrganizationsData = (state) => state.admin.ameOrganizations;
export const selectGeneralData = (state) => state.admin.generalData;
export const selectPaymentTransactionsData = (state) => state.admin.paymentTransactions;
export const selectGovernmentOrganizationsData = (state) =>
  state.admin.governmentOrganizations;
export const selectAdminsData = (state) => state.admin.admins;
export const selectActivityLogData = (state) => state.admin.activityLog;
export const selectClaimRequests = (state) => state.admin.claimRequests ?? [];
export const selectClaimRequestsTotal = (state) => state.admin.claimRequestsTotal ?? 0;
export const selectClaimRequestsPendingCount = (state) =>
  state.admin.claimRequestsPendingCount ?? 0;
export const selectClaimRequestsLoading = (state) => state.admin.claimRequestsLoading ?? false;
export const selectClaimRequestsError = (state) => state.admin.claimRequestsError;
export const selectClaimRequestsPage = (state) => state.admin.claimRequestsPage ?? 1;
export const selectClaimRequestsTotalPages = (state) => state.admin.claimRequestsTotalPages ?? 1;

export default adminSlice.reducer;
