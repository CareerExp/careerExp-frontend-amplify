import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  loading: false,
  error: null,
};

/**
 * Creates a Stripe Checkout session for organization subscription.
 * Backend returns { url }; redirect to url to complete payment.
 */
export const createSubscriptionCheckoutSession = createAsyncThunk(
  "subscription/createSubscriptionCheckoutSession",
  async ({ organizationId, organizationType, token }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/payment/create-subscription-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ organizationId, organizationType }),
        }
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || "Failed to start subscription checkout"
      );
    }
  }
);

/**
 * Fetches payment invoices for the logged-in org user.
 * GET /api/payment/invoices?limit=20&starting_after=...
 */
export const fetchInvoices = createAsyncThunk(
  "subscription/fetchInvoices",
  async ({ token, limit = 20, startingAfter }, thunkAPI) => {
    try {
      const params = new URLSearchParams({ limit: String(limit) });
      if (startingAfter) params.set("starting_after", startingAfter);
      const url = `${config.api}/api/payment/invoices?${params.toString()}`;
      const response = await FetchApi.fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || "Failed to load payment history"
      );
    }
  }
);

/**
 * Creates a Stripe Billing Portal session for the logged-in org user.
 * Backend uses req.user, returns { url }. Redirect to url to manage billing.
 */
export const createPortalSession = createAsyncThunk(
  "subscription/createPortalSession",
  async ({ token, returnUrl }, thunkAPI) => {
    try {
      const body = returnUrl ? { return_url: returnUrl } : {};
      const response = await FetchApi.fetch(
        `${config.api}/api/payment/create-portal-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || "Failed to open billing management"
      );
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubscriptionCheckoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscriptionCheckoutSession.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createSubscriptionCheckoutSession.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Failed to start subscription checkout";
      })
      .addCase(createPortalSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPortalSession.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createPortalSession.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Failed to open billing management";
      });
  },
});

export const { clearSubscriptionError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;

export const selectSubscriptionLoading = (state) => state.subscription.loading;
export const selectSubscriptionError = (state) => state.subscription.error;
