import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  sendLoading: false,
  sendError: null,
  recipientSuggestions: [],
  suggestionsLoading: false,
  received: {
    messages: [],
    total: 0,
    currentPage: 1,
    totalPages: 0,
    loading: false,
    error: null,
  },
  sent: {
    messages: [],
    total: 0,
    currentPage: 1,
    totalPages: 0,
    loading: false,
    error: null,
  },
};

/**
 * GET /api/messages/received?page=1&limit=20
 * Returns messages where current user is receiver. data: { messages, total, currentPage, totalPages }.
 */
export const fetchReceivedMessages = createAsyncThunk(
  "message/fetchReceivedMessages",
  async ({ token, page = 1, limit = 20 }, thunkAPI) => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(Math.min(100, Math.max(1, limit))) });
      const response = await FetchApi.fetch(`${config.api}/api/messages/received?${params}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return {
        messages: response.data?.messages ?? [],
        total: response.data?.total ?? 0,
        currentPage: response.data?.currentPage ?? 1,
        totalPages: response.data?.totalPages ?? 0,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

/**
 * GET /api/messages/sent?page=1&limit=20
 * Returns messages where current user is sender. data: { messages, total, currentPage, totalPages }.
 */
export const fetchSentMessages = createAsyncThunk(
  "message/fetchSentMessages",
  async ({ token, page = 1, limit = 20 }, thunkAPI) => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(Math.min(100, Math.max(1, limit))) });
      const response = await FetchApi.fetch(`${config.api}/api/messages/sent?${params}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return {
        messages: response.data?.messages ?? [],
        total: response.data?.total ?? 0,
        currentPage: response.data?.currentPage ?? 1,
        totalPages: response.data?.totalPages ?? 0,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

/**
 * GET /api/messages/recipients/suggest?q=...&limit=10
 * Returns { email, displayName }[] for autocomplete. Min 2 chars in q for results.
 */
export const fetchRecipientSuggestions = createAsyncThunk(
  "message/fetchRecipientSuggestions",
  async ({ token, q, limit = 10 }, thunkAPI) => {
    try {
      if (!q || String(q).trim().length < 2) {
        return { data: [] };
      }
      const params = new URLSearchParams({ q: String(q).trim(), limit: Math.min(20, Math.max(1, limit)) });
      const response = await FetchApi.fetch(`${config.api}/api/messages/recipients/suggest?${params}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return { data: response.data || [] };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

/**
 * POST /api/messages
 * Body: { toEmail: string, title: string (max 200), body: string (max 4000) }
 * Recipient is identified by email. Returns 201 with message data on success.
 * Errors: 400 (validation + field), 401, 404 (no user with email), 500.
 */
export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async ({ token, toEmail, title, body }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(`${config.api}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: { toEmail, title, body },
      });

      if (!response.success) {
        return thunkAPI.rejectWithValue({
          error: response.message || "Failed to send message",
          field: response.field || null,
        });
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.message || "Failed to send message",
        field: error.field || null,
      });
    }
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    clearSendError: (state) => {
      state.sendError = null;
    },
    clearRecipientSuggestions: (state) => {
      state.recipientSuggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceivedMessages.pending, (state) => {
        state.received.loading = true;
        state.received.error = null;
      })
      .addCase(fetchReceivedMessages.fulfilled, (state, action) => {
        state.received.loading = false;
        state.received.error = null;
        state.received.messages = action.payload?.messages ?? [];
        state.received.total = action.payload?.total ?? 0;
        state.received.currentPage = action.payload?.currentPage ?? 1;
        state.received.totalPages = action.payload?.totalPages ?? 0;
      })
      .addCase(fetchReceivedMessages.rejected, (state, action) => {
        state.received.loading = false;
        state.received.error = action.payload?.error ?? action.error?.message;
        state.received.messages = [];
      })
      .addCase(fetchSentMessages.pending, (state) => {
        state.sent.loading = true;
        state.sent.error = null;
      })
      .addCase(fetchSentMessages.fulfilled, (state, action) => {
        state.sent.loading = false;
        state.sent.error = null;
        state.sent.messages = action.payload?.messages ?? [];
        state.sent.total = action.payload?.total ?? 0;
        state.sent.currentPage = action.payload?.currentPage ?? 1;
        state.sent.totalPages = action.payload?.totalPages ?? 0;
      })
      .addCase(fetchSentMessages.rejected, (state, action) => {
        state.sent.loading = false;
        state.sent.error = action.payload?.error ?? action.error?.message;
        state.sent.messages = [];
      })
      .addCase(fetchRecipientSuggestions.pending, (state) => {
        state.suggestionsLoading = true;
      })
      .addCase(fetchRecipientSuggestions.fulfilled, (state, action) => {
        state.suggestionsLoading = false;
        state.recipientSuggestions = action.payload?.data ?? [];
      })
      .addCase(fetchRecipientSuggestions.rejected, (state) => {
        state.suggestionsLoading = false;
        state.recipientSuggestions = [];
      })
      .addCase(sendMessage.pending, (state) => {
        state.sendLoading = true;
        state.sendError = null;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.sendLoading = false;
        state.sendError = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendLoading = false;
        state.sendError = action.payload?.error ?? action.error?.message ?? "Failed to send message";
      });
  },
});

export const { clearSendError, clearRecipientSuggestions } = messageSlice.actions;
export const selectSendLoading = (state) => state.message.sendLoading;
export const selectSendError = (state) => state.message.sendError;
export const selectRecipientSuggestions = (state) => state.message.recipientSuggestions;
export const selectSuggestionsLoading = (state) => state.message.suggestionsLoading;
export const selectReceivedMessages = (state) => state.message.received.messages;
export const selectReceivedTotal = (state) => state.message.received.total;
export const selectReceivedCurrentPage = (state) => state.message.received.currentPage;
export const selectReceivedTotalPages = (state) => state.message.received.totalPages;
export const selectReceivedLoading = (state) => state.message.received.loading;
export const selectReceivedError = (state) => state.message.received.error;
export const selectSentMessages = (state) => state.message.sent.messages;
export const selectSentTotal = (state) => state.message.sent.total;
export const selectSentCurrentPage = (state) => state.message.sent.currentPage;
export const selectSentTotalPages = (state) => state.message.sent.totalPages;
export const selectSentLoading = (state) => state.message.sent.loading;
export const selectSentError = (state) => state.message.sent.error;

export default messageSlice.reducer;
